import { randomUUID } from "node:crypto";
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
import { storagePut } from "@/lib/storage";

const REFERENCE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file limit

function generateReference(): string {
  let out = "";
  for (let i = 0; i < 10; i++) {
    out += REFERENCE_ALPHABET[Math.floor(Math.random() * REFERENCE_ALPHABET.length)];
  }
  return out;
}

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 255);
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
    const contentType = request.headers.get("content-type") || "";

    let rawData: Record<string, unknown> = {};
    const filesToUpload: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      rawData = {
        programId: formData.get("programId"),
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone") || undefined,
        institution: formData.get("institution") || undefined,
        position: formData.get("position") || undefined,
        applicantType: formData.get("applicantType"),
        motivation: formData.get("motivation"),
        consentGiven: formData.get("consentGiven") === "true" || formData.get("consentGiven") === "on",
        idempotencyKey: formData.get("idempotencyKey"),
        turnstileToken: formData.get("turnstileToken") || undefined,
        [HONEYPOT_FIELD]: formData.get(HONEYPOT_FIELD) || undefined,
      };

      const fileEntries = formData.getAll("documents");
      for (const entry of fileEntries) {
        if (entry instanceof File && entry.size > 0) {
          if (entry.size > MAX_FILE_SIZE) {
            return problem(413, "FILE_TOO_LARGE", `File "${entry.name}" exceeds the maximum allowed size of 5MB.`);
          }
          filesToUpload.push(entry);
        }
      }
    } else {
      rawData = await request.json();
    }

    const parsed = schema.parse(rawData);

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
    const createdApp = await prisma.application.create({
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

    // Save any uploaded supporting documents
    for (const file of filesToUpload) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const storageKey = `applications/${reference}/${randomUUID()}-${safeName(file.name)}`;
      await storagePut(storageKey, buffer);

      await prisma.applicationDocument.create({
        data: {
          applicationId: createdApp.id,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          fileId: storageKey,
        },
      });
    }

    await queueEmail(
      parsed.email,
      `Application received: ${program.title}`,
      `Dear ${parsed.fullName},\n\nYour application to "${program.title}" has been successfully received.\n\nYour reference identifier is: ${reference}\n\nOur scientific review committee will evaluate your application according to program criteria. You will receive updates at this email address.\n\nUNMASK`,
    );

    return Response.json({ reference }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
