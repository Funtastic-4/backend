import type { AuthUser } from "@core/Authentication";
import { IUserRepository } from "@core/User";
import {
  IVolunteerRequestRepository,
  IVolunteerRequestService,
} from "@core/Volunteer";
import { Effect, Layer } from "effect";

export const VolunteerRequestService = Layer.effect(
  IVolunteerRequestService,
  Effect.gen(function* () {
    const userRepository = yield* IUserRepository;
    const volunteerRequestRepository = yield* IVolunteerRequestRepository;
    return {
      create(
        specification: {
          reason: string;
          institution: string | undefined;
        },
        auth: AuthUser,
      ) {
        return Effect.gen(function* () {
          const storedUser = yield* userRepository
            .getByExternalId(auth.externalId)
            .pipe(Effect.catchAll((e) => Effect.fail(e)));
          const result = yield* volunteerRequestRepository
            .request({
              reason: specification.reason,
              institution: specification.institution,
              userId: storedUser.id,
            })
            .pipe(Effect.catchAll((e) => Effect.fail(e)));
          return result;
        });
      },
    };
  }),
);
