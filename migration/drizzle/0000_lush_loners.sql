CREATE TABLE "user" (
	"id" integer PRIMARY KEY NOT NULL,
	"external_id" varchar(12) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"name" varchar(255) NOT NULL,
	"profile_image_url" text,
	CONSTRAINT "user_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number")
);
