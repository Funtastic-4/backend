import { Context, Effect } from "effect";
import { Base } from "./Base";
import type { CoreError } from "./Error";

export class User extends Base {
  declare id: number;
  declare external_id: string;
  declare email: string;
  declare password?: string;
  declare phone_number: string;
  declare name: string;
  declare profile_image_url: string | undefined;
  declare verify_at: Date | null;

  isVerified(): boolean {
    return this.verify_at !== null;
  }
}

export type CreateUserSpecification = {
  email: string;
  hashedPassword: string;
  phone_number: string;
  name: string;
  profile_image_url: string | undefined;
};

export type LoginSpecification = {
  email: string;
  password: string;
};

export class IUserRepository extends Context.Tag("UserRepository")<
  IUserRepository,
  {
    getById(id: number): Effect.Effect<User, CoreError>;
    getByEmail(email: string): Effect.Effect<User, CoreError>;
    getByPhoneNumber(phoneNumber: string): Effect.Effect<User, CoreError>;
    getByExternalId(externalId: string): Effect.Effect<User, CoreError>;
    create(
      specification: CreateUserSpecification,
    ): Effect.Effect<User, CoreError>;
  }
>() {}

export class IUserService extends Context.Tag("UserService")<
  IUserService,
  {}
>() {}
