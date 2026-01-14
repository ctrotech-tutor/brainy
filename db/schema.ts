// db/schema.ts
import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// ------------------------------
// ENUMS
// ------------------------------
export const userRoleEnum = pgEnum("user_role", [
  "USER",
  "STUDENT",
  "TUTOR",
  "INSTITUTION_ADMIN",
  "FACULTY_ADMIN",
  "DEPARTMENT_ADMIN",
  "PLATFORM_ADMIN",
]);

export const institutionStatusEnum = pgEnum("institution_status", [
  "PENDING",
  "APPROVED",
  "ACTIVE",
  "REJECTED",
  "SUSPENDED",
  "UNDER_REVIEW",
  "REQUEST_CHANGES",
  "ARCHIVED",
]);

export const institutionTypeEnum = pgEnum("institution_type", [
  "FEDERAL_UNIVERSITY",
  "STATE_UNIVERSITY",
  "PRIVATE_UNIVERSITY",
  "POLYTECHNIC",
  "COLLEGE_OF_EDUCATION",
  "TECHNICAL_COLLEGE",
  "SECONDARY_SCHOOL",
  "TRAINING_ACADEMY",
  "RESEARCH_INSTITUTE",
  "ONLINE_UNIVERSITY",
  "OTHER",
]);

export const ownershipTypeEnum = pgEnum("ownership_type", [
  "FEDERAL",
  "STATE",
  "PRIVATE",
  "MISSION",
  "OTHER",
]);

export const accreditationStatusEnum = pgEnum("accreditation_status", [
  "FULL",
  "INTERIM",
  "PROVISIONAL",
  "DENIED",
  "EXPIRED",
  "NOT_APPLICABLE",
]);

export const studentPopulationEnum = pgEnum("student_population", [
  "LESS_THAN_1000",
  "1000-5000",
  "5000-10000",
  "10000-20000",
  "20000-50000",
  "MORE_THAN_50000",
]);

export const documentTypeEnum = pgEnum("document_type", [
  "ACCREDITATION_CERTIFICATE",
  "REGISTRATION_CERTIFICATE",
  "AUTHORIZATION_LETTER",
  "BUSINESS_LICENSE",
  "TAX_CERTIFICATE",
  "ID_CARD",
  "OTHER",
]);

export const invitationStatusEnum = pgEnum("invitation_status", [
  "PENDING",
  "ACCEPTED",
  "EXPIRED",
  "REVOKED",
]);

export const quizStatusEnum = pgEnum("quiz_status", [
  "DRAFT",
  "PUBLISHED",
  "CLOSED",
]);

export const questionTypeEnum = pgEnum("question_type", [
  "MULTIPLE_CHOICE",
  "MULTIPLE_SELECT",
  "SHORT_ANSWER",
  "LONG_ANSWER",
  "TRUE_FALSE",
]);

// ------------------------------
// AUTH & USERS
// ------------------------------
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date", withTimezone: true }),
  image: text("image"),
  hashedPassword: text("hashed_password"), // Custom field for credentials provider
  onboardingIntent: text("onboarding_intent"),
  onboardingComplete: boolean("onboarding_complete").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const userRoles = pgTable(
  "user_roles",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: userRoleEnum("role").notNull(),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.role] }),
  })
);

