import { prisma } from "@/lib/db";
import type { ContentType } from "@prisma/client";
import { getPaginationSize } from "@/lib/settings";
import ContentCard from "./ContentCard";
import Pagination from "./Pagination";

type Props = {
  title: string;
  type: ContentType;
  hrefPrefix: string;
  subtitle?: string;
  searchParams?: Promise<{ page?: string }>;
};

export default async function ContentListPage({ title, type, hrefPrefix, subtitle, searchParams }: Props) {
  const perPage = await getPaginationSize(); // Default is 12
  const page = Math.max(1, Number((await searchParams)?.page ?? 1) || 1);

  const where = { type, status: "PUBLISHED" as const, accessLevel: "PUBLIC" as const, deletedAt: null };
  const [items, total] = await Promise.all([
    prisma.contentItem.findMany({
      where,
      orderBy:
        type === "EVENT"
          ? [{ startAt: "asc" }, { publishedAt: "desc" }]
          : [{ isPinned: "desc" }, { publishedAt: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.contentItem.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="min-h-screen bg-surface text-content relative">
      {/* Aristocratic Header */}
      <section className="border-b border-edge bg-gradient-to-b from-card to-surface py-20 text-center">
        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center">
          <div className="mb-6 flex items-center justify-center gap-4 w-full">
            <div className="h-px bg-brand/30 w-16 sm:w-32"></div>
            <span className="font-mono text-[10px] uppercase tracking-super-wide text-brand">Institutional Repository</span>
            <div className="h-px bg-brand/30 w-16 sm:w-32"></div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-medium tracking-[0.05em] text-ink py-2 uppercase">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-2xl text-sm sm:text-base text-muted tracking-wide leading-relaxed font-light">
              {subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-20 bg-surface">
        <div className="mx-auto max-w-7xl px-6">
          {items.length === 0 ? (
            <div className="aristocratic-card mx-auto max-w-xl rounded-none border border-edge p-16 text-center">
              <span className="mb-4 block font-serif text-3xl text-muted/50">~</span>
              <p className="text-sm tracking-widest text-muted uppercase">Archive Empty</p>
            </div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ContentCard key={item.id} item={item} href={`${hrefPrefix}/${item.slug}`} />
              ))}
            </div>
          )}
          
          <div className="mt-16 flex justify-center">
            <Pagination page={page} totalPages={totalPages} basePath={hrefPrefix} />
          </div>
        </div>
      </section>
    </div>
  );
}
