import type { Job } from "@prisma/client";
import { prisma } from "./lib/db";
import { sendMail } from "./lib/mail";

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
}

async function processJob(job: Job): Promise<void> {
  switch (job.type) {
    case "email":
      await runEmail(job);
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
  console.log("worker started");
  for (;;) {
    try {
      await tick();
    } catch (err) {
      console.error("worker tick error", err);
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
}

main();
