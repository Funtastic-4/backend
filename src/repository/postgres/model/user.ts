import { integer, pgTable, varchar, text } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: integer().primaryKey(),
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
  profile_image_url: text(),
});

export type SelectUser = typeof user.$inferSelect;
