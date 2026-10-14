import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { queueEmail } from "@/lib/email";
import { emailWrapper } from "@/lib/templates";
import { toErrorResponse, problem } from "@/lib/http";

const replySchema = z.object({
  replyText: z.string().min(2).max(10000),
  subject: z.string().min(1).max(255).optional(),
});

const patchSchema = z.object({
  status: z.enum(["NEW", "READ", "RESOLVED"]),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requirePermission("contacts.view");
    const { id } = await params;
    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return problem(404, "NOT_FOUND", "Message not found.");
    }

    // Auto mark as READ if NEW
    if (message.status === "NEW") {
      await prisma.contactMessage.update({
        where: { id },
        data: { status: "READ" },
      });
      message.status = "READ";
    }

    return Response.json({ message });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requirePermission("contacts.view");
    const { id } = await params;
    const body = await request.json();
    const { status } = patchSchema.parse(body);

    const message = await prisma.contactMessage.update({
      where: { id },
      data: {
        status,
        resolvedAt: status === "RESOLVED" ? new Date() : null,
      },
    });

    await recordAudit({
      action: "CONTACT_STATUS_UPDATE",
      actorId: user.id,
      targetResource: `contact:${id}`,
      metadata: { newStatus: status },
    });

    return Response.json({ message });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requirePermission("contacts.view");
    const { id } = await params;
    const body = await request.json();
    const { replyText, subject } = replySchema.parse(body);

    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return problem(404, "NOT_FOUND", "Message not found.");
    }

    const replySubject = subject || `Re: ${message.subject}`;
    const html = emailWrapper(
      replySubject,
      `
      <h2 style="color: #20a39e; margin-top: 0;">Reply from Bio-Tech Research Center</h2>
      <p>Dear ${message.fullName},</p>
      <div style="background-color: #17233f; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #20a39e; white-space: pre-wrap; font-size: 14px; color: #f1f5f9;">
${replyText}
      </div>
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b;">
        <p><strong>Your Original Message:</strong></p>
        <blockquote style="margin: 0; padding-left: 12px; border-left: 2px solid #334155; font-style: italic;">
          ${message.message}
        </blockquote>
      </div>
    `
    );

    await queueEmail(message.email, replySubject, replyText, html);

    // Update message status to RESOLVED
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: {
        status: "RESOLVED",
        resolvedAt: new Date(),
      },
    });

    await recordAudit({
      action: "CONTACT_REPLY_SENT",
      actorId: user.id,
      targetResource: `contact:${id}`,
    });

    return Response.json({ ok: true, message: updated });
  } catch (err) {
    return toErrorResponse(err);
  }
}
