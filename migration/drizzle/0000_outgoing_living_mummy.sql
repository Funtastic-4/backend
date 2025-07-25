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
