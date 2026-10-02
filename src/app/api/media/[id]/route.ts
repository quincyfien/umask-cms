import { prisma } from "@/lib/db";
import { hasPermission, requireUser } from "@/lib/auth";
import { storageGet } from "@/lib/storage";
import { recordAudit } from "@/lib/audit";
import { toErrorResponse, problem } from "@/lib/http";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset || asset.deletedAt || asset.status === "QUARANTINED") {
      return problem(404, "NOT_FOUND", "File not found.");
    }

    if (asset.access === "PRIVATE") {
      const user = await requireUser();
      const allowed = hasPermission(user, "media.manage") || hasPermission(user, "applications.view");
      if (!allowed) return problem(403, "FORBIDDEN", "You do not have access to this file.");
      await recordAudit({
        action: "PII_ACCESS_LOGGED",
        actorId: user.id,
        targetResource: `media:${id}`,
      });
    }

    const body = await storageGet(asset.key);
    if (!body) return problem(404, "NOT_FOUND", "File not found.");

    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type": asset.mimeType,
        "Content-Length": String(body.byteLength),
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}
