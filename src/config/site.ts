
import type { NavItem } from "@/types";
import { LayoutDashboard, Users, Building, Settings2, UsersRound, ShieldCheck, BellRing } from "lucide-react";

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
      icon: ShieldCheck,
    },
    {
      title: "Branch Settings",
      href: "/branch-settings",
      icon: Building,
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: BellRing,
    }
    // Example for future system-wide settings
    // {
    //   title: "System Settings",
    //   href: "/system-settings",
    //   icon: Settings2, // Assuming Settings2 is available or replaced with Settings
    // },
  ] satisfies NavItem[],
};
