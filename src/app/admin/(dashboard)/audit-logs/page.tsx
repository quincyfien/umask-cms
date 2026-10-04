import { prisma } from "@/lib/db";

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const { status } = (await searchParams) ?? {};

  const logs = await prisma.auditLog.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
    },
    orderBy: { timestamp: "desc" },
    take: 100,
  });

  const STATUS_STYLES: Record<string, string> = {
    SUCCESS: "bg-brand/10 text-brand border-brand/30",
    DENIED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    ERROR: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <span className="text-[10px] font-mono text-brand uppercase tracking-wider">SECURITY & COMPLIANCE</span>
        <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">Audit Logs</h1>
        <p className="text-xs text-gray-400 mt-1">Immutable institutional record tracking authentication, permissions, and business rule modifications.</p>
      </div>

      <div className="aristocratic-card rounded-2xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Timestamp</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Action Event</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Target Resource</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Actor / IP</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-gray-500 font-mono">
                  No audit log entries recorded yet. Administrative events will be archived here automatically.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-brand/5 transition-colors">
                  <td className="px-5 py-3 font-mono text-gray-400">
                    {log.timestamp.toISOString().replace("T", " ").slice(0, 19)}
                  </td>
                  <td className="px-5 py-3 font-mono text-white font-medium">{log.action}</td>
                  <td className="px-5 py-3 font-mono text-gray-300">{log.targetResource ?? "—"}</td>
                  <td className="px-5 py-3 font-mono text-gray-400">
                    {log.actorId ? `ID: ${log.actorId.slice(0, 8)}…` : log.actorIp ?? "System"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                        STATUS_STYLES[log.status] ?? "bg-gray-500/10 text-gray-400 border-gray-500/30"
                      }`}
                    >
                      {log.status}
                    </span>
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
