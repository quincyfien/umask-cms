import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { randomToken, sha256 } from "@/lib/crypto";
import { queueEmail } from "@/lib/email";
import { toErrorResponse, problem } from "@/lib/http";
import { env } from "@/lib/env";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requirePermission("staff.manage");
    const { id } = await params;
    const staff = await prisma.staff.findUnique({ where: { id } });
    if (!staff) return problem(404, "NOT_FOUND", "Staff not found.");
    if (staff.status !== "PENDING") {
      return problem(409, "NOT_PENDING", "This account is not pending invitation.");
    }

    const token = randomToken();
    await prisma.token.create({
      data: {
        purpose: "staff_invite",
        tokenHash: sha256(token),
        email: staff.email,
        staffId: staff.id,
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
      },
    });

    const link = `${env.siteOrigin}/admin/accept-invite?token=${token}`;
    await queueEmail(
      staff.email,
      "You have been invited",
      `Set your password here:\n\n${link}\n\nThis link expires in 72 hours.`,
    );

    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
