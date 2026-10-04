import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { isPermissionKey } from "@/lib/permissions";
import { randomToken, sha256 } from "@/lib/crypto";
import { queueEmail } from "@/lib/email";
import { recordAudit } from "@/lib/audit";
import { toErrorResponse, problem } from "@/lib/http";
import { env } from "@/lib/env";

const inviteSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  roleIds: z.array(z.string()).optional(),
  permissions: z.array(z.string()).optional(),
  expiresAt: z.string().datetime().optional(),
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
        sessions: {
          orderBy: { lastSeenAt: "desc" },
          take: 1,
          select: { lastSeenAt: true },
        },
      },
    });
    return Response.json({
      staff: staff.map((s) => ({
        ...s,
        lastActiveAt: s.sessions[0]?.lastSeenAt ?? null,
        sessions: undefined,
      })),
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(request: Request) {
  try {
    await requirePermission("staff.manage");
    const body = await request.json();
    const parsed = inviteSchema.parse(body);

    const existing = await prisma.staff.findUnique({
      where: { email: parsed.email.toLowerCase() },
    });
    if (existing) {
      return problem(409, "EMAIL_TAKEN", "A staff account with this email already exists.");
    }

    const validPermissions = (parsed.permissions ?? []).filter(isPermissionKey);

    const staff = await prisma.staff.create({
      data: {
        email: parsed.email.toLowerCase(),
        name: parsed.name,
        passwordHash: "",
        status: "PENDING",
        permissions: validPermissions.length
          ? { create: validPermissions.map((p) => ({ permissionId: p })) }
          : undefined,
        roles: parsed.roleIds?.length
          ? { create: parsed.roleIds.map((roleId) => ({ roleId })) }
          : undefined,
      },
    });

    const token = randomToken();
    await prisma.token.create({
      data: {
        purpose: "staff_invite",
        tokenHash: sha256(token),
        email: parsed.email.toLowerCase(),
        staffId: staff.id,
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : new Date(Date.now() + 72 * 60 * 60 * 1000),
      },
    });

    const link = `${env.siteOrigin}/admin/accept-invite?token=${token}`;
    await queueEmail(
      parsed.email,
      "You have been invited",
      `You have been invited to join the admin team. Set your password here:\n\n${link}\n\nThis link expires in 72 hours.`,
    );

    await recordAudit({ action: "STAFF_USER_CREATE", targetResource: `staff:${staff.id}` });

    return Response.json({ staff }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
