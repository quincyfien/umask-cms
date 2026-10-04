import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12 text-paper">
      <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-ink-light p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl text-red-400">
          ⛔
        </div>
        <h1 className="text-2xl font-bold text-white">Access Denied</h1>
        <p className="mt-2 text-sm text-gray-400">
          You do not have permission to view this page. If you believe this is a mistake, contact an administrator.
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
