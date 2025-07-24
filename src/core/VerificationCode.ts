import { Context, Data, Effect, Layer } from "effect";
import { Base } from "./Base";
import { nanoid } from "nanoid";

export class VerificationCodeError extends Data.TaggedError(
  "VerificationCodeError",
)<{
  message: string;
}> { }

export class VerificationCode extends Base {
  declare id: number;
  declare external_id: string;
  declare email: string;
  declare verificationCode: string;
}

export class IVerificationCodeService extends Context.Tag(
  "VerificationService",
)<
  IVerificationCodeService,
  {
    generate(): Effect.Effect<string, VerificationCodeError>;
  }
>() { }

export const VerificationCodeService = Layer.succeed(
  IVerificationCodeService,
  {
    generate() {
      return Effect.sync(() => nanoid(12));
    },
  }
);
