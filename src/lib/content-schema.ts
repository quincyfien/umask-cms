import { z } from "zod";

export const detailsSchema = z
  .object({
    programStatus: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CLOSED"]).optional(),
    applicationStartAt: z.string().datetime().optional(),
    applicationCloseAt: z.string().datetime().optional(),
    programStartAt: z.string().datetime().optional(),
    programEndAt: z.string().datetime().optional(),
    eligibility: z.array(z.string().min(1)).optional(),
    deliveryMode: z.enum(["PHYSICAL", "ONLINE", "HYBRID"]).optional(),

    projectStatus: z.enum(["PLANNED", "ONGOING", "COMPLETED"]).optional(),
    doi: z.string().max(255).optional(),
    objectives: z.array(z.string().min(1)).optional(),
    methodology: z.string().optional(),
    findings: z.string().optional(),
    partners: z
      .array(z.object({ name: z.string(), logo: z.string().optional(), url: z.string().optional() }))
      .optional(),
    leads: z.array(z.string().min(1)).optional(),
    deliverables: z.array(z.string().min(1)).optional(),
    relatedProjectIds: z.array(z.string()).optional(),
    capabilities: z.array(z.string().min(1)).optional(),

    eventKind: z.enum(["EVENT", "WORKSHOP"]).optional(),
    startAt: z.string().datetime().optional(),
    endAt: z.string().datetime().optional(),
    locationType: z.enum(["PHYSICAL", "ONLINE", "HYBRID"]).optional(),
    venueAddress: z.string().max(500).optional(),
    onlineLink: z.string().url().optional(),
    organizer: z.string().max(255).optional(),
    registrationEnabled: z.boolean().optional(),
    capacity: z.number().int().positive().optional(),

    byline: z.string().max(255).optional(),
    publicationDate: z.string().datetime().optional(),
    excerpt: z.string().max(1000).optional(),
  })
  .optional();

export const contentSchema = z.object({
  type: z.enum(["SERVICE", "PROGRAM", "PROJECT", "EVENT", "NEWS", "RESOURCE", "PAGE"]),
  title: z.string().min(1).max(255),
  slug: z.string().max(255).optional(),
  summary: z.string().min(1).max(500),
  body: z.string().max(200000).optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string().min(1).max(40)).max(10).optional(),
  featuredImageId: z.string().optional(),
  attachmentIds: z.array(z.string()).max(10).optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  template: z.enum(["DEFAULT", "FULL_WIDTH", "LANDING_PAGE", "NEWS_ARTICLE"]).optional(),
  isFeatured: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  noIndex: z.boolean().optional(),
  details: detailsSchema,
});
