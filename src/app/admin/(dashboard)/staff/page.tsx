import { prisma } from "@/lib/db";
import { requirePagePermission } from "@/lib/auth";
import StaffManager from "@/components/admin/StaffManager";

export default async function StaffPage() {
  await requirePagePermission("staff.manage");

  const staff = await prisma.staff.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "asc" },
    include: {
      roles: { include: { role: { select: { id: true, name: true } } } },
      sessions: { orderBy: { lastSeenAt: "desc" }, take: 1, select: { lastSeenAt: true } },
    },
  });

  const roles = await prisma.role.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  return (
    <StaffManager
      initialStaff={staff.map((s) => ({
        id: s.id,
        email: s.email,
        name: s.name,
        status: s.status,
        isSuperAdmin: s.isSuperAdmin,
        roles: s.roles,
        lastActiveAt: s.sessions[0]?.lastSeenAt?.toISOString() ?? null,
      }))}
      roles={roles}
    />
  );
}
