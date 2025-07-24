import { Context, Data, Effect, Layer } from "effect";
import { customAlphabet } from "nanoid";

export class IdGeneratorError extends Data.TaggedError("IdGeneratorError")<{
  message: string;
}> {}

export class IdGenerator extends Context.Tag("IdGeneratorService")<
  IdGenerator,
  {
    generate(): Effect.Effect<string, IdGeneratorError>;
  }
>() {}

export const NanoIdGenerator = Layer.succeed(IdGenerator, {
  generate() {
    return Effect.try({
      try: () => {
        const nanoid = customAlphabet("1234567890abcdef", 12);
        return nanoid();
      },
      catch: (e) =>
        new IdGeneratorError({
          message: e instanceof Error ? e.message : "Failed to generate ID",
        }),
    });
  },
});
