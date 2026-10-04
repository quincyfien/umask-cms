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
    <div className="bg-ink text-paper selection:bg-brand selection:text-white min-h-screen">
      {/* Header Banner */}
      <section className="relative py-20 border-b border-brand/20 bg-gradient-to-b from-ink-light to-ink overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="text-xs font-mono tracking-super-wide text-brand uppercase font-semibold">
            INSTITUTIONAL OVERVIEW
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mt-2 max-w-4xl leading-tight">
            About {org.name}
          </h1>
          <p className="mt-4 text-gray-300 text-lg max-w-3xl leading-relaxed font-normal">
            {org.description ||
              "Bamenda Tech Research Center (BTRC) is an independent scientific engineering and technology research facility located in Bambili, NW Region, Cameroon."}
          </p>
        </div>
      </section>

      {/* Purpose & Dynamic Page Content */}
      <section className="py-20 border-b border-brand/10 bg-ink">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <div className="aristocratic-card p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">
                Our Purpose & Operational Mandate
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Founded to bridge the gap between academic theory and practical engineering output, BTRC maintains state-of-the-art electronics cleanrooms, telemetry test stations, and software innovation labs.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                We work closely with university researchers, technical institutions, and industrial partners to design, build, and deploy robust hardware and software platforms across Central Africa.
              </p>
            </div>

            {page?.body && (
              <div className="aristocratic-card p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">
                  Additional Details
                </h2>
                <div className="prose prose-invert max-w-none text-gray-300">
                  <RichText html={page.body} />
                </div>
              </div>
            )}

            {/* Core Values */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Institutional Core Values</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {CORE_VALUES.map((v) => (
                  <div key={v.title} className="aristocratic-card p-6 rounded-xl border border-brand/20">
                    <span className="h-2 w-2 rounded-full bg-brand inline-block mb-3"></span>
                    <h4 className="text-base font-bold text-white mb-2">{v.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info & Facility Stats */}
          <div className="lg:col-span-4 space-y-6">
            <div className="aristocratic-card p-6 rounded-2xl">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand border-b border-white/10 pb-3 mb-4">
                CAMPUS HEADQUARTERS
              </h3>
              <div className="space-y-3 text-xs text-gray-300">
                <div>
                  <span className="text-gray-500 uppercase font-mono block">Location</span>
                  <span className="font-semibold text-white">Bambili Campus, NW Region, Cameroon</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase font-mono block">Primary Email</span>
                  <span className="font-semibold text-brand font-mono">inquiries@btrc-center.org</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase font-mono block">Facility Status</span>
                  <span className="inline-block px-2 py-0.5 rounded bg-brand/10 text-brand border border-brand/30 font-mono text-[10px]">
                    ACTIVE RESIDENCY LABS
                  </span>
                </div>
              </div>
              <Link
                href="/contact"
                className="mt-6 block w-full text-center rounded-full bg-brand py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors"
              >
                Get In Touch
              </Link>
            </div>

            <div className="aristocratic-card p-6 rounded-2xl">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand border-b border-white/10 pb-3 mb-4">
                RESEARCH COMMONS
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Access open research papers, hardware documentation, software repositories, and dataset downloads.
              </p>
              <Link
                href="/downloads"
                className="inline-block text-xs font-mono text-brand hover:underline font-semibold uppercase"
              >
                Browse Downloads →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 bg-ink-light">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-xs font-mono tracking-super-wide text-brand uppercase font-semibold">
            SCIENTIFIC LEADERSHIP
          </span>
          <h2 className="text-3xl font-bold text-white tracking-tight mt-2 mb-10">
            Executive & Research Directorate
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {LEADERSHIP.map((m) => (
              <div key={m.name} className="aristocratic-card p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center font-mono font-bold text-brand">
                    {m.name.charAt(4)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{m.name}</h3>
                    <p className="text-xs text-brand font-mono">{m.role}</p>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-gray-400 bg-black/30 p-2 rounded mb-3 border border-white/5">
                  Focus: {m.focus}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
