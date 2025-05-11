import { BranchSwitcher } from "@/components/shared/branch-switcher";
import { UserNav } from "@/components/shared/user-nav";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Briefcase } from "lucide-react";
import Link from "next/link";

export function AppHeader() {
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

        <div className="flex flex-1 items-center justify-end space-x-4">
          <BranchSwitcher />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
