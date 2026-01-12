This explains **what** the backend must provide, the data model relationships, core flows, APIs, event/operational concerns, security requirements, and non-functional expectations.
This is written so an you fully understands the *scope*, the *expected behavior*, and the *data relationships* — not a how-to or implementation guide.

Use this as the definitive backend brief to implement the Neon + Drizzle backend and the service layer (Resend for email).

---

# Brainy — Backend Specification (Complete & Final)

## 1 — High-level purpose and goals

Brainy is an **institution-first, multi-tenant academic quiz platform**. The backend’s mission:

* Host canonical application data (institutions, faculties, departments, users, courses, quizzes, attempts, leaderboards, invitations, verification tokens, etc.).
* Provide secure authentication and session management (custom password + OTP flows).
* Enforce role-based access and multi-tenant scoping (each institution is isolated).
* Support progressive role promotion (USER → STUDENT / TUTOR / ADMINS) and invitation workflows.
* Support reliable verification workflows (student/institution email OTPs) and audit trails.
* Provide endpoints for frontend pages, admin consoles (platform/institution), dashboards, and background jobs (leaderboard compute, cleanup).
* Be scalable, observable, and maintainable.

---

## 2 — Principal domain entities & relationships (conceptual)

Below are the key domain objects and how they relate. Think of these as the ER model described in plain language.

### Core entities

* **User**

  * Represents a person with login credentials.
  * Attributes: full name, email, phone, hashed password, `email_verified` flag, primary role (USER/STUDENT/TUTOR/INSTITUTION_ADMIN/FACULTY_ADMIN/PLATFORM_ADMIN), optional links to an institution/faculty/department.
  * Relationship: can have one StudentProfile (if student), can be referenced by invitations, created quizzes, attempts, notifications, audit logs, sessions.

* **Institution**

  * Represents a university/college/school/tutorial.
  * Attributes: name, type, domain(s), contact email, status (PENDING/VERIFIED/ACTIVE/REJECTED), metadata (address, contact), createdAt/updatedAt.
  * Relationship: owns faculties, departments, users, courses, verification tokens, invitations.

* **Faculty**

  * A division within an Institution (e.g., Faculty of Science).
  * Relationship: belongs to one Institution; has many Departments; can have an optional faculty admin (User).

* **Department**

  * A department belonging to a Faculty (e.g., Department of Computer Science).
  * Relationship: belongs to a Faculty (and by extension to an Institution); can have an optional department admin (User); owns courses.

* **StudentProfile**

  * Extra data for student users (matric number optional, facultyId, departmentId, verifiedAt).
  * Relationship: one-to-one with User (for those who are students).

* **TutorInvitation**

  * Invitation record created by institution/faculty admins to add a tutor.
  * Attributes: invitee email, token, role, institution/faculty/department context, expiry, status (PENDING/ACCEPTED/EXPIRED/REVOKED), message.
  * Relationship: references inviting user and institution; on accept it associates or upgrades a User to TUTOR.

* **InstitutionVerificationToken / Email OTP**

  * Short-lived tokens or codes used to verify institution or student emails.
  * Attributes: token/code, target email, expiresAt, usedAt, status.
  * Relationship: references Institution (for institution tokens) or StudentProfile/User (for student OTPs).

* **Course**

  * Represents a course (e.g., CSC 101).
  * Attributes: code, title, description, courseType (GENERAL / FACULTY / DEPARTMENTAL), owner department/faculty/institution.
  * Relationship: belongs to Institution and optionally Faculty/Department; has many Quizzes; has tutors via CourseTutor join; has enrollments.

* **CourseTutor (join)**

  * Assignment indicating which User(s) (tutors) can create/manage quizzes for a course.

* **CourseEnrollment**

  * Join between Users (students) and Course for enrollment.

* **Quiz**

  * A quiz/test associated with a Course.
  * Attributes: title, description, duration, attemptsAllowed, passingScore, status (DRAFT/PUBLISHED/CLOSED), randomization flags, createdBy (tutor).
  * Relationship: belongs to Course; has Questions; has QuizAttempts.

* **Question**

  * A question within a Quiz.
  * Attributes: content, type (MCQ, multi-select, short, long, true/false, image-based), options (if MCQ) and correct answer(s), marks, metadata (images, LaTeX).
  * Relationship: belongs to a Quiz.

* **QuizAttempt**

  * A student’s attempt at a Quiz.
  * Attributes: answers JSON, startedAt, submittedAt, score, duration, graded flag, graderId (if manual grading needed), attemptNumber.
  * Relationship: references Quiz and User.

* **LeaderboardEntry**

  * Cached or materialized view of high-scores per institution/course/quiz for fast reads.

