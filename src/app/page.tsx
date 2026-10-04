import Link from "next/link";
import { prisma } from "@/lib/db";

const METRICS = [
  { value: "14+", label: "Active Research Projects", badge: "Tier-1 Deployment" },
  { value: "35+", label: "Published Papers", badge: "IEEE & Indexed" },
  { value: "1,200+", label: "Students & Innovators Trained", badge: "Capacity Building" },
  { value: "98.4%", label: "Verified Project Success Rate", badge: "Scientific Rigor" },
];

const FOCUS_AREAS = [
  {
    code: "SEC-01",
    title: "Applied AI & Robotics",
    desc: "Autonomous systems, localized machine learning models, and computer vision hardware for African agricultural & industrial challenges.",
    tag: "LABORATORY 01",
  },
  {
    code: "SEC-02",
    title: "Embedded Systems & IoT",
    desc: "Low-power microcontrollers, telemetry sensors, and custom PCB hardware prototyping for real-time remote monitoring.",
    tag: "LABORATORY 02",
  },
  {
    code: "SEC-03",
    title: "Renewable Energy & Power Systems",
    desc: "Microgrid telemetry, solar battery management systems, and smart grid automation engineered for regional resilience.",
    tag: "LABORATORY 03",
  },
  {
    code: "SEC-04",
    title: "Technical Training & Research Commons",
    desc: "Hands-on residency bootcamps, open access scientific documentation, and academic fellowship supervision.",
    tag: "ACADEMIC COMMONS",
  },
];

const FALLBACK_PROJECTS = [
  {
    id: "PRJ-01",
    title: "AgriSense Autonomous Crop Telemetry",
    category: "IoT & Agriculture",
    status: "Active Deployment",
    desc: "Solar-powered sensor array delivering microclimate metrics to local smallholder farms.",
  },
  {
    id: "PRJ-02",
    title: "Micro-Grid Energy Orchestrator",
    category: "Renewables",
    status: "Field Testing",
    desc: "Intelligent battery management unit optimizing hybrid solar-diesel mini grids.",
  },
  {
    id: "PRJ-03",
    title: "Neural Speech Synthesizer",
    category: "Applied AI",
    status: "Research Paper Published",
    desc: "Speech synthesis and speech-to-text models trained on local Cameroonian languages.",
  },
];

export default async function Home() {
  const [events, news] = await Promise.all([
    prisma.contentItem.findMany({
      where: { type: "EVENT", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
      take: 3,
    }),
    prisma.contentItem.findMany({
      where: { type: "NEWS", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
      take: 3,
    }),
  ]);

  return (
    <div className="bg-surface text-content">
      {/* Hero — always dark, image clearly visible */}
      <section className="relative flex min-h-[80vh] flex-col justify-end overflow-hidden bg-ink">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-bg.png"
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/30 to-transparent"></div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-end px-6 pb-20 pt-32 text-white">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-brand"></span>
            <span className="font-mono text-xs font-semibold uppercase tracking-super-wide text-brand">
              Research. Innovate. Build. Sustain.
            </span>
          </div>

          <h1 className="mb-6 max-w-5xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Turning Ideas Into Technology That Matters
          </h1>

          <p className="mb-10 max-w-3xl text-base leading-relaxed text-gray-200 md:text-xl">
            A technology research institution dedicated to transforming scientific ideas into practical engineering solutions — empowering researchers, students, and industrial partners across Africa.
          </p>

          <div className="mb-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <Link
              href="/projects"
              className="rounded-full bg-brand px-8 py-4 text-center text-xs font-semibold uppercase tracking-super-wide text-white transition-all duration-300 hover:bg-brand-hover"
            >
              Explore Research Projects
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/30 px-8 py-4 text-center text-xs font-semibold uppercase tracking-super-wide text-white transition-all duration-300 hover:border-brand hover:text-brand"
            >
              Request a Service
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
                {METRICS.map((m) => (
                  <div key={m.label} className="border-b border-edge pb-4 last:border-0 last:pb-0">
                    <div className="flex items-baseline justify-between">
                      <div className="text-3xl font-extrabold tracking-tight text-content">{m.value}</div>
                      <span className="font-mono text-[10px] font-semibold text-brand">{m.badge}</span>
                    </div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="border-b border-brand/10 bg-card py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
            <div>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-content sm:text-5xl">
                What We Offer
              </h2>
            </div>
            <Link
              href="/services"
              className="mt-4 font-mono text-xs uppercase tracking-widest text-brand hover:underline md:mt-0"
            >
              View All Services &amp; Labs →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {FOCUS_AREAS.map((fa) => (
              <div key={fa.code} className="aristocratic-card group flex flex-col justify-between rounded-2xl p-6">
                <div>
                  <div className="mb-4 flex items-center justify-between font-mono text-xs text-brand">
                    <span>{fa.code}</span>
                    <span className="rounded border border-brand/20 bg-brand/10 px-2 py-0.5 text-[10px] text-brand">
                      {fa.tag}
                    </span>
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-content transition-colors group-hover:text-brand">
                    {fa.title}
                  </h3>
                  <p className="mb-6 text-xs leading-relaxed text-muted">{fa.desc}</p>
                </div>
                <Link
                  href="/services"
                  className="flex items-center justify-between border-t border-edge pt-4 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand"
                >
                  <span>Learn More</span>
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="border-b border-brand/10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
            <div>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-content sm:text-5xl">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="mt-4 font-mono text-xs uppercase tracking-widest text-brand hover:underline md:mt-0"
            >
              Browse Project Repository →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FALLBACK_PROJECTS.map((p) => (
              <div key={p.id} className="aristocratic-card flex flex-col justify-between rounded-2xl p-6">
                <div>
                  <div className="mb-3 flex items-center justify-between font-mono text-xs text-muted">
                    <span>{p.category}</span>
                    <span className="rounded-full border border-brand/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-brand">
                      {p.status}
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-content">{p.title}</h3>
                  <p className="mb-6 text-xs leading-relaxed text-muted">{p.desc}</p>
                </div>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-brand transition-colors hover:text-brand-hover"
                >
                  <span>Explore Case Study</span>
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                      <p className="mt-1 text-xs text-muted">{e.summary || "BTRC Campus Hall"}</p>
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
