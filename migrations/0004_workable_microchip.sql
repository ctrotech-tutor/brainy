CREATE TABLE "marketing_leads" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text,
	"message" text NOT NULL,
	"type" text DEFAULT 'CONTACT' NOT NULL,
	"status" text DEFAULT 'NEW' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
