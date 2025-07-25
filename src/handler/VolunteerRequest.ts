import { type AuthUser } from "@core/Authentication";
import { ServiceLayer } from "@core/Layer";
import { IVolunteerRequestService } from "@core/Volunteer";
import { effectValidator } from "@hono/effect-validator";
import { Effect } from "effect";
import * as Schema from "effect/Schema";
import { Hono } from "hono";
import { createSuccessResponse } from "@core/Responder";

const app = new Hono();

const RequestVolunteerSpecification = Schema.Struct({
  reason: Schema.String,
  institution: Schema.optional(Schema.String),
});

app.post(
  "/",
  effectValidator("json", RequestVolunteerSpecification),
  async (c) => {
    let validatedBody = c.req.valid("json");

    const result = await Effect.runPromise(
      Effect.gen(function* () {
        let volunteerService = yield* IVolunteerRequestService;

        const auth: AuthUser = { externalId: "dummy-user" };

        return yield* volunteerService.create(
          {
            reason: validatedBody.reason,
            institution: validatedBody.institution,
          },
          auth,
        );
      }).pipe(Effect.provide(ServiceLayer)),
    );

    return c.json(
      createSuccessResponse(result, "Volunteer request created", 201),
      201,
    );
  },
);

export default app;
