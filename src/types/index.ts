
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  external?: boolean;
  label?: string;
};

export type Permission = {
  id: string; // UUID from backend
  name: string;
  category: string;
  description?: string;
};

export type Role = {
  id: string; // UUID from backend
  name: string;
  description?: string;
  permissions?: Permission[]; // Array of full Permission objects
  userCount?: number; 
  isDefault?: boolean; // Added from backend
};

export type Branch = {
  id: string; // UUID from backend
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
};

export type User = {
  id: string; // User ID from backend is now UUID (from BaseEntity)
  name: string;
  email: string;
  avatarUrl?: string;
  role: Role; // Role object
  status: 'active' | 'invited' | 'inactive' | 'pending';
  branch?: Branch | null; // Branch object or null
  lastLogin?: string | null; // ISO date string, or null
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
};

// Add other types as needed based on new entities e.g. Student, Parent, AcademicClass etc.
// For example:
export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string; // ISO date string
  gender: 'male' | 'female' | 'other';
  admissionNumber: string;
  admissionDate: string; // ISO date string
  status: 'active' | 'inactive' | 'graduated' | 'transferred' | 'prospect';
  branch: Branch;
  academicClass?: AcademicClass | null;
  profilePhotoUrl?: string;
  address?: string;
  parents?: Parent[];
  createdAt?: string;
  updatedAt?: string;
};

export type Parent = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  occupation?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AcademicClass = {
  id: string;
  name: string;
  description?: string;
  branch: Branch; // Typically just branchId might be sent from backend list views, full object for details
  createdAt?: string;
  updatedAt?: string;
};

// ... and so on for FeeCategory, FeeStructure, FeePayment, Receipt, Exam
