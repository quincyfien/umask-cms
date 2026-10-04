import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { randomToken, sha256 } from "./crypto";
import { env } from "./env";
import { PERMISSION_KEYS } from "./permissions";
import { ApiError } from "./http";
import { recordAudit } from "./audit";

export const SESSION_COOKIE = "session";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  isSuperAdmin: boolean;
  permissions: Set<string>;
};

export async function createSession(
  staffId: string,
  ip?: string,
  userAgent?: string,
): Promise<string> {
  const token = randomToken(32);
  const now = new Date();
  await prisma.session.create({
    data: {
      staffId,
      tokenHash: sha256(token),
      ip,
      userAgent,
      expiresAt: new Date(now.getTime() + env.sessionAbsoluteSeconds * 1000),
      idleExpiresAt: new Date(now.getTime() + env.sessionIdleSeconds * 1000),
      lastSeenAt: now,
    },
  });
  return token;
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: env.sessionAbsoluteSeconds,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function destroySession(tokenHash: string): Promise<void> {
  await prisma.session.deleteMany({ where: { tokenHash } });
}

function buildPermissions(isSuperAdmin: boolean, keys: string[]): Set<string> {
  const set = new Set<string>(keys);
  if (isSuperAdmin) {
    for (const k of PERMISSION_KEYS) set.add(k);
    set.add("settings.manage");
    set.add("superadmin.transfer");
  }
  return set;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: sha256(token) },
    include: {
      staff: {
        include: {
          permissions: { include: { permission: true } },
          roles: {
            include: {
              role: { include: { permissions: { include: { permission: true } } } },
            },
          },
        },
      },
    },
  });
  if (!session) return null;

  const now = Date.now();
  if (now > session.expiresAt.getTime() || now > session.idleExpiresAt.getTime()) {
    return null;
  }
  if (session.staff.status !== "ACTIVE" || session.staff.deletedAt) {
    return null;
  }

  const keys: string[] = [];
  for (const sp of session.staff.permissions) keys.push(sp.permission.key);
  for (const sr of session.staff.roles) {
    for (const rp of sr.role.permissions) keys.push(rp.permission.key);
  }

  await prisma.session.update({
    where: { id: session.id },
    data: {
      idleExpiresAt: new Date(now + env.sessionIdleSeconds * 1000),
      lastSeenAt: new Date(now),
    },
  });

  return {
    id: session.staff.id,
    email: session.staff.email,
    name: session.staff.name,
    isSuperAdmin: session.staff.isSuperAdmin,
    permissions: buildPermissions(session.staff.isSuperAdmin, keys),
  };
}

export function hasPermission(user: SessionUser, key: string): boolean {
  return user.isSuperAdmin || user.permissions.has(key);
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new ApiError(401, "UNAUTHENTICATED", "You must be signed in.");
  return user;
}

export async function requirePermission(key: string): Promise<SessionUser> {
  const user = await requireUser();
  if (!hasPermission(user, key)) {
    await recordAudit({
      action: "AUTHZ_DENIED",
      actorId: user.id,
      targetResource: `permission:${key}`,
      status: "DENIED",
    });
    throw new ApiError(403, "FORBIDDEN", "You do not have permission to perform this action.");
  }
  return user;
}

export async function requirePagePermission(key: string): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!hasPermission(user, key)) redirect("/admin/denied");
  return user;
}
