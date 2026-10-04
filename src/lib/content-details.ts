import type {
  EventKind,
  LocationType,
  ProgramStatus,
  ProjectStatus,
} from "@prisma/client";

export type ContentPartner = {
  name: string;
  logo?: string;
  url?: string;
};

export type ContentDetails = {
  programStatus?: ProgramStatus;
  applicationStartAt?: string;
  applicationCloseAt?: string;
  programStartAt?: string;
  programEndAt?: string;
  eligibility?: string[];
  deliveryMode?: LocationType;

  projectStatus?: ProjectStatus;
  doi?: string;
  objectives?: string[];
  methodology?: string;
  findings?: string;
  partners?: ContentPartner[];
  leads?: string[];
  deliverables?: string[];
  relatedProjectIds?: string[];
  capabilities?: string[];

  eventKind?: EventKind;
  startAt?: string;
  endAt?: string;
  locationType?: LocationType;
  venueAddress?: string;
  onlineLink?: string;
  organizer?: string;
  registrationEnabled?: boolean;
  capacity?: number;

  byline?: string;
  publicationDate?: string;
  excerpt?: string;
};

export function detailsToColumns(details?: ContentDetails) {
  return {
    programStatus: details?.programStatus,
    projectStatus: details?.projectStatus,
    eventKind: details?.eventKind,
    startAt: details?.startAt ? new Date(details.startAt) : undefined,
    endAt: details?.endAt ? new Date(details.endAt) : undefined,
    locationType: details?.locationType,
    venueAddress: details?.venueAddress,
    onlineLink: details?.onlineLink,
    registrationEnabled: details?.registrationEnabled,
    capacity: details?.capacity,
    excerpt: details?.excerpt,
    details: details ?? undefined,
  };
}
