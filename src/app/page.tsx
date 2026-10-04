import Link from "next/link";
import { prisma } from "@/lib/db";

const METRICS = [
  { value: "14+", label: "Active Research Projects", badge: "Tier-1 Deployment" },
  { value: "35+", label: "Published Papers", badge: "IEEE & Indexed" },
  { value: "1,200+", label: "Students Trained", badge: "National Reach" },
  { value: "98.4%", label: "Completion Rate", badge: "Verified Outcomes" },
];

const SERVICE_IMAGES = ["mentorship", "workspace", "internet", "lab-access"];

type ServiceCard = {
  id: string;
  title: string;
  image: string;
  description: string;
  bullets: string[];
};

type ProgramCard = { title: string; duration: string; description: string };
type EventCard = { title: string; meta: string; description: string };

const FALLBACK_SERVICES: ServiceCard[] = [
  {
    id: "SRV-01",
    title: "Mentorship",
    image: "/images/services/mentorship.png",
    description: "One-on-one guidance from industry experts and research mentors.",
    bullets: ["Career navigation", "Research supervision", "Pitch preparation"],
  },
  {
    id: "SRV-02",
    title: "Workspace Access",
    image: "/images/services/workspace.png",
    description: "Dedicated coworking space for innovators and startups.",
    bullets: ["24/7 secure access", "Meeting rooms", "Community events"],
  },
  {
    id: "SRV-03",
    title: "Free Internet Connection",
    image: "/images/services/internet.png",
    description: "Reliable high-speed internet for research and collaboration.",
    bullets: ["Fiber backbone", "Campus-wide Wi-Fi", "No data caps"],
  },
  {
    id: "SRV-04",
    title: "Equipment / Lab Access",
    image: "/images/services/lab-access.png",
    description: "Specialized lab equipment for prototyping and testing.",
    bullets: ["Prototyping tools", "Measurement instruments", "Safety-first protocols"],
  },
];

const FALLBACK_PROGRAMS: ProgramCard[] = [
  {
    title: "Internships",
    duration: "3 to 6 Months",
    description: "Hands-on placements within active research and engineering projects.",
  },
  {
    title: "Workshops",
    duration: "Intensive Bootcamps",
    description: "Focused, practical training across emerging technology domains.",
  },
  {
    title: "Research Fellowships",
    duration: "Fully Funded Residency",
    description: "Immersive residency programs for committed researchers.",
  },
];

const FALLBACK_EVENTS: EventCard[] = [
  {
    title: "Tech Innovation Summit",
    meta: "March 25, 2026 · Bambili Campus Auditorium",
    description: "A convergence of researchers, founders and industry leaders.",
  },
  {
    title: "Research Showcase 2026",
    meta: "June 12, 2026 · BTRC Innovation Hall",
    description: "Annual exhibition of published papers and working prototypes.",
  },
];

const FALLBACK_WORKSHOPS: EventCard[] = [
  {
    title: "Robotics & Embedded Systems",
    meta: "April 05–07, 2026 · In-Person Cleanroom B",
    description: "Build and program embedded systems from the ground up.",
  },
  {
    title: "Data Science Bootcamp",
    meta: "May 18–20, 2026 · Online",
    description: "End-to-end data analysis and machine learning workflows.",
  },
];

