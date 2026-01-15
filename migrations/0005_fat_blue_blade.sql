ALTER TABLE "marketing_leads" ADD COLUMN "replied_at" timestamp;--> statement-breakpoint
ALTER TABLE "marketing_leads" ADD COLUMN "last_replied_by_id" text;--> statement-breakpoint
ALTER TABLE "marketing_leads" ADD COLUMN "reply_thread" jsonb;--> statement-breakpoint
ALTER TABLE "marketing_leads" ADD CONSTRAINT "marketing_leads_last_replied_by_id_user_id_fk" FOREIGN KEY ("last_replied_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;