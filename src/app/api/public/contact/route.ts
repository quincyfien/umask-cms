import { z } from "zod";
import { prisma } from "@/lib/db";
import { toErrorResponse, problem } from "@/lib/http";
import {
  HONEYPOT_FIELD,
  checkFormRateLimit,
  clientIp,
  hasHoneypotFilled,
  consumeIdempotency,
  verifyTurnstile,
} from "@/lib/public-form";
import { sha256 } from "@/lib/crypto";
import { queueEmail } from "@/lib/email";
import { getOrganization } from "@/lib/organization";

const schema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email().max(254),
  subject: z.string().min(3).max(150),
  message: z.string().min(10).max(5000),
  consentGiven: z.boolean(),
  idempotencyKey: z.string().uuid(),
  turnstileToken: z.string().optional(),
  [HONEYPOT_FIELD]: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const body = await request.json();
    const parsed = schema.parse(body);

    if (hasHoneypotFilled(parsed)) {
      return Response.json({ ok: true });
    }

    if (!(await verifyTurnstile(parsed.turnstileToken))) {
      return problem(400, "CHALLENGE_FAILED", "Bot verification failed.");
    }
    if (!parsed.consentGiven) {
      return problem(400, "CONSENT_REQUIRED", "Consent is required.");
    }

    const emailHash = sha256(parsed.email.toLowerCase());
    const limit = await checkFormRateLimit(`contact:ip:${ip}`, 5);
    if (limit) return limit;
    const emailLimit = await checkFormRateLimit(`contact:email:${emailHash}`, 3);
    if (emailLimit) return emailLimit;

    if (await consumeIdempotency(parsed.idempotencyKey, "contact")) {
      return Response.json({ ok: true });
    }

    await prisma.contactMessage.create({
      data: {
        fullName: parsed.fullName,
        email: parsed.email,
        subject: parsed.subject,
        message: parsed.message,
        status: "NEW",
        consentGiven: true,
        consentAt: new Date(),
        policyVersion: "1.0",
      },
    });

    const org = await getOrganization();
    if (org.email) {
      await queueEmail(
        org.email,
        `New contact message: ${parsed.subject}`,
        `From: ${parsed.fullName} <${parsed.email}>\n\n${parsed.message}`,
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
