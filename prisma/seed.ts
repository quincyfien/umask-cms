import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";
import {
  PERMISSION_KEYS,
  PERMISSION_DESCRIPTIONS,
} from "../src/lib/permissions";

const prisma = new PrismaClient();

async function main() {
  for (const key of PERMISSION_KEYS) {
    await prisma.permission.upsert({
      where: { key },
      create: { key, description: PERMISSION_DESCRIPTIONS[key] ?? "" },
      update: { description: PERMISSION_DESCRIPTIONS[key] ?? "" },
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
