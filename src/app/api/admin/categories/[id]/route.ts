import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { toErrorResponse, problem } from "@/lib/http";

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().max(255).optional(),
  description: z.string().max(1000).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requirePermission("content.create");
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.parse(body);

    const data: Record<string, unknown> = {};
    if (parsed.name !== undefined) data.name = parsed.name;
    if (parsed.slug !== undefined) {
      const s = slugify(parsed.slug);
      if (s) data.slug = s;
    }
    if (parsed.description !== undefined) data.description = parsed.description;

    const category = await prisma.category.update({ where: { id }, data });
    return Response.json({ category });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requirePermission("content.create");
    const { id } = await params;
    const used = await prisma.contentItem.count({ where: { categoryId: id } });
    if (used > 0) {
      return problem(409, "CATEGORY_IN_USE", "Category is used by content and cannot be deleted.");
    }
    await prisma.category.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
