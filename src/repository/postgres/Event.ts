import { CoreErrorConstructors } from "@core/Error";
import { Effect, Layer } from "effect";
import { PostgresDatabase } from "./Database";
import { IdGenerator } from "@core/IdGenerator";
import { event, event_to_user } from "./schema/Event";
import {
  IEventRepository,
  Event,
  IEventToUserRepository,
  EventToUser,
} from "@core/Event";
import { and, eq, isNotNull } from "drizzle-orm";

export const EventRepository = Layer.effect(
  IEventRepository,
  Effect.gen(function* () {
    const db = yield* PostgresDatabase;

    return {
      getById(id) {
        return Effect.gen(function* () {
          let result = yield* Effect.tryPromise({
            try: () =>
              db
                .select()
                .from(event)
                .where(and(isNotNull(event.deleted_at), eq(event.id, id))),
            catch: (error) =>
              CoreErrorConstructors.database(
                "Failed to fetch event",
                error instanceof Error ? error : undefined,
              ),
          });

          if (!result[0]) {
            return yield* CoreErrorConstructors.notFound("Event", id);
          }
          return result[0] as Event;
        });
      },
      getByExternalId(externalId) {
        return Effect.gen(function* () {
          let result = yield* Effect.tryPromise({
            try: () =>
              db
                .select()
                .from(event)
                .where(
                  and(
                    isNotNull(event.deleted_at),
                    eq(event.external_id, externalId),
                  ),
                ),
            catch: (error) =>
              CoreErrorConstructors.database(
                "Failed to fetch event",
                error instanceof Error ? error : undefined,
              ),
          });

          if (!result[0]) {
            return yield* CoreErrorConstructors.notFound("Event", externalId);
          }

          return result[0] as Event;
        });
      },
      getByOrganizationId(organizationId) {
        return Effect.gen(function* () {
          let result = yield* Effect.tryPromise({
            try: () =>
              db
                .select()
                .from(event)
                .where(
                  and(
                    isNotNull(event.deleted_at),
                    eq(event.organization_id, organizationId),
                  ),
                ),
            catch: (error) =>
              CoreErrorConstructors.database(
                "Failed to fetch events by organization",
                error instanceof Error ? error : undefined,
              ),
          });

          return result as Event[];
        });
      },
      geyBySiteId(siteId) {
        return Effect.gen(function* () {
          let result = yield* Effect.tryPromise({
            try: () =>
              db
                .select()
                .from(event)
                .where(
                  and(isNotNull(event.deleted_at), eq(event.site_id, siteId)),
                ),
            catch: (error) =>
              CoreErrorConstructors.database(
                "Failed to fetch events by site",
                error instanceof Error ? error : undefined,
              ),
          });
          return result as Event[];
        });
      },
    };
  }),
);

export const EventToUserRepository = Layer.effect(
  IEventToUserRepository,
  Effect.gen(function* () {
    const db = yield* PostgresDatabase;
    let idGenerator = yield* IdGenerator;

    return {
      create: (specification) =>
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
                .insert(event_to_user)
                .values({
                  external_id: externalId,
                  event_id: specification.eventId,
                  user_id: specification.userId,
                })
                .returning(),
            catch: (error) =>
              CoreErrorConstructors.database(
                "Failed to create event to user",
                error instanceof Error ? error : undefined,
              ),
          });

          if (!insertedRows[0]) {
            return yield* CoreErrorConstructors.internal_error();
          }

          return insertedRows[0] as EventToUser;
        }),
      getByEventId(eventId) {
        return Effect.gen(function* () {
          let result = yield* Effect.tryPromise({
            try: () =>
              db
                .select()
                .from(event_to_user)
                .where(eq(event_to_user.event_id, eventId)),
            catch: (error) =>
              CoreErrorConstructors.database(
                "Failed to fetch event to user by event",
                error instanceof Error ? error : undefined,
              ),
          });

          return result as EventToUser[];
        });
      },
      getByUserId(userId) {
        return Effect.gen(function* () {
          let result = yield* Effect.tryPromise({
            try: () =>
              db
                .select()
                .from(event_to_user)
                .where(eq(event_to_user.user_id, userId)),
            catch: (error) =>
              CoreErrorConstructors.database(
                "Failed to fetch event to user by user",
                error instanceof Error ? error : undefined,
              ),
          });

          return result as EventToUser[];
        });
      },
    };
  }),
);

