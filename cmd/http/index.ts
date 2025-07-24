import { Hono } from "hono";
import { Effect } from "effect";
import { config } from "@core/Config";
import { LoggerLive } from "@core/Logger";
import { BunSQLDatabase } from "@repository/postgres/Database";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono();
app.use(secureHeaders())


export const server = Effect.gen(function* () {
  const { port } = yield* config;
  yield* Effect.log(`Server starting on port ${port}`);
  yield* Effect.log("Database connected");

  return {
    fetch: app.fetch,
    port: port,
  };
});

export default Effect.runSync(
  server.pipe(Effect.provide(LoggerLive), Effect.provide(BunSQLDatabase)),
);
