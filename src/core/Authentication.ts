import { Context, Data, Effect } from "effect";
import type { User } from "./User";
import type { CoreError } from "./Error";

export class AuthenticationError extends Data.TaggedError(
  "AuthenticationError",
)<{
  message: string;
}> {}

export type LoginSpecification = {
  email: string;
  password: string;
};

export type CreateUserSpecification = {
  email: string;
  password: string;
  phone_number: string;
  name: string;
  profile_image_url: string | undefined;
};

export class IAuthenticationService extends Context.Tag(
  "AuthenticationService",
)<
  IAuthenticationService,
  {
    login(specification: LoginSpecification): Effect.Effect<User, CoreError>;
    register(
      specification: CreateUserSpecification,
    ): Effect.Effect<User, CoreError>;
  }
>() {}

