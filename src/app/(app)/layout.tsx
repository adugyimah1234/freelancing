"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ImpersonationProvider, useImpersonation } from "@/context/impersonation-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react"; // Added useState
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
  const { isImpersonating, originalUser, isLoadingOriginalUser, currentEffectiveUser } = useImpersonation();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true once component mounts on client
  }, []);

  useEffect(() => {
    if (isClient) { // Only run client-side logic after mount
      const token = localStorage.getItem('accessToken');
      // If user loading is complete (isLoadingOriginalUser is false) AND there's no token, redirect.
      if (!isLoadingOriginalUser && !token) {
        router.replace('/login');
      }
    }
  }, [isClient, isLoadingOriginalUser, router]);

  // Loader logic:
  // Show loader if:
  // 1. On the client (isClient is true)
  // 2. AND ( EITHER initial user loading is still in progress (isLoadingOriginalUser is true)
  //          OR no access token is found (implies user is not logged in, redirect is imminent via useEffect) )
  if (isClient && (isLoadingOriginalUser || !localStorage.getItem('accessToken'))) {
    // This loader is safe because `isClient` ensures it's only rendered after initial mount,
    // matching server's behavior of not rendering this loader initially.
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // If it's SSR (!isClient), or if client-side checks have passed (user loaded, token exists), render the main layout.
  // Also, currentEffectiveUser should be populated if isLoadingOriginalUser is false and token exists.
  // A further check could be added for `!currentEffectiveUser?.email` if needed for edge cases.
  if (!isClient && isLoadingOriginalUser) {
    // For SSR and initial client render before `isClient` is true,
    // if `isLoadingOriginalUser` is true, we might render a minimal non-interactive layout shell
    // or simply proceed to render the full layout structure as below.
    // The key is that it must match. Proceeding to render the layout structure is often the simplest.
  }


  const showBanner = isImpersonating && originalUser?.role?.name === 'Super Admin';

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main 
        className={cn(
          "flex-1 flex flex-col min-h-screen peer-data-[state=collapsed]:peer-data-[collapsible=icon]:lg:ml-[var(--sidebar-width-icon)] lg:ml-[var(--sidebar-width)] transition-[margin-left] duration-300 ease-in-out",
          { 'pt-12': showBanner } 
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