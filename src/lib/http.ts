import { ZodError } from "zod";
import { env } from "./env";
import { logger } from "./logger";

export type ProblemDetails = {
  code: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: { field: string; message: string }[];
};

export class ApiError extends Error {
  status: number;
  code: string;
  errors?: { field: string; message: string }[];

  constructor(
    status: number,
    code: string,
    message: string,
    errors?: { field: string; message: string }[],
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

export function problem(
  status: number,
  code: string,
  message: string,
  instance?: string,
  errors?: { field: string; message: string }[],
): Response {
  const body: Record<string, unknown> = {
    type: `${env.siteOrigin}/errors/${code}`,
    title: message,
    status,
    detail: message,
    instance: instance ?? "",
  };
  if (errors) body.errors = errors;
  return Response.json(body, { status });
}

export function validationError(
  errors: { field: string; message: string }[],
  instance?: string,
): Response {
  return problem(400, "VALIDATION_ERROR", "The request is invalid.", instance, errors);
}

export function toErrorResponse(err: unknown, instance?: string): Response {
  if (err instanceof ApiError) {
    if (err.status >= 500) {
      logger.error(`API Error: ${err.message}`, err, { code: err.code, status: err.status, instance });
    }
    return problem(err.status, err.code, err.message, instance, err.errors);
  }
  if (err instanceof ZodError) {
    return validationError(
      err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
      instance,
    );
  }
  logger.error("Unhandled API error", err, { instance });
  return problem(500, "INTERNAL_ERROR", "An unexpected error occurred.", instance);
}
