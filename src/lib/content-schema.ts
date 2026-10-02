import { z } from "zod";

export const detailsSchema = z
  .object({
    programStatus: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CLOSED"]).optional(),
    projectStatus: z.enum(["PLANNED", "ACTIVE", "COMPLETED"]).optional(),
    eventKind: z.enum(["EVENT", "WORKSHOP"]).optional(),
    startAt: z.string().datetime().optional(),
    endAt: z.string().datetime().optional(),
    locationType: z.enum(["PHYSICAL", "ONLINE", "HYBRID"]).optional(),
    venueAddress: z.string().max(500).optional(),
    onlineLink: z.string().url().optional(),
    registrationEnabled: z.boolean().optional(),
    capacity: z.number().int().positive().optional(),
    excerpt: z.string().max(1000).optional(),
  })
  .optional();

export const contentSchema = z.object({
  type: z.enum(["SERVICE", "PROGRAM", "PROJECT", "EVENT", "NEWS", "RESOURCE", "PAGE"]),
  title: z.string().min(1).max(255),
  slug: z.string().max(255).optional(),
  summary: z.string().max(500).optional(),
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
