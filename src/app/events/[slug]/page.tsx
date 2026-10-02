import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPublishedSlugs, getPublishedBySlug } from "@/lib/content";
import ContentDetail from "@/components/public/ContentDetail";

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs("EVENT");
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedBySlug("EVENT", slug);
  if (!item) return {};
  return { title: item.metaTitle ?? item.title, description: item.metaDescription ?? item.summary ?? undefined };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublishedBySlug("EVENT", slug);
  if (!item) notFound();
  return <ContentDetail item={item} />;
}
