import { Config, Effect, Layer, Logger, LogLevel } from "effect";

const LOG_LEVEL = Config.logLevel("LOG_LEVEL").pipe(
  Config.withDefault(LogLevel.Info),
);

const LogLevelLive = LOG_LEVEL.pipe(
  Effect.map((level) => Logger.minimumLogLevel(level)),
  Layer.unwrapEffect,
);

export const LoggerLive = Layer.merge(Logger.json, LogLevelLive);
