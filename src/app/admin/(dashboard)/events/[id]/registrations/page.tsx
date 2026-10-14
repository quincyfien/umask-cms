import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePagePermission } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";

export default async function EventRegistrationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePagePermission("content.create");
  const { id } = await params;

  const event = await prisma.contentItem.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      type: true,
      startAt: true,
      endAt: true,
      capacity: true,
      locationType: true,
      venueAddress: true,
      onlineLink: true,
      status: true,
    },
  });

  if (!event || event.type !== "EVENT") {
    notFound();
  }

  const registrations = await prisma.registration.findMany({
    where: { eventId: id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Link
          href="/admin/events"
          className="text-xs font-mono text-brand hover:underline inline-flex items-center gap-1 mb-2"
        >
          ← Back to Events Management
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="text-[10px] font-mono text-brand uppercase tracking-wider">ATTENDEE ROSTER</span>
            <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">{event.title}</h1>
            <p className="text-xs text-gray-400 mt-1 font-mono">
              Scheduled: {event.startAt ? formatDateTime(event.startAt) : "Date TBD"} • Location:{" "}
              {event.locationType === "ONLINE" ? "Online Symposium" : event.venueAddress || "Auditorium"}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Total RSVPs</span>
            <span className="text-2xl font-bold text-brand font-mono">
              {registrations.length}
              {event.capacity ? ` / ${event.capacity}` : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="aristocratic-card rounded-2xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Attendee</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Phone</th>
              <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Registered</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-gray-500 font-mono">
                  No attendees have registered for this event yet.
                </td>
              </tr>
            ) : (
              registrations.map((reg) => (
                <tr key={reg.id} className="border-b border-white/5 hover:bg-brand/5 transition-colors">
                  <td className="px-5 py-3 font-medium text-white">{reg.fullName}</td>
                  <td className="px-5 py-3 font-mono text-brand">
                    <a href={`mailto:${reg.email}`} className="hover:underline">
                      {reg.email}
                    </a>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-400">{reg.phone || "—"}</td>
                  <td className="px-5 py-3 font-mono text-gray-500">
                    {reg.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
