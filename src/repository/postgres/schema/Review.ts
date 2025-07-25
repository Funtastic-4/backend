import { pgTable, varchar, serial, integer, index } from "drizzle-orm/pg-core";

export const event_review = pgTable(
  "event_review",
  {
    id: serial().primaryKey(),
    external_id: varchar({
      length: 12,
    })
      .unique()
      .notNull(),
    event_id: varchar({
      length: 12,
    }).notNull(),
    user_id: varchar({
      length: 12,
    }).notNull(),
    scale: integer().notNull(),
  },
  (t) => [index("event_review_external_id_idx").on(t.external_id)],
);

export const site_review = pgTable(
  "site_review",
  {
    id: serial().primaryKey(),
    external_id: varchar({
      length: 12,
    })
      .unique()
      .notNull(),
    site_id: varchar({
      length: 12,
    }).notNull(),
    event_id: varchar({
      length: 12,
    }).notNull(),
    scale: integer().notNull(),
  },
  (t) => [index("site_review_external_id_idx").on(t.external_id)],
);

