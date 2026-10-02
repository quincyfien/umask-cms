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

const REFERENCE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateReference(): string {
  let out = "";
  for (let i = 0; i < 10; i++) {
    out += REFERENCE_ALPHABET[Math.floor(Math.random() * REFERENCE_ALPHABET.length)];
  }
  return out;
}

const schema = z.object({
  programId: z.string().uuid(),
  fullName: z.string().min(2).max(100),
  email: z.string().email().max(254),
  phone: z.string().max(30).optional(),
  institution: z.string().max(150).optional(),
  position: z.string().max(150).optional(),
  applicantType: z.enum(["STUDENT", "RESEARCHER", "PROFESSIONAL", "OTHER"]),
  motivation: z.string().min(50).max(3000),
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
    const limit = await checkFormRateLimit(`application:ip:${ip}`, 5);
    if (limit) return limit;
    const emailLimit = await checkFormRateLimit(`application:email:${emailHash}`, 3);
    if (emailLimit) return emailLimit;

    if (await consumeIdempotency(parsed.idempotencyKey, "application")) {
      return Response.json({ ok: true });
    }

    const program = await prisma.contentItem.findUnique({ where: { id: parsed.programId } });
    if (!program || program.type !== "PROGRAM" || program.status !== "PUBLISHED") {
      return problem(404, "APPLICATIONS_CLOSED", "Applications are closed.");
    }
    if (!program.programStatus || !["UPCOMING", "ONGOING"].includes(program.programStatus)) {
      return problem(409, "APPLICATIONS_CLOSED", "Applications are closed.");
    }
    const deadline = program.details
      ? (program.details as { applicationDeadline?: string }).applicationDeadline
      : undefined;
    if (deadline && new Date(deadline) <= new Date()) {
      return problem(409, "APPLICATIONS_CLOSED", "Applications are closed.");
    }

    const existing = await prisma.application.findUnique({
      where: { programId_email: { programId: parsed.programId, email: parsed.email.toLowerCase() } },
    });
    if (existing) {
      return problem(409, "ALREADY_APPLIED", "You have already applied to this program.");
    }

    const reference = generateReference();
    await prisma.application.create({
      data: {
        programId: parsed.programId,
        reference,
        fullName: parsed.fullName,
        email: parsed.email.toLowerCase(),
        phone: parsed.phone,
        institution: parsed.institution,
        position: parsed.position,
        applicantType: parsed.applicantType,
        motivation: parsed.motivation,
        status: "SUBMITTED",
        consentGiven: true,
        consentAt: new Date(),
        policyVersion: "1.0",
      },
    });

    await queueEmail(
      parsed.email,
      `Application received: ${program.title}`,
      `Your application to "${program.title}" has been received. Keep this reference number:\n\n${reference}`,
    );

    return Response.json({ reference }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
