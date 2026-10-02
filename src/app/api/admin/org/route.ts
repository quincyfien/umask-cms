import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { getOrganization, saveOrganization } from "@/lib/organization";
import { recordAudit } from "@/lib/audit";
import { toErrorResponse } from "@/lib/http";

const orgSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  address: z.string().max(500).optional(),
  phone: z.string().max(50).optional(),
  email: z.string().email().max(254).optional(),
  whatsapp: z.string().max(50).optional(),
  socials: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),
  mapConfig: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
      embedUrl: z.string().url().optional(),
    })
    .nullable()
    .optional(),
});

export async function GET() {
  try {
    await requirePermission("org.edit");
    return Response.json({ organization: await getOrganization() });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requirePermission("org.edit");
    const body = await request.json();
    const parsed = orgSchema.parse(body);
    const current = await getOrganization();
    const next = { ...current, ...parsed };
    await saveOrganization(next);
    await recordAudit({
      action: "SETTINGS_UPDATE",
      actorId: user.id,
      targetResource: "organization",
    });
    return Response.json({ organization: next });
  } catch (err) {
    return toErrorResponse(err);
  }
}
