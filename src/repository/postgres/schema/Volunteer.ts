import {
  pgTable,
  varchar,
  timestamp,
  serial,
  integer,
  index,
  text,
} from "drizzle-orm/pg-core";
import { baseSchema } from "./Base";

export const volunteer_request = pgTable(
  "volunteer_request",
  {
    id: serial().primaryKey(),
    external_id: varchar({
      length: 12,
    })
      .unique()
      .notNull(),
    reason: text().notNull(),
    institution: varchar({
      length: 255,
    }),
    ...baseSchema,
  },
  (t) => [index("volunteer_request_external_id_idx").on(t.external_id)],
);

export const volunteer = pgTable(
  "volunteer",
  {
    id: serial().primaryKey(),
    external_id: varchar({
      length: 12,
    })
      .unique()
      .notNull(),
    organization_id: integer(),
    verified_at: timestamp(),
    ...baseSchema,
  },
  (t) => [index("volunteer_external_id_idx").on(t.external_id)],
);
