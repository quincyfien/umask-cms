import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { contentSchema } from "@/lib/content-schema";
import { detailsToColumns } from "@/lib/content-details";
import { sanitizeBody } from "@/lib/sanitize";
import { slugify } from "@/lib/slug";
import { recordAudit } from "@/lib/audit";
import { toErrorResponse, problem } from "@/lib/http";

const listQuery = z.object({
  type: z.string().optional(),
  status: z.string().optional(),
  q: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    await requirePermission("content.create");
    const url = new URL(request.url);
    const query = listQuery.parse(Object.fromEntries(url.searchParams));

    const items = await prisma.contentItem.findMany({
      where: {
        deletedAt: null,
        ...(query.type ? { type: query.type as never } : {}),
        ...(query.status ? { status: query.status as never } : {}),
        ...(query.q
          ? { OR: [{ title: { contains: query.q, mode: "insensitive" } }] }
          : {}),
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
      include: { category: true, author: { select: { name: true } } },
    });
    return Response.json({ items });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requirePermission("content.create");
    const body = await request.json();
    const parsed = contentSchema.parse(body);

    const slug = parsed.slug ? slugify(parsed.slug) : slugify(parsed.title);
    if (!slug) return problem(400, "INVALID_SLUG", "Slug cannot be empty.");

    const existing = await prisma.contentItem.findFirst({
      where: { type: parsed.type, slug, deletedAt: null },
    });
    if (existing) {
      return problem(409, "SLUG_TAKEN", "A content item with this slug already exists.");
    }

    const bodySanitized = parsed.body ? sanitizeBody(parsed.body) : null;
    const words = bodySanitized ? bodySanitized.split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    const item = await prisma.contentItem.create({
      data: {
        type: parsed.type,
        title: parsed.title,
        slug,
        summary: parsed.summary,
        body: bodySanitized,
        categoryId: parsed.categoryId,
        tags: parsed.tags ?? [],
        featuredImageId: parsed.featuredImageId,
        attachmentIds: parsed.attachmentIds ?? [],
        metaTitle: parsed.metaTitle,
        metaDescription: parsed.metaDescription,
        template: parsed.template,
        isFeatured: parsed.isFeatured ?? false,
        isPinned: parsed.isPinned ?? false,
        noIndex: parsed.noIndex ?? false,
        status: "DRAFT",
        authorId: user.id,
        version: 1,
        readingTimeMinutes: readingTime,
        ...detailsToColumns(parsed.details),
      },
    });

    await prisma.contentVersion.create({
      data: {
        contentId: item.id,
        version: 1,
        title: item.title,
        body: item.body,
        summary: item.summary,
        snapshot: item as unknown as Prisma.InputJsonValue,
        createdBy: user.id,
      },
    });

    await recordAudit({
      action: "CONTENT_CREATE",
      actorId: user.id,
      targetResource: `content:${item.id}`,
    });

    return Response.json({ item }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
