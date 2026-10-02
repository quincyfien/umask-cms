import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, passwordIssues } from "@/lib/password";
import { sha256 } from "@/lib/crypto";
import { recordAudit } from "@/lib/audit";
import { toErrorResponse, problem, validationError } from "@/lib/http";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = schema.parse(body);

    const issues = passwordIssues(password);
    if (issues.length > 0) {
      return validationError(issues.map((m) => ({ field: "password", message: m })));
    }

    const tokenRecord = await prisma.token.findUnique({
      where: { tokenHash: sha256(token) },
    });
    if (
      !tokenRecord ||
      tokenRecord.purpose !== "password_reset" ||
      tokenRecord.usedAt ||
      tokenRecord.expiresAt < new Date()
    ) {
      return problem(400, "INVALID_TOKEN", "This reset link is invalid or has expired.");
    }

    const staff = await prisma.staff.findUnique({
      where: { email: tokenRecord.email ?? "" },
    });
    if (!staff) {
      return problem(400, "INVALID_TOKEN", "This reset link is invalid or has expired.");
    }

    await prisma.$transaction([
      prisma.staff.update({
        where: { id: staff.id },
        data: { passwordHash: await hashPassword(password) },
      }),
      prisma.session.deleteMany({ where: { staffId: staff.id } }),
      prisma.token.update({
        where: { id: tokenRecord.id },
        data: { usedAt: new Date() },
      }),
    ]);

    await recordAudit({
      action: "AUTH_PASSWORD_CHANGE",
      actorId: staff.id,
      targetResource: `staff:${staff.id}`,
    });

    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
