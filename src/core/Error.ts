import { Data, Effect } from "effect";

export const errorCode = [
  "database",
  "not_found",
  "validation",
  "unauthorized",
  "forbidden",
  "internal_error",
] as const;

export const errorCodeToHttpStatus = {
  database: 500,
  not_found: 404,
  validation: 400,
  unauthorized: 401,
  forbidden: 403,
  internal_error: 500,
} as const;

export type ErrorCode = (typeof errorCode)[number];

export class CoreError extends Data.TaggedError("CoreError")<{
  type: ErrorCode;
  message: string;
  cause?: Error;
}> {}

export const createCoreError = (
  type: ErrorCode,
  message: string,
  cause?: Error,
): Effect.Effect<never, CoreError> => {
  return Effect.fail(
    new CoreError({
      type,
      message,
      ...(cause && { cause }),
    }),
  );
};

export const CoreErrors = {
  database: (message: string, cause?: Error) =>
    createCoreError("database", message, cause),

  notFound: (resource: string, id?: string | number) =>
    createCoreError(
      "not_found",
      `${resource}${id ? ` with id ${id}` : ""} not found`,
    ),

  validation: (field: string, reason: string) =>
    createCoreError("validation", `${field}: ${reason}`),

  unauthorized: (message: string = "Authentication required") =>
    createCoreError("unauthorized", message),

  forbidden: (message: string = "Access denied") =>
    createCoreError("forbidden", message),
};

export const CoreErrorConstructors = {
  database: (message: string, cause?: Error) =>
    new CoreError({
      type: "database",
      message,
      ...(cause && { cause }),
    }),

  notFound: (resource: string, id?: string | number) =>
    new CoreError({
      type: "not_found",
      message: `${resource}${id ? ` with id ${id}` : ""} not found`,
    }),

  validation: (field: string, reason: string) =>
    new CoreError({
      type: "validation",
      message: `${field}: ${reason}`,
    }),

  unauthorized: (message: string = "Authentication required") =>
    new CoreError({
      type: "unauthorized",
      message,
    }),

  forbidden: (message: string = "Access denied") =>
    new CoreError({
      type: "forbidden",
      message,
    }),
  internal_error: (message: string = "Internal error") =>
    new CoreError({
      type: "internal_error",
      message,
    }),
};
