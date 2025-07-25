import { LoggerLive } from "@core/Logger";
import { BunSQLDatabase } from "@repository/postgres/Database";
import { AuthenticationService } from "../../src/service/Authentication";
import { PostgresUserRepository } from "@repository/postgres/User";
import { Argon2Hashing } from "@core/Hashing";
import { NanoIdGenerator } from "@core/IdGenerator";
import { Layer } from "effect";
import { VolunteerRequestService } from "../service/VolunteerRequest";
import { VolunteerRequestRepository } from "../repository/Volunteer";
import { OrganizationRequestRepository } from "@repository/postgres/Organization";
import { OrganizationRequestService } from "../service/Organization";
import {
  EventRepository,
  EventToUserRepository,
} from "@repository/postgres/Event";
import { EventService } from "../service/Event";

export const DatabaseLayer = BunSQLDatabase;
export const UtilityLayers = Layer.mergeAll(Argon2Hashing, NanoIdGenerator);

export const RepositoryLayer = Layer.mergeAll(
  PostgresUserRepository,
  VolunteerRequestRepository,
  OrganizationRequestRepository,
  EventRepository,
  EventToUserRepository,
).pipe(Layer.provide(DatabaseLayer), Layer.provide(UtilityLayers));

export const ServiceLayer = Layer.mergeAll(
  AuthenticationService,
  VolunteerRequestService,
  OrganizationRequestService,
  EventService,
).pipe(Layer.provide(RepositoryLayer), Layer.provide(UtilityLayers));

export const MainLayer = Layer.mergeAll(
  LoggerLive,
  DatabaseLayer,
  UtilityLayers,
  RepositoryLayer,
  ServiceLayer,
);
