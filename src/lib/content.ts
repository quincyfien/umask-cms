import type { ContentStatus, ContentType, Prisma } from "@prisma/client";
import { prisma } from "./db";

export type TransitionRule = {
  allowed: boolean;
  permission: string | null;
  requireNote: boolean;
};

const TRANSITIONS: Record<ContentStatus, Partial<Record<ContentStatus, TransitionRule>>> = {
  DRAFT: {
    REVIEW: { allowed: true, permission: "content.create", requireNote: false },
    PUBLISHED: { allowed: true, permission: "content.publish", requireNote: false },
    ARCHIVED: { allowed: true, permission: "content.delete", requireNote: false },
  },
  REVIEW: {
    DRAFT: { allowed: true, permission: "content.reject", requireNote: true },
    PUBLISHED: { allowed: true, permission: "content.publish", requireNote: false },
    ARCHIVED: { allowed: true, permission: "content.delete", requireNote: false },
  },
  PUBLISHED: {
    DRAFT: { allowed: true, permission: "content.publish", requireNote: false },
    ARCHIVED: { allowed: true, permission: "content.delete", requireNote: false },
  },
  ARCHIVED: {
    DRAFT: { allowed: true, permission: "content.delete", requireNote: false },
  },
};

export function getTransition(
  from: ContentStatus,
  to: ContentStatus,
): TransitionRule {
  return (
    TRANSITIONS[from]?.[to] ?? {
      allowed: false,
      permission: null,
      requireNote: false,
    }
  );
}

export function getPublishedContent(
  opts: {
    type?: ContentType;
    categoryId?: string;
    tag?: string;
    take?: number;
    skip?: number;
  } = {},
) {
  const where: Prisma.ContentItemWhereInput = {
    status: "PUBLISHED",
    accessLevel: "PUBLIC",
    deletedAt: null,
  };
  if (opts.type) where.type = opts.type;
  if (opts.categoryId) where.categoryId = opts.categoryId;
  if (opts.tag) where.tags = { has: opts.tag };

  return prisma.contentItem.findMany({
    where,
    orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
    take: opts.take ?? 12,
    skip: opts.skip ?? 0,
    include: { category: true },
  });
}

export function getPublishedBySlug(type: ContentType, slug: string) {
  return prisma.contentItem.findFirst({
    where: { type, slug, status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
    include: { category: true, author: { select: { name: true } } },
  });
}

export function getPublishedCount(type: ContentType) {
  return prisma.contentItem.count({
    where: { type, status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
  });
}

export function getAllPublishedSlugs(type: ContentType) {
  return prisma.contentItem.findMany({
    where: { type, status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
    select: { slug: true, publishedAt: true },
  });
}
