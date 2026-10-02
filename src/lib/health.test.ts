// @vitest-environment node
import { describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { checkDatabase, liveResponse, readyResponse } from "./health";

describe("health checks", () => {
  it("live returns 200 with exactly the keys status and checks", async () => {
    const res = liveResponse();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Object.keys(body)).toEqual(["status", "checks"]);
    expect(body.status).toBe("ok");
  });

  it("ready returns 200 when PostgreSQL is up", async () => {
    const res = await readyResponse();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Object.keys(body)).toEqual(["status", "checks"]);
    expect(body).toEqual({ status: "ok", checks: { database: "up" } });
  });

  it("ready returns 503 when PostgreSQL is unreachable", async () => {
    const down = new PrismaClient({
      datasourceUrl:
        "postgresql://devuser:devpassword@127.0.0.1:5999/devdb?connect_timeout=2",
    });
    try {
      expect(await checkDatabase(down)).toBe(false);

      const res = await readyResponse(down);
      expect(res.status).toBe(503);
      const body = await res.json();
      expect(body).toEqual({ status: "error", checks: { database: "down" } });
    } finally {
      await down.$disconnect();
    }
  });
});
