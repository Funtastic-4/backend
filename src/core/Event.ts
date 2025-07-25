import { Context, Effect } from "effect";
import { Base } from "./Base";
import { CoreError } from "./Error";
import type { AuthUser } from "./Authentication";

export class Event extends Base {
  declare id: number;
  declare external_id: string;
  declare title: string;
  declare start_date_time: Date;
  declare end_date_time: Date;
  declare location: string;
  declare description: string;
  declare registration_fee: number;
  declare volunteer_id?: number;
  declare organization_id?: number;
  declare site_id?: number;
}

export class EventToUser extends Base {
  declare id: number;
  declare external_id: string;
  declare event_id: number;
  declare user_id: number;
}

export class IEventRepository extends Context.Tag("EventRepository")<
  IEventRepository,
  {
    getById(id: number): Effect.Effect<Event, CoreError>;
    getByExternalId(externalId: string): Effect.Effect<Event, CoreError>;
    getByOrganizationId(
      organizationId: number,
    ): Effect.Effect<Event[], CoreError>;
    geyBySiteId(siteId: number): Effect.Effect<Event[], CoreError>;
  }
>() {}

export class IEventToUserRepository extends Context.Tag("EventToUserRepostory")<
  IEventToUserRepository,
  {
    create(specification: {
      eventId: number;
      userId: number;
    }): Effect.Effect<EventToUser, CoreError>;
    getByEventId(eventId: number): Effect.Effect<EventToUser[], CoreError>;
    getByUserId(userId: number): Effect.Effect<EventToUser[], CoreError>;
  }
>() {}

export class IEventService extends Context.Tag("EventService")<
  IEventService,
  {
    getEvent(externalId: string): Effect.Effect<Event, CoreError>;
    getUserEvent(auth: AuthUser): Effect.Effect<Event[], CoreError>;
    registerEvent(
      eventExternalId: string,
      auth: AuthUser,
    ): Effect.Effect<Event, CoreError>;
  }
>() {}
