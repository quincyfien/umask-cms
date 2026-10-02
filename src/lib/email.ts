import { enqueueJob } from "./jobs";

export async function queueEmail(
  to: string,
  subject: string,
  text: string,
  html?: string,
): Promise<void> {
  await enqueueJob(
    "email",
    { to, subject, text, html: html ?? null },
    { maxAttempts: 5 },
  );
}
