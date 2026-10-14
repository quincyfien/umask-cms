"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RoleItem = {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
  assignedStaffCount: number;
};

type PermissionItem = {
  key: string;
  description: string;
};

export default function RolesManager({
  initialRoles,
  allPermissions,
}: {
  initialRoles: RoleItem[];
  allPermissions: PermissionItem[];
}) {
  const router = useRouter();
  const [roles, setRoles] = useState(initialRoles);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startCreate() {
    setEditingRole(null);
    setIsCreating(true);
    setName("");
    setDescription("");
    setSelectedPerms([]);
    setError(null);
  }

  function startEdit(role: RoleItem) {
    setIsCreating(false);
    setEditingRole(role);
    setName(role.name);
    setDescription(role.description ?? "");
    setSelectedPerms([...role.permissions]);
    setError(null);
  }

  function cancelForm() {
    setIsCreating(false);
    setEditingRole(null);
    setError(null);
  }

  function togglePerm(key: string) {
    setSelectedPerms((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError(null);

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      permissions: selectedPerms,
    };

    try {
      if (isCreating) {
        const res = await fetch("/api/admin/roles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setError(data?.detail ?? "Failed to create role.");
          setSaving(false);
          return;
        }

        const data = await res.json();
        setRoles((prev) => [
          ...prev,
          {
            id: data.role.id,
            name: data.role.name,
            description: data.role.description,
            permissions: selectedPerms,
            assignedStaffCount: 0,
          },
        ]);
      } else if (editingRole) {
        const res = await fetch(`/api/admin/roles/${editingRole.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setError(data?.detail ?? "Failed to update role.");
          setSaving(false);
          return;
        }

        setRoles((prev) =>
          prev.map((r) =>
            r.id === editingRole.id
              ? {
                  ...r,
                  name: payload.name,
                  description: payload.description ?? null,
                  permissions: selectedPerms,
                }
              : r
          )
        );
      }

      setSaving(false);
      cancelForm();
      router.refresh();
    } catch {
      setError("Network error occurred.");
      setSaving(false);
    }
  }

  async function handleDelete(roleId: string, roleName: string) {
    if (!confirm(`Are you certain you wish to delete the role "${roleName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/roles/${roleId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.detail ?? "Failed to delete role.");
        return;
      }

      setRoles((prev) => prev.filter((r) => r.id !== roleId));
      if (editingRole?.id === roleId) cancelForm();
      router.refresh();
    } catch {
      alert("Network error occurred.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-gray-400">
          Showing {roles.length} defined system role{roles.length === 1 ? "" : "s"}
        </span>
        {!isCreating && !editingRole && (
          <button
            type="button"
            onClick={startCreate}
            className="rounded-full bg-brand px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20"
          >
            + Create Role
          </button>
        )}
      </div>

      {/* Editor Modal / Card */}
      {(isCreating || editingRole) && (
        <form onSubmit={handleSave} className="aristocratic-card rounded-2xl p-6 space-y-5 border border-brand/40 bg-card">
          <div className="border-b border-white/10 pb-3 flex justify-between items-center">
            <h3 className="text-base font-bold text-white">
              {isCreating ? "Create New Institutional Role" : `Edit Role: ${editingRole?.name}`}
            </h3>
            <button
              type="button"
              onClick={cancelForm}
              className="text-xs font-mono text-gray-400 hover:text-white"
            >
              ✕ Cancel
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">
                Role Name <span className="text-brand">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Research Director"
                className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-xs text-white focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">
                Description
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Lead researcher overseeing laboratory trials"
                className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-xs text-white focus:border-brand focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
              Capabilities & Permissions ({selectedPerms.length} enabled)
            </label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 max-h-60 overflow-y-auto p-3 rounded-xl border border-white/5 bg-ink">
              {allPermissions.map((perm) => {
                const checked = selectedPerms.includes(perm.key);
                return (
                  <label
                    key={perm.key}
                    className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      checked ? "bg-brand/10 border border-brand/30" : "hover:bg-white/5"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePerm(perm.key)}
                      className="mt-0.5 accent-brand"
                    />
                    <div className="text-[11px]">
                      <span className="font-mono text-white block">{perm.key}</span>
                      <span className="text-gray-400 text-[10px]">{perm.description}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl text-xs font-mono bg-red-500/10 border border-red-500/20 text-red-400">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={cancelForm}
              className="rounded-full border border-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-brand px-6 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover disabled:opacity-50 transition-colors shadow-lg shadow-brand/20"
            >
              {saving ? "Saving…" : isCreating ? "Create Role" : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {/* Roles List */}
      <div className="grid gap-4 sm:grid-cols-2">
        {roles.map((r) => (
          <div
            key={r.id}
            className="aristocratic-card rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-brand/30 transition-all"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-white">{r.name}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{r.description || "No description provided."}</p>
                </div>
                <span className="font-mono text-[10px] bg-white/5 text-brand px-2 py-0.5 rounded-full border border-brand/20">
                  {r.assignedStaffCount} staff
                </span>
              </div>

              <div className="mt-4">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5">
                  Granted Capabilities ({r.permissions.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {r.permissions.length === 0 ? (
                    <span className="text-xs text-gray-500 font-mono">None assigned</span>
                  ) : (
                    r.permissions.slice(0, 5).map((p) => (
                      <span
                        key={p}
                        className="text-[10px] font-mono bg-ink px-2 py-0.5 rounded border border-white/10 text-gray-300"
                      >
                        {p}
                      </span>
                    ))
                  )}
                  {r.permissions.length > 5 && (
                    <span className="text-[10px] font-mono text-gray-400 self-center">
                      +{r.permissions.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => startEdit(r)}
                className="font-mono text-xs text-brand hover:underline"
              >
                Configure →
              </button>
              {r.name !== "Super Admin" && (
                <button
                  type="button"
                  onClick={() => handleDelete(r.id, r.name)}
                  className="font-mono text-xs text-red-400 hover:text-red-300 ml-3"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