* **Notification**

  * In-app/email notifications delivered to Users, e.g., invitation, verification, results.

* **AuditLog**

  * Records important back-office actions (user created, role changed, institution approved, tutor invited/accepted, manual grading), with actor, action, resource, and metadata.

* **Sessions**

  * Server-side session tokens or refresh sessions if using stateful sessions (stores token, user id, expiry). If JWT stateless preferred, store refresh tokens for revocation.

---

## 3 — Key relationships & constraints (conceptual)

* Institution → has many Faculties, Departments, Courses, Users, Invitations, VerificationTokens.
* Faculty → belongs to one Institution; has many Departments and optionally a faculty-admin User.
* Department → belongs to a Faculty (and Institution); has many Courses.
* Course → belongs to Institution and optionally Faculty/Department; has many Quizzes; many-to-many visible departments.
* User → can belong to an Institution (optional) and optionally to a Faculty/Department; can have multiple roles over time (role promotions are modeled by updating role and maintaining AdminAssignment records for scope).
* StudentProfile → 1:1 with User; stores student-specific fields.
* TutorInvitation → when accepted, either associates with an existing User (upgrade) or leads to new User creation + role assignment.
* QuizAttempt → many attempts per student per quiz (subject to attemptsAllowed constraint).

Primary integrity rules:

* Unique constraints where appropriate (institution domain or name optional uniqueness policy, course code + department uniqueness, user email unique).
* Timestamps for createdAt/updatedAt for every entity.
* Soft-delete via status or archivedAt for entities that should not be physically removed.

---

## 4 — Core backend flows (end-to-end, in plain language)

### A. Universal Signup (intent-aware)

* User signs up through the public signup page (full name, email, password, phone optional). The form can include an `intent` param (student/institution) captured from the homepage button.
* Backend creates a User (hashed password), sets `email_verified = false`, stores `intent` (transient or in DB).
* Backend generates an email OTP or verification link and sends via Resend.
* After email verified, evaluate intent:

  * If intent = institution → redirect to institution onboarding.
  * If intent = student → redirect to student onboarding (institution selection).
  * Else → show choice screen.

### B. Institution registration

* Admin (who signed up) provides institution details (name, domain, contact email, type, optional faculties/departments).
* Backend checks external API list (optional) to auto-suggest and mark pre-approved; otherwise mark PENDING.
* Generate OTP to institution contact email; once OTP verified → institution status = VERIFIED/ACTIVE.
* Link the creating user to the institution as `INSTITUTION_ADMIN`. Create AdminAssignment scoped to institution.

### C. Student registration / verification

* Student selects institution (from verified list) and faculty/department; provides institutional email and matric number (optional).
* Backend sends OTP to institutional email; upon verification, set StudentProfile.verifiedAt, set role to STUDENT, add enrollment permissions.
* Student can then enroll in courses and take quizzes.

### D. Tutor invitation & onboarding (both new & existing users)

* Admin creates an invitation record with token and context (institution/faculty/department).
* If invitee email exists as a User:

  * Send invite to existing account → link the token to that user; when they accept, upgrade their role to TUTOR and associate with institution/faculty/department.
* If invitee does not exist:

  * Invite contains flow to create a User account with the token so the created user is immediately assigned TUTOR role and association.
* Tokens expire and are single-use; accepted/revoked states tracked; audit logs kept.

### E. Course & Quiz lifecycle

* Tutors (with appropriate assignment) create Courses and Quizzes. Quizzes can be DRAFT or PUBLISHED.
* Questions stored with type, options, correct answer(s), marks; media stored externally (object storage) with metadata linking.
* When a student starts a quiz, backend creates a QuizAttempt, generates instance-specific state (retry limits, shuffle order), enforces timers and submission rules.
* On submission, auto-grade MCQs and auto-calc scores; flag manual grading if needed (long answers).
* Persist attempt, compute score, update leaderboards cache asynchronously.

### F. Leaderboards & Analytics

* Leaderboard computation is a background/materialized process; compute aggregates periodically or on-demand using event-driven updates when a new attempt is graded.
* Analytics endpoints provide per-course and per-institution aggregates (averages, median, participation, pass rates).

### G. Admin & Platform operations

* Platform Admin has a central dashboard for:

  * Institution approvals and suspension
  * Global user management and role overrides
  * System-wide metrics and instrumentation
* Institution Admin dashboard allows faculty/department management, tutor invites, course management, and user oversight.

---

## 5 — API surface (logical endpoints & responsibilities)

> The list below describes **what** endpoints should exist and **what they must do**. Implementation details left to the engineer.

### Auth & user

