CREATE TYPE "public"."contact_type" AS ENUM('instagram', 'email', 'phone_number');--> statement-breakpoint
CREATE TABLE "event" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(12) NOT NULL,
	"title" varchar(255) NOT NULL,
	"start_date_time" timestamp NOT NULL,
	"end_date_time" timestamp NOT NULL,
	"location" text NOT NULL,
	"description" text NOT NULL,
	"registration_fee" numeric(10, 2) NOT NULL,
	"volunteer_id" integer,
	"organization_id" integer,
	"created_by_id" integer,
	"updated_by_id" integer,
	"deleted_by_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "event_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "event_to_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(12) NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "event_to_user_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(12) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"cover_photo_url" text NOT NULL,
	"profile_picture_url" text NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"deleted_by_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "organization_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "organization_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(12) NOT NULL,
	"name" varchar(255) NOT NULL,
	"organization_id" integer NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"deleted_by_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "organization_achievements_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "organization_contact" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(12) NOT NULL,
	"type" "contact_type" NOT NULL,
	"content" text NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"deleted_by_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "organization_contact_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "organization_request" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(12) NOT NULL,
	"contact_email" varchar(255) NOT NULL,
	"contact_phone_number" varchar(20) NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"deleted_by_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "organization_request_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "event_review" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(12) NOT NULL,
	"event_id" varchar(12) NOT NULL,
	"user_id" varchar(12) NOT NULL,
	"scale" integer NOT NULL,
	CONSTRAINT "event_review_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "site_review" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(12) NOT NULL,
	"site_id" varchar(12) NOT NULL,
	"event_id" varchar(12) NOT NULL,
	"scale" integer NOT NULL,
	CONSTRAINT "site_review_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(12) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"name" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"profile_image_url" text,
	"verify_at" timestamp,
	"created_by_id" integer,
	"updated_by_id" integer,
	"deleted_by_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "user_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "verification_code" (
	"id" integer PRIMARY KEY NOT NULL,
	"external_id" varchar(12),
	"email" varchar(255) NOT NULL,
	"verificationCode" varchar(12) NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"deleted_by_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "verification_code_verificationCode_unique" UNIQUE("verificationCode")
);
--> statement-breakpoint
CREATE TABLE "volunteer" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(12) NOT NULL,
	"organization_id" integer,
	"verified_at" timestamp,
	"created_by_id" integer,
	"updated_by_id" integer,
	"deleted_by_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "volunteer_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "volunteer_request" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(12) NOT NULL,
	"reason" text NOT NULL,
	"institution" varchar(255),
	"created_by_id" integer,
	"updated_by_id" integer,
	"deleted_by_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "volunteer_request_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE INDEX "event_external_id_idx" ON "event" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "event_to_user_external_id_idx" ON "event_to_user" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "organization_external_id_idx" ON "organization" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "organization_achievements_external_id_idx" ON "organization_achievements" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "organization_contact_external_id_idx" ON "organization_contact" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "organization_request_external_id_idx" ON "organization_request" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "event_review_external_id_idx" ON "event_review" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "site_review_external_id_idx" ON "site_review" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "user_external_id_idx" ON "user" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "volunteer_external_id_idx" ON "volunteer" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "volunteer_request_external_id_idx" ON "volunteer_request" USING btree ("external_id");