// ------------------------------
// INSTITUTIONS & ACADEMIC STRUCTURE
// ------------------------------
export const institutions = pgTable("institutions", {
  // Core Identification
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  shortName: text("short_name"),
  domain: text("domain").unique(),
  emailDomain: text("email_domain"),

  // Nigerian-Specific Identification
  nucCode: text("nuc_code"),
  nbteCode: text("nbte_code"),
  ncceCode: text("ncce_code"),
  jambCode: text("jamb_code"),
  accreditationNumber: text("accreditation_number"),

  // Institution Type & Ownership
  type: institutionTypeEnum("type"),
  ownership: ownershipTypeEnum("ownership"),

  // Location
  country: text("country"),
  state: text("state"),
  lga: text("lga"),
  address: text("address"),
  campusLocation: text("campus_location"),
  googleMapsUrl: text("google_maps_url"),

  // Contact Information
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  website: text("website"),
  alternativePhone: text("alternative_phone"),

  // Accreditation & Verification Status
  accreditationStatus: accreditationStatusEnum("accreditation_status"),
  accreditationDate: date("accreditation_date"),
  accreditationExpiry: date("accreditation_expiry"),
  verificationTier: integer("verification_tier").default(1),
  verificationMethod: text("verification_method"),

  // Media & Branding
  logo: text("logo"),
  coverImage: text("cover_image"),
  galleryImages: text("gallery_images").array(),
  brochureUrl: text("brochure_url"),

  // Institutional Details
  description: text("description"),
  mission: text("mission"),
  vision: text("vision"),
  yearEstablished: integer("year_established"),
  motto: text("motto"),

  // Academic Structure
  facultiesCount: integer("faculties_count"),
  departmentsCount: integer("departments_count"),
  studentPopulation: studentPopulationEnum("student_population"),
  academicStaffCount: integer("academic_staff_count"),
  nonAcademicStaffCount: integer("non_academic_staff_count"),

  // Platform Status
  status: institutionStatusEnum("status").default("PENDING").notNull(),
  rejectionReason: text("rejection_reason"),
  rejectionDetails: text("rejection_details"),

  // Admin & Management
  createdById: text("created_by_id").references(() => users.id, {
    onDelete: "set null",
  }),
  approvedById: text("approved_by_id").references(() => users.id, {
    onDelete: "set null",
  }),
  verifiedById: text("verified_by_id").references(() => users.id, {
    onDelete: "set null",
  }),
  representativeId: text("representative_id").references(() => users.id, {
    onDelete: "set null",
  }),

  // Social Media & Online Presence
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  youtubeUrl: text("youtube_url"),

  // Academic Information
  academicSessionType: text("academic_session_type").default("SEMESTER"),
  languagesOfInstruction: text("languages_of_instruction")
    .array()
    .default(["English"]),
  popularPrograms: text("popular_programs").array(),

  // Verification Metadata
  lastVerifiedAt: timestamp("last_verified_at"),
  nextVerificationDue: timestamp("next_verification_due"),
  verificationNotes: text("verification_notes"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  verifiedAt: timestamp("verified_at"),
  approvedAt: timestamp("approved_at"),
});

// Export Institution type
export type Institution = typeof institutions.$inferSelect;

export const institutionDocuments = pgTable("institution_documents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  institutionId: text("institution_id")
    .references(() => institutions.id, { onDelete: "cascade" })
    .notNull(),
  documentType: documentTypeEnum("document_type").notNull(),
  documentUrl: text("document_url").notNull(),
  fileName: text("file_name"),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  uploadedById: text("uploaded_by_id").references(() => users.id, {
    onDelete: "set null",
  }),
  verified: boolean("verified").default(false),
  verifiedById: text("verified_by_id").references(() => users.id, {
    onDelete: "set null",
  }),
  verificationNotes: text("verification_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const institutionContacts = pgTable("institution_contacts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  institutionId: text("institution_id")
    .references(() => institutions.id, { onDelete: "cascade" })
    .notNull(),
  fullName: text("full_name").notNull(),
  position: text("position"),
  department: text("department"),
  email: text("email"),
  phone: text("phone"),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const institutionVerificationLogs = pgTable(
  "institution_verification_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    institutionId: text("institution_id")
      .references(() => institutions.id, { onDelete: "cascade" })
      .notNull(),
    action: text("action").notNull(),
    performedById: text("performed_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    details: jsonb("details"),
    previousStatus: text("previous_status"),
    newStatus: text("new_status"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

export const faculties = pgTable("faculties", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  name: text("name").notNull(),

  // mark optional fields as string | null
  description: text("description").$type<string | null>(),
  code: text("code").notNull(),
  coverImage: text("cover_image").$type<string | null>(),
  logo: text("logo").$type<string | null>(),

  institutionId: text("institution_id")
    .notNull()
    .references(() => institutions.id, { onDelete: "cascade" }),

  adminId: text("admin_id")
    .$type<string | null>()
    .references(() => users.id, { onDelete: "set null" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


export const departments = pgTable("departments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description"),
  code: text("code"),
  facultyId: text("faculty_id")
    .notNull()
    .references(() => faculties.id, { onDelete: "cascade" }),
  adminId: text("admin_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ------------------------------
// STUDENT PROFILE
// ------------------------------
export const studentProfiles = pgTable("student_profiles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  institutionId: text("institution_id")
    .notNull()
    .references(() => institutions.id, { onDelete: "cascade" }),
  facultyId: text("faculty_id").references(() => faculties.id, {
    onDelete: "set null",
  }),
  departmentId: text("department_id").references(() => departments.id, {
    onDelete: "set null",
  }),
  matricNumber: text("matric_number"),
  institutionalEmail: text("institutional_email"),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ------------------------------
// COURSES & QUIZZES
// ------------------------------
export const courses = pgTable("courses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  code: text("code").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  institutionId: text("institution_id")
    .notNull()
    .references(() => institutions.id, { onDelete: "cascade" }),
  departmentId: text("department_id").references(() => departments.id, {
    onDelete: "set null",
  }),
  isActive: boolean("is_active").default(true).notNull(),
  createdById: text("created_by_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const quizzes = pgTable("quizzes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration"), // minutes
  attemptsAllowed: integer("attempts_allowed").default(1).notNull(),
  passingScore: integer("passing_score"),
  shuffleQuestions: boolean("shuffle_questions").default(false).notNull(),
  showResults: boolean("show_results").default(true).notNull(),
  status: quizStatusEnum("status").default("DRAFT").notNull(),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  authorId: text("author_id").references(() => users.id, {
    onDelete: "set null",
  }),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  content: text("content").notNull(),
  type: questionTypeEnum("type").notNull(),
  options: jsonb("options"),
  correctAnswer: jsonb("correct_answer"),
  marks: integer("marks").default(1).notNull(),
  explanation: text("explanation"),
  order: integer("order").default(0).notNull(),
  quizId: text("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  quizId: text("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  // reference student_profiles.id to ensure attempts belong to a student profile
  studentProfileId: text("student_profile_id")
    .notNull()
    .references(() => studentProfiles.id, { onDelete: "cascade" }),
  answers: jsonb("answers"),
  score: integer("score"),
  maxScore: integer("max_score"),
  attemptNumber: integer("attempt_number").default(1).notNull(),
  isGraded: boolean("is_graded").default(false).notNull(),
  gradedById: text("graded_by_id").references(() => users.id, {
    onDelete: "set null",
  }),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ------------------------------
// INVITATIONS & JOIN TABLES
// ------------------------------
export const tutorInvitations = pgTable("tutor_invitations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  status: invitationStatusEnum("status").default("PENDING").notNull(),
  message: text("message"),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
  institutionId: text("institution_id")
    .notNull()
    .references(() => institutions.id, { onDelete: "cascade" }),
  inviterId: text("inviter_id").references(() => users.id, {
    onDelete: "set null",
  }),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const courseTutors = pgTable(
  "course_tutors",
  {
    courseId: text("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    tutorId: text("tutor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.courseId, table.tutorId] }),
  })
);

export const courseEnrollments = pgTable(
  "course_enrollments",
  {
    courseId: text("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    studentProfileId: text("student_profile_id")
      .notNull()
      .references(() => studentProfiles.id, { onDelete: "cascade" }),
    enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.courseId, table.studentProfileId] }),
  })
);

// ------------------------------
// AUDIT & NOTIFICATIONS
// ------------------------------
export const auditLogs = pgTable("audit_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  actorId: text("actor_id").references(() => users.id, {
    onDelete: "set null",
  }),
  action: text("action").notNull(),
  resourceId: text("resource_id"),
  resourceTable: text("resource_table"),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: jsonb("metadata"),
});

// ------------------------------
// RELATIONS (Drizzle helpers)
// ------------------------------
export const usersRelations = relations(users, ({ one, many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  roles: many(userRoles),
  authoredQuizzes: many(quizzes),
  sentInvitations: many(tutorInvitations),
  studentProfile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.userId], references: [users.id] }),
}));

export const institutionsRelations = relations(
  institutions,
  ({ many, one }) => ({
    faculties: many(faculties),
    invitations: many(tutorInvitations),
    createdBy: one(users, {
      fields: [institutions.createdById],
      references: [users.id],
    }),
    approvedBy: one(users, {
      fields: [institutions.approvedById],
      references: [users.id],
    }),
    verifiedBy: one(users, {
      fields: [institutions.verifiedById],
      references: [users.id],
    }),
    representative: one(users, {
      fields: [institutions.representativeId],
      references: [users.id],
    }),
    documents: many(institutionDocuments),
    contacts: many(institutionContacts),
    verificationLogs: many(institutionVerificationLogs),
  })
);

export const institutionDocumentsRelations = relations(
  institutionDocuments,
  ({ one }) => ({
    institution: one(institutions, {
      fields: [institutionDocuments.institutionId],
      references: [institutions.id],
    }),
    uploadedBy: one(users, {
      fields: [institutionDocuments.uploadedById],
      references: [users.id],
    }),
    verifiedBy: one(users, {
      fields: [institutionDocuments.verifiedById],
      references: [users.id],
    }),
  })
);

export const institutionContactsRelations = relations(
  institutionContacts,
  ({ one }) => ({
    institution: one(institutions, {
      fields: [institutionContacts.institutionId],
      references: [institutions.id],
    }),
  })
);

export const institutionVerificationLogsRelations = relations(
  institutionVerificationLogs,
  ({ one }) => ({
    institution: one(institutions, {
      fields: [institutionVerificationLogs.institutionId],
      references: [institutions.id],
    }),
    performedBy: one(users, {
      fields: [institutionVerificationLogs.performedById],
      references: [users.id],
    }),
  })
);

export const facultiesRelations = relations(faculties, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [faculties.institutionId],
    references: [institutions.id],
  }),
  departments: many(departments),
  admin: one(users, { fields: [faculties.adminId], references: [users.id] }),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  faculty: one(faculties, {
    fields: [departments.facultyId],
    references: [faculties.id],
  }),
  courses: many(courses),
  admin: one(users, { fields: [departments.adminId], references: [users.id] }),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  department: one(departments, {
    fields: [courses.departmentId],
    references: [departments.id],
  }),
  quizzes: many(quizzes),
  tutors: many(courseTutors),
  enrollments: many(courseEnrollments),
  createdBy: one(users, {
    fields: [courses.createdById],
    references: [users.id],
  }),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  course: one(courses, {
    fields: [quizzes.courseId],
    references: [courses.id],
  }),
  author: one(users, { fields: [quizzes.authorId], references: [users.id] }),
  questions: many(questions),
  attempts: many(quizAttempts),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  quiz: one(quizzes, { fields: [questions.quizId], references: [quizzes.id] }),
}));

