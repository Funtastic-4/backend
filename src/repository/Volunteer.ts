import { CoreErrorConstructors } from "@core/Error";
import { Effect, Layer } from "effect";
import { PostgresDatabase } from "./postgres/Database";
import { IdGenerator } from "@core/IdGenerator";
import { volunteer_request, volunteer } from "./postgres/schema/Volunteer";
import {
  IVolunteerRequestRepository,
  VolunteerRequest,
  IVolunteerRepository,
  Volunteer,
} from "@core/Volunteer";
import { and, eq, isNotNull } from "drizzle-orm";

export const VolunteerRequestRepository = Layer.effect(
  IVolunteerRequestRepository,
  Effect.gen(function* ($) {
    const db = yield* $(PostgresDatabase);
    let idGenerator = yield* IdGenerator;

    return {
      request: (spec: {
        reason: string;
        institution: string | undefined;
        userId: number;
      }) =>
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
                  user_id: spec.userId,
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

export const VolunteerRepository = Layer.effect(
  IVolunteerRepository,
  Effect.gen(function* ($) {
    const db = yield* $(PostgresDatabase);
    let idGenerator = yield* IdGenerator;

    return {
      create: (spec: {
        organization_id: number | null;
        verified_at: Date | null;
      }) =>
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
                .insert(volunteer)
                .values({
                  external_id: externalId,
                  organization_id: spec.organization_id,
                  verified_at: spec.verified_at,
                })
                .returning(),
            catch: (error) =>
              CoreErrorConstructors.database(
                "Failed to create volunteer",
                error instanceof Error ? error : undefined,
              ),
          });

          if (!insertedRows[0]) {
            return yield* CoreErrorConstructors.internal_error();
          }

          return insertedRows[0] as Volunteer;
        }),
      getById(id: number) {
        return Effect.gen(function* () {
          let result = yield* Effect.tryPromise({
            try: () =>
              db
                .select()
                .from(volunteer)
                .where(
                  and(isNotNull(volunteer.deleted_at), eq(volunteer.id, id)),
                )
                .limit(1),
            catch: (e) =>
              CoreErrorConstructors.database(
                "Failed to fetch volunteer",
                e instanceof Error ? e : undefined,
              ),
          });

          if (!result[0]) {
            return yield* CoreErrorConstructors.notFound(
              "Failed to fetch volunteer",
              id,
            );
          }
          return result[0] as Volunteer;
        });
      },
      getByExternalId(externalId: string) {
        return Effect.gen(function* () {
          let result = yield* Effect.tryPromise({
            try: () =>
              db
                .select()
                .from(volunteer)
                .where(
                  and(
                    isNotNull(volunteer.deleted_at),
                    eq(volunteer.external_id, externalId),
                  ),
                )
                .limit(1),
            catch: (e) =>
              CoreErrorConstructors.database(
                "Failed to fetch volunteer",
                e instanceof Error ? e : undefined,
              ),
          });

          if (!result[0]) {
            return yield* CoreErrorConstructors.notFound(
              "Failed to fetch volunteer",
              externalId,
            );
          }
          return result[0] as Volunteer;
        });
      },
    };
  }),
);
