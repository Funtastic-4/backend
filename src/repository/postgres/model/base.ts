import { integer, timestamp } from "drizzle-orm/pg-core";

export const baseModel = {
  created_by_id: integer(),
  updated_by_id: integer(),
  deleted_by_id: integer(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
};
