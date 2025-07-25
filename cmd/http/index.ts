import { Hono } from "hono";
import { Effect } from "effect";
import { config } from "@core/Config";

import { secureHeaders } from "hono/secure-headers";
import { MainLayer } from "@core/Layer";
import { CoreError, errorCodeToHttpStatus, type ErrorCode } from "@core/Error";

import authHandler from "@handler/Authentication";
import volunteerRequestHandler from "@handler/VolunteerRequest";
import organizationRequestHandler from "@handler/OrganizationRequest";
import eventHandler from "@handler/Event";

import { createSuccessResponse } from "@core/Responder";
import { logger } from "hono/logger";

const app = new Hono().basePath("/api/v1");
app.use(secureHeaders());
app.use(logger());

app.onError((err, c) => {
  console.log(err);
  let type: ErrorCode = "internal_error";
  let message = "Internal server error";

  const castedErr = err as CoreError;

  if (castedErr.type) {
    type = castedErr.type;
    message = castedErr.message;
  }

  const coreError = new CoreError({
    message,
    type,
  });

  const status = errorCodeToHttpStatus[coreError.type];

  return c.json(
    {
      code: status,
      success: false,
      message: coreError.message,
      error: {
        type: coreError.type,
      },
    },
    status,
  );
});

app.notFound((c) => {
  return c.json(
    {
      code: 404,
      success: false,
      error: {
        type: "not_found",
        message: "Not found",
      },
    },
    404,
  );
});

app.get("/healthcheck", (c) => {
  return c.json(createSuccessResponse(undefined, "Service is running...", 200));
});

app.route("/auth", authHandler);
app.route("/volunteer-request", volunteerRequestHandler);
app.route("/organization-request", organizationRequestHandler);
app.route("/event", eventHandler);

export const server = Effect.gen(function* () {
  const { port } = yield* config;
  yield* Effect.log(`Server starting on port ${port}`);
  yield* Effect.log("Database connected");

  return {
    fetch: app.fetch,
    port: port,
  };
});

export default Effect.runSync(server.pipe(Effect.provide(MainLayer)));
