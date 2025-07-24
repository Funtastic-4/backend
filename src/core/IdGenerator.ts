import { Context, Data, Effect, Layer } from "effect";
import { customAlphabet } from "nanoid";

export class IdGeneratorError extends Data.TaggedError(
  "VerificationCodeError",
)<{
  message: string;
}> { }

export class IdGenerator extends Context.Tag("IdGeneratorService")<
  IdGenerator,
  {
    generate(): Effect.Effect<string, IdGeneratorError>;
  }
>() { }

export const NanoIdGenerator = Layer.succeed(
  IdGenerator,
  {
    generate() {
      const nanoid = customAlphabet("1234567890abcdef", 12);
      return Effect.sync(nanoid);
    }
  },
);
