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
  id: string;
  name: string;
  category: string;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Array of permission IDs
  userCount?: number; // Optional: for display purposes
};

export type Branch = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string; // Role Name
  status: 'active' | 'invited' | 'inactive';
  branchId?: string; // Optional, for users assigned to a specific branch
  lastLogin?: string; // ISO date string, for display
};
