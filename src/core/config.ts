import { Config, Effect } from "effect";

export const config = Effect.gen(function* () {
  return {
    port: yield* Config.number("PORT").pipe(Config.withDefault(8000)),
    databaseUrl: yield* Config.string("DATABASE_URL"),
    smtp: {
      host: yield* Config.string("SMTP_HOST"),
      port: yield* Config.number("SMTP_PORT").pipe(Config.withDefault(587)),
      user: yield* Config.string("SMTP_USER"),
      pass: yield* Config.string("SMTP_PASSWORD"),
      fromName: yield* Config.string("SMTP_FROM_NAME"),
      fromEmail: yield* Config.string("SMTP_FROM_EMAIL"),
    },
  };
});
