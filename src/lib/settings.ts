import { prisma } from "./db";

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await prisma.systemSetting.findUnique({ where: { key } });
  return (row?.value as T) ?? fallback;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  await prisma.systemSetting.upsert({
    where: { key },
    create: { key, value: value as never },
    update: { value: value as never },
  });
}

export type HeroConfig = {
  title: string;
  tagline: string;
  subtitle: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  backgroundImageId: string | null;
};

const DEFAULT_HERO: HeroConfig = {
  title: "Turning Ideas Into Technology That Matters",
  tagline: "Research. Innovate. Build. Sustain.",
  subtitle:
    "A technology research institution dedicated to transforming scientific ideas into practical engineering solutions — empowering researchers, students, and industrial partners across Africa.",
  ctaPrimaryLabel: "Explore Research Projects",
  ctaPrimaryHref: "/projects",
  ctaSecondaryLabel: "Request a Service",
  ctaSecondaryHref: "/contact",
  backgroundImageId: null,
};

export async function getHeroConfig(): Promise<HeroConfig> {
  return getSetting<HeroConfig>("hero", DEFAULT_HERO);
}

export type MetricConfig = {
  label: string;
  mode: "count" | "manual";
  source?: "PROJECT" | "PROGRAM" | "EVENT" | "NEWS";
  value?: string;
  suffix?: string;
};

const DEFAULT_METRICS: MetricConfig[] = [
  { label: "Active Research Projects", mode: "count", source: "PROJECT", suffix: "+" },
  { label: "Programs & Fellowships", mode: "count", source: "PROGRAM", suffix: "+" },
  { label: "Students & Innovators Trained", mode: "manual", value: "1,200", suffix: "+" },
  { label: "Verified Project Success Rate", mode: "manual", value: "98.4", suffix: "%" },
];

export async function getMetrics(): Promise<MetricConfig[]> {
  return getSetting<MetricConfig[]>("metrics", DEFAULT_METRICS);
}

export async function getPaginationSize(): Promise<number> {
  return getSetting<number>("pagination.items_per_page", 12);
}

export async function isTurnstileEnabled(): Promise<boolean> {
  return getSetting<boolean>("turnstile_enabled", false);
}

export async function isAnalyticsEnabled(): Promise<boolean> {
  return getSetting<boolean>("analytics_enabled", false);
}

export async function resolveMetricValues(
  metrics: MetricConfig[],
): Promise<{ label: string; value: string; suffix?: string }[]> {
  const counts = new Map<string, number>();
  for (const m of metrics) {
    if (m.mode === "count" && m.source && !counts.has(m.source)) {
      counts.set(
        m.source,
        await prisma.contentItem.count({
          where: { type: m.source as never, status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
        }),
      );
    }
  }
  return metrics.map((m) => ({
    label: m.label,
    value: m.mode === "count" ? String(counts.get(m.source ?? "") ?? 0) : (m.value ?? "0"),
    suffix: m.suffix,
  }));
}