* `POST /auth/signup` — create user (store hashed password), return pending verification status; accept optional `intent`.
* `POST /auth/login` — authenticate (email + password), return session token/JWT and user summary.
* `POST /auth/otp/send` — send OTP to target email (signup/verify/reset).
* `POST /auth/otp/verify` — verify OTP and mark user/institution as verified, return session token or next step.
* `POST /auth/password-reset/request` — send reset token/OTP to email.
* `POST /auth/password-reset/confirm` — validate reset token and set new password.
* `POST /auth/logout` — revoke session/refresh token.

### Onboarding

* `GET /onboarding/intent` — return dynamic options (if needed).
* `POST /onboarding/institution` — create institution draft + generate verification token.
* `POST /onboarding/institution/verify` — verify institution OTP/token.
* `POST /onboarding/student` — create StudentProfile and send OTP.
* `POST /onboarding/student/verify` — verify student email OTP and upgrade role.

### Invitations

* `POST /invitations/tutor` — create TutorInvitation (admin-only).
* `GET /invitations/:token` — validate invitation token and return invite metadata.
* `POST /invitations/:token/accept` — accept invitation; if user exists upgrade, otherwise create user and assign.

### Courses & quizzes

* `POST /courses` — create course (institution-admin or assigned roles).
* `GET /courses` — list courses with scoping by institution/department.
* `POST /courses/:id/quizzes` — create quiz (tutors).
* `GET /quizzes/:id` — fetch quiz metadata (with security checks).
* `POST /quizzes/:id/start` — create a QuizAttempt instance.
* `POST /quizzes/:id/submit` — submit attempt answers, perform grading, return result.
* `GET /quizzes/:id/attempts` — list attempts (student or tutor context).
* `POST /quizzes/:id/questions` — create question (tutor).

### Enrollments & roles

* `POST /courses/:id/enroll` — enroll student in course (or institution-driven enrollment).
* `POST /users/:id/role` — role assignment (admin-only), audit logged.

### Dashboards & analytics

* `GET /dashboard/student` — student summary (enrollments, recent attempts, badges).
* `GET /dashboard/tutor` — tutor summary (courses, recent attempts needing grading, analytics).
* `GET /dashboard/institution` — institution-level analytics, users, courses.
* `GET /platform/*` — platform admin endpoints for global stats (PLATFORM_ADMIN only).

### Admin tools

* `POST /admin/institutions/:id/approve` — approve or reject institution (platform admin).
* `POST /admin/institutions/:id/suspend` — suspend institution.
* `GET /admin/verifications` — list pending verification tokens.
* `GET /admin/audit-logs` — access audit trails.

---

## 6 — Operational behaviors and policies

### Multi-tenancy & scoping

* Every tenant (institution) resource must be scoped by `institutionId`. API responses must never leak other institutions’ data.
* Admin and faculty roles are scoped: platform admins can access all, institution admins only their institution, faculty/department admins within their scope.

### Role & permission model

* Role hierarchy and admin assignments allow scope-based permissions (institution vs faculty vs department).
* A user may hold multiple roles; permission checks must consider intersection and highest privilege relevant to requested operation.
* Invitations and admin assignments are recorded for audit and for future revocation.

### Verification & token lifecycle

* OTPs and tokens are short-lived (e.g., 10–15 minutes for OTP, 24–48 hours for invitation links) and single-use.
* Tokens are stored hashed or associated with opaque IDs and not reversible, to protect from DB leaks.
* Expired tokens must be cleaned up by background jobs.

### Sessions & authentication

* Use secure session tokens (either refresh-token + short-lived access JWT, or stateful session tokens stored server-side).
* Support token revocation (sessions table or token blacklist).
* Enforce secure cookie settings, SameSite, secure flag, and HTTPS in production.

### Data retention & compliance

* Provide retention policy for OTPs, logs, and attempt data.
* Allow institutions to request data exports; support compliance with privacy laws (GDPR-style) if needed.
* Soft-delete vs hard-delete policy: sensitive items like quiz attempts should be archived not hard-deleted.

### Concurrency, consistency & transactions

* Use database transactions for multi-step operations (e.g., accept invitation upgrades, institution verify + user activation).
* Implement optimistic locking where needed (e.g., concurrent quiz submission or grading edits).
* Ensure idempotency for critical endpoints (invitation accept, OTP verify) to prevent double-processing.

### Background jobs & async processing

* Tasks to run asynchronously:

  * Send emails (Resend), retries on failure.
  * Compute leaderboards and analytics (periodic or event-driven).
  * Purge expired tokens and invites.
  * Recompute aggregates on heavy load off the main request path (use job queue).
* Keep jobs idempotent and audit their results.

### Monitoring, logging & alerting

* Log critical actions (auth failures, invitation acceptance, institution approval).
* Capture metrics: active users, attempts/sec, average quiz duration, failed verification rate.
* Set alerts for anomalies (mass failed OTPs, email deliverability issues, DB errors).

