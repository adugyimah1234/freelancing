
"use client";
import { BranchSwitcher } from "@/components/shared/branch-switcher";
import { UserNav } from "@/components/shared/user-nav";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Briefcase, Bell } from "lucide-react";
import Link from "next/link";
import { useImpersonation } from "@/context/impersonation-context"; // For potential future use for banner offset

export function AppHeader() {
  const { isImpersonating, originalUser } = useImpersonation();
  const showBanner = isImpersonating && originalUser.role === 'Super Admin';

  // Mock notification count
  const notificationCount = 3; // Replace with actual count logic

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block text-lg text-foreground">
              Branch Buddy
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <BranchSwitcher />
          <Button variant="ghost" size="icon" className="relative h-9 w-9" asChild>
            <Link href="/notifications">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
              <span className="sr-only">View Notifications</span>
            </Link>
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
