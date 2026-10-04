import { prisma } from "@/lib/db";

function getMimeIcon(mimeType: string | null) {
  if (!mimeType) return "📄";
  if (mimeType.includes("pdf")) return "📕";
  if (mimeType.includes("word") || mimeType.includes("docx")) return "📘";
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "📊";
  if (mimeType.includes("zip") || mimeType.includes("archive")) return "🗜️";
  return "📎";
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function DownloadsPage() {
  const resources = await prisma.contentItem.findMany({
    where: { type: "RESOURCE", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="bg-ink text-paper min-h-screen">
      <section className="relative py-16 border-b border-brand/20 bg-gradient-to-b from-ink-light to-ink">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-xs font-mono tracking-super-wide text-brand uppercase font-semibold">RESEARCH COMMONS</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">Downloads & Resources</h1>
          <p className="mt-3 text-gray-300 text-base max-w-2xl">
            Access published research papers, hardware documentation, datasets, and technical manuals from BTRC.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {resources.length === 0 ? (
            <div className="aristocratic-card p-12 text-center rounded-2xl max-w-xl mx-auto">
              <span className="text-brand font-mono text-2xl block mb-2">∅</span>
              <p className="text-gray-300 text-sm">No resources published yet. Check back soon.</p>
            </div>
          ) : (
            <div className="aristocratic-card rounded-2xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Resource</th>
                    <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Summary</th>
                    <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Published</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((r) => {
                    const details = r.details as { url?: string; mimeType?: string; size?: number } | null;
                    return (
                      <tr key={r.id} className="border-b border-white/5 hover:bg-brand/5 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getMimeIcon(details?.mimeType ?? null)}</span>
                            <div>
                              <p className="font-semibold text-white">{r.title}</p>
                              {details?.url && (
                                <a
                                  href={details.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] font-mono text-brand hover:underline mt-0.5 inline-block"
                                >
                                  Download File →
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {r.category ? (
                            <span className="px-2 py-0.5 rounded-full bg-brand/10 border border-brand/30 text-[10px] font-mono text-brand">
                              {r.category.name}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-5 py-4 text-gray-400 max-w-xs truncate">{r.summary || "—"}</td>
                        <td className="px-5 py-4 font-mono text-gray-500">
                          {r.publishedAt ? r.publishedAt.toISOString().slice(0, 10) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
