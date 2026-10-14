import type { ContentItem } from "@prisma/client";
import { RichText } from "./RichText";
import { formatDate, formatDateTime } from "@/lib/format";
import { getProgramBadge } from "@/lib/program";
import ProgramApply from "./ProgramApply";
import EventRsvpModal from "./EventRsvpModal";
import BackLink from "./BackLink";

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

  const programBadge = item.type === "PROGRAM" ? getProgramBadge(item.details as never) : null;

  return (
    <div className="min-h-screen bg-surface text-content relative">
      {/* Header Banner */}
      <section className="border-b border-brand/20 bg-gradient-to-b from-card to-surface py-16">
        <div className="mx-auto max-w-4xl px-6">
          <BackLink />
          
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

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-content sm:text-5xl font-serif">
            {item.title}
          </h1>

          {item.summary && <p className="mt-6 text-lg leading-relaxed text-muted font-light">{item.summary}</p>}

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-muted uppercase tracking-widest">
            {item.author && <span>Authored by <span className="text-brand">{item.author.name}</span></span>}
            {item.type === "NEWS" && details.byline && <span>By <span className="text-brand">{details.byline}</span></span>}
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          {item.featuredImageId && (
            <img
              src={`/api/media/${item.featuredImageId}`}
              alt={item.title}
              className="mb-12 max-h-[500px] w-full rounded-2xl object-cover shadow-xl"
            />
          )}

          {item.type === "EVENT" && (
            <div className="aristocratic-card mb-12 rounded-2xl border-l-4 border-brand p-8 bg-card">
              <h3 className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-brand">
                Event Logistics
              </h3>
              <div className="grid gap-6 text-sm text-muted sm:grid-cols-2">
                {item.startAt && (
                  <div>
                    <span className="block font-mono uppercase text-muted/70 text-[10px] mb-1">Commencement</span>
                    <span className="font-semibold text-content">{formatDateTime(item.startAt)}</span>
                  </div>
                )}
                {item.endAt && (
                  <div>
                    <span className="block font-mono uppercase text-muted/70 text-[10px] mb-1">Conclusion</span>
                    <span className="font-semibold text-content">{formatDateTime(item.endAt)}</span>
                  </div>
                )}
                {item.locationType === "PHYSICAL" && item.venueAddress && (
                  <div className="sm:col-span-2">
                    <span className="block font-mono uppercase text-muted/70 text-[10px] mb-1">Venue Location</span>
                    <span className="font-semibold text-content">{item.venueAddress}</span>
                  </div>
                )}
                {item.locationType === "ONLINE" && item.onlineLink && (
                  <div className="sm:col-span-2">
                    <span className="block font-mono uppercase text-muted/70 text-[10px] mb-1">Online Access URL</span>
                    <a href={item.onlineLink} target="_blank" rel="noreferrer" className="font-mono text-brand underline">
                      {item.onlineLink}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {item.type === "PROGRAM" && (details.eligibility?.length || details.deliveryMode) && (
            <div className="aristocratic-card mb-12 rounded-2xl p-8 bg-card border border-edge">
              <h3 className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-brand">Program Structure</h3>
              {details.deliveryMode && <p className="text-sm text-content font-medium mb-4">Delivery Mode: <span className="text-muted font-normal">{details.deliveryMode}</span></p>}
              {details.eligibility && details.eligibility.length > 0 && (
                <div className="mt-4">
                  <p className="font-mono text-[10px] uppercase text-muted mb-2">Eligibility Criteria</p>
                  <ul className="space-y-2 text-sm text-muted">
                    {details.eligibility.map((e) => (
                      <li key={e} className="flex gap-2">
                        <span className="text-brand">✦</span>
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {item.type === "PROJECT" && (
            <div className="aristocratic-card mb-12 space-y-8 rounded-2xl p-8 bg-card border border-edge">
              {details.doi && <p className="font-mono text-xs text-brand tracking-widest">DOI: {details.doi}</p>}
              {details.objectives && details.objectives.length > 0 && (
                <div>
                  <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-brand">Objectives & Scope</h3>
                  <ul className="space-y-2 text-sm text-muted">
                    {details.objectives.map((o) => (
                      <li key={o} className="flex gap-2">
                        <span className="text-brand">✦</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {details.methodology && (
                <div>
                  <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-brand">Methodology</h3>
                  <p className="whitespace-pre-wrap text-sm text-muted leading-relaxed">{details.methodology}</p>
                </div>
              )}
              {details.findings && (
                <div>
                  <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-brand">Key Findings</h3>
                  <p className="whitespace-pre-wrap text-sm text-muted leading-relaxed">{details.findings}</p>
                </div>
              )}
              {details.partners && details.partners.length > 0 && (
                <div>
                  <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-brand">Partners</h3>
                  <ul className="space-y-2 text-sm text-muted">
                    {details.partners.map((p) => (
                      <li key={p.name} className="flex gap-2">
                        <span className="text-brand">✦</span>
                        {p.url ? <a href={p.url} target="_blank" rel="noreferrer" className="text-content hover:text-brand transition-colors underline decoration-brand/30">{p.name}</a> : <span>{p.name}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {details.leads && details.leads.length > 0 && (
                <div>
                  <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-brand">Research Leads</h3>
                  <p className="text-sm text-content font-medium">{details.leads.join(", ")}</p>
                </div>
              )}
              {details.deliverables && details.deliverables.length > 0 && (
                <div>
                  <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-brand">Deliverables</h3>
                  <ul className="space-y-2 text-sm text-muted">
                    {details.deliverables.map((d) => (
                      <li key={d} className="flex gap-2">
                         <span className="text-brand">✦</span>
                        <a href={d} target="_blank" rel="noreferrer" className="text-content hover:text-brand transition-colors underline decoration-brand/30">{d}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {item.body ? (
            <div className="aristocratic-card rounded-2xl p-8 sm:p-12 bg-card border border-edge">
              <div className="prose max-w-none leading-relaxed text-muted prose-headings:font-serif prose-headings:text-content prose-a:text-brand">
                <RichText html={item.body} />
              </div>
            </div>
          ) : (
            <div className="aristocratic-card rounded-2xl p-12 text-center text-xs text-muted border border-edge">
              Detailed documentation will be published shortly.
            </div>
          )}
        </div>
      </section>

      {/* Floating CTAs */}
      {item.type === "PROGRAM" && programBadge && programBadge.applyOpen && (
        <ProgramApply
          programId={item.id}
          programTitle={item.title}
        />
      )}

      {item.type === "EVENT" && (
        <EventRsvpModal
          eventId={item.id}
          eventTitle={item.title}
        />
      )}
    </div>
  );
}
