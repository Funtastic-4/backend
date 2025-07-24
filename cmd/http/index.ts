import { Hono } from "hono";
import { Effect } from "effect";
import { config } from "@core/Config";

import { secureHeaders } from "hono/secure-headers";
import { MainLayer } from "@core/Layer";
import { CoreError, errorCodeToHttpStatus } from "@core/Error";

import authHandler from "@handler/Authentication";

const app = new Hono().basePath("/api/v1");

app.route("/auth", authHandler);

app.use(secureHeaders());

app.onError((err, c) => {
  if (err instanceof CoreError) {
    const status = errorCodeToHttpStatus[err.type];
    return c.json(
      {
        error: {
          type: err.type,
          message: err.message,
        },
      },
      status,
    );
  }

  return c.json(
    {
      error: {
        type: "internal_error",
        message: "An unexpected error occurred",
      },
    },
    500,
  );
});

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
