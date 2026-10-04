import Link from "next/link";
import { prisma } from "@/lib/db";
import { requirePagePermission } from "@/lib/auth";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  await requirePagePermission("content.create");
  const { status } = (await searchParams) ?? {};

  const projects = await prisma.contentItem.findMany({
    where: {
      type: "PROJECT",
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
          <span className="text-[10px] font-mono text-brand uppercase tracking-wider">LABORATORY INITIATIVES</span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">Projects Management</h1>
          <p className="text-xs text-gray-400 mt-1">Direct scientific investigations, pilot demonstrators, and technology transfer pipelines.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/categories"
            className="px-4 py-2.5 rounded-full border border-white/20 text-xs font-semibold uppercase tracking-wider text-gray-300 hover:border-brand hover:text-brand transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/admin/content/new?type=PROJECT"
            className="px-5 py-2.5 rounded-full bg-brand text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20"
          >
            + New Project
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-mono text-gray-400">Filter Status:</span>
        <Link
          href="/admin/projects"
          className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${
            !status ? "bg-brand/20 border-brand text-brand" : "border-white/20 text-gray-300 hover:border-brand hover:text-brand"
          }`}
        >
          All ({projects.length})
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/projects?status=${s}`}
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
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Project Title</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Discipline / Category</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">R&D Lifecycle</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Updated</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-500 font-mono">
                  No research projects catalogued yet. Click &quot;+ New Project&quot; above to publish an active investigation.
                </td>
              </tr>
            ) : (
              projects.map((proj) => (
                <tr key={proj.id} className="border-b border-white/5 hover:bg-brand/5 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/admin/content/${proj.id}`} className="text-white hover:text-brand transition-colors font-medium">
                      {proj.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-400">{proj.category?.name ?? "General"}</td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs text-gray-300">
                      {proj.projectStatus ?? "ACTIVE"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                        proj.status === "PUBLISHED"
                          ? "bg-brand/10 text-brand border-brand/30"
                          : proj.status === "DRAFT"
                          ? "bg-gray-500/10 text-gray-400 border-gray-500/30"
                          : proj.status === "REVIEW"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                          : "bg-red-500/10 text-red-400 border-red-500/30"
                      }`}
                    >
                      {proj.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 font-mono">{proj.updatedAt.toISOString().slice(0, 10)}</td>
                  <td className="px-5 py-3 text-right space-x-3 font-mono">
                    <Link href={`/admin/content/${proj.id}`} className="text-brand hover:underline">
                      Edit
                    </Link>
                    {proj.status === "PUBLISHED" && (
                      <Link href={`/projects/${proj.slug}`} target="_blank" className="text-gray-400 hover:text-white">
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
