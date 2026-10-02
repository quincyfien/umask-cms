import type {
  EventKind,
  LocationType,
  ProgramStatus,
  ProjectStatus,
} from "@prisma/client";

export type ContentDetails = {
  programStatus?: ProgramStatus;
  projectStatus?: ProjectStatus;
  eventKind?: EventKind;
  startAt?: string;
  endAt?: string;
  locationType?: LocationType;
  venueAddress?: string;
  onlineLink?: string;
  registrationEnabled?: boolean;
  capacity?: number;
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
