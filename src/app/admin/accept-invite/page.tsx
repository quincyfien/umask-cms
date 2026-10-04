import AcceptInviteForm from "@/components/admin/AcceptInviteForm";

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12 text-paper">
        <div className="w-full max-w-md rounded-2xl border border-brand/30 bg-ink-light p-10 text-center">
          <h1 className="text-2xl font-bold text-white">Invalid Invitation</h1>
          <p className="mt-2 text-sm text-gray-400">This invitation link is missing its activation token.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12 text-paper">
      <div className="w-full max-w-md rounded-2xl border border-brand/30 bg-ink-light p-8 sm:p-10">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">Set Your Password</h1>
          <p className="mt-2 text-xs text-gray-400">Activate your staff account to access the admin dashboard.</p>
        </div>
        <AcceptInviteForm token={token} />
      </div>
    </div>
  );
}
