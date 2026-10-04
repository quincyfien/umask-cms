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
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5 flex items-end justify-between">
        <div>
          <span className="text-[10px] font-mono text-brand uppercase tracking-wider">ADMIN ONLY</span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">Staff Accounts</h1>
          <p className="text-xs text-gray-400 mt-1">Manage ADMIN and CONTENT_ADMIN staff users.</p>
        </div>
        <button className="px-5 py-2.5 rounded-full bg-brand text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20">
          + Invite Staff
        </button>
      </div>

      <div className="aristocratic-card rounded-2xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Role & Permissions</th>
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-gray-500">No staff accounts found.</td>
              </tr>
            ) : (
              staff.map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-brand/5 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center text-[10px] font-mono font-bold text-brand">
                        {s.name.charAt(0)}
                      </div>
                      <span className="font-medium text-white">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-400">{s.email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${s.status === "ACTIVE" ? "bg-brand/10 text-brand border-brand/30" : "bg-red-500/10 text-red-400 border-red-500/30"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {s.isSuperAdmin ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                        SUPER ADMIN
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {[...s.permissions.map((p) => p.permission.key), ...s.roles.map((r) => r.role.name)].slice(0, 3).map((p) => (
                          <span key={p} className="px-1.5 py-0.5 rounded bg-ink text-gray-400 border border-white/10 text-[10px] font-mono">
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
