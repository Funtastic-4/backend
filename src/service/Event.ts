import type { AuthUser } from "@core/Authentication";
import {
  IEventRepository,
  IEventToUserRepository,
  IEventService,
} from "@core/Event";
import { IUserRepository } from "@core/User";
import { Effect, Layer } from "effect";

export const EventService = Layer.effect(
  IEventService,
  Effect.gen(function* () {
    const eventRepository = yield* IEventRepository;
    const eventToUserRepository = yield* IEventToUserRepository;
    const userRepository = yield* IUserRepository;
    return {
      getEvent(externalId: string) {
        return Effect.gen(function* () {
          const result = yield* eventRepository
            .getByExternalId(externalId)
            .pipe(Effect.catchAll((e) => Effect.fail(e)));
          return result;
        });
      },
      getUserEvent(auth: AuthUser) {
        return Effect.gen(function* () {
          const storedUser = yield* userRepository
            .getByExternalId(auth.externalId)
            .pipe(Effect.catchAll((e) => Effect.fail(e)));
          const eventToUsers = yield* eventToUserRepository
            .getByUserId(storedUser.id)
            .pipe(Effect.catchAll((e) => Effect.fail(e)));
          const events = yield* Effect.all(
            eventToUsers.map((eventToUser) =>
              eventRepository
                .getById(eventToUser.event_id)
                .pipe(Effect.catchAll((e) => Effect.fail(e))),
            ),
          );
          return events;
        });
      },
      registerEvent(eventExternalId: string, auth: AuthUser) {
        return Effect.gen(function* () {
          const storedUser = yield* userRepository
            .getByExternalId(auth.externalId)
            .pipe(Effect.catchAll((e) => Effect.fail(e)));
          const event = yield* eventRepository
            .getByExternalId(eventExternalId)
            .pipe(Effect.catchAll((e) => Effect.fail(e)));
          yield* eventToUserRepository
            .create({
              eventId: event.id,
              userId: storedUser.id,
            })
            .pipe(Effect.catchAll((e) => Effect.fail(e)));
          return event;
        });
      },
    };
  }),
);

