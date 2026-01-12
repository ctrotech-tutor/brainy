// src/lib/utils/roles.ts - Fixed types
import { db } from "@/db";
import { userRoles, type userRoleEnum } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cache } from "react";

// ============================================
// ROLE TYPES
// ============================================

// Extract the enum values from the schema
export type Role = typeof userRoleEnum.enumValues[number];

// Role hierarchy for permission checking
const ROLE_HIERARCHY: Record<Role, number> = {
  USER: 1,
  STUDENT: 2,
  TUTOR: 3,
  DEPARTMENT_ADMIN: 4,
  FACULTY_ADMIN: 5,
  INSTITUTION_ADMIN: 6,
  PLATFORM_ADMIN: 7,
};

// ============================================
// GET USER ROLES
// ============================================

export const getUserRoles = cache(async (userId: string): Promise<Role[]> => {
  const roles = await db
    .select({ role: userRoles.role })
    .from(userRoles)
    .where(eq(userRoles.userId, userId));

  return roles.map((r) => r.role);
});

// ============================================
// CHECK IF USER HAS ROLE
// ============================================

export const hasRole = cache(
  async (userId: string, role: Role): Promise<boolean> => {
    const roles = await getUserRoles(userId);
    return roles.includes(role);
  }
);

// ============================================
// CHECK IF USER HAS ANY ROLE
// ============================================

export const hasAnyRole = cache(
  async (userId: string, requiredRoles: Role[]): Promise<boolean> => {
    const roles = await getUserRoles(userId);
    return requiredRoles.some((role) => roles.includes(role));
  }
);

// ============================================
// CHECK IF USER HAS ALL ROLES
// ============================================

export const hasAllRoles = cache(
  async (userId: string, requiredRoles: Role[]): Promise<boolean> => {
    const roles = await getUserRoles(userId);
    return requiredRoles.every((role) => roles.includes(role));
  }
);

// ============================================
// CHECK ROLE HIERARCHY (user has at least this level)
// ============================================

export const hasRoleLevel = cache(
  async (userId: string, minRole: Role): Promise<boolean> => {
    const roles = await getUserRoles(userId);
    const minLevel = ROLE_HIERARCHY[minRole];

    return roles.some((role) => ROLE_HIERARCHY[role] >= minLevel);
  }
);

// ============================================
// ASSIGN ROLE TO USER
// ============================================

export async function assignRole(userId: string, role: Role): Promise<void> {
  const existingRole = await hasRole(userId, role);
  
  if (existingRole) {
    return; // Role already assigned
  }

  await db.insert(userRoles).values({
    userId,
    role,
  });
}

// ============================================
// REMOVE ROLE FROM USER
// ============================================

export async function removeRole(userId: string, role: Role): Promise<void> {
  await db
    .delete(userRoles)
    .where(and(
      eq(userRoles.userId, userId),
      eq(userRoles.role, role)
    ));
}

// ============================================
// ROLE GUARDS (for API routes)
// ============================================

export class RoleGuard {
  static async requireRole(userId: string, role: Role): Promise<void> {
    const hasRequiredRole = await hasRole(userId, role);
    
    if (!hasRequiredRole) {
      throw new Error(`Forbidden: ${role} role required`);
    }
  }

  static async requireAnyRole(userId: string, roles: Role[]): Promise<void> {
    const hasRequiredRole = await hasAnyRole(userId, roles);
    
    if (!hasRequiredRole) {
      throw new Error(`Forbidden: One of [${roles.join(", ")}] roles required`);
    }
  }

  static async requireAllRoles(userId: string, roles: Role[]): Promise<void> {
    const hasRequiredRoles = await hasAllRoles(userId, roles);
    
    if (!hasRequiredRoles) {
      throw new Error(`Forbidden: All of [${roles.join(", ")}] roles required`);
    }
  }

  static async requireRoleLevel(userId: string, minRole: Role): Promise<void> {
    const hasRequiredLevel = await hasRoleLevel(userId, minRole);
    
    if (!hasRequiredLevel) {
      throw new Error(`Forbidden: ${minRole} level or higher required`);
    }
  }
}

// ============================================
// PERMISSION HELPERS
// ============================================

export const PERMISSIONS = {
  // Platform-wide permissions
  MANAGE_PLATFORM: ["PLATFORM_ADMIN"],
  MANAGE_INSTITUTIONS: ["PLATFORM_ADMIN", "INSTITUTION_ADMIN"],
  MANAGE_FACULTY: ["PLATFORM_ADMIN", "INSTITUTION_ADMIN", "FACULTY_ADMIN"],
  MANAGE_DEPARTMENTS: ["PLATFORM_ADMIN", "INSTITUTION_ADMIN", "FACULTY_ADMIN", "DEPARTMENT_ADMIN"],
  
  // Teaching permissions
  CREATE_COURSES: ["TUTOR", "FACULTY_ADMIN", "DEPARTMENT_ADMIN", "INSTITUTION_ADMIN", "PLATFORM_ADMIN"],
  MANAGE_COURSES: ["TUTOR", "FACULTY_ADMIN", "DEPARTMENT_ADMIN", "INSTITUTION_ADMIN", "PLATFORM_ADMIN"],
  GRADE_STUDENTS: ["TUTOR", "FACULTY_ADMIN", "DEPARTMENT_ADMIN", "INSTITUTION_ADMIN", "PLATFORM_ADMIN"],
  
  // Student permissions
  ENROLL_COURSES: ["STUDENT", "USER"],
  VIEW_COURSES: ["STUDENT", "TUTOR", "USER"],
  
  // Invitation permissions
  INVITE_TUTORS: ["INSTITUTION_ADMIN", "FACULTY_ADMIN", "PLATFORM_ADMIN"],
  
  // Approval permissions
  APPROVE_INSTITUTIONS: ["PLATFORM_ADMIN"],
} as const;

export async function hasPermission(
  userId: string,
  permission: keyof typeof PERMISSIONS
): Promise<boolean> {
  const allowedRoles = PERMISSIONS[permission] as unknown as Role[];
  return await hasAnyRole(userId, allowedRoles);
}