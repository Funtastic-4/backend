import { IAuthenticationService } from "@core/Authentication";
import { CoreError, CoreErrorConstructors } from "@core/Error";
import { Hashing } from "@core/Hashing";
import { IUserRepository } from "@core/User";
import { Effect, Layer } from "effect";

export const AuthenticationService = Layer.effect(
  IAuthenticationService,
  Effect.gen(function* () {
    const userRepository = yield* IUserRepository;
    const hashingService = yield* Hashing;

    return {
      login(specification) {
        return Effect.gen(function* () {
          const storedUser = yield* userRepository
            .getByEmail(specification.email)
            .pipe(Effect.catchAll((e) => Effect.fail(e)));

          const isValidPassword = yield* hashingService
            .verify(storedUser.password || "", specification.password)
            .pipe(
              Effect.mapError(() =>
                CoreErrorConstructors.validation(
                  "Invalid credentials",
                  "email or password",
                ),
              ),
            );

          if (!isValidPassword) {
            return yield* CoreErrorConstructors.validation(
              "Invalid credentials",
              "email or password",
            );
          }

          return storedUser;
        });
      },
      register(specification) {
        return Effect.gen(function* () {
          const existingUserByEmail = yield* userRepository
            .getByEmail(specification.email)
            .pipe(
              Effect.catchAll((err) => {
                if (err instanceof CoreError && err.type === "not_found") {
                  return Effect.succeed(undefined);
                }
                return Effect.fail(err);
              }),
            );

          if (existingUserByEmail) {
            return yield* CoreErrorConstructors.validation(
              "email",
              "already exists",
            );
          }

          const existingUserByPhone = yield* userRepository
            .getByPhoneNumber(specification.phone_number)
            .pipe(
              Effect.catchAll((err) => {
                if (err instanceof CoreError && err.type === "not_found") {
                  return Effect.succeed(undefined);
                }
                return Effect.fail(err);
              }),
            );

          if (existingUserByPhone) {
            return yield* CoreErrorConstructors.validation(
              "phone_number",
              "already exists",
            );
          }

          const hashedPassword = yield* hashingService
            .hash(specification.password)
            .pipe(
              Effect.mapError((hashError) =>
                CoreErrorConstructors.internal_error(
                  `Hashing failed: ${hashError.message}`,
                ),
              ),
            );

          const newUser = yield* userRepository.create({
            email: specification.email,
            phone_number: specification.phone_number,
            name: specification.name,
            profile_image_url: specification.profile_image_url,
            hashedPassword,
          });

          return newUser;
        });
      },
    };
  }),
);
