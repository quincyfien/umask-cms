import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { hashPassword, passwordIssues } from "@/lib/password";
import { isPermissionKey } from "@/lib/permissions";
import { recordAudit } from "@/lib/audit";
import { toErrorResponse, problem, validationError } from "@/lib/http";

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "PENDING"]).optional(),
  password: z.string().min(8).max(128).optional(),
  permissions: z.array(z.string()).optional(),
  roleIds: z.array(z.string()).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requirePermission("staff.manage");
    const { id } = await params;
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        permissions: { include: { permission: true } },
        roles: { include: { role: { include: { permissions: true } } } },
      },
    });
    if (!staff) return problem(404, "NOT_FOUND", "Staff not found.");
    return Response.json({ staff });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requirePermission("staff.manage");
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.parse(body);

    const staff = await prisma.staff.findUnique({ where: { id } });
    if (!staff || staff.deletedAt) return problem(404, "NOT_FOUND", "Staff not found.");

    if (staff.isSuperAdmin) {
      return problem(403, "FORBIDDEN", "The Super Admin account cannot be modified here.");
    }

    const data: Record<string, unknown> = {};
    if (parsed.name !== undefined) data.name = parsed.name;
    if (parsed.status !== undefined) data.status = parsed.status;
    if (parsed.password !== undefined) {
      const issues = passwordIssues(parsed.password);
      if (issues.length > 0) {
        return validationError(issues.map((m) => ({ field: "password", message: m })));
      }
      data.passwordHash = await hashPassword(parsed.password);
    }

    await prisma.$transaction(async (tx) => {
      if (Object.keys(data).length > 0) {
        await tx.staff.update({ where: { id }, data });
      }
      if (parsed.permissions !== undefined) {
        await tx.staffPermission.deleteMany({ where: { staffId: id } });
        const valid = parsed.permissions.filter(isPermissionKey);
        if (valid.length) {
          await tx.staffPermission.createMany({
            data: valid.map((p) => ({ staffId: id, permissionId: p })),
          });
        }
      }
      if (parsed.roleIds !== undefined) {
        await tx.staffRole.deleteMany({ where: { staffId: id } });
        if (parsed.roleIds.length) {
          await tx.staffRole.createMany({
            data: parsed.roleIds.map((roleId) => ({ staffId: id, roleId })),
          });
        }
      }
    });

    await recordAudit({
      action: "STAFF_USER_UPDATE",
      targetResource: `staff:${id}`,
    });

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
    await requirePermission("staff.manage");
    const { id } = await params;
    const staff = await prisma.staff.findUnique({ where: { id } });
    if (!staff) return problem(404, "NOT_FOUND", "Staff not found.");
    if (staff.isSuperAdmin) {
      return problem(403, "FORBIDDEN", "The Super Admin account cannot be deleted.");
    }
    await prisma.staff.update({
      where: { id },
      data: { deletedAt: new Date(), status: "SUSPENDED" },
    });
    await prisma.session.deleteMany({ where: { staffId: id } });
    await recordAudit({ action: "STAFF_USER_DELETE", targetResource: `staff:${id}` });
    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
