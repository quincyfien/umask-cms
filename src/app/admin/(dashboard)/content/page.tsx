import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function ContentAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const { type, status } = await searchParams;
  const items = await prisma.contentItem.findMany({
    where: {
      deletedAt: null,
      ...(type ? { type: type as never } : {}),
      ...(status ? { status: status as never } : {}),
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: { author: { select: { name: true } } },
  });

  const TYPES = ["SERVICE", "PROGRAM", "PROJECT", "EVENT", "NEWS", "RESOURCE", "PAGE"];
  const STATUSES = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <span className="text-[10px] font-mono text-brand uppercase tracking-wider">CMS</span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">News & Pages</h1>
        </div>
        <Link
          href="/admin/content/new"
          className="px-5 py-2.5 rounded-full bg-brand text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20"
        >
          + New Content
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/content" className="px-3 py-1.5 rounded-full border border-white/20 text-xs font-mono text-gray-300 hover:border-brand hover:text-brand transition-colors">
          All
        </Link>
        {TYPES.map((t) => (
          <Link
            key={t}
            href={`/admin/content?type=${t}`}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${type === t ? "bg-brand/20 border-brand text-brand" : "border-white/20 text-gray-300 hover:border-brand hover:text-brand"}`}
          >
            {t}
          </Link>
        ))}
        <span className="mx-2 text-white/20">|</span>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/content?status=${s}`}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${status === s ? "bg-brand/20 border-brand text-brand" : "border-white/20 text-gray-300 hover:border-brand hover:text-brand"}`}
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
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Title</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Type</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Author</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Updated</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-500">No content items found.</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-brand/5 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/admin/content/${item.id}`} className="text-white hover:text-brand transition-colors font-medium">
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-400">{item.type}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                      item.status === "PUBLISHED" ? "bg-brand/10 text-brand border-brand/30" :
                      item.status === "DRAFT" ? "bg-gray-500/10 text-gray-400 border-gray-500/30" :
                      item.status === "REVIEW" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" :
                      "bg-red-500/10 text-red-400 border-red-500/30"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{item.author?.name ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-500 font-mono">{item.updatedAt.toISOString().slice(0, 10)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
