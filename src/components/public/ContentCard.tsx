import Link from "next/link";
import type { ContentItem } from "@prisma/client";

type CardProps = {
  item: ContentItem;
  href: string;
};

export default function ContentCard({ item, href }: CardProps) {
  const details = (item.details ?? {}) as Record<string, unknown>;
  
  // Extract possible lists from details to form two bulleted lists
  const list1 = (Array.isArray(details.offerings) ? details.offerings : Array.isArray(details.capabilities) ? details.capabilities : Array.isArray(details.objectives) ? details.objectives : []) as string[];
  const list2 = (Array.isArray(details.parameters) ? details.parameters : Array.isArray(details.requirements) ? details.requirements : Array.isArray(details.eligibility) ? details.eligibility : []) as string[];

  return (
    <Link href={href} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden bg-card border border-edge transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="h-56 w-full shrink-0 bg-ink overflow-hidden">
          {item.featuredImageId ? (
            <img
              src={`/api/media/${item.featuredImageId}`}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/10 to-card">
              <span className="font-mono text-xs text-muted uppercase tracking-widest">No Image</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-1 flex-col p-8">
          <h3 className="mb-4 text-2xl font-serif font-bold leading-tight text-content group-hover:text-brand transition-colors">
            {item.title}
          </h3>

          {item.summary && (
            <p className="mb-8 text-sm leading-relaxed text-muted font-light">
              {item.summary}
            </p>
          )}

          <div className="mt-auto grid grid-cols-1 gap-6 sm:grid-cols-2">
            {Array.isArray(list1) && list1.length > 0 && (
              <div>
                <h4 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-brand">Core Offerings</h4>
                <ul className="space-y-2">
                  {list1.slice(0, 3).map((val: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-muted">
                      <span className="text-brand">✦</span>
                      <span className="leading-tight">{val}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {Array.isArray(list2) && list2.length > 0 && (
              <div>
                <h4 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-brand">Access Parameters</h4>
                <ul className="space-y-2">
                  {list2.slice(0, 3).map((val: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-muted">
                      <span className="text-brand">✦</span>
                      <span className="leading-tight">{val}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
