export const PERMISSION_KEYS = [
  "content.create",
  "content.edit.any",
  "content.review",
  "content.publish",
  "content.delete",
  "media.upload",
  "media.manage",
  "media.release",
  "applications.view",
  "applications.manage",
  "contacts.view",
  "contacts.manage",
  "registrations.view",
  "registrations.export",
  "subscribers.view",
  "subscribers.export",
  "org.edit",
  "staff.manage",
  "roles.create",
  "audit.view",
  "ops.view",
  "data.delete",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const SUPER_ADMIN_ONLY = ["settings.manage", "superadmin.transfer"] as const;

export const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  "content.create": "Create and submit content",
  "content.edit.any": "Edit any content",
  "content.review": "Review and reject content",
  "content.publish": "Publish, unpublish and archive content",
  "content.delete": "Permanently delete content",
  "media.upload": "Upload media",
  "media.manage": "Delete and set media visibility",
  "media.release": "Act on flagged files",
  "applications.view": "View applications",
  "applications.manage": "Manage application status",
  "contacts.view": "View contact messages",
  "contacts.manage": "Resolve contact messages",
  "registrations.view": "View event registrations",
  "registrations.export": "Export event registrations",
  "subscribers.view": "View newsletter subscribers",
  "subscribers.export": "Export newsletter subscribers",
  "org.edit": "Edit organization information",
  "staff.manage": "Manage staff accounts and permissions",
  "roles.create": "Create and edit roles",
  "audit.view": "View the audit log",
  "ops.view": "View operations (jobs, flagged files)",
  "data.delete": "Execute data deletion requests",
};

export function isPermissionKey(key: string): key is PermissionKey {
  return (PERMISSION_KEYS as readonly string[]).includes(key);
}
