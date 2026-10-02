import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { hashPassword, passwordIssues } from "@/lib/password";
import { isPermissionKey } from "@/lib/permissions";
import { recordAudit } from "@/lib/audit";
import { toErrorResponse, problem, validationError } from "@/lib/http";

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  password: z.string().min(8).max(128),
  permissions: z.array(z.string()).optional(),
  roleIds: z.array(z.string()).optional(),
});

export async function GET() {
  try {
    await requirePermission("staff.manage");
    const staff = await prisma.staff.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        isSuperAdmin: true,
        createdAt: true,
        permissions: { select: { permission: { select: { key: true } } } },
        roles: { select: { role: { select: { id: true, name: true } } } },
      },
    });
    return Response.json({ staff });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(request: Request) {
  try {
    await requirePermission("staff.manage");
    const body = await request.json();
    const parsed = createSchema.parse(body);

    const issues = passwordIssues(parsed.password);
    if (issues.length > 0) {
      return validationError(issues.map((m) => ({ field: "password", message: m })));
    }

    const existing = await prisma.staff.findUnique({
      where: { email: parsed.email.toLowerCase() },
    });
    if (existing) return problem(409, "EMAIL_TAKEN", "A staff account with this email already exists.");

    const validPermissions = (parsed.permissions ?? []).filter(isPermissionKey);

    const staff = await prisma.staff.create({
      data: {
        email: parsed.email.toLowerCase(),
        name: parsed.name,
        passwordHash: await hashPassword(parsed.password),
        status: "ACTIVE",
        permissions: validPermissions.length
          ? { create: validPermissions.map((p) => ({ permissionId: p })) }
          : undefined,
        roles: parsed.roleIds?.length
          ? { create: parsed.roleIds.map((roleId) => ({ roleId })) }
          : undefined,
      },
    });

    await recordAudit({
      action: "STAFF_USER_CREATE",
      targetResource: `staff:${staff.id}`,
    });

    return Response.json({ staff }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
