import { config } from "@core/Config";
import { Context, Data, Effect, Layer } from "effect";
import nodemailer from "nodemailer";

export class NodemailerError extends Data.TaggedError("NodemailerError")<{
  message: string;
}> {}

export class Nodemailer extends Context.Tag("NodemailerService")<
  Nodemailer,
  {
    readonly transporter: nodemailer.Transporter;
  }
>() {}

export const NodemailerProvider = Layer.effect(
  Nodemailer,
  Effect.gen(function* () {
    const { smtp } = yield* config;

    const transporter = yield* Effect.try({
      try: () =>
        nodemailer.createTransport({
          host: smtp.host,
          port: smtp.port,
          secure: smtp.port === 465,
          auth: {
            user: smtp.user,
            pass: smtp.pass,
          },
        }),
      catch: (error) =>
        new NodemailerError({
          message:
            error instanceof Error
              ? error.message
              : "Failed to create transporter",
        }),
    });

    return {
      transporter,
      from: `${smtp.fromName} <${smtp.fromEmail}>`,
    };
  }),
);
