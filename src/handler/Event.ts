import { type AuthUser } from "@core/Authentication";
import { IEventService } from "@core/Event";
import { ServiceLayer } from "@core/Layer";
import { createSuccessResponse } from "@core/Responder";
import { effectValidator } from "@hono/effect-validator";
import { Effect } from "effect";
import * as Schema from "effect/Schema";
import { Hono } from "hono";

const app = new Hono();

const RegisterEventSpecification = Schema.Struct({
  eventExternalId: Schema.String,
});

app.get("/:externalId", async (c) => {
  const externalId = c.req.param("externalId");

  const result = await Effect.runPromise(
    Effect.gen(function* () {
      const eventService = yield* IEventService;
      return yield* eventService.getEvent(externalId);
    }).pipe(Effect.provide(ServiceLayer)),
  );

  return c.json(createSuccessResponse(result, "Event retrieved", 200), 200);
});

app.get("/user/events", async (c) => {
  const result = await Effect.runPromise(
    Effect.gen(function* () {
      const eventService = yield* IEventService;
      const auth: AuthUser = { externalId: "dummy-user" };
      return yield* eventService.getUserEvent(auth);
    }).pipe(Effect.provide(ServiceLayer)),
  );

  return c.json(
    createSuccessResponse(result, "User events retrieved", 200),
    200,
  );
});

app.post(
  "/register",
  effectValidator("json", RegisterEventSpecification),
  async (c) => {
    const validatedBody = c.req.valid("json");

    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const eventService = yield* IEventService;
        const auth: AuthUser = { externalId: "dummy-user" };
        return yield* eventService.registerEvent(
          validatedBody.eventExternalId,
          auth,
        );
      }).pipe(Effect.provide(ServiceLayer)),
    );

    return c.json(
      createSuccessResponse(result, "Event registration successful", 201),
      201,
    );
  },
);

export default app;
