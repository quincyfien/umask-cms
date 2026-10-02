import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { storageDelete } from "@/lib/storage";
import { recordAudit } from "@/lib/audit";
import { toErrorResponse, problem } from "@/lib/http";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requirePermission("media.manage");
    const { id } = await params;
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) return problem(404, "NOT_FOUND", "Media not found.");
    await storageDelete(asset.key);
    await prisma.mediaAsset.delete({ where: { id } });
    await recordAudit({ action: "MEDIA_DELETE", targetResource: `media:${id}` });
    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
