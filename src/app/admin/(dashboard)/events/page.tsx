import Link from "next/link";
import { prisma } from "@/lib/db";
import { requirePagePermission } from "@/lib/auth";

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  await requirePagePermission("content.create");
  const { status } = (await searchParams) ?? {};

  const events = await prisma.contentItem.findMany({
    where: {
      type: "EVENT",
      deletedAt: null,
      ...(status ? { status: status as never } : {}),
    },
    orderBy: { startAt: "desc" },
    include: {
      category: { select: { name: true } },
      author: { select: { name: true } },
    },
  });

  const STATUSES = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <span className="text-[10px] font-mono text-brand uppercase tracking-wider">CONFERENCES & SYMPOSIA</span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">Events Management</h1>
          <p className="text-xs text-gray-400 mt-1">Organize scientific symposia, cleanroom workshops, keynote addresses, and research summits.</p>
        </div>
        <Link
          href="/admin/content/new?type=EVENT"
          className="px-5 py-2.5 rounded-full bg-brand text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20"
        >
          + New Event
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-mono text-gray-400">Filter Status:</span>
        <Link
          href="/admin/events"
          className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${
            !status ? "bg-brand/20 border-brand text-brand" : "border-white/20 text-gray-300 hover:border-brand hover:text-brand"
          }`}
        >
          All ({events.length})
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/events?status=${s}`}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${
              status === s ? "bg-brand/20 border-brand text-brand" : "border-white/20 text-gray-300 hover:border-brand hover:text-brand"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="aristocratic-card rounded-2xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Event Name</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Classification</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Scheduled Date</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Modality</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-500 font-mono">
                  No symposia or workshops scheduled yet. Click &quot;+ New Event&quot; above to publish an event.
                </td>
              </tr>
            ) : (
              events.map((evt) => (
                <tr key={evt.id} className="border-b border-white/5 hover:bg-brand/5 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/admin/content/${evt.id}`} className="text-white hover:text-brand transition-colors font-medium">
                      {evt.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-400">{evt.eventKind ?? "EVENT"}</td>
                  <td className="px-5 py-3 font-mono text-gray-300">
                    {evt.startAt ? evt.startAt.toISOString().slice(0, 16).replace("T", " ") : "TBD"}
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-400">
                    {evt.locationType ?? "PHYSICAL"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                        evt.status === "PUBLISHED"
                          ? "bg-brand/10 text-brand border-brand/30"
                          : evt.status === "DRAFT"
                          ? "bg-gray-500/10 text-gray-400 border-gray-500/30"
                          : evt.status === "REVIEW"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                          : "bg-red-500/10 text-red-400 border-red-500/30"
                      }`}
                    >
                      {evt.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right space-x-3 font-mono">
                    <Link href={`/admin/events/${evt.id}/registrations`} className="text-gray-300 hover:text-brand">
                      RSVPs
                    </Link>
                    <Link href={`/admin/content/${evt.id}`} className="text-brand hover:underline">
                      Edit
                    </Link>
                    {evt.status === "PUBLISHED" && (
                      <Link href={`/events/${evt.slug}`} target="_blank" className="text-gray-400 hover:text-white">
                        View ↗
                      </Link>
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
