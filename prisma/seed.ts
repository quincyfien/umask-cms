import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";
import {
  PERMISSION_KEYS,
  PERMISSION_DESCRIPTIONS,
} from "../src/lib/permissions";

const prisma = new PrismaClient();

const CONTENT_ADMIN_PERMISSIONS = [
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
];

async function main() {
  for (const key of PERMISSION_KEYS) {
    await prisma.permission.upsert({
      where: { key },
      create: { key, description: PERMISSION_DESCRIPTIONS[key] ?? "" },
      update: { description: PERMISSION_DESCRIPTIONS[key] ?? "" },
    });
  }

  const contentAdmin = await prisma.role.upsert({
    where: { name: "Content Admin" },
    create: {
      name: "Content Admin",
      description: "Full content CRUD and publishing with no administrative access.",
      permissions: {
        create: CONTENT_ADMIN_PERMISSIONS.map((permissionId) => ({ permissionId })),
      },
    },
    update: {},
  });

  for (const permissionId of CONTENT_ADMIN_PERMISSIONS) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: contentAdmin.id, permissionId } },
      create: { roleId: contentAdmin.id, permissionId },
      update: {},
    });
  }

  const email = process.env.SUPER_ADMIN_EMAIL ?? "admin@btrc.example";
  const password = process.env.SUPER_ADMIN_PASSWORD ?? "ChangeMe!123";

  const existing = await prisma.staff.findUnique({ where: { email } });
  if (!existing) {
    await prisma.staff.create({
      data: {
        email,
        name: "Super Admin",
        passwordHash: await hashPassword(password),
        status: "ACTIVE",
        isSuperAdmin: true,
      },
    });
    console.log(`Seeded Super Admin: ${email}`);
  } else {
    console.log(`Super Admin already exists: ${email}`);
  }

  console.log("Seeded Content Admin role");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
