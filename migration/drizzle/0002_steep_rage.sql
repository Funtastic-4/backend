ALTER TABLE "event" ALTER COLUMN "registration_fee" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "registration_fee" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "volunteer_request" ADD COLUMN "user_id" integer NOT NULL;