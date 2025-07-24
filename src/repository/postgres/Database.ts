import { config } from "@core/Config";
import { drizzle } from "drizzle-orm/bun-sql";
import { Effect, Layer, Context } from "effect";

export class PostgresDatabase extends Context.Tag("PostgresDatabase")<
  PostgresDatabase,
  ReturnType<typeof drizzle>
>() {}

export const BunSQLDatabase = Layer.effect(
  PostgresDatabase,
  config.pipe(
    Effect.map((c) => drizzle(c.databaseUrl)),
    Effect.tapErrorCause(Effect.logError),
  ),
);
