import { ServiceLayer } from "@core/Layer";
import { IOrganizationRequestService } from "@core/Organization";
import { createSuccessResponse } from "@core/Responder";
import { effectValidator } from "@hono/effect-validator";
import { Effect, Schema } from "effect";
import { Hono } from "hono";

const app = new Hono();

const RequestOrganizationSpecification = Schema.Struct({
  contact_email: Schema.String,
  contact_phone_number: Schema.String,
});

app.post(
  "/",
  effectValidator("json", RequestOrganizationSpecification),
  async (c) => {
    let validatedBody = c.req.valid("json");

    const result = await Effect.runPromise(
      Effect.gen(function* () {
        let organizationService = yield* IOrganizationRequestService;
        return yield* organizationService.create({
          contact_email: validatedBody.contact_email,
          contact_phone_number: validatedBody.contact_phone_number,
        });
      }).pipe(Effect.provide(ServiceLayer)),
    );
    return c.json(
      createSuccessResponse(result, "Organization request created", 201),
      201,
    );
  },
);

export default app;
