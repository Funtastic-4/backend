import { Context, Effect } from "effect";
import { Base } from "./Base";
import type { CoreError } from "./Error";
import type { AuthUser } from "./Authentication";

export class VolunteerRequest extends Base {
  declare id: number;
  declare external_id: string;
  declare reason: string;
  declare institution: string | undefined;
  declare user_id: number;
}

export class Volunteer extends Base {
  declare id: number;
  declare external_id: string;
  declare organization_id: number | null;
  declare verified_at: Date | null;
}

export class IVolunteerRequestRepository extends Context.Tag(
  "VolunteerRequestRepository",
)<
  IVolunteerRequestRepository,
  {
    request(specification: {
      reason: string;
      institution: string | undefined;
      userId: number;
    }): Effect.Effect<VolunteerRequest, CoreError>;
  }
>() {}

export class IVolunteerRequestService extends Context.Tag(
  "VolunteerRequestService",
)<
  IVolunteerRequestService,
  {
    create(
      specification: {
        reason: string;
        institution: string | undefined;
      },
      auth: AuthUser,
    ): Effect.Effect<VolunteerRequest, CoreError>;
  }
>() {}

export class IVolunteerRepository extends Context.Tag("VolunteerRepository")<
  IVolunteerRepository,
  {
    create(specification: {
      organization_id: number | null;
      verified_at: Date | null;
    }): Effect.Effect<Volunteer, CoreError>;
    getById(id: number): Effect.Effect<Volunteer, CoreError>;
    getByExternalId(externalId: string): Effect.Effect<Volunteer, CoreError>;
  }
>() {}
