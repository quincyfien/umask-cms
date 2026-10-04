"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type StaffRow = {
  id: string;
  email: string;
  name: string;
  status: string;
  isSuperAdmin: boolean;
  roles: { role: { id: string; name: string } }[];
  lastActiveAt: string | null;
};

type Role = { id: string; name: string };

function StatusBadge({ status }: { status: string }) {
  if (status === "ACTIVE") {
    return <span className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-brand">ACTIVE</span>;
  }
  if (status === "PENDING") {
    return <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-yellow-400">PENDING INVITATION</span>;
  }
  return <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-red-400">{status}</span>;
}

export default function StaffManager({ initialStaff, roles }: { initialStaff: StaffRow[]; roles: Role[] }) {
  const router = useRouter();
  const [staff, setStaff] = useState(initialStaff);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function invite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          roleIds: form.get("roleId") ? [form.get("roleId")] : [],
        }),
      });
      if (res.ok) {
        setInviteOpen(false);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function resend(id: string) {
    await fetch(`/api/admin/staff/${id}/resend`, { method: "POST" });
    router.refresh();
  }

  async function revoke(id: string) {
    await fetch(`/api/admin/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "SUSPENDED" }),
    });
    router.refresh();
  }

  async function restore(id: string) {
    await fetch(`/api/admin/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ACTIVE" }),
    });
    router.refresh();
  }

  async function changeRole(id: string, roleId: string) {
    await fetch(`/api/admin/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleIds: roleId ? [roleId] : [] }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-white">Staff Accounts</h1>
          <p className="mt-1 text-xs text-gray-400">Invite, manage roles, and control access.</p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="rounded-full bg-brand px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover"
        >
          + Invite Staff
        </button>
      </div>

      <div className="aristocratic-card overflow-hidden rounded-2xl">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="px-5 py-3 font-mono uppercase tracking-wider text-gray-400">Name & Email</th>
              <th className="px-5 py-3 font-mono uppercase tracking-wider text-gray-400">Status</th>
              <th className="px-5 py-3 font-mono uppercase tracking-wider text-gray-400">Role & Activity</th>
              <th className="px-5 py-3 text-right font-mono uppercase tracking-wider text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-b border-white/5">
                <td className="px-5 py-3">
                  <p className="font-semibold text-white">{s.name}</p>
                  <p className="text-gray-400">{s.email}</p>
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={s.isSuperAdmin ? "SUPERADMIN" : s.status} />
                </td>
                <td className="px-5 py-3">
                  <p className="text-gray-300">
                    {s.isSuperAdmin
                      ? "Super Admin"
                      : s.roles.map((r) => r.role.name).join(", ") || "No role"}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {s.lastActiveAt ? `Last active ${new Date(s.lastActiveAt).toLocaleDateString()}` : "Never active"}
                  </p>
                </td>
                <td className="space-x-2 px-5 py-3 text-right">
                  {!s.isSuperAdmin && (
                    <>
                      <select
                        defaultValue={s.roles[0]?.role.id ?? ""}
                        onChange={(e) => changeRole(s.id, e.target.value)}
                        className="rounded-lg border border-brand/30 bg-ink-light px-2 py-1 text-[11px] text-white focus:outline-none"
                      >
                        <option value="">No role</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                      {s.status === "PENDING" && (
                        <button onClick={() => resend(s.id)} className="font-mono text-brand hover:underline">
                          Resend
                        </button>
                      )}
                      {s.status === "ACTIVE" && (
                        <button onClick={() => revoke(s.id)} className="font-mono text-red-400 hover:underline">
                          Revoke
                        </button>
                      )}
                      {s.status === "SUSPENDED" && (
                        <button onClick={() => restore(s.id)} className="font-mono text-brand hover:underline">
                          Restore
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-brand/30 bg-ink-light p-8">
            <h2 className="mb-4 text-lg font-bold text-white">Invite Staff</h2>
            <form onSubmit={invite} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-mono uppercase text-brand">Full Name *</label>
                <input name="name" required className="w-full rounded-xl border border-brand/30 bg-ink px-4 py-3 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-mono uppercase text-brand">Email Address *</label>
                <input name="email" type="email" required className="w-full rounded-xl border border-brand/30 bg-ink px-4 py-3 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-mono uppercase text-brand">Assigned Role</label>
                <select name="roleId" className="w-full rounded-xl border border-brand/30 bg-ink px-4 py-3 text-sm text-white focus:outline-none">
                  <option value="">No role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setInviteOpen(false)} className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-wider text-gray-300 hover:text-white">
                  Cancel
                </button>
                <button type="submit" disabled={busy} className="rounded-full bg-brand px-5 py-2 text-xs uppercase tracking-wider text-white hover:bg-brand-hover disabled:opacity-50">
                  {busy ? "Sending…" : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
