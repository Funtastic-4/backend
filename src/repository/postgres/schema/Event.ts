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
    registration_fee: numeric({
      precision: 10,
      scale: 2,
    }).notNull(),
    volunteer_id: integer(),
    organization_id: integer(),
    ...baseSchema,
  },
  (t) => [index("event_external_id_idx").on(t.external_id)],
);
