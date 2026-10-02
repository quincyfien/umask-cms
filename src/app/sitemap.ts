import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

const TYPES: { type: "SERVICE" | "PROGRAM" | "PROJECT" | "EVENT" | "NEWS" | "RESOURCE"; prefix: string }[] = [
  { type: "SERVICE", prefix: "/services" },
  { type: "PROGRAM", prefix: "/programs" },
  { type: "PROJECT", prefix: "/projects" },
  { type: "EVENT", prefix: "/events" },
  { type: "NEWS", prefix: "/news" },
  { type: "RESOURCE", prefix: "/downloads" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${env.siteOrigin}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${env.siteOrigin}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${env.siteOrigin}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${env.siteOrigin}/downloads`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${env.siteOrigin}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.1 },
  ];

  const entries: MetadataRoute.Sitemap = [...staticRoutes];

  for (const { type, prefix } of TYPES) {
    const items = await prisma.contentItem.findMany({
      where: { type, status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null, noIndex: false },
      select: { slug: true, publishedAt: true },
    });
    entries.push({
      url: `${env.siteOrigin}${prefix}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
    for (const item of items) {
      entries.push({
        url: `${env.siteOrigin}${prefix}/${item.slug}`,
        lastModified: item.publishedAt ?? new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
