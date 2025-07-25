import { Context, Effect } from "effect";
import { Base } from "./Base";
import type { CoreError } from "./Error";

export class VolunteerRequest extends Base {
  declare id: number;
  declare external_id: string;
  declare reason: string;
  declare institution: string | undefined;
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
    }): Effect.Effect<VolunteerRequest, CoreError>;
  }
>() {}
