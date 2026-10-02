import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { toErrorResponse } from "@/lib/http";
import { sha256 } from "@/lib/crypto";

export async function POST() {
  try {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (token) {
      const session = await prisma.session.findUnique({ where: { tokenHash: sha256(token) } });
      if (session) {
        await recordAudit({
          action: "AUTH_LOGOUT",
          actorId: session.staffId,
          targetResource: `session:${session.id}`,
        });
        await prisma.session.delete({ where: { id: session.id } });
      }
    }
    const store = await cookies();
    store.delete(SESSION_COOKIE);
    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
