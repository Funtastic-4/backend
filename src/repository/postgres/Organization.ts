import { CoreErrorConstructors } from "@core/Error";
import { Effect, Layer } from "effect";
import { PostgresDatabase } from "./Database";
import { IdGenerator } from "@core/IdGenerator";
import { organization_request } from "./schema/Organization";
import {
  IOrganizationRequestRepository,
  OrganizationRequest,
} from "@core/Organization";

export const OrganizationRequestRepository = Layer.effect(
  IOrganizationRequestRepository,
  Effect.gen(function* () {
    const db = yield* PostgresDatabase;
    let idGenerator = yield* IdGenerator;

    return {
      create: (spec: { contact_email: string; contact_phone_number: string }) =>
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
                .insert(organization_request)
                .values({
                  external_id: externalId,
                  contact_email: spec.contact_email,
                  contact_phone_number: spec.contact_phone_number,
                })
                .returning(),
            catch: (error) =>
              CoreErrorConstructors.database(
                "Failed to create organization request",
                error instanceof Error ? error : undefined,
              ),
          });

          if (!insertedRows[0]) {
            return yield* CoreErrorConstructors.internal_error();
          }

          return insertedRows[0] as OrganizationRequest;
        }),
    };
  }),
);

