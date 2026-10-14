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
    <div className="min-h-screen bg-surface text-content relative">
      <section className="border-b border-edge bg-gradient-to-b from-card to-surface py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl font-serif">Services We Offer</h1>
          <div className="mt-4 h-px w-24 bg-brand/50"></div>
          <p className="mt-6 max-w-2xl text-base text-muted tracking-wide">
            Explore our professional services and laboratory offerings. Contact us to initiate an engagement.
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
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((svc) => {
                const details = (svc.details ?? {}) as { capabilities?: string[], requirements?: string[] };
                return (
                  <div key={svc.id} className="aristocratic-card flex flex-col rounded-xl overflow-hidden bg-card border border-edge">
                    {/* High-quality representative image */}
                    <div className="h-48 w-full shrink-0 bg-ink">
                      {svc.featuredImageId ? (
                        <img src={`/api/media/${svc.featuredImageId}`} alt={svc.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/20 to-card">
                           <span className="text-muted text-xs font-mono">No Image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 p-6 flex flex-col">
                      <h2 className="text-xl font-bold font-serif mb-2">{svc.title}</h2>
                      {svc.summary && <p className="text-sm text-muted mb-6 leading-relaxed">{svc.summary}</p>}
                      
                      {/* Structured sub-lists */}
                      <div className="mt-auto space-y-4">
                        {details.capabilities && details.capabilities.length > 0 && (
                          <div>
                            <h4 className="font-mono text-[10px] uppercase tracking-widest text-brand mb-2">Core Offerings</h4>
                            <ul className="space-y-1">
                              {details.capabilities.map((c) => (
                                <li key={c} className="flex items-start gap-2 text-xs text-muted">
                                  <span className="text-brand mt-0.5">•</span>
                                  <span>{c}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {details.requirements && details.requirements.length > 0 && (
                          <div>
                            <h4 className="font-mono text-[10px] uppercase tracking-widest text-brand mb-2">Access Parameters</h4>
                            <ul className="space-y-1">
                              {details.requirements.map((r) => (
                                <li key={r} className="flex items-start gap-2 text-xs text-muted">
                                  <span className="text-brand mt-0.5">•</span>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-12">
            <Pagination page={page} totalPages={totalPages} basePath="/services" />
          </div>
        </div>
      </section>

      {/* Floating Contact Us */}
      <Link
        href="/contact"
        className="fixed bottom-8 right-8 z-50 rounded-full bg-brand px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white shadow-xl shadow-brand/40 transition-all hover:bg-brand-hover hover:scale-105"
      >
        Contact Us
      </Link>
    </div>
  );
}
