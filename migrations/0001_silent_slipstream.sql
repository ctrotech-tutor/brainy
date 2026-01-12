CREATE TYPE "public"."accreditation_status" AS ENUM('FULL', 'INTERIM', 'PROVISIONAL', 'DENIED', 'EXPIRED', 'NOT_APPLICABLE');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('ACCREDITATION_CERTIFICATE', 'REGISTRATION_CERTIFICATE', 'AUTHORIZATION_LETTER', 'BUSINESS_LICENSE', 'TAX_CERTIFICATE', 'ID_CARD', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."institution_type" AS ENUM('FEDERAL_UNIVERSITY', 'STATE_UNIVERSITY', 'PRIVATE_UNIVERSITY', 'POLYTECHNIC', 'COLLEGE_OF_EDUCATION', 'TECHNICAL_COLLEGE', 'SECONDARY_SCHOOL', 'TRAINING_ACADEMY', 'RESEARCH_INSTITUTE', 'ONLINE_UNIVERSITY', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."ownership_type" AS ENUM('FEDERAL', 'STATE', 'PRIVATE', 'MISSION', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."student_population" AS ENUM('LESS_THAN_1000', '1000-5000', '5000-10000', '10000-20000', '20000-50000', 'MORE_THAN_50000');--> statement-breakpoint
CREATE TABLE "institution_contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"institution_id" text NOT NULL,
	"full_name" text NOT NULL,
	"position" text,
	"department" text,
	"email" text,
	"phone" text,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "institution_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"institution_id" text NOT NULL,
	"document_type" "document_type" NOT NULL,
	"document_url" text NOT NULL,
	"file_name" text,
	"file_size" integer,
	"mime_type" text,
	"uploaded_by_id" text,
	"verified" boolean DEFAULT false,
	"verified_by_id" text,
	"verification_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "institution_verification_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"institution_id" text NOT NULL,
	"action" text NOT NULL,
	"performed_by_id" text,
	"details" jsonb,
	"previous_status" text,
	"new_status" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "institutions" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "institutions" ALTER COLUMN "status" SET DEFAULT 'PENDING'::text;--> statement-breakpoint
DROP TYPE "public"."institution_status";--> statement-breakpoint
CREATE TYPE "public"."institution_status" AS ENUM('PENDING', 'APPROVED', 'ACTIVE', 'REJECTED', 'SUSPENDED', 'UNDER_REVIEW', 'REQUEST_CHANGES', 'ARCHIVED');--> statement-breakpoint
ALTER TABLE "institutions" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"public"."institution_status";--> statement-breakpoint
ALTER TABLE "institutions" ALTER COLUMN "status" SET DATA TYPE "public"."institution_status" USING "status"::"public"."institution_status";--> statement-breakpoint
ALTER TABLE "institutions" ALTER COLUMN "type" SET DATA TYPE "public"."institution_type" USING "type"::"public"."institution_type";--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "short_name" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "email_domain" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "nuc_code" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "nbte_code" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "ncce_code" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "jamb_code" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "accreditation_number" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "ownership" "ownership_type";--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "lga" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "campus_location" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "google_maps_url" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "website" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "alternative_phone" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "accreditation_status" "accreditation_status";--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "accreditation_date" date;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "accreditation_expiry" date;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "verification_tier" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "verification_method" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "gallery_images" text[];--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "brochure_url" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "mission" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "vision" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "year_established" integer;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "motto" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "faculties_count" integer;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "departments_count" integer;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "student_population" "student_population";--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "academic_staff_count" integer;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "non_academic_staff_count" integer;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "rejection_details" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "verified_by_id" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "representative_id" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "linkedin_url" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "twitter_url" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "facebook_url" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "instagram_url" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "youtube_url" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "academic_session_type" text DEFAULT 'SEMESTER';--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "languages_of_instruction" text[] DEFAULT '{"English"}';--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "popular_programs" text[];--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "last_verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "next_verification_due" timestamp;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "verification_notes" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "approved_at" timestamp;--> statement-breakpoint
ALTER TABLE "institution_contacts" ADD CONSTRAINT "institution_contacts_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institution_documents" ADD CONSTRAINT "institution_documents_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institution_documents" ADD CONSTRAINT "institution_documents_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institution_documents" ADD CONSTRAINT "institution_documents_verified_by_id_users_id_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institution_verification_logs" ADD CONSTRAINT "institution_verification_logs_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institution_verification_logs" ADD CONSTRAINT "institution_verification_logs_performed_by_id_users_id_fk" FOREIGN KEY ("performed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_verified_by_id_users_id_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_representative_id_users_id_fk" FOREIGN KEY ("representative_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;