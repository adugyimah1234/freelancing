
"use client";
import { BranchSwitcher } from "@/components/shared/branch-switcher";
import { UserNav } from "@/components/shared/user-nav";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Briefcase, Bell } from "lucide-react";
import Link from "next/link";
import { useImpersonation } from "@/context/impersonation-context"; 

export function AppHeader() {
  const { isImpersonating, originalUser } = useImpersonation();
  const showBanner = isImpersonating && originalUser.role === 'Super Admin';

  // Mock notification count
  const notificationCount = 3; 

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-none items-center space-x-4 sm:justify-between sm:space-x-0 px-4 md:px-6">
        <div className="flex items-center gap-1 md:gap-2">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <Briefcase className="h-6 w-6 text-primary group-hover:text-primary/90 transition-colors" />
            <span className="font-bold sm:inline-block text-lg text-foreground group-hover:text-foreground/90 transition-colors">
              Branch Buddy
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <BranchSwitcher />
          <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground" asChild>
            <Link href="/notifications">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
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
