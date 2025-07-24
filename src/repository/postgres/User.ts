import { IUserRepository, User } from "@core/User";
import { Effect, Layer } from "effect";
import { PostgresDatabase } from "./Database";
import { user } from "./schema/User";
import { and, eq, isNull } from "drizzle-orm";
import { CoreErrorConstructors, CoreErrors } from "@core/Error";
import { IdGenerator } from "@core/IdGenerator";

export const PostgresUserRepository = Layer.effect(
  IUserRepository,
  Effect.gen(function* () {
    let db = yield* PostgresDatabase;
    let idGenerator = yield* IdGenerator;
    return {
      getById(id: number) {
        return Effect.gen(function* () {
          const result = yield* Effect.tryPromise({
            try: () =>
              db
                .select()
                .from(user)
                .where(and(isNull(user.deleted_at), eq(user.id, id)))
                .limit(1),
            catch: (e) =>
              CoreErrorConstructors.database(
                "Failed to fetch user",
                e instanceof Error ? e : undefined,
              ),
          });

          if (!result[0]) {
            return yield* CoreErrors.notFound("user", id);
          }
          return result[0] as User;
        });
      },
      getByEmail(email: string) {
        return Effect.gen(function* () {
          const result = yield* Effect.tryPromise({
            try: () =>
              db
                .select()
                .from(user)
                .where(and(isNull(user.deleted_at), eq(user.email, email)))
                .limit(1),
            catch: (e) =>
              CoreErrorConstructors.database(
                "Failed to fetch user",
                e instanceof Error ? e : undefined,
              ),
          });

          if (!result[0]) {
            return yield* CoreErrors.notFound("user", email);
          }

          return result[0] as User;
        });
      },
      getByPhoneNumber(phoneNumber: string) {
        return Effect.gen(function* () {
          const result = yield* Effect.tryPromise({
            try: () =>
              db
                .select()
                .from(user)
                .where(
                  and(
                    isNull(user.deleted_at),
                    eq(user.phone_number, phoneNumber),
                  ),
                )
                .limit(1),
            catch: (e) =>
              CoreErrorConstructors.database(
                "Failed to fetch user",
                e instanceof Error ? e : undefined,
              ),
          });

          if (!result[0]) {
            return yield* CoreErrors.notFound("user", phoneNumber);
          }

          return result[0] as User;
        });
      },
      getByExternalId(externalId: string) {
        return Effect.gen(function* () {
          const result = yield* Effect.tryPromise({
            try: () =>
              db
                .select()
                .from(user)
                .where(
                  and(
                    isNull(user.deleted_at),
                    eq(user.external_id, externalId),
                  ),
                )
                .limit(1),
            catch: (e) =>
              CoreErrorConstructors.database(
                "Failed to fetch user",
                e instanceof Error ? e : undefined,
              ),
          });

          if (!result[0]) {
            return yield* CoreErrors.notFound("user", externalId);
          }

          return result[0] as User;
        });
      },
      create(specification) {
        return Effect.gen(function* () {
          const externalId = yield* idGenerator
            .generate()
            .pipe(
              Effect.mapError((idError) =>
                CoreErrorConstructors.database(
                  `Failed to generate ID: ${idError.message}`,
                ),
              ),
            );
          const result = yield* Effect.tryPromise({
            try: () =>
              db
                .insert(user)
                .values({
                  external_id: externalId,
                  email: specification.email,
                  phone_number: specification.phone_number,
                  name: specification.name,
                  profile_image_url: specification.profile_image_url,
                  password: specification.hashedPassword,
                })
                .returning(),
            catch: (e) =>
              CoreErrorConstructors.database(
                "Failed to create user",
                e instanceof Error ? e : undefined,
              ),
          });

          if (!result[0]) {
            return yield* CoreErrors.database(
              "Failed to insert user - no result returned",
            );
          }

          return result[0] as User;
        });
      },
    };
  }),
);
