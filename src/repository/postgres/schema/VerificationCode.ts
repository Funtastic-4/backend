import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { baseSchema } from "./Base";

export const verificationCode = pgTable("verification_code", {
  id: integer().primaryKey(),
  external_id: varchar({
    length: 12,
  }),
  email: varchar({
    length: 255,
  }).notNull(),
  verificationCode: varchar({ length: 12 }).unique().notNull(),
  ...baseSchema,
});
