import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { isPermissionKey } from "@/lib/permissions";
import { recordAudit } from "@/lib/audit";
import { toErrorResponse } from "@/lib/http";

const createSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  permissions: z.array(z.string()).optional(),
});

export async function GET() {
  try {
    await requirePermission("staff.manage");
    const roles = await prisma.role.findMany({
      orderBy: { name: "asc" },
      include: { permissions: { include: { permission: true } } },
    });
    return Response.json({ roles });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(request: Request) {
  try {
    await requirePermission("roles.create");
    const body = await request.json();
    const parsed = createSchema.parse(body);

    const valid = (parsed.permissions ?? []).filter(isPermissionKey);
    const role = await prisma.role.create({
      data: {
        name: parsed.name,
        description: parsed.description,
        permissions: valid.length
          ? { create: valid.map((p) => ({ permissionId: p })) }
          : undefined,
      },
    });
    await recordAudit({ action: "ROLE_CREATE", targetResource: `role:${role.id}` });
    return Response.json({ role }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
