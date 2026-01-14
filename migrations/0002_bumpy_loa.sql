ALTER TABLE "oauth_accounts" RENAME TO "account";--> statement-breakpoint
ALTER TABLE "sessions" RENAME TO "session";--> statement-breakpoint
ALTER TABLE "users" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "verification_tokens" RENAME TO "verificationToken";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "provider_id" TO "provider";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "provider_user_id" TO "providerAccountId";--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "expires_at" TO "expires";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "email_verified" TO "emailVerified";--> statement-breakpoint
ALTER TABLE "verificationToken" RENAME COLUMN "expires_at" TO "expires";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "verificationToken" DROP CONSTRAINT "verification_tokens_token_unique";--> statement-breakpoint
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_actor_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "course_tutors" DROP CONSTRAINT "course_tutors_tutor_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "courses" DROP CONSTRAINT "courses_created_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "departments" DROP CONSTRAINT "departments_admin_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "faculties" DROP CONSTRAINT "faculties_admin_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "institution_documents" DROP CONSTRAINT "institution_documents_uploaded_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "institution_documents" DROP CONSTRAINT "institution_documents_verified_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "institution_verification_logs" DROP CONSTRAINT "institution_verification_logs_performed_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "institutions" DROP CONSTRAINT "institutions_created_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "institutions" DROP CONSTRAINT "institutions_approved_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "institutions" DROP CONSTRAINT "institutions_verified_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "institutions" DROP CONSTRAINT "institutions_representative_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "oauth_accounts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "quiz_attempts" DROP CONSTRAINT "quiz_attempts_graded_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "sessions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "student_profiles" DROP CONSTRAINT "student_profiles_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tutor_invitations" DROP CONSTRAINT "tutor_invitations_inviter_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "oauth_accounts_provider_id_provider_user_id_pk";--> statement-breakpoint
ALTER TABLE "verificationToken" DROP CONSTRAINT "verification_tokens_identifier_token_pk";--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId");--> statement-breakpoint
ALTER TABLE "verificationToken" ADD CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token");--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "refresh_token" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "access_token" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "expires_at" integer;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "token_type" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "scope" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "id_token" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "session_state" text;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "sessionToken" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "tutor_invitations" ADD COLUMN "expires" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_tutors" ADD CONSTRAINT "course_tutors_tutor_id_user_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_admin_id_user_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculties" ADD CONSTRAINT "faculties_admin_id_user_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institution_documents" ADD CONSTRAINT "institution_documents_uploaded_by_id_user_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institution_documents" ADD CONSTRAINT "institution_documents_verified_by_id_user_id_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institution_verification_logs" ADD CONSTRAINT "institution_verification_logs_performed_by_id_user_id_fk" FOREIGN KEY ("performed_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_approved_by_id_user_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_verified_by_id_user_id_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_representative_id_user_id_fk" FOREIGN KEY ("representative_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_graded_by_id_user_id_fk" FOREIGN KEY ("graded_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tutor_invitations" ADD CONSTRAINT "tutor_invitations_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "tutor_invitations" DROP COLUMN "expires_at";--> statement-breakpoint
ALTER TABLE "verificationToken" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");