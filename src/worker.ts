import type { Job } from "@prisma/client";
import { prisma } from "./lib/db";
import { sendMail } from "./lib/mail";
import { computeProgramStatus } from "./lib/program";
import { logger } from "./lib/logger";
import { eventReminderTemplate } from "./lib/templates";
import { formatDateTime } from "./lib/format";

const EMAIL_DELAYS_MIN = [1, 5, 30, 120, 720];
const DEFAULT_DELAYS_MIN = [1, 2, 4, 8, 16];

async function runEmail(job: Job): Promise<void> {
  const p = (job.payload ?? {}) as {
    to?: string;
    subject?: string;
    text?: string;
    html?: string | null;
  };
  if (!p.to || !p.subject) throw new Error("email job missing to/subject");
  await sendMail({
    to: p.to,
    subject: p.subject,
    text: p.text ?? "",
    html: p.html ?? undefined,
  });
  logger.info("Email dispatched successfully", { to: p.to, subject: p.subject });
}

async function runProgramStatusUpdate(): Promise<void> {
  const programs = await prisma.contentItem.findMany({
    where: { type: "PROGRAM", deletedAt: null },
    select: { id: true, details: true },
  });
  for (const p of programs) {
    const details = (p.details ?? {}) as {
      applicationStartAt?: string;
      applicationCloseAt?: string;
      programStartAt?: string;
      programEndAt?: string;
    };
    const status = computeProgramStatus(details);
    await prisma.contentItem.update({
      where: { id: p.id },
      data: { programStatus: status },
    });
  }
  logger.info("Program statuses refreshed", { count: programs.length });
}

async function runEventReminders(): Promise<void> {
  const now = new Date();
  const maxHorizon = new Date(now.getTime() + 49 * 60 * 60 * 1000); // Up to 49h ahead

  const upcomingEvents = await prisma.contentItem.findMany({
    where: {
      type: "EVENT",
      status: "PUBLISHED",
      deletedAt: null,
      startAt: { gt: now, lte: maxHorizon },
    },
  });

  for (const event of upcomingEvents) {
    if (!event.startAt) continue;
    const diffHours = (event.startAt.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Determine if we should trigger 48h or 3h reminder
    let targetTier: 48 | 3 | null = null;
    if (diffHours >= 47 && diffHours <= 49) {
      targetTier = 48;
    } else if (diffHours >= 2.5 && diffHours <= 3.5) {
      targetTier = 3;
    }

    if (!targetTier) continue;

    const registrations = await prisma.registration.findMany({
      where: { eventId: event.id },
    });

    for (const reg of registrations) {
      const reminderKey = `event_reminder_${event.id}_${reg.email}_${targetTier}h`;
      // Check if a job or record already exists for this reminder
      const alreadySent = await prisma.job.findFirst({
        where: {
          type: "email",
          payload: {
            path: ["reminderKey"],
            equals: reminderKey,
          },
        },
      });

      if (alreadySent) continue;

      const venue = event.locationType === "ONLINE"
        ? (event.onlineLink || "Online")
        : (event.venueAddress || "UNMASK Main Auditorium");

      const tmpl = eventReminderTemplate(
        reg.fullName,
        event.title,
        formatDateTime(event.startAt),
        venue,
        targetTier
      );

      await prisma.job.create({
        data: {
          type: "email",
          payload: {
            reminderKey,
            to: reg.email,
            subject: tmpl.subject,
            text: tmpl.text,
            html: tmpl.html,
          },
          runAt: new Date(),
          maxAttempts: 3,
        },
      });

      logger.info(`Queued ${targetTier}h reminder for attendee`, {
        eventId: event.id,
        email: reg.email,
        tier: targetTier,
      });
    }
  }
}

function nextMidnight(): Date {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d;
}

function nextQuarterHour(): Date {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 15);
  return d;
}

async function ensureScheduledJobs(): Promise<void> {
  const existingProg = await prisma.job.findFirst({
    where: { type: "program_status_update", status: { in: ["PENDING", "RUNNING"] } },
  });
  if (!existingProg) {
    await prisma.job.create({ data: { type: "program_status_update", runAt: nextMidnight(), maxAttempts: 3 } });
  }

  const existingReminders = await prisma.job.findFirst({
    where: { type: "event_reminders", status: { in: ["PENDING", "RUNNING"] } },
  });
  if (!existingReminders) {
    await prisma.job.create({ data: { type: "event_reminders", runAt: nextQuarterHour(), maxAttempts: 3 } });
  }
}

async function processJob(job: Job): Promise<void> {
  switch (job.type) {
    case "email":
      await runEmail(job);
      return;
    case "program_status_update":
      await runProgramStatusUpdate();
      await prisma.job.create({ data: { type: "program_status_update", runAt: nextMidnight(), maxAttempts: 3 } });
      return;
    case "event_reminders":
      await runEventReminders();
      await prisma.job.create({ data: { type: "event_reminders", runAt: nextQuarterHour(), maxAttempts: 3 } });
      return;
    default:
      throw new Error(`No handler for job type: ${job.type}`);
  }
}

function nextDelay(type: string, attempts: number): number {
  const delays = type === "email" ? EMAIL_DELAYS_MIN : DEFAULT_DELAYS_MIN;
  return delays[Math.min(Math.max(attempts - 1, 0), delays.length - 1)] * 60 * 1000;
}

async function tick(): Promise<void> {
  const due = await prisma.job.findMany({
    where: { status: "PENDING", runAt: { lte: new Date() } },
    orderBy: { runAt: "asc" },
    take: 10,
  });
  if (due.length === 0) return;

  await prisma.job.updateMany({
    where: { id: { in: due.map((j) => j.id) }, status: "PENDING" },
    data: { status: "RUNNING", attempts: { increment: 1 } },
  });

  for (const job of due) {
    const attempts = job.attempts + 1;
    try {
      await processJob(job);
      await prisma.job.update({ where: { id: job.id }, data: { status: "DONE" } });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error("Job processing failed", err, { jobId: job.id, type: job.type, attempts });
      if (attempts >= job.maxAttempts) {
        await prisma.job.update({
          where: { id: job.id },
          data: { status: "DEAD", lastError: message.slice(0, 1000) },
        });
      } else {
        await prisma.job.update({
          where: { id: job.id },
          data: {
            status: "PENDING",
            runAt: new Date(Date.now() + nextDelay(job.type, attempts)),
            lastError: message.slice(0, 1000),
          },
        });
      }
    }
  }
}

async function main(): Promise<void> {
  logger.info("Background worker initialized and listening for jobs");
  await ensureScheduledJobs();
  for (;;) {
    try {
      await tick();
      await ensureScheduledJobs();
    } catch (err) {
      logger.error("Worker tick encountered an unhandled exception", err);
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
}

main();
