CREATE TYPE "public"."notification_type" AS ENUM('INFO', 'SUCCESS', 'WARNING', 'ERROR');
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"recipient_id" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" "notification_type" DEFAULT 'INFO' NOT NULL,
	"link" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_user_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;