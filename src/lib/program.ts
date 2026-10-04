import type { ProgramStatus } from "@prisma/client";

export type ProgramDetails = {
  applicationStartAt?: string;
  applicationCloseAt?: string;
  programStartAt?: string;
  programEndAt?: string;
};

export type ProgramBadge = {
  status: ProgramStatus;
  label: string;
  applyOpen: boolean;
  closed: boolean;
  cta: string;
};

function ts(v?: string): number | null {
  return v ? new Date(v).getTime() : null;
}

export function computeProgramStatus(details?: ProgramDetails): ProgramStatus {
  const now = Date.now();
  const progEnd = ts(details?.programEndAt);
  const progStart = ts(details?.programStartAt);
  const appClose = ts(details?.applicationCloseAt);

  if (progEnd && now >= progEnd) return "COMPLETED";
  if (progStart && now >= progStart) return "ONGOING";
  if (appClose && now >= appClose) return "CLOSED";
  return "UPCOMING";
}

export function getProgramBadge(details?: ProgramDetails): ProgramBadge {
  const now = Date.now();
  const progEnd = ts(details?.programEndAt);
  const progStart = ts(details?.programStartAt);
  const appClose = ts(details?.applicationCloseAt);
  const appStart = ts(details?.applicationStartAt);

  if (progEnd && now >= progEnd) {
    return { status: "COMPLETED", label: "✓ COMPLETED", applyOpen: false, closed: true, cta: "Program Ended" };
  }
  if (progStart && now >= progStart) {
    const applyOpen = !appClose || now < appClose;
    return {
      status: "ONGOING",
      label: "● ONGOING",
      applyOpen,
      closed: false,
      cta: applyOpen ? "Apply Now" : "Applications Closed (In Progress)",
    };
  }
  if (appClose && now >= appClose) {
    return { status: "CLOSED", label: "CLOSED", applyOpen: false, closed: true, cta: "Applications Closed" };
  }
  if (appStart && now < appStart) {
    const date = new Date(appStart).toLocaleDateString();
    return { status: "UPCOMING", label: "UPCOMING", applyOpen: false, closed: false, cta: `Applications Open ${date}` };
  }
  // between appStart and appClose
  return { status: "UPCOMING", label: "APPLICATIONS OPEN", applyOpen: true, closed: false, cta: "Apply Now" };
}
