import { prisma } from "@/lib/db";
import { RichText } from "@/components/public/RichText";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.contentItem.findFirst({
    where: { type: "PAGE", slug: "about", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
  });
  if (!page) return {};
  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.summary,
  };
}

export default async function AboutPage() {
  const page = await prisma.contentItem.findFirst({
    where: { type: "PAGE", slug: "about", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
  });

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface text-content selection:bg-brand selection:text-white">
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-brand/20 bg-gradient-to-b from-card to-surface py-20">
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="font-mono text-xs font-semibold uppercase tracking-super-wide text-brand">
            Institutional Overview
          </span>
          <h1 className="mt-2 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-content sm:text-6xl">
            {page.title}
          </h1>
          {page.summary && (
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">
              {page.summary}
            </p>
          )}
        </div>
      </section>

      {/* Purpose & Dynamic Page Content */}
      <section className="border-b border-brand/10 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="aristocratic-card rounded-2xl p-8">
            <div className="prose max-w-none text-muted">
              {page.body ? <RichText html={page.body} /> : <p>Page content coming soon.</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
