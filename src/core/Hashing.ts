import { Context, Data, Effect, Layer } from "effect";

export class HashingError extends Data.TaggedError("HashingError")<{
  message: string;
}> { }

export class HashNotMatchError extends Data.TaggedError("HashNotMatchError")<{
  message: string;
}> { }

export class Hashing extends Context.Tag("HashingService")<
  Hashing,
  {
    readonly hash: (passwd: string) => Effect.Effect<string, HashingError>;
    readonly verify: (
      hash: string,
      passwd: string,
    ) => Effect.Effect<true, HashingError | HashNotMatchError>;
  }
>() { }

export const Argon2Hashing = Layer.succeed(
  Hashing,
  {
    hash(passwd: string) {
      return Effect.tryPromise({
        try: () => Bun.password.hash(passwd),
        catch: (e) =>
          new HashingError({
            message: e instanceof Error ? e.message : "Unknown hashing error",
          }),
      });
    },
    verify(hash: string, passwd: string) {
      return Effect.tryPromise({
        try: () => Bun.password.verify(passwd, hash),
        catch: (e) =>
          new HashingError({
            message:
              e instanceof Error ? e.message : "Unknown verification error",
          }),
      }).pipe(
        Effect.flatMap((isValid) =>
          isValid
            ? Effect.succeed(true as const)
            : Effect.fail(
              new HashNotMatchError({
                message: "Password does not match hash",
              }),
            ),
        ),
      );
    },
  }
);