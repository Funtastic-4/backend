import { CoreErrorConstructors } from "@core/Error";
import { Effect, Layer } from "effect";
import { PostgresDatabase } from "./postgres/Database";
import { IdGenerator } from "@core/IdGenerator";
import { volunteer_request } from "./postgres/schema/Volunteer";
import { IVolunteerRequestRepository, VolunteerRequest } from "@core/Volunteer";

export const VolunteerRequestRepository = Layer.effect(
  IVolunteerRequestRepository,
  Effect.gen(function* ($) {
    const db = yield* $(PostgresDatabase);
    let idGenerator = yield* IdGenerator;

    return {
      request: (spec: { reason: string; institution: string }) =>
        Effect.gen(function* () {
          const externalId = yield* idGenerator
            .generate()
            .pipe(
              Effect.mapError((idError) =>
                CoreErrorConstructors.database(
                  `Failed to generate ID: ${idError.message}`,
                ),
              ),
            );
          const insertedRows = yield* Effect.tryPromise({
            try: () =>
              db
                .insert(volunteer_request)
                .values({
                  external_id: externalId,
                  reason: spec.reason,
                  institution: spec.institution,
                })
                .returning(),
            catch: (error) =>
              CoreErrorConstructors.database(
                "Failed to create volunteer request",
                error instanceof Error ? error : undefined,
              ),
          });

          if (!insertedRows[0]) {
            return yield* CoreErrorConstructors.internal_error();
          }

          return insertedRows[0] as VolunteerRequest;
        }),
    };
  }),
);
