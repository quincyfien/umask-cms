import Link from "next/link";
import { prisma } from "@/lib/db";
import { requirePagePermission } from "@/lib/auth";

export default async function ContactsPage() {
  await requirePagePermission("contacts.view");
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  const STATUS_STYLES: Record<string, string> = {
    NEW: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    READ: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    RESOLVED: "bg-brand/10 text-brand border-brand/30",
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
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-500">No contact messages yet.</td>
              </tr>
            ) : (
              messages.map((m) => (
                <tr key={m.id} className="border-b border-white/5 hover:bg-brand/5 transition-colors">
                  <td className="px-5 py-3 font-medium text-white">
                    <Link href={`/admin/contacts/${m.id}`} className="hover:text-brand transition-colors">
                      {m.fullName}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-300">
                    <Link href={`/admin/contacts/${m.id}`} className="hover:text-white transition-colors">
                      {m.subject}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${STATUS_STYLES[m.status] ?? "bg-gray-500/10 text-gray-400 border-gray-500/30"}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-500">{m.createdAt.toISOString().slice(0, 10)}</td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/contacts/${m.id}`} className="font-mono text-brand hover:underline">
                      View & Reply →
                    </Link>
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
