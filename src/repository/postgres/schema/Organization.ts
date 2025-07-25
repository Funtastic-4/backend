import {
  pgTable,
  varchar,
  text,
  serial,
  integer,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { baseSchema } from "./Base";

export const contactTypeEnum = pgEnum("contact_type", [
  "instagram",
  "email",
  "phone_number",
]);

export const organization_request = pgTable(
  "organization_request",
  {
    id: serial().primaryKey(),
    external_id: varchar({
      length: 12,
    })
      .unique()
      .notNull(),
    contact_email: varchar({
      length: 255,
    }).notNull(),
    contact_phone_number: varchar({
      length: 20,
    }).notNull(),
    ...baseSchema,
  },
  (t) => [index("organization_request_external_id_idx").on(t.external_id)],
);

export const organization = pgTable(
  "organization",
  {
    id: serial().primaryKey(),
    external_id: varchar({
      length: 12,
    })
      .unique()
      .notNull(),
    name: varchar({
      length: 255,
    }).notNull(),
    description: text().notNull(),
    cover_photo_url: text().notNull(),
    profile_picture_url: text().notNull(),
    ...baseSchema,
  },
  (t) => [index("organization_external_id_idx").on(t.external_id)],
);

export const organization_contact = pgTable(
  "organization_contact",
  {
    id: serial().primaryKey(),
    external_id: varchar({
      length: 12,
    })
      .unique()
      .notNull(),
    type: contactTypeEnum().notNull(),
    content: text().notNull(),
    ...baseSchema,
  },
  (t) => [index("organization_contact_external_id_idx").on(t.external_id)],
);

export const organization_achievements = pgTable(
  "organization_achievements",
  {
    id: serial().primaryKey(),
    external_id: varchar({
      length: 12,
    })
      .unique()
      .notNull(),
    name: varchar({
      length: 255,
    }).notNull(),
    organization_id: integer().notNull(),
    ...baseSchema,
  },
  (t) => [index("organization_achievements_external_id_idx").on(t.external_id)],
);

