import { prisma } from "./db";

export type Organization = {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  socials: { label: string; url: string }[];
  mapConfig: { latitude: number; longitude: number; embedUrl?: string } | null;
};

const DEFAULT_ORG: Organization = {
  name: "Bamenda Tech Research Center",
  description: "Practical Innovation & Scientific Engineering",
  address: "",
  phone: "",
  email: "",
  whatsapp: "",
  socials: [],
  mapConfig: null,
};

export async function getOrganization(): Promise<Organization> {
  const row = await prisma.organizationSetting.findUnique({ where: { key: "organization" } });
  if (!row) return DEFAULT_ORG;
  return { ...DEFAULT_ORG, ...(row.value as Partial<Organization>) };
}

export async function saveOrganization(org: Organization): Promise<void> {
  await prisma.organizationSetting.upsert({
    where: { key: "organization" },
    create: { key: "organization", value: org as never },
    update: { value: org as never },
  });
}
