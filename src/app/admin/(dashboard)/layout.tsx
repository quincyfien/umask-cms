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

  const links: { href: string; label: string; show: boolean }[] = [
    { href: "/admin", label: "Dashboard", show: true },
    { href: "/admin/content", label: "Content", show: hasPermission(user, "content.create") },
    { href: "/admin/media", label: "Media", show: hasPermission(user, "media.upload") },
    { href: "/admin/staff", label: "Staff", show: hasPermission(user, "staff.manage") },
    { href: "/admin/contacts", label: "Contacts", show: hasPermission(user, "contacts.view") },
    { href: "/admin/applications", label: "Applications", show: hasPermission(user, "applications.view") },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-4">
          <Link href="/admin" className="font-semibold text-brand">
            BTRC Admin
          </Link>
        </div>
        <nav className="p-2">
          {links
            .filter((l) => l.show)
            .map((l) => (
              <Link key={l.href} href={l.href} className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {l.label}
              </Link>
            ))}
        </nav>
        <div className="border-t border-gray-200 p-4 text-sm">
          <p className="text-gray-600">{user.name}</p>
          <form action="/api/auth/logout" method="post">
            <button className="mt-1 text-brand underline">Sign out</button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
