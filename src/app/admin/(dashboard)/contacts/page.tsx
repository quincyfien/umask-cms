import { prisma } from "@/lib/db";

export default async function ContactsPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  const STATUS_STYLES: Record<string, string> = {
    NEW: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    READ: "bg-gray-500/10 text-gray-400 border-gray-500/30",
    REPLIED: "bg-brand/10 text-brand border-brand/30",
    ARCHIVED: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <span className="text-[10px] font-mono text-brand uppercase tracking-wider">INBOX</span>
        <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">Contact Messages</h1>
        <p className="text-xs text-gray-400 mt-1">Public inquiries submitted via the contact form.</p>
      </div>

      <div className="aristocratic-card rounded-2xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">From</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Subject</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-gray-500">No contact messages yet.</td>
              </tr>
            ) : (
              messages.map((m) => (
                <tr key={m.id} className="border-b border-white/5 hover:bg-brand/5 transition-colors">
                  <td className="px-5 py-3 font-medium text-white">{m.fullName}</td>
                  <td className="px-5 py-3 text-gray-300">{m.subject}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${STATUS_STYLES[m.status] ?? "bg-gray-500/10 text-gray-400 border-gray-500/30"}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-500">{m.createdAt.toISOString().slice(0, 10)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
