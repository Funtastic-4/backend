import { LoggerLive } from "@core/Logger";
import { BunSQLDatabase } from "@repository/postgres/Database";
import { AuthenticationService } from "../../src/service/Authentication";
import { PostgresUserRepository } from "@repository/postgres/User";
import { Argon2Hashing } from "@core/Hashing";
import { NanoIdGenerator } from "@core/IdGenerator";
import { Layer } from "effect";

export const DatabaseLayer = BunSQLDatabase;
export const UtilityLayers = Layer.mergeAll(Argon2Hashing, NanoIdGenerator);

export const RepositoryLayer = PostgresUserRepository.pipe(
  Layer.provide(DatabaseLayer),
  Layer.provide(UtilityLayers),
);

export const ServiceLayer = AuthenticationService.pipe(
  Layer.provide(RepositoryLayer),
  Layer.provide(UtilityLayers),
);

export const MainLayer = Layer.mergeAll(
  LoggerLive,
  DatabaseLayer,
  UtilityLayers,
  RepositoryLayer,
  ServiceLayer,
);
