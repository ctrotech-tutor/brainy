CREATE TYPE "public"."broadcast_status" AS ENUM('DRAFT', 'PROCESSING', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."newsletter_status" AS ENUM('PENDING', 'ACTIVE', 'UNSUBSCRIBED');--> statement-breakpoint
CREATE TABLE "newsletter_broadcasts" (
	"id" text PRIMARY KEY NOT NULL,
	"subject" text NOT NULL,
	"content" text NOT NULL,
	"author_id" text,
	"status" "broadcast_status" DEFAULT 'DRAFT' NOT NULL,
	"recipients_count" integer DEFAULT 0,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"status" "newsletter_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"verified_at" timestamp,
	"unsubscribed_at" timestamp,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email"),
	CONSTRAINT "newsletter_subscribers_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "newsletter_broadcasts" ADD CONSTRAINT "newsletter_broadcasts_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;