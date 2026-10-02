import { Prisma } from "@prisma/client";
import { prisma } from "./db";

export type AuditInput = {
  action: string;
  actorId?: string | null;
  actorIp?: string | null;
  userAgent?: string | null;
  targetResource?: string | null;
  status?: "SUCCESS" | "DENIED" | "ERROR";
  metadata?: Record<string, unknown>;
};

function redactIp(ip: string): string {
  if (ip.includes(".")) {
    return ip.split(".").slice(0, 3).join(".") + ".0";
  }
  return ip.slice(0, 12) + "0:0:0:0:0";
}

export async function recordAudit(input: AuditInput): Promise<void> {
  await prisma.auditLog.create({
    data: {
      action: input.action,
      actorId: input.actorId ?? null,
      actorIp: input.actorIp ? redactIp(input.actorIp) : null,
      userAgent: input.userAgent ?? null,
      targetResource: input.targetResource ?? null,
      status: input.status ?? "SUCCESS",
      metadata: (input.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  });
}
