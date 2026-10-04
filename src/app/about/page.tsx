import { getOrganization } from "@/lib/organization";
import { prisma } from "@/lib/db";
import { RichText } from "@/components/public/RichText";
import Link from "next/link";

const CORE_VALUES = [
  {
    title: "Practical Innovation",
    desc: "We prioritize research that solves concrete, verifiable problems in industry, agriculture, and telemetry.",
  },
  {
    title: "Academic Rigor",
    desc: "Every research project undergoes strict peer reviews, empirical measurement, and open documentation.",
  },
  {
    title: "Capacity Building",
    desc: "We train local engineers and students with world-class toolsets to build technological self-reliance.",
  },
  {
    title: "Open Research Commons",
    desc: "We share knowledge, publications, and open hardware schemas to spur regional collaboration.",
  },
];

const LEADERSHIP = [
  {
    name: "Dr. Fon Kenneth",
    role: "Executive Director & Chief Scientist",
    focus: "Embedded Telemetry & Power Systems",
    bio: "Over 15 years leading research initiatives in microgrids, sensor networks, and high-altitude telemetry.",
  },
  {
    name: "Eng. Mbah Brenda",
    role: "Head of Robotics & AI Systems",
    focus: "Autonomous Robotics & Edge AI",
    bio: "Specializes in computer vision applications and autonomous robotic prototypes tailored for tropical agriculture.",
  },
  {
    name: "Dr. Nkwain Paul",
    role: "Director of Academic Partnerships",
    focus: "Scientific Engineering & Mentorship",
    bio: "Oversees research residencies, postgraduate mentorship, and international journal publication pipelines.",
  },
];

export default async function AboutPage() {
  const org = await getOrganization();
  const page = await prisma.contentItem.findFirst({
    where: { type: "PAGE", slug: "about", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
  });

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-brand selection:text-white">
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-brand/20 bg-gradient-to-b from-white to-paper py-20">
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="font-mono text-xs font-semibold uppercase tracking-super-wide text-brand">
            Institutional Overview
          </span>
          <h1 className="mt-2 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-6xl">
            About {org.name}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
            {org.description ||
              "An independent scientific engineering and technology research facility located in Bambili, NW Region, Cameroon."}
          </p>
        </div>
      </section>

      {/* Purpose & Dynamic Page Content */}
      <section className="border-b border-brand/10 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <div className="aristocratic-card rounded-2xl p-8">
              <h2 className="mb-4 border-b border-black/10 pb-3 text-2xl font-bold text-ink">
                Our Purpose & Operational Mandate
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-gray-600">
                Founded to bridge the gap between academic theory and practical engineering output, we maintain state-of-the-art electronics cleanrooms, telemetry test stations, and software innovation labs.
              </p>
              <p className="text-sm leading-relaxed text-gray-600">
                We work closely with university researchers, technical institutions, and industrial partners to design, build, and deploy robust hardware and software platforms across Central Africa.
              </p>
            </div>

            {page?.body && (
              <div className="aristocratic-card rounded-2xl p-8">
                <h2 className="mb-4 border-b border-black/10 pb-3 text-2xl font-bold text-ink">
                  Additional Details
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <RichText html={page.body} />
                </div>
              </div>
            )}

            {/* Core Values */}
            <div>
              <h3 className="mb-6 text-xl font-bold text-ink">Institutional Core Values</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {CORE_VALUES.map((v) => (
                  <div key={v.title} className="aristocratic-card rounded-xl border border-brand/20 p-6">
                    <span className="mb-3 inline-block h-2 w-2 rounded-full bg-brand"></span>
                    <h4 className="mb-2 text-base font-bold text-ink">{v.title}</h4>
                    <p className="text-xs leading-relaxed text-gray-600">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6 lg:col-span-4">
            <div className="aristocratic-card rounded-2xl p-6">
              <h3 className="mb-4 border-b border-black/10 pb-3 font-mono text-xs font-semibold uppercase tracking-widest text-brand">
                Campus Headquarters
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <span className="block font-mono uppercase text-gray-400">Location</span>
                  <span className="font-semibold text-ink">Bambili Campus, NW Region, Cameroon</span>
                </div>
                <div>
                  <span className="block font-mono uppercase text-gray-400">Primary Email</span>
                  <span className="font-mono font-semibold text-brand">inquiries@btrc-center.org</span>
                </div>
                <div>
                  <span className="block font-mono uppercase text-gray-400">Facility Status</span>
                  <span className="inline-block rounded border border-brand/30 bg-brand/10 px-2 py-0.5 font-mono text-[10px] text-brand">
                    Active Residency Labs
                  </span>
                </div>
              </div>
              <Link
                href="/contact"
                className="mt-6 block w-full rounded-full bg-brand py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover"
              >
                Get In Touch
              </Link>
            </div>

            <div className="aristocratic-card rounded-2xl p-6">
              <h3 className="mb-4 border-b border-black/10 pb-3 font-mono text-xs font-semibold uppercase tracking-widest text-brand">
                Research Commons
              </h3>
              <p className="mb-4 text-xs leading-relaxed text-gray-600">
                Access open research papers, hardware documentation, software repositories, and dataset downloads.
              </p>
              <Link
                href="/downloads"
                className="inline-block font-mono text-xs font-semibold uppercase text-brand hover:underline"
              >
                Browse Downloads →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <span className="font-mono text-xs font-semibold uppercase tracking-super-wide text-brand">
            Scientific Leadership
          </span>
          <h2 className="mb-10 mt-2 text-3xl font-bold tracking-tight text-ink">
            Executive & Research Directorate
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {LEADERSHIP.map((m) => (
              <div key={m.name} className="aristocratic-card rounded-2xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/40 bg-brand/20 font-mono font-bold text-brand">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink">{m.name}</h3>
                    <p className="font-mono text-xs text-brand">{m.role}</p>
                  </div>
                </div>
                <div className="mb-3 rounded border border-black/5 bg-gray-50 p-2 font-mono text-[11px] text-gray-500">
                  Focus: {m.focus}
                </div>
                <p className="text-xs leading-relaxed text-gray-600">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