### Security & hardening

* Strong password hashing (bcrypt/argon2).
* Rate limit auth endpoints (signup, login, OTP send) to prevent abuse.
* Prevent account enumeration via uniform error messages.
* Protect invitation endpoints and admin endpoints with strong auth/authorization checks.
* Validate all file uploads and store in secure object storage with signed access URLs.
* Secure backups and encryption at rest where possible.

---

## 7 — Data model and indexing recommendations (conceptual)

* Index on frequently queried columns: `users.email`, `users.institution_id`, `courses.institution_id`, `quiz_attempts.quiz_id`, `quiz_attempts.student_id`, `tutor_invitations.token`, `institution_verification_codes.code`.
* Add compound unique constraints where needed: e.g., `(course_code, department)` uniqueness rule, `(user_id, course_id)` for enrollments uniqueness.
* Use UUID primary keys for distributed safety and migration friendliness.

---

## 8 — Auditability & traceability

* Every administrative action (institution approve/reject, invite created/accepted, role changed, manual grading) must produce an audit log entry with:

  * actorId (user who performed action)
  * action (canonical code)
  * resource reference (e.g., `quiz:uuid`, `institution:uuid`)
  * metadata (reason, payload)
  * timestamp

---

## 9 — Integration points & external services

* **Email & OTP**: Resend (primary) — use for transactional emails (OTP, invites, notifications).
* **Object storage**: for media (question images, attachments) — S3-compatible storage.
* **Optional external institution list API**: to auto-suggest and auto-approve institutions.
* **Monitoring/observability**: Datadog, Sentry, or similar for logs/metrics/errors.
* **Job queue**: Redis/sidekiq-like or serverless queue for background processing.

---

## 10 — Non-functional requirements (NFRs)

* **Availability**: Designed to be highly available; database hosted with a resilient provider (Neon/RDS). Keep failover strategy and backups in place.
* **Scalability**: The system should handle spiky quiz traffic (many students starting/submitting simultaneously). Use connection pooling, background jobs for heavy work.
* **Latency**: Sub-second responses for read endpoints (dashboard, quiz fetch). Use caches (materialized or in-memory) for leaderboard/analytics reads.
* **Security**: Strong authentication and authorization, encrypt secrets, apply least privilege.
* **Maintainability**: Clear separation of concerns, versioned migrations, and thorough logging. Schema evolution should be safe and backward-compatible where possible.

---

## 11 — Acceptance criteria (what success looks like)

* Users can sign up, verify email via OTP, and progress to student/institution onboarding per intent.
* Institutions can register, be verified via institutional email OTP or admin approval, and create faculties/departments.
* Admins can invite tutors; invites accept either upgrade existing users or create new users with TUTOR role.
* Tutors can create courses and quizzes; students can take quizzes and receive validated results.
* Leaderboard and analytics endpoints produce accurate, timely results.
* Multi-tenant scoping is strictly enforced; data does not leak across institutions.
* All critical flows are audited and traceable.
* System supports reasonable scale and is protected against common auth abuses.

---

## 12 — Deliverables for the backend engineer

(What to hand over / produce to be “done”)

* Database schema DDL / Drizzle schema files for all entities.
* Migration scripts and seed (platform admin + sample institution).
* API spec (list of endpoints, request/response shapes, auth requirements).
* Authentication service: signup, login, otp send/verify, session management.
* Onboarding endpoints: institution, student flows, invitation flows.
* Course & quiz endpoints: CRUD plus attempt lifecycle.
* Background job definitions and scheduling (leaderboard, cleanup).
* Audit/logging and monitoring hooks.
* Security checklist implemented (rate limits, password hashing, token expiry).
* Documentation: endpoint docs, data model diagram, role/permission matrix.

---

## Final notes (context)

* This design prioritizes **trust, academic integrity, and clarity**: institution verification, invitation-based tutor onboarding, student verification via institutional email.
* Keep the **user experience consistent**: intent-aware signup redirects, clear verification steps, and direct flows for invited tutors.
* The backend is the single source of truth; frontend must query only through authenticated endpoints and should not make trust assumptions.

---

If you want, I can produce any of the following next (pick one or more):

* A concise **endpoint reference** (method, path, required auth, request/response example) for every API above.
* A **database ER diagram** image and mapping of each table’s fields & indexes.
* A **role & permission matrix** mapping endpoints to allowed roles and scope rules.
* An **audit & logging plan** with sample audit entries for key actions.

Which of these would help your engineer most right now?



npm install lucia @lucia-auth/adapter-drizzle argon2 resend react-email zod @upstash/ratelimit
