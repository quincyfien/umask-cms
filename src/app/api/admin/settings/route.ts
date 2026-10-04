import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { setSetting } from "@/lib/settings";
import { toErrorResponse } from "@/lib/http";

export async function GET() {
  try {
    await requirePermission("settings.manage");
    const rows = await prisma.systemSetting.findMany();
    const settings: Record<string, unknown> = {};
    for (const row of rows) settings[row.key] = row.value;
    return Response.json({ settings });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function PUT(request: Request) {
  try {
    await requirePermission("settings.manage");
    const body = (await request.json()) as Record<string, unknown>;
    for (const [key, value] of Object.entries(body)) {
      await setSetting(key, value);
    }
    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
