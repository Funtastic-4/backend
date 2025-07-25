import {
  pgTable,
  varchar,
  text,
  timestamp,
  serial,
  numeric,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { baseSchema } from "./Base";

export const event = pgTable(
  "event",
  {
    id: serial().primaryKey(),
    external_id: varchar({
      length: 12,
    })
      .unique()
      .notNull(),
    title: varchar({
      length: 255,
    }).notNull(),
    start_date_time: timestamp().notNull(),
    end_date_time: timestamp().notNull(),
    location: text().notNull(),
    description: text().notNull(),
    registration_fee: integer(),
    volunteer_id: integer(),
    organization_id: integer(),
    site_id: integer(),
    ...baseSchema,
  },
  (t) => [index("event_external_id_idx").on(t.external_id)],
);

export const event_to_user = pgTable(
  "event_to_user",
  {
    id: serial().primaryKey(),
    external_id: varchar({
      length: 12,
    })
      .unique()
      .notNull(),
    event_id: integer().notNull(),
    user_id: integer().notNull(),
  },
  (t) => [index("event_to_user_external_id_idx").on(t.external_id)],
);
