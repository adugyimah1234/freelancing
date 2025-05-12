import type { NavItem } from "@/types";
import { LayoutDashboard, Users, Building, Settings2, UsersRound, ShieldCheck } from "lucide-react";

export const siteConfig = {
  name: "Branch Buddy",
  description: "School Management System for Multi-Branch Institutions",
  navItems: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      href: "/users",
      icon: UsersRound,
    },
    {
      title: "User Roles",
      href: "/user-roles",
      icon: ShieldCheck, // Changed from Users to ShieldCheck for better distinction
    },
    {
      title: "Branch Settings",
      href: "/branch-settings",
      icon: Building,
    },
    // Example for future system-wide settings
    // {
    //   title: "System Settings",
    //   href: "/system-settings",
    //   icon: Settings2,
    // },
  ] satisfies NavItem[],
};
