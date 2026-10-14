import { z } from "zod";
import { prisma } from "@/lib/db";
import { randomToken, sha256 } from "@/lib/crypto";
import { queueEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { recordAudit } from "@/lib/audit";
import { toErrorResponse, problem } from "@/lib/http";
import { env } from "@/lib/env";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const body = await request.json();
    const { email } = schema.parse(body);

    const ipLimit = await rateLimit(`reset:ip:${ip}`, 10, 3600);
    const emailLimit = await rateLimit(`reset:email:${email.toLowerCase()}`, 3, 3600);
    if (!ipLimit.allowed || !emailLimit.allowed) {
      return problem(429, "RATE_LIMITED", "Too many requests. Try again later.");
    }

    const staff = await prisma.staff.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (staff && staff.status === "ACTIVE" && !staff.deletedAt) {
      const token = randomToken();
      await prisma.token.create({
        data: {
          purpose: "password_reset",
          tokenHash: sha256(token),
          email: email.toLowerCase(),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        },
      });
      const link = `${env.siteOrigin}/admin/reset?token=${token}`;
      await queueEmail(
        email,
        "Reset your UNMASK account password",
        `A password reset was requested for your account. This link expires in 30 minutes:\n\n${link}\n\nIf you did not request this, please disregard.`,
      );
      await recordAudit({
        action: "AUTH_PASSWORD_RESET_REQUEST",
        actorIp: ip,
        status: "SUCCESS",
      });
    }

    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
