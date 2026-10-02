import { z } from "zod";
import { prisma } from "@/lib/db";
import { randomToken, sha256 } from "@/lib/crypto";
import { queueEmail } from "@/lib/email";
import { toErrorResponse, problem } from "@/lib/http";
import {
  HONEYPOT_FIELD,
  checkFormRateLimit,
  clientIp,
  hasHoneypotFilled,
  consumeIdempotency,
  verifyTurnstile,
} from "@/lib/public-form";
import { env } from "@/lib/env";

const schema = z.object({
  email: z.string().email().max(254),
  consentGiven: z.boolean(),
  idempotencyKey: z.string().uuid(),
  turnstileToken: z.string().optional(),
  [HONEYPOT_FIELD]: z.string().optional(),
});

export async function createConfirmToken(subscriptionId: string, email: string): Promise<string> {
  const token = randomToken();
  await prisma.token.create({
    data: {
      purpose: "newsletter_confirm",
      tokenHash: sha256(token),
      email: email.toLowerCase(),
      payload: subscriptionId,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    },
  });
  return token;
}

export async function createUnsubscribeToken(subscriptionId: string, email: string): Promise<string> {
  const token = randomToken();
  await prisma.token.create({
    data: {
      purpose: "newsletter_unsubscribe",
      tokenHash: sha256(token),
      email: email.toLowerCase(),
      payload: subscriptionId,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });
  return token;
}

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const body = await request.json();
    const parsed = schema.parse(body);

    if (hasHoneypotFilled(parsed)) return Response.json({ ok: true });
    if (!(await verifyTurnstile(parsed.turnstileToken))) {
      return problem(400, "CHALLENGE_FAILED", "Bot verification failed.");
    }
    if (!parsed.consentGiven) return problem(400, "CONSENT_REQUIRED", "Consent is required.");

    const email = parsed.email.toLowerCase();
    const emailHash = sha256(email);
    const limit = await checkFormRateLimit(`newsletter:ip:${ip}`, 5);
    if (limit) return limit;
    const emailLimit = await checkFormRateLimit(`newsletter:email:${emailHash}`, 3);
    if (emailLimit) return emailLimit;

    if (await consumeIdempotency(parsed.idempotencyKey, "newsletter")) {
      return Response.json({ ok: true });
    }

    let subscription = await prisma.newsletterSubscription.findUnique({
      where: { emailNormalized: email },
    });

    if (subscription?.status === "ACTIVE") {
      return Response.json({ ok: true });
    }

    if (!subscription) {
      subscription = await prisma.newsletterSubscription.create({
        data: { email: parsed.email, emailNormalized: email, status: "PENDING" },
      });
    } else if (subscription.status === "UNSUBSCRIBED") {
      subscription = await prisma.newsletterSubscription.update({
        where: { id: subscription.id },
        data: { status: "PENDING", unsubscribedAt: null },
      });
    }

    const token = await createConfirmToken(subscription.id, email);
    const link = `${env.siteOrigin}/newsletter/confirm?token=${token}`;
    await queueEmail(
      parsed.email,
      "Confirm your subscription",
      `Please confirm your subscription by opening this link:\n\n${link}\n\nThis link expires in 48 hours.`,
    );

    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
