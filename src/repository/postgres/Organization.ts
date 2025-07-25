import { CoreErrorConstructors } from "@core/Error";
import { Effect, Layer } from "effect";
import { PostgresDatabase } from "./Database";
import { IdGenerator } from "@core/IdGenerator";
import { organization_request, organization } from "./schema/Organization";
import {
  IOrganizationRequestRepository,
  OrganizationRequest,
  IOrganizationRepository,
  Organization,
} from "@core/Organization";
import { and, eq, isNotNull } from "drizzle-orm";

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

export const OrganizationRepository = Layer.effect(
  IOrganizationRepository,
  Effect.gen(function* () {
    const db = yield* PostgresDatabase;
    let idGenerator = yield* IdGenerator;

    return {
      create: (spec: {
        name: string;
        description: string;
        cover_photo_url: string;
        profile_picture_url: string;
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
                .insert(organization)
                .values({
                  external_id: externalId,
                  name: spec.name,
                  description: spec.description,
                  cover_photo_url: spec.cover_photo_url,
                  profile_picture_url: spec.profile_picture_url,
                })
                .returning(),
            catch: (error) =>
              CoreErrorConstructors.database(
                "Failed to create organization",
                error instanceof Error ? error : undefined,
              ),
          });

          if (!insertedRows[0]) {
            return yield* CoreErrorConstructors.internal_error();
          }

          return insertedRows[0] as Organization;
        }),
      getById(id) {
        return Effect.gen(function* () {
          let result = yield* Effect.tryPromise({
            try: () =>
              db
                .select()
                .from(organization)
                .where(
                  and(
                    isNotNull(organization.deleted_at),
                    eq(organization.id, id),
                  ),
                ),
            catch: (error) =>
              CoreErrorConstructors.database(
                "Failed to fetch organization",
                error instanceof Error ? error : undefined,
              ),
          });

          if (!result[0]) {
            return yield* CoreErrorConstructors.notFound("Organization", id);
          }
          return result[0] as Organization;
        });
      },
      getByExternalId(externalId) {
        return Effect.gen(function* () {
          let result = yield* Effect.tryPromise({
            try: () =>
              db
                .select()
                .from(organization)
                .where(
                  and(
                    isNotNull(organization.deleted_at),
                    eq(organization.external_id, externalId),
                  ),
                ),
            catch: (error) =>
              CoreErrorConstructors.database(
                "Failed to fetch organization",
                error instanceof Error ? error : undefined,
              ),
          });

          if (!result[0]) {
            return yield* CoreErrorConstructors.notFound(
              "Organization",
              externalId,
            );
          }
          return result[0] as Organization;
        });
      },
    };
  }),
);
