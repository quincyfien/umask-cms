import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { queueEmail } from "@/lib/email";
import { applicationStatusTemplate } from "@/lib/templates";
import { toErrorResponse, problem } from "@/lib/http";

const updateSchema = z.object({
  status: z.enum(["SUBMITTED", "UNDER_REVIEW", "ACCEPTED", "REJECTED"]),
  reviewNotes: z.string().max(3000).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requirePermission("applications.view");
    const { id } = await params;
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        documents: true,
      },
    });

    if (!application) {
      return problem(404, "NOT_FOUND", "Application not found.");
    }

    const program = await prisma.contentItem.findUnique({
      where: { id: application.programId },
      select: { title: true, slug: true },
    });

    return Response.json({ application, program });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requirePermission("applications.review");
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.parse(body);

    const existing = await prisma.application.findUnique({
      where: { id },
    });

    if (!existing) {
      return problem(404, "NOT_FOUND", "Application not found.");
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: parsed.status,
        reviewNotes: parsed.reviewNotes !== undefined ? parsed.reviewNotes : existing.reviewNotes,
        reviewerId: user.id,
      },
    });

    const program = await prisma.contentItem.findUnique({
      where: { id: updated.programId },
    });

    // If decision status is rendered (ACCEPTED, REJECTED, UNDER_REVIEW), notify applicant
    if (parsed.status !== "SUBMITTED" && program) {
      const tmpl = applicationStatusTemplate(
        updated.fullName,
        program.title,
        updated.reference,
        parsed.status as "ACCEPTED" | "REJECTED" | "UNDER_REVIEW",
        updated.reviewNotes,
      );

      await queueEmail(updated.email, tmpl.subject, tmpl.text, tmpl.html);
    }

    await recordAudit({
      action: "APPLICATION_REVIEW",
      actorId: user.id,
      targetResource: `application:${id}`,
      metadata: { newStatus: parsed.status },
    });

    return Response.json({ application: updated });
  } catch (err) {
    return toErrorResponse(err);
  }
}
