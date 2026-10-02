import { prisma } from "./db";

const WINDOW_SECONDS = 3600;

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number = WINDOW_SECONDS,
): Promise<{ allowed: boolean; remaining: number }> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = new Date(Math.floor(now / windowSeconds) * windowSeconds * 1000);

  const bucket = await prisma.rateLimitBucket.upsert({
    where: { key_windowStart: { key, windowStart } },
    create: { key, windowStart, count: 1 },
    update: { count: { increment: 1 } },
  });

  const remaining = Math.max(0, limit - bucket.count);
  return { allowed: bucket.count <= limit, remaining };
}
