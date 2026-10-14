import { prisma } from "@/lib/db";
import { RichText } from "@/components/public/RichText";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.contentItem.findFirst({
    where: { type: "PAGE", slug: "privacy", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
  });
  if (!page) return {};
  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.summary,
  };
}

export default async function PrivacyPage() {
  const page = await prisma.contentItem.findFirst({
    where: { type: "PAGE", slug: "privacy", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
  });

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface text-content selection:bg-brand selection:text-white">
      <section className="border-b border-brand/20 bg-card py-16">
        <div className="mx-auto max-w-4xl px-6">
          <span className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-widest text-brand">
            LEGAL & COMPLIANCE
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-content sm:text-5xl">
            {page.title}
          </h1>
          {page.summary && (
            <p className="mt-4 text-base leading-relaxed text-muted">
              {page.summary}
            </p>
          )}
          {page.publishedAt && (
            <p className="mt-6 font-mono text-xs text-muted">
              Last Updated: {new Date(page.publishedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="aristocratic-card rounded-2xl p-8 md:p-12">
            <div className="prose max-w-none text-muted">
              {page.body ? <RichText html={page.body} /> : <p>Policy content coming soon.</p>}
            </div>
            
            <div className="mt-12 border-t border-edge pt-8">
              <h3 className="mb-4 text-lg font-bold text-content">Data Subject Requests</h3>
              <p className="mb-4 text-sm text-muted">
                To submit a formal request regarding your personal data (access, deletion, or correction), please use our secure request form.
              </p>
              <Link
                href="/contact?subject=privacy"
                className="inline-flex items-center gap-2 rounded bg-brand px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover"
              >
                Submit Privacy Request →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
