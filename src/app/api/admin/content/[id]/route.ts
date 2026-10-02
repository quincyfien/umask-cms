import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hasPermission, requireUser } from "@/lib/auth";
import { getTransition } from "@/lib/content";
import { detailsToColumns } from "@/lib/content-details";
import { sanitizeBody } from "@/lib/sanitize";
import { slugify } from "@/lib/slug";
import { recordAudit } from "@/lib/audit";
import { toErrorResponse, problem } from "@/lib/http";

const updateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z.string().max(255).optional(),
  summary: z.string().max(500).optional(),
  body: z.string().max(200000).optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string().min(1).max(40)).max(10).optional(),
  featuredImageId: z.string().optional(),
  attachmentIds: z.array(z.string()).max(10).optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  template: z.enum(["DEFAULT", "FULL_WIDTH", "LANDING_PAGE", "NEWS_ARTICLE"]).optional(),
  isFeatured: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  noIndex: z.boolean().optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]).optional(),
  rejectionNotes: z.string().max(2000).optional(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireUser();
    const { id } = await params;
    const item = await prisma.contentItem.findUnique({
      where: { id },
      include: {
        category: true,
        author: { select: { name: true } },
        versions: { orderBy: { version: "desc" }, take: 20 },
      },
    });
    if (!item) return problem(404, "NOT_FOUND", "Content not found.");
    return Response.json({ item });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.parse(body);

    const item = await prisma.contentItem.findUnique({ where: { id } });
    if (!item || item.deletedAt) return problem(404, "NOT_FOUND", "Content not found.");

    const canEditAny = hasPermission(user, "content.edit.any");
    if (!canEditAny && item.authorId !== user.id) {
      return problem(403, "FORBIDDEN", "You cannot edit this content.");
    }

    const data: Prisma.ContentItemUncheckedUpdateInput = {};
    let action: string | null = null;
    let directPublish = false;

    if (parsed.title !== undefined) data.title = parsed.title;
    if (parsed.slug !== undefined) {
      const s = slugify(parsed.slug);
      if (s) data.slug = s;
    }
    if (parsed.summary !== undefined) data.summary = parsed.summary;
    if (parsed.body !== undefined) data.body = sanitizeBody(parsed.body);
    if (parsed.categoryId !== undefined) data.categoryId = parsed.categoryId;
    if (parsed.tags !== undefined) data.tags = parsed.tags;
    if (parsed.featuredImageId !== undefined) data.featuredImageId = parsed.featuredImageId;
    if (parsed.attachmentIds !== undefined) data.attachmentIds = parsed.attachmentIds;
    if (parsed.metaTitle !== undefined) data.metaTitle = parsed.metaTitle;
    if (parsed.metaDescription !== undefined) data.metaDescription = parsed.metaDescription;
    if (parsed.template !== undefined) data.template = parsed.template;
    if (parsed.isFeatured !== undefined) data.isFeatured = parsed.isFeatured;
    if (parsed.isPinned !== undefined) data.isPinned = parsed.isPinned;
    if (parsed.noIndex !== undefined) data.noIndex = parsed.noIndex;

    if (parsed.details !== undefined) {
      Object.assign(data, detailsToColumns(parsed.details as never));
    }

    if (parsed.status !== undefined && parsed.status !== item.status) {
      const rule = getTransition(item.status, parsed.status);
      if (!rule.allowed) {
        return problem(409, "INVALID_TRANSITION", "Invalid content status transition.");
      }
      if (rule.permission && !hasPermission(user, rule.permission)) {
        return problem(403, "FORBIDDEN", "You do not have permission for this transition.");
      }
      if (rule.requireNote && !parsed.rejectionNotes) {
        return problem(400, "REJECTION_NOTE_REQUIRED", "A rejection note is required.");
      }

      data.status = parsed.status;
      if (parsed.status === "REVIEW") {
        data.rejectionNotes = null;
        action = "CONTENT_SUBMIT";
      } else if (parsed.status === "DRAFT" && item.status === "PUBLISHED") {
        data.publishedAt = null;
        data.accessLevel = "STAFF_ONLY";
        action = "CONTENT_UNPUBLISH";
      } else if (parsed.status === "PUBLISHED") {
        data.publishedAt = new Date();
        data.accessLevel = "PUBLIC";
        data.reviewerId = user.id;
        directPublish = item.status === "DRAFT";
        action = directPublish ? "CONTENT_DIRECT_PUBLISH" : "CONTENT_PUBLISH";
      } else if (parsed.status === "ARCHIVED") {
        data.accessLevel = "STAFF_ONLY";
        action = "CONTENT_STATUS_OVERRIDE";
      } else if (parsed.status === "DRAFT" && item.status === "REVIEW") {
        data.rejectionNotes = parsed.rejectionNotes;
        action = "CONTENT_REJECT";
      }
    }

    const updated = await prisma.contentItem.update({ where: { id }, data });

    if (parsed.title !== undefined || parsed.body !== undefined || parsed.summary !== undefined || action) {
      const nextVersion = updated.version + 1;
      await prisma.contentItem.update({ where: { id }, data: { version: nextVersion } });
      await prisma.contentVersion.create({
        data: {
          contentId: id,
          version: nextVersion,
          title: updated.title,
          body: updated.body,
          summary: updated.summary,
          snapshot: updated as unknown as Prisma.InputJsonValue,
          createdBy: user.id,
        },
      });
    }

    if (action) {
      await recordAudit({
        action,
        actorId: user.id,
        targetResource: `content:${id}`,
      });
    }

    return Response.json({ item: updated });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const item = await prisma.contentItem.findUnique({ where: { id } });
    if (!item || item.deletedAt) return problem(404, "NOT_FOUND", "Content not found.");

    const isHardDelete = item.status === "ARCHIVED" || item.status === "DRAFT";
    if (isHardDelete) {
      if (!hasPermission(user, "content.delete")) {
        return problem(403, "FORBIDDEN", "You do not have permission to delete content.");
      }
      await prisma.contentItem.delete({ where: { id } });
      await recordAudit({
        action: "CONTENT_HARD_DELETE",
        actorId: user.id,
        targetResource: `content:${id}`,
      });
    } else {
      if (!hasPermission(user, "content.delete")) {
        return problem(403, "FORBIDDEN", "You do not have permission to archive content.");
      }
      await prisma.contentItem.update({
        where: { id },
        data: { status: "ARCHIVED", accessLevel: "STAFF_ONLY", deletedAt: new Date() },
      });
      await recordAudit({
        action: "CONTENT_STATUS_OVERRIDE",
        actorId: user.id,
        targetResource: `content:${id}`,
      });
    }

    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
