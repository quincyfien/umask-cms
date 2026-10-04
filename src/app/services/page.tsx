import Link from "next/link";
import { prisma } from "@/lib/db";
import { getPaginationSize } from "@/lib/settings";
import Pagination from "@/components/public/Pagination";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const perPage = await getPaginationSize();
  const page = Math.max(1, Number((await searchParams)?.page ?? 1) || 1);

  const where = { type: "SERVICE" as const, status: "PUBLISHED" as const, accessLevel: "PUBLIC" as const, deletedAt: null };
  const [services, total] = await Promise.all([
    prisma.contentItem.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      include: { category: true },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.contentItem.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="min-h-screen bg-surface text-content">
      <section className="border-b border-edge bg-gradient-to-b from-card to-surface py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Services & Labs</h1>
          <p className="mt-3 max-w-2xl text-base text-muted">
            Research infrastructure, equipment access, mentorship, and technical consulting.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          {services.length === 0 ? (
            <div className="aristocratic-card mx-auto max-w-xl rounded-2xl p-12 text-center">
              <span className="mb-2 block font-mono text-2xl text-brand">∅</span>
              <p className="text-sm text-muted">No services published yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((svc) => {
                const details = (svc.details ?? {}) as { capabilities?: string[] };
                return (
                  <div key={svc.id} className="aristocratic-card flex flex-col gap-6 rounded-2xl p-6 sm:flex-row sm:items-center">
                    <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-card sm:h-24 sm:w-40">
                      {svc.featuredImageId ? (
                        <img src={`/api/media/${svc.featuredImageId}`} alt={svc.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/20 to-card">
                          <img src="/images/icon.svg" alt="" className="h-10 w-10 opacity-70" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-bold">{svc.title}</h2>
                        {svc.category && (
                          <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand">
                            {svc.category.name}
                          </span>
                        )}
                      </div>
                      {svc.summary && <p className="mt-2 text-sm text-muted">{svc.summary}</p>}
                      {details.capabilities && details.capabilities.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {details.capabilities.map((c) => (
                            <li key={c} className="flex items-center gap-1.5 rounded-full border border-edge px-2.5 py-1 font-mono text-[11px] text-muted">
                              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} basePath="/services" />
        </div>
      </section>

      {/* Floating Contact Us */}
      <Link
        href="/contact"
        className="fixed bottom-6 right-6 z-40 rounded-full bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand/30 transition-all hover:bg-brand-hover hover:shadow-brand/50"
      >
        Contact Us
      </Link>
    </div>
  );
}
