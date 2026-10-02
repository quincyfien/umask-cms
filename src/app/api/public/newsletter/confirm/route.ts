import { z } from "zod";
import { prisma } from "@/lib/db";
import { sha256 } from "@/lib/crypto";
import { recordAudit } from "@/lib/audit";
import { toErrorResponse, problem } from "@/lib/http";

const confirmSchema = z.object({ token: z.string().min(1) });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = confirmSchema.parse(body);
    const record = await prisma.token.findUnique({ where: { tokenHash: sha256(token) } });
    if (
      !record ||
      record.purpose !== "newsletter_confirm" ||
      record.usedAt ||
      record.expiresAt < new Date() ||
      !record.payload
    ) {
      return problem(400, "INVALID_TOKEN", "This link is invalid or has expired.");
    }

    await prisma.$transaction([
      prisma.newsletterSubscription.update({
        where: { id: record.payload as string },
        data: { status: "ACTIVE", confirmedAt: new Date() },
      }),
      prisma.token.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    ]);

    await recordAudit({ action: "NEWSLETTER_CONFIRMED", status: "SUCCESS" });
    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
