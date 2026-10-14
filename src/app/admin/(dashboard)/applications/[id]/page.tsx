import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePagePermission } from "@/lib/auth";
import ApplicationReviewForm from "./ReviewForm";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePagePermission("applications.view");
  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      documents: true,
    },
  });

  if (!application) {
    notFound();
  }

  const program = await prisma.contentItem.findUnique({
    where: { id: application.programId },
    select: { id: true, title: true, slug: true },
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Breadcrumb & Header */}
      <div>
        <Link
          href="/admin/applications"
          className="text-xs font-mono text-brand hover:underline inline-flex items-center gap-1 mb-2"
        >
          ← Back to Applications
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="text-[10px] font-mono text-brand uppercase tracking-wider">CANDIDATE DOSSIER</span>
            <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">{application.fullName}</h1>
            <p className="text-xs text-gray-400 mt-1 font-mono">
              Reference: <span className="text-brand font-semibold">{application.reference}</span> • Submitted{" "}
              {application.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          {program && (
            <div className="text-right">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Target Program</span>
              <span className="text-sm font-semibold text-white">{program.title}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details (2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Candidate Profile */}
          <div className="aristocratic-card rounded-2xl p-6 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-brand font-semibold">Profile & Credentials</h3>
            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div>
                <span className="text-gray-400 block mb-0.5">Full Name</span>
                <span className="text-white font-medium text-sm">{application.fullName}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Email</span>
                <a href={`mailto:${application.email}`} className="text-brand underline">{application.email}</a>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Phone</span>
                <span className="text-white">{application.phone || "Not provided"}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Classification</span>
                <span className="font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  {application.applicantType}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Institution</span>
                <span className="text-white">{application.institution || "Independent"}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Current Position / Role</span>
                <span className="text-white">{application.position || "Not specified"}</span>
              </div>
            </div>
          </div>

          {/* Motivation Statement */}
          <div className="aristocratic-card rounded-2xl p-6 space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-wider text-brand font-semibold">Statement of Motivation</h3>
            <div className="rounded-xl border border-white/5 bg-ink p-4 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
              {application.motivation}
            </div>
          </div>

          {/* Supporting Documents */}
          <div className="aristocratic-card rounded-2xl p-6 space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-wider text-brand font-semibold">
              Attached Documents ({application.documents.length})
            </h3>
            {application.documents.length === 0 ? (
              <p className="text-xs text-gray-500">No documents attached with this submission.</p>
            ) : (
              <div className="divide-y divide-white/5 rounded-xl border border-white/10 overflow-hidden">
                {application.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 text-xs bg-ink/40">
                    <div className="truncate pr-4">
                      <span className="text-white font-medium block truncate">{doc.fileName}</span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {(doc.size / 1024 / 1024).toFixed(2)} MB • {doc.mimeType}
                      </span>
                    </div>
                    {doc.fileId && (
                      <a
                        href={`/api/media/${doc.fileId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-brand/40 bg-brand/10 px-3 py-1 font-mono text-[10px] font-semibold text-brand hover:bg-brand hover:text-white transition-colors"
                      >
                        Download ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Review & Status Sidebar (1 col) */}
        <div>
          <ApplicationReviewForm
            applicationId={application.id}
            initialStatus={application.status}
            initialNotes={application.reviewNotes ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
