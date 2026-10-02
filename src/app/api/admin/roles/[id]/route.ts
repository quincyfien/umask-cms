import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { isPermissionKey } from "@/lib/permissions";
import { recordAudit } from "@/lib/audit";
import { toErrorResponse } from "@/lib/http";

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  permissions: z.array(z.string()).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requirePermission("roles.create");
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.parse(body);

    await prisma.$transaction(async (tx) => {
      if (parsed.name !== undefined || parsed.description !== undefined) {
        await tx.role.update({
          where: { id },
          data: {
            ...(parsed.name !== undefined ? { name: parsed.name } : {}),
            ...(parsed.description !== undefined ? { description: parsed.description } : {}),
          },
        });
      }
      if (parsed.permissions !== undefined) {
        await tx.rolePermission.deleteMany({ where: { roleId: id } });
        const valid = parsed.permissions.filter(isPermissionKey);
        if (valid.length) {
          await tx.rolePermission.createMany({
            data: valid.map((p) => ({ roleId: id, permissionId: p })),
          });
        }
      }
    });

    await recordAudit({ action: "ROLE_UPDATE", targetResource: `role:${id}` });
    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requirePermission("roles.create");
    const { id } = await params;
    await prisma.role.delete({ where: { id } });
    await recordAudit({ action: "ROLE_DELETE", targetResource: `role:${id}` });
    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