export default async function Home() {
  const [services, programs, events] = await Promise.all([
    prisma.contentItem.findMany({
      where: { type: "SERVICE", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
      orderBy: { publishedAt: "asc" },
      take: 4,
    }),
    prisma.contentItem.findMany({
      where: { type: "PROGRAM", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
      orderBy: { publishedAt: "asc" },
      take: 3,
    }),
    prisma.contentItem.findMany({
      where: { type: "EVENT", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
      orderBy: { startAt: "asc" },
      take: 4,
    }),
  ]);

  const serviceCards: ServiceCard[] = services.length
    ? services.map((s, i) => ({
        id: `SRV-0${i + 1}`,
        title: s.title,
        image: `/images/services/${SERVICE_IMAGES[i % SERVICE_IMAGES.length]}.png`,
        description: s.summary ?? "",
        bullets: ((s.details as { bullets?: string[] } | null)?.bullets ?? []) as string[],
      }))
    : FALLBACK_SERVICES;

  const programCards: ProgramCard[] = programs.length
    ? programs.map((p) => ({
        title: p.title,
        duration: ((p.details as { duration?: string } | null)?.duration ?? "Open") as string,
        description: p.summary ?? "",
      }))
    : FALLBACK_PROGRAMS;

  const dbEvents = events.filter((e) => e.eventKind !== "WORKSHOP");
  const dbWorkshops = events.filter((e) => e.eventKind === "WORKSHOP");
  const toEventCard = (e: (typeof events)[number]): EventCard => ({
    title: e.title,
    meta: e.startAt
      ? `${e.startAt.toISOString().slice(0, 10)} · ${e.venueAddress ?? "BTRC"}`
      : "TBA",
    description: e.summary ?? "",
  });

  const eventCards = dbEvents.length ? dbEvents.map(toEventCard) : FALLBACK_EVENTS;
  const workshopCards = dbWorkshops.length ? dbWorkshops.map(toEventCard) : FALLBACK_WORKSHOPS;

  return (
    <div>
      {/* Section 01 — Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <img src="/images/hero-bg.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto max-w-7xl px-6 py-28">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
              Research. Innovate. Build. Sustain.
            </p>
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Turning Ideas Into Technology That Matters
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300">
            Bamenda Tech Research Center bridges research and real-world impact — equipping
            innovators, students and industry partners to build technology that matters.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-brand-dark"
            >
              Explore Our Research Projects
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:border-brand hover:text-brand"
            >
              Request a Service
            </Link>
          </div>
        </div>
      </section>

      {/* Section 02 — Purpose & Metrics */}
      <section className="bg-paper py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
              Section 02 / The Purpose
            </p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Our Mission: Turning Ideas Into Impact
            </h2>
            <p className="mt-6 text-gray-600">
              We exist to accelerate scientific and engineering excellence in Cameroon by
              connecting talent, research infrastructure and real-world problems. Through
              mentorship, accessible workspaces, reliable connectivity and specialized labs,
              we give innovators the environment to build, test and ship.
            </p>
            <div className="mt-8 rounded-xl border-l-4 border-brand bg-white p-6">
              <p className="italic text-gray-700">
                Vision: To become a leading platform for technology research, innovation, and
                engineering excellence in Cameroon.
              </p>
            </div>
            <Link
              href="/services"
              className="mt-8 inline-block text-sm font-bold uppercase tracking-widest text-brand hover:text-brand-dark"
            >
              Explore Our Focus Areas →
            </Link>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">
                  Metric Benchmarks
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-brand">
                  Verified Data
                </span>
              </div>
              <div className="divide-y divide-gray-100">
                {METRICS.map((m) => (
                  <div key={m.label} className="flex items-center justify-between py-5">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{m.value}</p>
                      <p className="mt-1 text-xs uppercase tracking-widest text-gray-500">
                        {m.label}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-brand-dark">
                      {m.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 03 — Services */}
      <section className="bg-ink py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
            Section 03 / Infrastructure & Support
          </p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">Our Services</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {serviceCards.map((s) => (
              <div key={s.id} className="rounded-xl border border-white/10 bg-ink-card p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-brand">{s.id}</span>
                  <span className="h-2 w-2 rounded-full bg-brand" />
                </div>
                <img src={s.image} alt={s.title} className="mt-4 h-40 w-full rounded-md object-cover" />
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{s.description}</p>
                <div className="my-4 border-t border-white/10" />
                <ul className="space-y-2 font-mono text-xs text-gray-300">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 04 — Programs */}
      <section className="bg-paper py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
            Section 04 / Build & Accelerate
          </p>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">Our Programs</h2>

          <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex justify-end">
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-dark">
                Cohort Enrolling
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {programCards.map((p) => (
                <div key={p.title} className="py-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{p.title}</h3>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gray-600">
                      {p.duration}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{p.description}</p>
                </div>
              ))}
            </div>
            <Link
              href="/programs"
              className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-brand-dark"
            >
              Browse All Programs →
            </Link>
          </div>
        </div>
      </section>

      {/* Section 05 — Events & Workshops */}
      <section className="bg-ink py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
            Section 05 / Community Convergence
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between">
            <h2 className="text-3xl font-bold md:text-4xl">Events & Workshops</h2>
            <span className="font-mono text-sm uppercase tracking-widest text-gray-400">
              Calendar 2026
            </span>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-brand">
                • Events
              </h3>
              <div className="mt-4 space-y-4">
                {eventCards.map((e) => (
                  <div key={e.title} className="rounded-xl border border-white/10 bg-ink-card p-6">
                    <h4 className="text-lg font-bold">{e.title}</h4>
                    <p className="mt-1 font-mono text-xs text-brand">{e.meta}</p>
                    <p className="mt-3 text-sm text-gray-400">{e.description}</p>
                    <Link
                      href="/events"
                      className="mt-4 inline-block rounded-full border border-brand px-4 py-2 text-xs font-semibold uppercase tracking-wider text-brand hover:bg-brand hover:text-white"
                    >
                      RSVP
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-brand">
                • Workshops
              </h3>
              <div className="mt-4 space-y-4">
                {workshopCards.map((w) => (
                  <div key={w.title} className="rounded-xl border border-white/10 bg-ink-card p-6">
                    <h4 className="text-lg font-bold">{w.title}</h4>
                    <p className="mt-1 font-mono text-xs text-brand">{w.meta}</p>
                    <p className="mt-3 text-sm text-gray-400">{w.description}</p>
                    <Link
                      href="/events"
                      className="mt-4 inline-block rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-dark"
                    >
                      Sign Up
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
