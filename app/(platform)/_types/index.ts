// app/(platform)/_types/index.ts

// --- USERS & AUTH ---
export type UserSession = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  roles: string[];
};

export type UserProfileData = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  emailVerified: string | null;
  onboardingComplete: boolean;
  createdAt: string;
  roles: { role: string }[];
  studentProfile: {
    id: string;
    matricNumber: string | null;
    institutionalEmail: string | null;
    institution: { id: string; name: string };
    faculty: { id: string; name: string } | null;
    department: { id: string; name: string } | null;
  } | null;
};

// --- INSTITUTIONS ---
export type InstitutionReviewData = {
  id: string;
  name: string;
  domain: string | null;
  website: string | null;
  country: string | null;
  state: string | null;
  type: string | null;
  ownership: string | null;
  status: string;
  yearEstablished: number | null;
  contactEmail: string | null;
  // Joined data
  createdBy: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
  documents: { id: string; documentType: string; documentUrl: string }[];
};

// --- DASHBOARD ---
export interface PlatformStats {
  pendingInstitutions: number;
  activeInstitutions: number;
  totalUsers: number;
  totalStudents: number;
}

// --- COMPONENTS ---
export interface EditRolesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: UserTableData | null; 
  selectedRoles: string[];
  onRolesChange: (newRoles: string[]) => void;
}

// Data Tables
export interface ApiResponse<TData> {
  data: TData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    limit: number;
  };
}

export type UserTableData = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  emailVerified: string | null;
  createdAt: string;
  roles: string[];
};

// --- CLIENT COMPONENTS ---
import type { User } from "lucia";

export interface UserNavClientProps {
  user: User & { roles: string[] };
}
