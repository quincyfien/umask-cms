import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const linkCls = "flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-xs font-semibold transition-colors";

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={`${basePath}?page=${page - 1}`} className={`${linkCls} border-edge text-content hover:border-brand hover:text-brand`}>
          Previous
        </Link>
      ) : (
        <span className={`${linkCls} cursor-not-allowed border-edge/50 text-muted`}>Previous</span>
      )}

      {pages.map((p) =>
        p === page ? (
          <span key={p} className={`${linkCls} border-brand bg-brand text-white`}>
            {p}
          </span>
        ) : (
          <Link key={p} href={`${basePath}?page=${p}`} className={`${linkCls} border-edge text-content hover:border-brand hover:text-brand`}>
            {p}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={`${basePath}?page=${page + 1}`} className={`${linkCls} border-edge text-content hover:border-brand hover:text-brand`}>
          Next
        </Link>
      ) : (
        <span className={`${linkCls} cursor-not-allowed border-edge/50 text-muted`}>Next</span>
      )}
    </nav>
  );
}
