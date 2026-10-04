import Link from "next/link";
import { prisma } from "@/lib/db";
import { requirePagePermission } from "@/lib/auth";

export default async function AdminProgramsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  await requirePagePermission("content.create");
  const { status } = (await searchParams) ?? {};

  const programs = await prisma.contentItem.findMany({
    where: {
      type: "PROGRAM",
      deletedAt: null,
      ...(status ? { status: status as never } : {}),
    },
    orderBy: { updatedAt: "desc" },
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
          <span className="text-[10px] font-mono text-brand uppercase tracking-wider">ACADEMIC & FELLOWSHIPS</span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">Programs & Fellowships</h1>
          <p className="text-xs text-gray-400 mt-1">Manage research residencies, tech cohorts, educational tracks, and application intake.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/applications"
            className="px-4 py-2.5 rounded-full border border-brand/40 text-xs font-semibold uppercase tracking-wider text-brand hover:bg-brand/10 transition-colors"
          >
            Review Applications ↗
          </Link>
          <Link
            href="/admin/content/new?type=PROGRAM"
            className="px-5 py-2.5 rounded-full bg-brand text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20"
          >
            + New Program
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-mono text-gray-400">Filter Status:</span>
        <Link
          href="/admin/programs"
          className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${
            !status ? "bg-brand/20 border-brand text-brand" : "border-white/20 text-gray-300 hover:border-brand hover:text-brand"
          }`}
        >
          All ({programs.length})
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/programs?status=${s}`}
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
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Program Title</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Cohort Phase</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Author</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Updated</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-500 font-mono">
                  No programs found. Click &quot;+ New Program&quot; above to launch a cohort or fellowship.
                </td>
              </tr>
            ) : (
              programs.map((prog) => (
                <tr key={prog.id} className="border-b border-white/5 hover:bg-brand/5 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/admin/content/${prog.id}`} className="text-white hover:text-brand transition-colors font-medium">
                      {prog.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-400">{prog.programStatus ?? "ACTIVE"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                        prog.status === "PUBLISHED"
                          ? "bg-brand/10 text-brand border-brand/30"
                          : prog.status === "DRAFT"
                          ? "bg-gray-500/10 text-gray-400 border-gray-500/30"
                          : prog.status === "REVIEW"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                          : "bg-red-500/10 text-red-400 border-red-500/30"
                      }`}
                    >
                      {prog.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{prog.author?.name ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-500 font-mono">{prog.updatedAt.toISOString().slice(0, 10)}</td>
                  <td className="px-5 py-3 text-right space-x-3 font-mono">
                    <Link href={`/admin/content/${prog.id}`} className="text-brand hover:underline">
                      Edit
                    </Link>
                    {prog.status === "PUBLISHED" && (
                      <Link href={`/programs/${prog.slug}`} target="_blank" className="text-gray-400 hover:text-white">
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
