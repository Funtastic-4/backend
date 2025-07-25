import { Context, Effect } from "effect";
import { Base } from "./Base";
import type { CoreError } from "./Error";
import { number } from "valibot";
import type { Event } from "./Event";

export const contactType = ["instagram", "email", "phone_number"] as const;
export type ContactType = (typeof contactType)[number];

export class OrganizationRequest extends Base {
  declare id: number;
  declare external_id: string;
  declare contact_email: string;
  declare contact_phone_number: string;
}

export class Organization extends Base {
  declare id: number;
  declare external_id: string;
  declare name: string;
  declare description: string;
  declare cover_photo_url: string;
  declare profile_picture_url: string;
}

export class OrganizationContact extends Base {
  declare id: number;
  declare external_id: string;
  declare type: ContactType;
  declare content: string;
}

export class OrganizationAchievements extends Base {
  declare id: number;
  declare external_id: string;
  declare name: string;
  declare organization_id: number;
}

export class IOrganizationRequestRepository extends Context.Tag(
  "OrganizationRequestRepository",
)<
  IOrganizationRequestRepository,
  {
    create(specification: {
      contact_email: string;
      contact_phone_number: string;
    }): Effect.Effect<OrganizationRequest, CoreError>;
  }
>() {}

export class IOrganizationRepository extends Context.Tag(
  "OrganizationRepository",
)<
  IOrganizationRepository,
  {
    create(specification: {
      name: string;
      description: string;
      cover_photo_url: string;
      profile_picture_url: string;
    }): Effect.Effect<Organization, CoreError>;
    getById(id: number): Effect.Effect<Organization, CoreError>;
    getByExternalId(externalId: string): Effect.Effect<Organization, CoreError>;
  }
>() {}

export class IOrganizationRequestService extends Context.Tag(
  "OrganizationRequestService",
)<
  IOrganizationRequestService,
  {
    create(specification: {
      contact_email: string;
      contact_phone_number: string;
    }): Effect.Effect<OrganizationRequest, CoreError>;
  }
>() {}
