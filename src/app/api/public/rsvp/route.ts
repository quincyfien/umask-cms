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
  eventId: z.string().uuid(),
  fullName: z.string().min(2).max(100),
  email: z.string().email().max(254),
  phone: z.string().max(30).optional(),
  reason: z.string().max(1000).optional(),
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

    if (hasHoneypotFilled(parsed)) return Response.json({ ok: true });
    if (!(await verifyTurnstile(parsed.turnstileToken))) {
      return problem(400, "CHALLENGE_FAILED", "Bot verification failed.");
    }
    if (!parsed.consentGiven) return problem(400, "CONSENT_REQUIRED", "Consent is required.");

    const emailHash = sha256(parsed.email.toLowerCase());
    const limit = await checkFormRateLimit(`rsvp:ip:${ip}`, 10);
    if (limit) return limit;
    const emailLimit = await checkFormRateLimit(`rsvp:email:${emailHash}`, 3);
    if (emailLimit) return emailLimit;

    if (await consumeIdempotency(parsed.idempotencyKey, "rsvp")) {
      return Response.json({ ok: true });
    }

    try {
      await prisma.$transaction(async (tx) => {
        const rows = await tx.$queryRaw<{ id: string }[]>`
          SELECT id FROM "ContentItem" WHERE id = ${parsed.eventId} FOR UPDATE
        `;
        if (rows.length === 0) throw new RegistrationError(404, "NOT_FOUND", "Event not found.");

        const event = await tx.contentItem.findUnique({ where: { id: parsed.eventId } });
        if (!event || event.type !== "EVENT" || event.status !== "PUBLISHED") {
          throw new RegistrationError(404, "NOT_FOUND", "Event not found.");
        }
        if (!event.registrationEnabled) {
          throw new RegistrationError(409, "REGISTRATION_CLOSED", "Registration is closed.");
        }
        if (event.startAt && event.startAt <= new Date()) {
          throw new RegistrationError(409, "REGISTRATION_CLOSED", "Registration is closed.");
        }
        if (event.capacity) {
          const count = await tx.registration.count({ where: { eventId: parsed.eventId } });
          if (count >= event.capacity) {
            throw new RegistrationError(409, "EVENT_FULL", "This event is full.");
          }
        }

        const existing = await tx.registration.findUnique({
          where: { eventId_email: { eventId: parsed.eventId, email: parsed.email.toLowerCase() } },
        });
        if (existing) return; // duplicate: same success response, no second row

        await tx.registration.create({
          data: {
            eventId: parsed.eventId,
            fullName: parsed.fullName,
            email: parsed.email.toLowerCase(),
            phone: parsed.phone,
            consentGiven: true,
            consentAt: new Date(),
            policyVersion: "1.0",
          },
        });
      });
    } catch (err) {
      if (err instanceof RegistrationError) {
        return problem(err.status, err.code, err.message);
      }
      throw err;
    }

    const event = await prisma.contentItem.findUnique({ where: { id: parsed.eventId } });
    const org = await getOrganization();
    await queueEmail(
      parsed.email,
      `Registration confirmed: ${event?.title ?? "Event"}`,
      `You are registered for "${event?.title ?? "Event"}". Location: ${event?.venueAddress ?? event?.onlineLink ?? org.name}.`,
    );

    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}

class RegistrationError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
