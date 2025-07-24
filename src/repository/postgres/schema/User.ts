import { pgTable, varchar, text, timestamp, serial } from "drizzle-orm/pg-core";
import { baseSchema } from "./Base";

export const user = pgTable("user", {
  id: serial().primaryKey(),
  external_id: varchar({
    length: 12,
  })
    .unique()
    .notNull(),
  email: varchar({
    length: 255,
  })
    .unique()
    .notNull(),
  phone_number: varchar({
    length: 20,
  })
    .unique()
    .notNull(),
  name: varchar({
    length: 255,
  }).notNull(),
  password: text().notNull(),
  profile_image_url: text(),
  verify_at: timestamp(),
  ...baseSchema,
});

export type SelectUser = typeof user.$inferSelect;