export const studentProfilesRelations = relations(
  studentProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [studentProfiles.userId],
      references: [users.id],
    }),
    institution: one(institutions, {
      fields: [studentProfiles.institutionId],
      references: [institutions.id],
    }),
    faculty: one(faculties, {
      fields: [studentProfiles.facultyId],
      references: [faculties.id],
    }),
    department: one(departments, {
      fields: [studentProfiles.departmentId],
      references: [departments.id],
    }),
    quizAttempts: many(quizAttempts),
    enrollments: many(courseEnrollments),
  })
);

export const quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  }),
  studentProfile: one(studentProfiles, {
    fields: [quizAttempts.studentProfileId],
    references: [studentProfiles.id],
  }),
  gradedBy: one(users, {
    fields: [quizAttempts.gradedById],
    references: [users.id],
  }),
}));

export const tutorInvitationsRelations = relations(
  tutorInvitations,
  ({ one }) => ({
    institution: one(institutions, {
      fields: [tutorInvitations.institutionId],
      references: [institutions.id],
    }),
    inviter: one(users, {
      fields: [tutorInvitations.inviterId],
      references: [users.id],
    }),
  })
);

export const courseTutorsRelations = relations(courseTutors, ({ one }) => ({
  course: one(courses, {
    fields: [courseTutors.courseId],
    references: [courses.id],
  }),
  tutor: one(users, { fields: [courseTutors.tutorId], references: [users.id] }),
}));

export const courseEnrollmentsRelations = relations(
  courseEnrollments,
  ({ one }) => ({
    course: one(courses, {
      fields: [courseEnrollments.courseId],
      references: [courses.id],
    }),
    studentProfile: one(studentProfiles, {
      fields: [courseEnrollments.studentProfileId],
      references: [studentProfiles.id],
    }),
  })
);

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(users, { fields: [auditLogs.actorId], references: [users.id] }),
}));
