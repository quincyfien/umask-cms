import { Prisma } from "@prisma/client";
import { prisma } from "./db";

export async function enqueueJob(
  type: string,
  payload: Record<string, unknown>,
  opts?: { runAt?: Date; maxAttempts?: number },
): Promise<void> {
  await prisma.job.create({
    data: {
      type,
      payload: (payload ?? {}) as Prisma.InputJsonValue,
      runAt: opts?.runAt ?? new Date(),
      maxAttempts: opts?.maxAttempts ?? 3,
    },
  });
}
