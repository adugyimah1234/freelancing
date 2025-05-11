import type { NavItem } from "@/types";
import { LayoutDashboard, Users, Building, Settings2 } from "lucide-react";

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
      title: "User Roles",
      href: "/user-roles",
      icon: Users,
    },
    {
      title: "Branch Settings",
      href: "/branch-settings",
      icon: Building,
    },
  ] satisfies NavItem[],
};
