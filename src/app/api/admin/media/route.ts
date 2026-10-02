import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { storagePut } from "@/lib/storage";
import { toErrorResponse, problem } from "@/lib/http";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 255);
}

export async function GET() {
  try {
    await requirePermission("media.upload");
    const assets = await prisma.mediaAsset.findMany({
      where: { deletedAt: null },
      orderBy: { uploadedAt: "desc" },
      take: 100,
    });
    return Response.json({ assets });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requirePermission("media.upload");
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return problem(400, "NO_FILE", "A file is required.");
    }
    if (file.size > MAX_SIZE) {
      return problem(413, "FILE_TOO_LARGE", "File exceeds the maximum size.");
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return problem(400, "INVALID_FILE_TYPE", "File type is not allowed.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `clean/${randomUUID()}-${safeName(file.name)}`;
    await storagePut(key, buffer);

    const asset = await prisma.mediaAsset.create({
      data: {
        key,
        fileName: file.name,
        mimeType: file.type,
        size: buffer.byteLength,
        status: "AVAILABLE",
        access: "PRIVATE",
        ownerId: user.id,
      },
    });

    return Response.json({ asset }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
