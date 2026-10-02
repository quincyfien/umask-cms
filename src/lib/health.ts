import type { PrismaClient } from "@prisma/client";
import { prisma } from "./db";

type DatabaseClient = Pick<PrismaClient, "$queryRaw">;

export async function checkDatabase(
  client: DatabaseClient = prisma,
): Promise<boolean> {
  try {
    await client.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export function liveResponse(): Response {
  return Response.json({ status: "ok", checks: {} });
}

export async function readyResponse(
  client: DatabaseClient = prisma,
): Promise<Response> {
  const up = await checkDatabase(client);
  return Response.json(
    {
      status: up ? "ok" : "error",
      checks: { database: up ? "up" : "down" },
    },
    { status: up ? 200 : 503 },
  );
}
