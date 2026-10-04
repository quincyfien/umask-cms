import { prisma } from "@/lib/db";

export default async function ApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const STATUS_STYLES: Record<string, string> = {
    SUBMITTED: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    IN_REVIEW: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    ACCEPTED: "bg-brand/10 text-brand border-brand/30",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <span className="text-[10px] font-mono text-brand uppercase tracking-wider">ADMIN ONLY</span>
        <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">Applications</h1>
        <p className="text-xs text-gray-400 mt-1">View and manage all program and fellowship submissions.</p>
      </div>

      <div className="aristocratic-card rounded-2xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Reference</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Full Name</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Type</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-500">No applications received yet.</td>
              </tr>
            ) : (
              applications.map((a) => (
                <tr key={a.id} className="border-b border-white/5 hover:bg-brand/5 transition-colors">
                  <td className="px-5 py-3 font-mono text-brand">{a.reference}</td>
                  <td className="px-5 py-3 text-white font-medium">{a.fullName}</td>
                  <td className="px-5 py-3 text-gray-400 font-mono">{a.applicantType}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${STATUS_STYLES[a.status] ?? "bg-gray-500/10 text-gray-400 border-gray-500/30"}`}>
                      {a.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 font-mono">{a.createdAt.toISOString().slice(0, 10)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
