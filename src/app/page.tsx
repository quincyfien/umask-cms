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
    title: "BTRC Neural Speech Synthesizer",
    category: "Applied AI",
    status: "Research Paper Published",
    desc: "Speech synthesis and speech-to-text models trained on local Cameroonian languages.",
  },
];

export default async function Home() {
  const [services, programs, events, news] = await Promise.all([
    prisma.contentItem.findMany({
      where: { type: "SERVICE", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
      take: 4,
    }),
    prisma.contentItem.findMany({
      where: { type: "PROGRAM", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
      take: 3,
    }),
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
    <div className="bg-ink text-paper selection:bg-brand selection:text-white">
      {/* Hero Section — Aristocratic Cleanroom Cleanroom Scroller */}
      <section className="relative min-h-[90vh] flex flex-col justify-end overflow-hidden border-b border-brand/20 bg-ink">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-bg.png"
            alt="BTRC Cleanroom and Electronics Engineering Lab"
            className="w-full h-full object-cover object-center scale-105 opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent"></div>
          <div className="absolute inset-0 bg-brand/5 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-7xl w-full mx-auto px-6 pt-36 pb-20 flex flex-col justify-end">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-brand"></span>
            <span className="text-brand font-mono text-xs tracking-super-wide uppercase font-semibold">
              Research. Innovate. Build. Sustain.
            </span>
          </div>

          <h1 className="text-white text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.08] mb-6 drop-shadow-sm">
            TURNING IDEAS INTO TECHNOLOGY THAT MATTERS
          </h1>

          <p className="text-gray-300 text-base md:text-xl font-normal max-w-3xl leading-relaxed mb-10 text-balance">
            Bamenda Tech Research Center (BTRC) is a premier technology research institution dedicated to transforming scientific ideas into practical engineering solutions. We empower researchers, students, and industrial partners across Africa.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-16">
            <Link
              href="/projects"
              className="px-8 py-4 rounded-full text-xs font-semibold tracking-super-wide uppercase bg-brand hover:bg-brand-hover text-white text-center transition-all duration-300 shadow-xl shadow-brand/25"
            >
              Explore Research Projects
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full text-xs font-semibold tracking-super-wide uppercase text-white border border-white/25 hover:border-brand hover:text-brand text-center transition-all duration-300 backdrop-blur-md"
            >
              Request R&D Service
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-white/10 pt-6 text-xs font-mono text-gray-400 gap-4">
            <div className="flex items-center gap-6">
              <span>FACILITY: BAMBILI R&D LABS</span>
              <span>OPERATIONAL STATUS: NOMINAL</span>
            </div>
            <div className="flex items-center gap-2 text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-ping"></span>
              <span>LIVE TELEMETRY FEED</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Metrics Benchmarks */}
      <section className="py-24 border-b border-brand/10 bg-gradient-to-b from-ink to-ink-light">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/30 text-brand text-[11px] font-mono tracking-super-wide font-semibold mb-6">
              SECTION 02 / THE PURPOSE
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight mb-6">
              OUR MISSION: TURNING IDEAS INTO IMPACT.
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
              To advance technology research, scientific innovation, and practical capacity building by creating an environment where high-potential ideas are engineered into real-world solutions.
            </p>
            <div className="p-6 rounded-2xl aristocratic-card border-l-4 border-brand mb-8">
              <p className="text-sm md:text-base font-medium italic text-gray-200">
                &ldquo;Vision: To become a leading platform for technology research, innovation, and engineering excellence in Cameroon and central Africa.&rdquo;
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 text-xs uppercase font-bold tracking-super-wide text-white hover:text-brand transition-colors"
            >
              <span>Read Full Institutional Overview</span>
              <span className="text-brand">→</span>
            </Link>
          </div>

          <div className="lg:col-span-5">
            <div className="aristocratic-card p-8 rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <span className="text-xs uppercase font-mono tracking-widest text-gray-400">Metric Benchmarks</span>
                <span className="text-[10px] font-mono text-brand font-semibold tracking-wider">VERIFIED DATA</span>
              </div>
              <div className="space-y-6">
                {METRICS.map((m) => (
                  <div key={m.label} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-baseline justify-between">
                      <div className="text-3xl font-extrabold text-white tracking-tight">{m.value}</div>
                      <span className="text-[10px] font-mono text-brand font-semibold">{m.badge}</span>
                    </div>
                    <div className="text-xs uppercase font-medium text-gray-400 tracking-wider mt-1">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas Grid */}
      <section className="py-24 border-b border-brand/10 bg-ink">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-mono tracking-super-wide text-brand uppercase font-semibold">
                SECTION 03 / FOCUS AREAS
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mt-2">
                WHAT BTRC OFFERS
              </h2>
            </div>
            <Link
              href="/services"
              className="mt-4 md:mt-0 text-xs font-mono tracking-widest uppercase text-brand hover:underline"
            >
              VIEW ALL SERVICES & LABS →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FOCUS_AREAS.map((fa) => (
              <div key={fa.code} className="aristocratic-card p-6 rounded-2xl flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-brand mb-4">
                    <span>{fa.code}</span>
                    <span className="text-[10px] bg-brand/10 px-2 py-0.5 rounded text-brand border border-brand/20">
                      {fa.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand transition-colors mb-3">
                    {fa.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-6">{fa.desc}</p>
                </div>
                <Link
                  href="/services"
                  className="text-[11px] font-mono font-semibold uppercase tracking-wider text-brand flex items-center justify-between border-t border-white/10 pt-4"
                >
                  <span>Learn More</span>
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Research Projects */}
      <section className="py-24 border-b border-brand/10 bg-ink-light">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-mono tracking-super-wide text-brand uppercase font-semibold">
                SECTION 04 / RESEARCH DISPATCH
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mt-2">
                FEATURED PROJECTS
              </h2>
            </div>
            <Link
              href="/projects"
              className="mt-4 md:mt-0 text-xs font-mono tracking-widest uppercase text-brand hover:underline"
            >
              BROWSE PROJECT REPOSITORY →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FALLBACK_PROJECTS.map((p) => (
              <div key={p.id} className="aristocratic-card p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-3">
                    <span>{p.category}</span>
                    <span className="text-brand font-semibold text-[10px] uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-brand/30">
                      {p.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-6">{p.desc}</p>
                </div>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-brand hover:text-white transition-colors"
                >
                  <span>Explore Case Study</span>
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events & Latest News */}
      <section className="py-24 bg-ink">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
          {/* Upcoming Events Column */}
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
              <div>
                <span className="text-xs font-mono tracking-wider text-brand uppercase font-semibold">CALENDAR</span>
                <h3 className="text-2xl font-bold text-white mt-1">Upcoming Events</h3>
              </div>
              <Link href="/events" className="text-xs font-mono text-brand hover:underline uppercase">
                ALL EVENTS →
              </Link>
            </div>

            <div className="space-y-4">
              {events.length ? (
                events.map((e) => (
                  <div key={e.id} className="aristocratic-card p-5 rounded-xl flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-brand uppercase tracking-wider">
                        {e.startAt ? new Date(e.startAt).toLocaleDateString() : "UPCOMING"}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">{e.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">{e.summary || "BTRC Campus Hall"}</p>
                    </div>
                    <Link
                      href={`/events/${e.slug}`}
                      className="px-4 py-2 rounded-full border border-brand/40 text-[11px] font-mono font-semibold text-brand hover:bg-brand hover:text-white transition-all"
                    >
                      RSVP
                    </Link>
                  </div>
                ))
              ) : (
                <div className="aristocratic-card p-6 rounded-xl text-center text-xs text-gray-400">
                  No upcoming public events scheduled for this week. Check back soon!
                </div>
              )}
            </div>
          </div>

          {/* Latest News Column */}
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
              <div>
                <span className="text-xs font-mono tracking-wider text-brand uppercase font-semibold">PUBLICATIONS</span>
                <h3 className="text-2xl font-bold text-white mt-1">Latest News & Papers</h3>
              </div>
              <Link href="/news" className="text-xs font-mono text-brand hover:underline uppercase">
                ALL NEWS →
              </Link>
            </div>

            <div className="space-y-4">
              {news.length ? (
                news.map((n) => (
                  <div key={n.id} className="aristocratic-card p-5 rounded-xl">
                    <span className="text-[10px] font-mono text-brand uppercase tracking-wider">
                      {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : "RECENT RELEASE"}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1 hover:text-brand transition-colors">
                      <Link href={`/news/${n.slug}`}>{n.title}</Link>
                    </h4>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">{n.summary || "Read full research article."}</p>
                  </div>
                ))
              ) : (
                <div className="aristocratic-card p-6 rounded-xl text-center text-xs text-gray-400">
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
