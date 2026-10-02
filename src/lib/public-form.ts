import { prisma } from "./db";
import { rateLimit } from "./rate-limit";
import { getSetting } from "./settings";
import { problem } from "./http";

export const HONEYPOT_FIELD = "website";

export function hasHoneypotFilled(body: Record<string, unknown>): boolean {
  const v = body[HONEYPOT_FIELD];
  return typeof v === "string" && v.length > 0;
}

export async function verifyTurnstile(token?: string): Promise<boolean> {
  const enabled = await getSetting<boolean>("turnstile_enabled", false);
  if (!enabled) return true;
  if (!token) return false;
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) return true; // not configured in dev
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(3000),
    });
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export async function checkFormRateLimit(key: string, limit: number): Promise<Response | null> {
  const rl = await rateLimit(key, limit, 3600);
  if (!rl.allowed) {
    return problem(429, "RATE_LIMITED", "Too many submissions. Please try again later.");
  }
  return null;
}

export async function consumeIdempotency(key: string, target: string): Promise<boolean> {
  try {
    await prisma.idempotencyKey.create({ data: { key, target } });
    return false;
  } catch {
    return true; // already processed
  }
}

export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
