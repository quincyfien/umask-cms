import { prisma } from "@/lib/db";
import { requirePagePermission } from "@/lib/auth";
import { PERMISSION_KEYS, PERMISSION_DESCRIPTIONS } from "@/lib/permissions";
import RolesManager from "./RolesManager";

export default async function RolesPage() {
  await requirePagePermission("staff.manage");

  const roles = await prisma.role.findMany({
    orderBy: { name: "asc" },
    include: {
      permissions: {
        select: { permissionId: true },
      },
      staff: {
        select: { staffId: true },
      },
    },
  });

  const formattedRoles = roles.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    permissions: r.permissions.map((p) => p.permissionId),
    assignedStaffCount: r.staff.length,
  }));

  const allPermissions = PERMISSION_KEYS.map((k) => ({
    key: k,
    description: PERMISSION_DESCRIPTIONS[k] ?? k,
  }));

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-white/10 pb-5">
        <span className="text-[10px] font-mono text-brand uppercase tracking-wider">ACCESS CONTROL</span>
        <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">Roles & Capabilities</h1>
        <p className="text-xs text-gray-400 mt-1">
          Define institutional roles and calibrate fine-grained permissions for staff members.
        </p>
      </div>

      <RolesManager
        initialRoles={formattedRoles}
        allPermissions={allPermissions}
      />
    </div>
  );
}
