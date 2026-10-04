import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, passwordIssues } from "@/lib/password";
import { sha256 } from "@/lib/crypto";
import { recordAudit } from "@/lib/audit";
import { toErrorResponse, problem, validationError } from "@/lib/http";

const acceptSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = acceptSchema.parse(body);

    const issues = passwordIssues(password);
    if (issues.length > 0) {
      return validationError(issues.map((m) => ({ field: "password", message: m })));
    }

    const record = await prisma.token.findUnique({ where: { tokenHash: sha256(token) } });
    if (
      !record ||
      record.purpose !== "staff_invite" ||
      record.usedAt ||
      record.expiresAt < new Date() ||
      !record.staffId
    ) {
      return problem(400, "INVALID_TOKEN", "This invitation link is invalid or has expired.");
    }

    await prisma.$transaction([
      prisma.staff.update({
        where: { id: record.staffId },
        data: { passwordHash: await hashPassword(password), status: "ACTIVE" },
      }),
      prisma.token.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    ]);

    await recordAudit({
      action: "STAFF_USER_UPDATE",
      targetResource: `staff:${record.staffId}`,
    });

    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
