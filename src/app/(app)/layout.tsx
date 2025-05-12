
"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ImpersonationProvider, useImpersonation } from "@/context/impersonation-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

function ImpersonationBanner() {
  const { isImpersonating, impersonatedUser, stopImpersonation, originalUser } = useImpersonation();

  if (!isImpersonating || !impersonatedUser || originalUser?.role?.name !== 'Super Admin') {
    return null;
  }

  return (
    <div className="bg-yellow-500 text-white text-center p-2.5 fixed top-0 left-0 right-0 z-[101] flex justify-center items-center shadow-lg">
      <span className="mr-4">
        You are currently viewing as <strong>{impersonatedUser.name}</strong> ({impersonatedUser.role.name}). System interactions are based on this user's permissions.
      </span>
      <Button variant="ghost" size="sm" onClick={stopImpersonation} className="hover:bg-yellow-600 text-white border border-white/50 h-8 px-3">
        <LogOut className="mr-2 h-4 w-4" /> Stop Viewing As
      </Button>
    </div>
  );
}


function InnerAppLayout({ children }: { children: React.ReactNode }) {
  const { isImpersonating, originalUser, isLoadingOriginalUser } = useImpersonation();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (!token && !isLoadingOriginalUser) { // Redirect if no token and not currently loading user info
        router.replace('/login');
      }
    }
  }, [router, isLoadingOriginalUser]);

  if (isLoadingOriginalUser && typeof window !== 'undefined' && !localStorage.getItem('accessToken')) {
      // If loading and no token, show a minimal loader or blank screen to avoid flashing content
      // The useEffect above will handle redirection.
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
  }
  
  const showBanner = isImpersonating && originalUser?.role?.name === 'Super Admin';

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main 
        className={cn(
          "flex-1 flex flex-col min-h-screen peer-data-[state=collapsed]:peer-data-[collapsible=icon]:lg:ml-[var(--sidebar-width-icon)] lg:ml-[var(--sidebar-width)] transition-[margin-left] duration-300 ease-in-out",
          { 'pt-12': showBanner } // Adjust main content padding if banner is shown
        )}
      >
        <AppHeader />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
          {children}
        </div>
      </main>
      <ImpersonationBanner />
    </SidebarProvider>
  );
}


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ImpersonationProvider>
      <InnerAppLayout>{children}</InnerAppLayout>
    </ImpersonationProvider>
  );
}
