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
  const perPage = await getPaginationSize();
  const page = Math.max(1, Number((await searchParams)?.page ?? 1) || 1);

  const where = { type, status: "PUBLISHED" as const, accessLevel: "PUBLIC" as const, deletedAt: null };
  const [items, total] = await Promise.all([
    prisma.contentItem.findMany({
      where,
      orderBy:
        type === "EVENT"
          ? [{ startAt: "asc" }, { publishedAt: "desc" }]
          : [{ isPinned: "desc" }, { publishedAt: "desc" }],
      include: { category: true },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.contentItem.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="min-h-screen bg-surface text-content">
      <section className="border-b border-edge bg-gradient-to-b from-card to-surface py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-3 max-w-2xl text-base text-muted">{subtitle}</p>}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          {items.length === 0 ? (
            <div className="aristocratic-card mx-auto max-w-xl rounded-2xl p-12 text-center">
              <span className="mb-2 block font-mono text-2xl text-brand">∅</span>
              <p className="text-sm text-muted">No published {title.toLowerCase()} currently available.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ContentCard key={item.id} item={item} href={`${hrefPrefix}/${item.slug}`} showDate={type === "NEWS"} />
              ))}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} basePath={hrefPrefix} />
        </div>
      </section>
    </div>
  );
}
