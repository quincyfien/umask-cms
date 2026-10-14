import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePagePermission } from "@/lib/auth";
import ContactReplyForm from "./ReplyForm";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePagePermission("contacts.view");
  const { id } = await params;

  const message = await prisma.contactMessage.findUnique({
    where: { id },
  });

  if (!message) {
    notFound();
  }

  // Auto mark as READ if NEW
  if (message.status === "NEW") {
    await prisma.contactMessage.update({
      where: { id },
      data: { status: "READ" },
    });
    message.status = "READ";
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link
          href="/admin/contacts"
          className="text-xs font-mono text-brand hover:underline inline-flex items-center gap-1 mb-2"
        >
          ← Back to Inbox
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="text-[10px] font-mono text-brand uppercase tracking-wider">INQUIRY DETAIL</span>
            <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">{message.subject}</h1>
            <p className="text-xs text-gray-400 mt-1 font-mono">
              From <span className="text-white font-medium">{message.fullName}</span> ({message.email}) • Received{" "}
              {message.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                message.status === "RESOLVED"
                  ? "bg-brand/10 text-brand border-brand/30"
                  : message.status === "READ"
                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                  : "bg-blue-500/10 text-blue-400 border-blue-500/30"
              }`}
            >
              {message.status}
            </span>
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="aristocratic-card rounded-2xl p-6 space-y-3">
        <h3 className="font-mono text-xs uppercase tracking-wider text-brand font-semibold">Message Body</h3>
        <div className="rounded-xl border border-white/5 bg-ink p-5 text-sm text-gray-200 leading-relaxed whitespace-pre-wrap font-sans">
          {message.message}
        </div>
      </div>

      {/* Reply Form */}
      <ContactReplyForm
        messageId={message.id}
        senderEmail={message.email}
        subject={message.subject}
        initialResolved={message.status === "RESOLVED"}
      />
    </div>
  );
}
