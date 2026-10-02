import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser, hasPermission } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const cards: { label: string; href: string; count: number | null; show: boolean }[] = [];
  if (hasPermission(user, "content.review") || hasPermission(user, "content.publish")) {
    const count = await prisma.contentItem.count({ where: { status: "REVIEW", deletedAt: null } });
    cards.push({ label: "Items awaiting review", href: "/admin/content", count, show: true });
  }
  if (hasPermission(user, "contacts.view")) {
    const count = await prisma.contactMessage.count({ where: { status: "NEW" } });
    cards.push({ label: "New contact messages", href: "/admin/contacts", count, show: true });
  }
  if (hasPermission(user, "applications.view")) {
    const count = await prisma.application.count({ where: { status: "SUBMITTED" } });
    cards.push({ label: "New applications", href: "/admin/applications", count, show: true });
  }
  if (hasPermission(user, "content.create")) {
    const count = await prisma.contentItem.count({ where: { status: "DRAFT", deletedAt: null } });
    cards.push({ label: "Draft content", href: "/admin/content", count, show: true });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-lg border border-gray-200 bg-white p-5 hover:border-brand">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="mt-1 text-2xl font-semibold">{c.count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
