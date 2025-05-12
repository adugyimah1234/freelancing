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
  id: string; // Usually string (UUID or slug) or number
  name: string;
  category: string;
};

export type Role = {
  id: string; // Backend uses string UUIDs for Role IDs in DTOs/Entities
  name: string;
  description?: string;
  permissions?: Permission[] | string[]; // Can be full objects or just IDs
  userCount?: number; 
};

export type Branch = {
  id: string; // Backend uses string UUIDs for Branch IDs
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  // Add other fields if needed
};

export type User = {
  id: number; // Backend UserEntity typically has a numeric auto-increment ID
  name: string;
  email: string;
  avatarUrl?: string; // Remains optional, backend might not provide it initially
  role: Role; // Changed from string to Role object to reflect backend relations
  status: 'active' | 'invited' | 'inactive' | 'pending'; // Added 'pending' from backend UserStatus enum
  branch?: Branch; // Changed from branchId to Branch object
  lastLogin?: string | null; // ISO date string, or null
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
};
