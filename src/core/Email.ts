import { Context, Data, Effect } from "effect";

export class EmailError extends Data.TaggedError("EmailError")<{
  message: string;
}> { }

export class Email extends Context.Tag("EmailService")<
  Email,
  {
    readonly sendVerificationEmail: (
      email: string,
      subject: string,
      verificationCode: string,
    ) => Effect.Effect<void, EmailError>;
  }
>() { }

