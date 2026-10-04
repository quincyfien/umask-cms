import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser, hasPermission } from "@/lib/auth";

const STAT_COLORS: Record<string, string> = {
  "Items awaiting review": "border-l-yellow-400",
  "New contact messages": "border-l-blue-400",
  "New applications": "border-l-brand",
  "Draft content": "border-l-gray-400",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const cards: { label: string; href: string; count: number | null; show: boolean; desc: string }[] = [];

  if (hasPermission(user, "content.review") || hasPermission(user, "content.publish")) {
    const count = await prisma.contentItem.count({ where: { status: "REVIEW", deletedAt: null } });
    cards.push({ label: "Items awaiting review", href: "/admin/content", count, show: true, desc: "Pending editorial sign-off" });
  }
  if (hasPermission(user, "contacts.view")) {
    const count = await prisma.contactMessage.count({ where: { status: "NEW" } });
    cards.push({ label: "New contact messages", href: "/admin/contacts", count, show: true, desc: "Unread public inquiries" });
  }
  if (hasPermission(user, "applications.view")) {
    const count = await prisma.application.count({ where: { status: "SUBMITTED" } });
    cards.push({ label: "New applications", href: "/admin/applications", count, show: true, desc: "Fellowship & program submissions" });
  }
  if (hasPermission(user, "content.create")) {
    const count = await prisma.contentItem.count({ where: { status: "DRAFT", deletedAt: null } });
    cards.push({ label: "Draft content", href: "/admin/content", count, show: true, desc: "Unpublished items in progress" });
  }

  const recentActivity = await prisma.contentItem.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: "desc" },
    take: 5,
    select: { id: true, title: true, type: true, status: true, updatedAt: true },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <span className="text-[10px] font-mono text-brand uppercase tracking-wider">CONTROL PANEL</span>
        <h1 className="text-3xl font-bold text-white tracking-tight mt-1">Dashboard Overview</h1>
        <p className="text-sm text-gray-400 mt-1">Welcome back, <span className="text-brand font-semibold">{user.name}</span></p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.filter(c => c.show).map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`aristocratic-card p-5 rounded-xl border-l-4 ${STAT_COLORS[c.label] ?? "border-l-brand"} hover:scale-[1.02] transition-transform`}
          >
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">{c.label}</p>
            <p className="mt-2 text-4xl font-extrabold text-white">{c.count ?? 0}</p>
            <p className="mt-1 text-[10px] text-gray-500">{c.desc}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-mono font-semibold uppercase tracking-widest text-brand mb-4">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "New News Article", href: "/admin/content/new", icon: "📰" },
            { label: "New Event", href: "/admin/content/new", icon: "📅" },
            { label: "New Program", href: "/admin/content/new", icon: "🎓" },
            { label: "Upload Media", href: "/admin/media", icon: "🖼️" },
          ].map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="aristocratic-card flex items-center gap-3 p-4 rounded-xl text-xs font-semibold text-gray-300 hover:text-brand transition-colors"
            >
              <span className="text-lg">{a.icon}</span>
              <span>{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-sm font-mono font-semibold uppercase tracking-widest text-brand mb-4">Recent Activity</h2>
        <div className="aristocratic-card rounded-2xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Updated</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-brand/5 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/admin/content/${item.id}`} className="text-white hover:text-brand transition-colors font-medium">
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-400 font-mono">{item.type}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                      item.status === "PUBLISHED" ? "bg-brand/10 text-brand border-brand/30" :
                      item.status === "DRAFT" ? "bg-gray-500/10 text-gray-400 border-gray-500/30" :
                      "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 font-mono">{item.updatedAt.toISOString().slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
