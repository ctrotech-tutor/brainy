CREATE TABLE "legal_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"version" text DEFAULT '1.0' NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"updated_by_id" text,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "legal_documents_slug_unique" UNIQUE("slug")
);

ALTER TABLE "legal_documents" ADD CONSTRAINT "legal_documents_updated_by_id_user_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;