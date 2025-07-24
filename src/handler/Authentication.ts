import { effectValidator } from "@hono/effect-validator";
import { Hono } from "hono";
import * as Schema from "effect/Schema";
import * as v from "valibot";
import { CoreErrors } from "@core/Error";
import { createSuccessResponse } from "@core/Responder";
import { Effect } from "effect";
import { ServiceLayer } from "@core/Layer";
import { IAuthenticationService } from "@core/Authentication";

const app = new Hono();

const LoginRequestSpecification = Schema.Struct({
  email: Schema.String,
  password: Schema.String,
});

const RegisterRequestSpecification = Schema.Struct({
  email: Schema.String,
  password: Schema.String,
  phone_number: Schema.String,
  name: Schema.String,
  profile_image_url: Schema.optional(Schema.String),
});

const EmailSchema = v.pipe(v.string(), v.email());

app.post(
  "/login",
  effectValidator("json", LoginRequestSpecification),
  async (c) => {
    let validatedBody = c.req.valid("json");
    let isEmailValid = v.safeParse(EmailSchema, validatedBody.email);
    if (!isEmailValid.success) {
      throw CoreErrors.validation("email", "Invalid email format");
    }

    const result = await Effect.runPromise(
      Effect.gen(function* () {
        let authenticationService = yield* IAuthenticationService;
        const user = yield* authenticationService.login(validatedBody);
        return user;
      }).pipe(Effect.provide(ServiceLayer)),
    );

    return c.json(createSuccessResponse(result, "Login successful", 200));
  },
);

app.post(
  "/register",
  effectValidator("json", RegisterRequestSpecification),
  async (c) => {
    const validatedBody = c.req.valid("json");
    let isEmailValid = v.safeParse(EmailSchema, validatedBody.email);
    if (!isEmailValid.success) {
      throw CoreErrors.validation("email", "Invalid email format");
    }

    const result = await Effect.runPromise(
      Effect.gen(function* () {
        let authenticationService = yield* IAuthenticationService;
        const result = yield* authenticationService.register({
          email: validatedBody.email,
          password: validatedBody.password,
          phone_number: validatedBody.phone_number,
          name: validatedBody.name,
          profile_image_url: validatedBody.profile_image_url,
        });
        return result;
      }).pipe(Effect.provide(ServiceLayer)),
    );

    return c.json(
      createSuccessResponse(result, "Register successful", 201),
      201,
    );
  },
);

export default app;
