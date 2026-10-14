import Link from "next/link";
import { prisma } from "@/lib/db";
import { getHeroConfig, getMetrics, resolveMetricValues, getHomepageServicesCount } from "@/lib/settings";
import { computeProgramStatus, ProgramDetails } from "@/lib/program";

export default async function Home() {
  const [events, news, hero, metrics, servicesCount] = await Promise.all([
    prisma.contentItem.findMany({
      where: { type: "EVENT", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.contentItem.findMany({
      where: { type: "NEWS", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    getHeroConfig(),
    getMetrics().then(resolveMetricValues),
    getHomepageServicesCount(),
  ]);

  const [services, allPrograms] = await Promise.all([
    prisma.contentItem.findMany({
      where: { type: "SERVICE", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
      take: servicesCount,
    }),
    prisma.contentItem.findMany({
      where: { type: "PROGRAM", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
    }),
  ]);

  // Filter programs to only show upcoming or ongoing (open for application)
  const activePrograms = allPrograms.filter((p) => {
    const status = computeProgramStatus(p.details as unknown as ProgramDetails);
    return status === "UPCOMING" || status === "ONGOING";
  }).slice(0, 3); // show max 3 on homepage

  const heroImage = hero.backgroundImageId
    ? `/api/media/${hero.backgroundImageId}`
    : "/images/hero-bg.png";

  return (
    <div className="bg-surface text-content">
      {/* Hero — always dark, image clearly visible */}
      <section className="relative flex min-h-[80vh] flex-col justify-end overflow-hidden bg-ink">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/30 to-transparent"></div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-end px-6 pb-20 pt-32 text-white">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-brand"></span>
            <span className="font-mono text-xs font-semibold uppercase tracking-super-wide text-brand">
              {hero.tagline}
            </span>
          </div>

          <h1 className="mb-6 max-w-5xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {hero.title}
          </h1>

          <p className="mb-10 max-w-3xl text-base leading-relaxed text-gray-200 md:text-xl">
            {hero.subtitle}
          </p>

          <div className="mb-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <Link
              href={hero.ctaPrimaryHref}
              className="rounded-full bg-brand px-8 py-4 text-center text-xs font-semibold uppercase tracking-super-wide text-white transition-all duration-300 hover:bg-brand-hover"
            >
              {hero.ctaPrimaryLabel}
            </Link>
            <Link
              href={hero.ctaSecondaryHref}
              className="rounded-full border border-white/30 px-8 py-4 text-center text-xs font-semibold uppercase tracking-super-wide text-white transition-all duration-300 hover:border-brand hover:text-brand"
            >
              {hero.ctaSecondaryLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Metrics */}
      <section className="border-b border-brand/10 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-content sm:text-5xl">
              Our Mission: Turning Ideas Into Impact
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted md:text-lg">
              To advance technology research, scientific innovation, and practical capacity building by creating an environment where high-potential ideas are engineered into real-world solutions.
            </p>
            <div className="aristocratic-card mb-8 rounded-2xl border-l-4 border-brand p-6">
              <p className="text-sm font-medium italic text-muted md:text-base">
                &ldquo;Vision: To become a leading platform for technology research, innovation, and engineering excellence in Cameroon and central Africa.&rdquo;
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-super-wide text-content transition-colors hover:text-brand"
            >
              <span>Read Full Institutional Overview</span>
              <span className="text-brand">→</span>
            </Link>
          </div>

          <div className="lg:col-span-5">
            <div className="aristocratic-card rounded-2xl p-8">
              <div className="mb-6 flex items-center justify-between border-b border-edge pb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-muted">Metric Benchmarks</span>
                <span className="font-mono text-[10px] font-semibold tracking-wider text-brand">VERIFIED DATA</span>
              </div>
              <div className="space-y-6">
                {metrics.map((m) => (
                  <div key={m.label} className="border-b border-edge pb-4 last:border-0 last:pb-0">
                    <div className="text-3xl font-extrabold tracking-tight text-content">
                      {m.value}
                      {m.suffix && <span className="text-brand">{m.suffix}</span>}
                    </div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      {services.length > 0 && (
        <section className="border-b border-brand/10 bg-card py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
              <div>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-content sm:text-5xl">
                  Services We Offer
                </h2>
              </div>
              <Link
                href="/services"
                className="mt-4 font-mono text-xs uppercase tracking-widest text-brand hover:underline md:mt-0"
              >
                View All Services &amp; Labs →
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <div key={s.id} className="aristocratic-card group flex flex-col justify-between rounded-2xl p-6">
                  <div>
                    {s.featuredImageId && (
                      <img src={`/api/media/${s.featuredImageId}`} alt={s.title} className="mb-4 h-40 w-full rounded-xl object-cover" />
                    )}
                    <h3 className="mb-3 text-xl font-bold text-content transition-colors group-hover:text-brand">
                      {s.title}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-muted">{s.summary}</p>
                  </div>
                  <Link
                    href="/services"
                    className="flex items-center justify-between border-t border-edge pt-4 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand"
                  >
                    <span>Contact Us</span>
                    <span>→</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Programs Section */}
      {activePrograms.length > 0 && (
        <section className="border-b border-brand/10 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
              <div>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-content sm:text-5xl">
                  Programs & Fellowships
                </h2>
              </div>
              <Link
                href="/programs"
                className="mt-4 font-mono text-xs uppercase tracking-widest text-brand hover:underline md:mt-0"
              >
                View All Programs →
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {activePrograms.map((p) => {
                const badge = computeProgramStatus(p.details as unknown as ProgramDetails);
                return (
                  <div key={p.id} className="aristocratic-card flex flex-col justify-between rounded-2xl p-6">
                    <div>
                      {p.featuredImageId && (
                        <img src={`/api/media/${p.featuredImageId}`} alt={p.title} className="mb-4 h-40 w-full rounded-xl object-cover" />
                      )}
                      <div className="mb-3 flex items-center justify-between font-mono text-xs text-muted">
                        <span className="rounded-full border border-brand/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-brand">
                          {badge}
                        </span>
                      </div>
                      <h3 className="mb-3 text-xl font-bold text-content">{p.title}</h3>
                      <p className="mb-6 text-xs leading-relaxed text-muted">{p.summary}</p>
                    </div>
                    <Link
                      href={`/programs/${p.slug}`}
                      className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-brand transition-colors hover:text-brand-hover"
                    >
                      <span>Explore Program</span>
                      <span>→</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Events & News */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <div className="mb-8 flex items-center justify-between border-b border-edge pb-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-brand">Calendar</span>
                <h3 className="mt-1 text-2xl font-bold text-content">Upcoming Events</h3>
              </div>
              <Link href="/events" className="font-mono text-xs uppercase text-brand hover:underline">
                All Events →
              </Link>
            </div>

            <div className="space-y-4">
              {events.length ? (
                events.map((e) => (
                  <div key={e.id} className="aristocratic-card flex items-start justify-between rounded-xl p-5">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-brand">
                        {e.startAt ? new Date(e.startAt).toLocaleDateString() : "UPCOMING"}
                      </span>
                      <h4 className="mt-1 text-base font-bold text-content">{e.title}</h4>
                      <p className="mt-1 text-xs text-muted">{e.summary || "UNMASK Campus Hall"}</p>
                    </div>
                    <Link
                      href={`/events/${e.slug}`}
                      className="rounded-full border border-brand/40 px-4 py-2 font-mono text-[11px] font-semibold text-brand transition-all hover:bg-brand hover:text-white"
                    >
                      RSVP
                    </Link>
                  </div>
                ))
              ) : (
                <div className="aristocratic-card rounded-xl p-6 text-center text-xs text-muted">
                  No upcoming public events scheduled for this week. Check back soon!
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-8 flex items-center justify-between border-b border-edge pb-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-brand">Publications</span>
                <h3 className="mt-1 text-2xl font-bold text-content">Latest News &amp; Papers</h3>
              </div>
              <Link href="/news" className="font-mono text-xs uppercase text-brand hover:underline">
                All News →
              </Link>
            </div>

            <div className="space-y-4">
              {news.length ? (
                news.map((n) => (
                  <div key={n.id} className="aristocratic-card rounded-xl p-5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-brand">
                      {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : "RECENT RELEASE"}
                    </span>
                    <h4 className="mt-1 text-base font-bold text-content transition-colors hover:text-brand">
                      <Link href={`/news/${n.slug}`}>{n.title}</Link>
                    </h4>
                    <p className="mt-2 line-clamp-2 text-xs text-muted">{n.summary || "Read full research article."}</p>
                  </div>
                ))
              ) : (
                <div className="aristocratic-card rounded-xl p-6 text-center text-xs text-muted">
                  Visit our News section to read our latest press releases and scientific reports.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
