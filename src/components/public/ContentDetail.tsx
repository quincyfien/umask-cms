import type { ContentItem } from "@prisma/client";
import { RichText } from "./RichText";
import { formatDate, formatDateTime } from "@/lib/format";
import { getProgramBadge } from "@/lib/program";
import ProgramApply from "./ProgramApply";

export default function ContentDetail({
  item,
}: {
  item: ContentItem & { category?: { name: string } | null; author?: { name: string } | null };
}) {
  const details = (item.details ?? {}) as {
    eligibility?: string[];
    deliveryMode?: string;
    applicationStartAt?: string;
    applicationCloseAt?: string;
    programStartAt?: string;
    programEndAt?: string;
    doi?: string;
    objectives?: string[];
    methodology?: string;
    findings?: string;
    partners?: { name: string; url?: string }[];
    leads?: string[];
    deliverables?: string[];
    byline?: string;
  };

  return (
    <div className="min-h-screen bg-surface text-content">
      {/* Header Banner */}
      <section className="border-b border-brand/20 bg-gradient-to-b from-card to-surface py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-4 flex items-center gap-3">
            {item.category && (
              <span className="rounded-full border border-brand/40 bg-brand/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-brand">
                {item.category.name}
              </span>
            )}
            {item.publishedAt && (
              <span className="font-mono text-xs text-muted">Published {formatDate(item.publishedAt)}</span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-content sm:text-5xl">
            {item.title}
          </h1>

          {item.summary && <p className="mt-4 text-lg leading-relaxed text-muted">{item.summary}</p>}

          {item.author && <p className="mt-4 font-mono text-xs text-brand">Authored by {item.author.name}</p>}
          {item.type === "NEWS" && details.byline && (
            <p className="mt-2 font-mono text-xs text-muted">By {details.byline}</p>
          )}
        </div>
      </section>

      {/* Main Content Body */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          {item.featuredImageId && (
            <img
              src={`/api/media/${item.featuredImageId}`}
              alt={item.title}
              className="mb-8 max-h-[420px] w-full rounded-2xl object-cover"
            />
          )}

          {item.type === "EVENT" && (
            <div className="aristocratic-card mb-8 rounded-2xl border-l-4 border-brand p-6">
              <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-brand">
                Event Details
              </h3>
              <div className="grid gap-4 text-sm text-muted sm:grid-cols-2">
                {item.startAt && (
                  <div>
                    <span className="block font-mono uppercase text-muted">Starts</span>
                    <span className="font-semibold text-content">{formatDateTime(item.startAt)}</span>
                  </div>
                )}
                {item.endAt && (
                  <div>
                    <span className="block font-mono uppercase text-muted">Ends</span>
                    <span className="font-semibold text-content">{formatDateTime(item.endAt)}</span>
                  </div>
                )}
                {item.locationType === "PHYSICAL" && item.venueAddress && (
                  <div className="sm:col-span-2">
                    <span className="block font-mono uppercase text-muted">Venue Location</span>
                    <span className="font-semibold text-content">{item.venueAddress}</span>
                  </div>
                )}
                {item.locationType === "ONLINE" && item.onlineLink && (
                  <div className="sm:col-span-2">
                    <span className="block font-mono uppercase text-muted">Online Access URL</span>
                    <a href={item.onlineLink} target="_blank" rel="noreferrer" className="font-mono text-brand underline">
                      {item.onlineLink}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {item.type === "PROGRAM" && (
            <ProgramApply
              programId={item.id}
              programTitle={item.title}
              badgeLabel={getProgramBadge(item.details as never).label}
              applyOpen={getProgramBadge(item.details as never).applyOpen}
              closed={getProgramBadge(item.details as never).closed}
              cta={getProgramBadge(item.details as never).cta}
            />
          )}

          {item.type === "PROGRAM" && (details.eligibility?.length || details.deliveryMode) && (
            <div className="aristocratic-card mb-8 rounded-2xl p-6">
              <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-brand">Program Details</h3>
              {details.deliveryMode && <p className="text-sm text-muted">Delivery Mode: {details.deliveryMode}</p>}
              {details.eligibility && details.eligibility.length > 0 && (
                <div className="mt-3">
                  <p className="font-semibold text-content">Eligibility</p>
                  <ul className="mt-1 list-disc pl-5 text-sm text-muted">
                    {details.eligibility.map((e) => <li key={e}>{e}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {item.type === "PROJECT" && (
            <div className="aristocratic-card mb-8 space-y-6 rounded-2xl p-6">
              {details.doi && <p className="font-mono text-xs text-brand">DOI: {details.doi}</p>}
              {details.objectives && details.objectives.length > 0 && (
                <div>
                  <h3 className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-brand">Objectives & Scope</h3>
                  <ul className="list-disc pl-5 text-sm text-muted">
                    {details.objectives.map((o) => <li key={o}>{o}</li>)}
                  </ul>
                </div>
              )}
              {details.methodology && (
                <div>
                  <h3 className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-brand">Methodology</h3>
                  <p className="whitespace-pre-wrap text-sm text-muted">{details.methodology}</p>
                </div>
              )}
              {details.findings && (
                <div>
                  <h3 className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-brand">Key Findings</h3>
                  <p className="whitespace-pre-wrap text-sm text-muted">{details.findings}</p>
                </div>
              )}
              {details.partners && details.partners.length > 0 && (
                <div>
                  <h3 className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-brand">Partners</h3>
                  <ul className="space-y-1 text-sm text-muted">
                    {details.partners.map((p) => (
                      <li key={p.name}>
                        {p.url ? <a href={p.url} target="_blank" rel="noreferrer" className="text-brand underline">{p.name}</a> : p.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {details.leads && details.leads.length > 0 && (
                <div>
                  <h3 className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-brand">Research Leads</h3>
                  <p className="text-sm text-muted">{details.leads.join(", ")}</p>
                </div>
              )}
              {details.deliverables && details.deliverables.length > 0 && (
                <div>
                  <h3 className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-brand">Deliverables</h3>
                  <ul className="list-disc pl-5 text-sm text-muted">
                    {details.deliverables.map((d) => (
                      <li key={d}>
                        <a href={d} target="_blank" rel="noreferrer" className="text-brand underline">{d}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {item.body ? (
            <div className="aristocratic-card rounded-2xl p-8 sm:p-10">
              <div className="prose max-w-none leading-relaxed text-muted">
                <RichText html={item.body} />
              </div>
            </div>
          ) : (
            <div className="aristocratic-card rounded-2xl p-8 text-center text-xs text-muted">
              Detailed documentation will be published shortly.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
