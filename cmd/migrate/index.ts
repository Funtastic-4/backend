import { DatabaseLayer } from "@core/Layer";
import { PostgresDatabase } from "@repository/postgres/Database";
import { migrate } from "drizzle-orm/bun-sql/migrator";
import { Effect } from "effect";
import path from "node:path";

const program = Effect.gen(function* () {
  yield* Effect.log(`Running migration...`);

  let database = yield* PostgresDatabase;

  yield* Effect.tryPromise({
    try: () =>
      migrate(database, {
        migrationsFolder: path.join(process.cwd(), "migration", "drizzle"),
      }),
    catch: (e) => console.log(e),
  });

  yield* Effect.log("Success running migration");
});

Effect.runPromise(program.pipe(Effect.provide(DatabaseLayer)));
