import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { toErrorResponse, problem } from "@/lib/http";

const createSchema = z.object({
  type: z.enum(["SERVICE", "PROGRAM", "PROJECT", "EVENT", "NEWS", "RESOURCE", "PAGE"]),
  name: z.string().min(1).max(255),
  slug: z.string().max(255).optional(),
  description: z.string().max(1000).optional(),
});

export async function GET(request: Request) {
  try {
    await requirePermission("content.create");
    const type = new URL(request.url).searchParams.get("type");
    const categories = await prisma.category.findMany({
      where: type ? { type: type as never } : {},
      orderBy: { name: "asc" },
    });
    return Response.json({ categories });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(request: Request) {
  try {
    await requirePermission("content.create");
    const body = await request.json();
    const parsed = createSchema.parse(body);
    const slug = parsed.slug ? slugify(parsed.slug) : slugify(parsed.name);
    if (!slug) return problem(400, "INVALID_SLUG", "Slug cannot be empty.");

    const existing = await prisma.category.findFirst({
      where: { type: parsed.type, slug },
    });
    if (existing) return problem(409, "SLUG_TAKEN", "A category with this slug already exists.");

    const category = await prisma.category.create({
      data: {
        type: parsed.type,
        name: parsed.name,
        slug,
        description: parsed.description,
      },
    });
    return Response.json({ category }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
