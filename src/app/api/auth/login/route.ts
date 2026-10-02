import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSession, setSessionCookie } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import { toErrorResponse, problem } from "@/lib/http";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const userAgent = request.headers.get("user-agent") ?? undefined;

    const body = await request.json();
    const parsed = loginSchema.parse(body);

    const ipLimit = await rateLimit(`login:ip:${ip}`, 20, 60);
    if (!ipLimit.allowed) {
      return problem(429, "RATE_LIMITED", "Too many login attempts. Try again shortly.");
    }

    const lock = await rateLimit(`login:fail:${parsed.email.toLowerCase()}`, 3, 900);
    if (!lock.allowed) {
      return problem(429, "LOCKED", "Account temporarily locked. Try again in 15 minutes.");
    }

    const staff = await prisma.staff.findUnique({
      where: { email: parsed.email.toLowerCase() },
    });
    const ok = staff ? await verifyPassword(staff.passwordHash, parsed.password) : false;

    if (!staff || !ok || staff.status === "SUSPENDED" || staff.deletedAt) {
      await recordAudit({
        action: "AUTH_LOGIN_FAILED",
        actorIp: ip,
        userAgent,
        status: "DENIED",
        metadata: { email: parsed.email.toLowerCase(), reason: "invalid_credentials" },
      });
      return problem(401, "INVALID_CREDENTIALS", "Invalid email or password.");
    }

    const token = await createSession(staff.id, ip, userAgent);
    await setSessionCookie(token);

    await recordAudit({
      action: "AUTH_LOGIN_SUCCESS",
      actorId: staff.id,
      actorIp: ip,
      userAgent,
      targetResource: `staff:${staff.id}`,
    });

    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
