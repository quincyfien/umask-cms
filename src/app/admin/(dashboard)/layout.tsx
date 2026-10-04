import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, hasPermission } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const links: { href: string; label: string; icon: string; show: boolean }[] = [
    { href: "/admin", label: "Overview", icon: "📊", show: true },
    { href: "/admin/services", label: "Services", icon: "🛠️", show: hasPermission(user, "content.create") },
    { href: "/admin/programs", label: "Programs", icon: "🎓", show: hasPermission(user, "content.create") },
    { href: "/admin/applications", label: "Applications", icon: "📝", show: hasPermission(user, "applications.view") },
    { href: "/admin/projects", label: "Projects", icon: "🔬", show: hasPermission(user, "content.create") },
    { href: "/admin/events", label: "Events", icon: "📅", show: hasPermission(user, "content.create") },
    { href: "/admin/content", label: "News & Pages", icon: "📰", show: hasPermission(user, "content.create") },
    { href: "/admin/media", label: "Media Library", icon: "🖼️", show: hasPermission(user, "media.upload") },
    { href: "/admin/settings/business-rules", label: "Business Rules", icon: "⚖️", show: user.isSuperAdmin },
    { href: "/admin/settings/org", label: "Org Info", icon: "🏛️", show: user.isSuperAdmin },
    { href: "/admin/staff", label: "Staff Accounts", icon: "👥", show: hasPermission(user, "staff.manage") },
    { href: "/admin/audit-logs", label: "Audit Logs", icon: "📜", show: user.isSuperAdmin },
  ];

  return (
    <div className="flex min-h-screen bg-ink text-paper font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-brand/20 bg-ink-light flex flex-col justify-between">
        <div>
          {/* Header Brand */}
          <div className="border-b border-brand/20 p-5 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/20 border border-brand/40 text-brand font-mono font-bold text-base">
              B
            </div>
            <div>
              <Link href="/admin" className="font-bold text-sm text-white tracking-wider uppercase block">
                BTRC Admin
              </Link>
              <span className="text-[10px] font-mono text-brand">CMS CONTROL PANEL</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {links
              .filter((l) => l.show)
              .map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-300 hover:bg-brand/10 hover:text-brand transition-colors"
                >
                  <span className="text-sm">{l.icon}</span>
                  <span>{l.label}</span>
                </Link>
              ))}
          </nav>
        </div>

        {/* User Footer Profile */}
        <div className="border-t border-brand/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">{user.name}</p>
              <p className="text-[10px] font-mono text-brand uppercase">{user.isSuperAdmin ? "SUPERADMIN" : "STAFF"}</p>
            </div>
            <form action="/api/auth/logout" method="post">
              <button className="text-xs font-mono text-gray-400 hover:text-red-400 transition-colors">
                Logout
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
