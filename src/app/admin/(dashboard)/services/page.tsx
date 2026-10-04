import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const { status } = (await searchParams) ?? {};

  const services = await prisma.contentItem.findMany({
    where: {
      type: "SERVICE",
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
          <span className="text-[10px] font-mono text-brand uppercase tracking-wider">LABORATORY & CONSULTING</span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">Services Management</h1>
          <p className="text-xs text-gray-400 mt-1">Manage instrumentation access, analytical testing, consulting, and cleanroom services.</p>
        </div>
        <Link
          href="/admin/content/new?type=SERVICE"
          className="px-5 py-2.5 rounded-full bg-brand text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20"
        >
          + New Service
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-mono text-gray-400">Filter Status:</span>
        <Link
          href="/admin/services"
          className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${
            !status ? "bg-brand/20 border-brand text-brand" : "border-white/20 text-gray-300 hover:border-brand hover:text-brand"
          }`}
        >
          All ({services.length})
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/services?status=${s}`}
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
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Service Title</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Author</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Updated</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-500 font-mono">
                  No research or lab services registered yet. Click &quot;+ New Service&quot; above to create one.
                </td>
              </tr>
            ) : (
              services.map((svc) => (
                <tr key={svc.id} className="border-b border-white/5 hover:bg-brand/5 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/admin/content/${svc.id}`} className="text-white hover:text-brand transition-colors font-medium">
                      {svc.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-400">{svc.category?.name ?? "General"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                        svc.status === "PUBLISHED"
                          ? "bg-brand/10 text-brand border-brand/30"
                          : svc.status === "DRAFT"
                          ? "bg-gray-500/10 text-gray-400 border-gray-500/30"
                          : svc.status === "REVIEW"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                          : "bg-red-500/10 text-red-400 border-red-500/30"
                      }`}
                    >
                      {svc.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{svc.author?.name ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-500 font-mono">{svc.updatedAt.toISOString().slice(0, 10)}</td>
                  <td className="px-5 py-3 text-right space-x-3 font-mono">
                    <Link href={`/admin/content/${svc.id}`} className="text-brand hover:underline">
                      Edit
                    </Link>
                    {svc.status === "PUBLISHED" && (
                      <Link href={`/services/${svc.slug}`} target="_blank" className="text-gray-400 hover:text-white">
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
