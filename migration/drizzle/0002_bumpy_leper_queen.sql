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
CREATE INDEX "event_review_external_id_idx" ON "event_review" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "site_review_external_id_idx" ON "site_review" USING btree ("external_id");