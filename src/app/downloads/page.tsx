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

export default async function DownloadsPage() {
  const resources = await prisma.contentItem.findMany({
    where: { type: "RESOURCE", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="min-h-screen bg-surface text-content">
      <section className="border-b border-brand/20 bg-gradient-to-b from-card to-surface py-16">
        <div className="mx-auto max-w-7xl px-6">
          <span className="font-mono text-xs font-semibold uppercase tracking-super-wide text-brand">Research Commons</span>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-content sm:text-5xl">Downloads & Resources</h1>
          <p className="mt-3 max-w-2xl text-base text-muted">
            Access published research papers, hardware documentation, datasets, and technical manuals.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          {resources.length === 0 ? (
            <div className="aristocratic-card mx-auto max-w-xl rounded-2xl p-12 text-center">
              <span className="mb-2 block font-mono text-2xl text-brand">∅</span>
              <p className="text-sm text-muted">No resources published yet. Check back soon.</p>
            </div>
          ) : (
            <div className="aristocratic-card overflow-hidden rounded-2xl">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-edge text-left">
                    <th className="px-5 py-3 font-mono uppercase tracking-wider text-muted">Resource</th>
                    <th className="px-5 py-3 font-mono uppercase tracking-wider text-muted">Category</th>
                    <th className="px-5 py-3 font-mono uppercase tracking-wider text-muted">Summary</th>
                    <th className="px-5 py-3 font-mono uppercase tracking-wider text-muted">Published</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((r) => {
                    const details = r.details as { url?: string; mimeType?: string; size?: number } | null;
                    return (
                      <tr key={r.id} className="border-b border-edge transition-colors hover:bg-brand/5">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getMimeIcon(details?.mimeType ?? null)}</span>
                            <div>
                              <p className="font-semibold text-content">{r.title}</p>
                              {details?.url && (
                                <a
                                  href={details.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-0.5 inline-block font-mono text-[10px] text-brand hover:underline"
                                >
                                  Download File →
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {r.category ? (
                            <span className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 font-mono text-[10px] text-brand">
                              {r.category.name}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="max-w-xs truncate px-5 py-4 text-muted">{r.summary || "—"}</td>
                        <td className="px-5 py-4 font-mono text-muted">
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
