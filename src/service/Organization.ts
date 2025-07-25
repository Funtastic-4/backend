import {
  IOrganizationRequestRepository,
  IOrganizationRequestService,
} from "@core/Organization";
import { Effect, Layer } from "effect";

export const OrganizationRequestService = Layer.effect(
  IOrganizationRequestService,
  Effect.gen(function* () {
    const organizationRequestRepository = yield* IOrganizationRequestRepository;
    return {
      create(specification: {
        contact_email: string;
        contact_phone_number: string;
      }) {
        return Effect.gen(function* () {
          const result = yield* organizationRequestRepository
            .create({
              contact_email: specification.contact_email,
              contact_phone_number: specification.contact_phone_number,
            })
            .pipe(Effect.catchAll((e) => Effect.fail(e)));
          return result;
        });
      },
    };
  }),
);
