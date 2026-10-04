import { PrismaClient } from "@prisma/client";
import { mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

function daysFromNow(days: number, hours = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString();
}

function copyServiceImage(name: string, key: string) {
  const src = join(process.cwd(), "public", "images", "services", name);
  const dest = join(process.cwd(), "uploads", key);
  if (existsSync(src)) {
    mkdirSync(join(process.cwd(), "uploads", key.split("/").slice(0, -1).join("/")), { recursive: true });
    copyFileSync(src, dest);
    return true;
  }
  return false;
}

async function createMedia(key: string, fileName: string, mimeType: string, size: number) {
  const existing = await prisma.mediaAsset.findUnique({ where: { key } });
  if (existing) return existing;
  return prisma.mediaAsset.create({
    data: { key, fileName, mimeType, size, status: "AVAILABLE", access: "PUBLIC" },
  });
}

async function upsertContent(input: {
  type: "SERVICE" | "PROGRAM" | "PROJECT" | "EVENT" | "NEWS";
  title: string;
  slug: string;
  summary: string;
  body?: string;
  featuredImageId?: string | null;
  details?: Record<string, unknown>;
  programStatus?: "UPCOMING" | "ONGOING" | "COMPLETED" | "CLOSED";
  projectStatus?: "PLANNED" | "ONGOING" | "COMPLETED";
  eventKind?: "EVENT" | "WORKSHOP";
  startAt?: Date;
  endAt?: Date;
  locationType?: "PHYSICAL" | "ONLINE" | "HYBRID";
  venueAddress?: string;
  onlineLink?: string;
  registrationEnabled?: boolean;
  capacity?: number;
}) {
  const existing = await prisma.contentItem.findFirst({ where: { type: input.type, slug: input.slug } });
  if (existing) return existing;
  return prisma.contentItem.create({
    data: {
      type: input.type,
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      body: input.body,
      status: "PUBLISHED",
      accessLevel: "PUBLIC",
      publishedAt: new Date(),
      authorId: null,
      featuredImageId: input.featuredImageId,
      details: (input.details ?? undefined) as never,
      programStatus: input.programStatus,
      projectStatus: input.projectStatus,
      eventKind: input.eventKind,
      startAt: input.startAt,
      endAt: input.endAt,
      locationType: input.locationType,
      venueAddress: input.venueAddress,
      onlineLink: input.onlineLink,
      registrationEnabled: input.registrationEnabled,
      capacity: input.capacity,
    },
  });
}

async function main() {
  console.log("Seeding demo data…");

  // Service images -> media assets
  const svcImages = [
    { name: "mentorship.png", key: "demo/services/mentorship.png", title: "Mentorship" },
    { name: "workspace.png", key: "demo/services/workspace.png", title: "Workspace Access" },
    { name: "internet.png", key: "demo/services/internet.png", title: "Free Internet Connection" },
    { name: "lab-access.png", key: "demo/services/lab-access.png", title: "Equipment / Lab Access" },
  ];
  const mediaByTitle: Record<string, string> = {};
  for (const img of svcImages) {
    copyServiceImage(img.name, img.key);
    const media = await createMedia(img.key, img.name, "image/png", 1500000);
    mediaByTitle[img.title] = media.id;
  }

  // Services
  await upsertContent({
    type: "SERVICE",
    title: "Mentorship",
    slug: "mentorship",
    summary: "One-on-one guidance from industry experts and research mentors.",
    featuredImageId: mediaByTitle["Mentorship"],
    details: { capabilities: ["Career navigation", "Research supervision", "Pitch preparation"] },
  });
  await upsertContent({
    type: "SERVICE",
    title: "Workspace Access",
    slug: "workspace-access",
    summary: "Dedicated coworking space for innovators and startups.",
    featuredImageId: mediaByTitle["Workspace Access"],
    details: { capabilities: ["24/7 secure access", "Meeting rooms", "Community events"] },
  });
  await upsertContent({
    type: "SERVICE",
    title: "Free Internet Connection",
    slug: "free-internet",
    summary: "Reliable high-speed internet for research and collaboration.",
    featuredImageId: mediaByTitle["Free Internet Connection"],
    details: { capabilities: ["Fiber backbone", "Campus-wide Wi-Fi", "No data caps"] },
  });
  await upsertContent({
    type: "SERVICE",
    title: "Equipment / Lab Access",
    slug: "equipment-lab-access",
    summary: "Specialized lab equipment for prototyping and testing.",
    featuredImageId: mediaByTitle["Equipment / Lab Access"],
    details: { capabilities: ["Prototyping tools", "Measurement instruments", "Safety-first protocols"] },
  });

  // Programs
  await upsertContent({
    type: "PROGRAM",
    title: "Internships",
    slug: "internships",
    summary: "Hands-on placements within active research and engineering projects.",
    programStatus: "ONGOING",
    details: {
      applicationStartAt: daysFromNow(-10),
      applicationCloseAt: daysFromNow(10),
      programStartAt: daysFromNow(-5),
      programEndAt: daysFromNow(90),
      deliveryMode: "HYBRID",
      eligibility: ["Enrolled in a STEM program", "Basic programming or lab skills", "Commitment of 3–6 months"],
    },
  });
  await upsertContent({
    type: "PROGRAM",
    title: "Workshops",
    slug: "workshops",
    summary: "Focused, practical training across emerging technology domains.",
    programStatus: "UPCOMING",
    details: {
      applicationStartAt: daysFromNow(5),
      applicationCloseAt: daysFromNow(30),
      programStartAt: daysFromNow(40),
      programEndAt: daysFromNow(45),
      deliveryMode: "PHYSICAL",
      eligibility: ["Open to all skill levels", "Early registration required"],
    },
  });
  await upsertContent({
    type: "PROGRAM",
    title: "Research Fellowships",
    slug: "research-fellowships",
    summary: "Immersive residency programs for committed researchers.",
    programStatus: "CLOSED",
    details: {
      applicationStartAt: daysFromNow(-60),
      applicationCloseAt: daysFromNow(-30),
      programStartAt: daysFromNow(-20),
      programEndAt: daysFromNow(-5),
      deliveryMode: "ONLINE",
      eligibility: ["Postgraduate or equivalent research experience", "Published or presented work"],
    },
  });

  // Projects
  await upsertContent({
    type: "PROJECT",
    title: "AgriSense Autonomous Crop Telemetry",
    slug: "agrisense-crop-telemetry",
    summary: "Solar-powered sensor array delivering microclimate metrics to local smallholder farms.",
    projectStatus: "ONGOING",
    details: {
      doi: "10.0000/btrc.agrisense.01",
      objectives: ["Deploy low-cost soil sensors", "Build a telemetry dashboard", "Validate against manual readings"],
      methodology: "Field-deployed ESP32 sensor nodes stream LoRa telemetry to a central gateway, aggregated in a time-series store.",
      findings: "Reduced water usage by 18% across pilot farms during the first season.",
      partners: [{ name: "Ministry of Agriculture", url: "https://example.org" }, { name: "Bambili Cooperative" }],
      leads: ["Dr. Fon Kenneth", "Eng. Mbah Brenda"],
      deliverables: ["https://example.org/whitepaper.pdf", "https://example.org/dataset.csv"],
    },
  });
  await upsertContent({
    type: "PROJECT",
    title: "Micro-Grid Energy Orchestrator",
    slug: "microgrid-energy-orchestrator",
    summary: "Intelligent battery management unit optimizing hybrid solar-diesel mini grids.",
    projectStatus: "PLANNED",
    details: {
      doi: "10.0000/btrc.microgrid.02",
      objectives: ["Optimize hybrid dispatch", "Predict demand", "Reduce diesel consumption"],
      methodology: "Reinforcement-learning dispatch model benchmarked against rule-based control.",
      leads: ["Dr. Nkwain Paul"],
    },
  });
  await upsertContent({
    type: "PROJECT",
    title: "Neural Speech Synthesizer",
    slug: "neural-speech-synthesizer",
    summary: "Speech synthesis and speech-to-text models trained on local Cameroonian languages.",
    projectStatus: "COMPLETED",
    details: {
      doi: "10.0000/btrc.speech.03",
      objectives: ["Collect a corpus", "Train TTS model", "Release open weights"],
      findings: "Achieved 4.2 MOS on held-out evaluation set.",
      leads: ["Eng. Mbah Brenda"],
      deliverables: ["https://example.org/model-weights.zip"],
    },
  });

  // Events
  await upsertContent({
    type: "EVENT",
    title: "Tech Innovation Summit",
    slug: "tech-innovation-summit",
    summary: "A convergence of researchers, founders and industry leaders.",
    eventKind: "EVENT",
    startAt: new Date(daysFromNow(14, 9)),
    endAt: new Date(daysFromNow(14, 17)),
    locationType: "PHYSICAL",
    venueAddress: "Bambili Campus Auditorium",
    registrationEnabled: true,
    capacity: 200,
    details: { organizer: "BTRC Programs Directorate" },
  });
  await upsertContent({
    type: "EVENT",
    title: "Robotics & Embedded Systems Workshop",
    slug: "robotics-embedded-workshop",
    summary: "Build and program embedded systems from the ground up.",
    eventKind: "WORKSHOP",
    startAt: new Date(daysFromNow(21, 9)),
    endAt: new Date(daysFromNow(23, 17)),
    locationType: "PHYSICAL",
    venueAddress: "Cleanroom B",
    registrationEnabled: true,
    capacity: 40,
    details: { organizer: "Applied AI & Robotics Lab" },
  });
  await upsertContent({
    type: "EVENT",
    title: "Data Science Bootcamp",
    slug: "data-science-bootcamp",
    summary: "End-to-end data analysis and machine learning workflows.",
    eventKind: "WORKSHOP",
    startAt: new Date(daysFromNow(30, 9)),
    endAt: new Date(daysFromNow(32, 17)),
    locationType: "ONLINE",
    onlineLink: "https://meet.example.org/ds-bootcamp",
    registrationEnabled: true,
    details: { organizer: "Research Commons" },
  });

  // News
  await upsertContent({
    type: "NEWS",
    title: "BTRC Secures Research Instrumentation Grant",
    slug: "instrumentation-grant",
    summary: "New funding expands cleanroom and telemetry instrumentation capacity.",
    details: { byline: "Communications Office", publicationDate: daysFromNow(-2) },
  });
  await upsertContent({
    type: "NEWS",
    title: "2026 Fellowship Cohort Announced",
    slug: "fellowship-cohort-2026",
    summary: "Twelve researchers selected for the fully-funded residency program.",
    details: { byline: "Academic Partnerships", publicationDate: daysFromNow(-5) },
  });
  await upsertContent({
    type: "NEWS",
    title: "AgriSense Pilot Reports 18% Water Savings",
    slug: "agrisense-water-savings",
    summary: "First-season results from the crop telemetry pilot are in.",
    details: { byline: "Research Directorate", publicationDate: daysFromNow(-10) },
  });

  // Demo staff account
  const demoEmail = "demo@btrc.example";
  const demo = await prisma.staff.findUnique({ where: { email: demoEmail } });
  if (!demo) {
    const contentAdmin = await prisma.role.findUnique({ where: { name: "Content Admin" } });
    await prisma.staff.create({
      data: {
        email: demoEmail,
        name: "Demo Content Admin",
        passwordHash: await hashPassword("DemoPass!123"),
        status: "ACTIVE",
        roles: contentAdmin ? { create: [{ roleId: contentAdmin.id }] } : undefined,
      },
    });
    console.log(`Seeded demo staff: ${demoEmail} (password: DemoPass!123)`);
  }

  // Organization info + socials
  await prisma.organizationSetting.upsert({
    where: { key: "organization" },
    create: {
      key: "organization",
      value: {
        name: "Bamenda Tech Research Center",
        description: "Practical Innovation & Scientific Engineering",
        address: "Bambili Campus, NW Region, Cameroon",
        phone: "+237 6XX XXX XXX",
        email: "inquiries@btrc-center.org",
        whatsapp: "",
        socials: [
          { label: "GH", url: "https://github.com/btrc" },
          { label: "X", url: "https://x.com/btrc" },
          { label: "IN", url: "https://linkedin.com/company/btrc" },
          { label: "YT", url: "https://youtube.com/@btrc" },
        ],
        mapConfig: null,
      },
    },
    update: {},
  });

  console.log("Demo data seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
