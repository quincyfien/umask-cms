import { prisma } from "@/lib/db";

export default async function StaffPage() {
  const staff = await prisma.staff.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "asc" },
    include: {
      permissions: { include: { permission: true } },
      roles: { include: { role: true } },
    },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold">Staff</h1>
      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-b border-gray-100">
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.email}</td>
                <td className="px-4 py-2">{s.status}</td>
                <td className="px-4 py-2">
                  {s.isSuperAdmin
                    ? "Super Admin"
                    : [
                        ...s.permissions.map((p) => p.permission.key),
                        ...s.roles.map((r) => `role:${r.role.name}`),
                      ].join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
