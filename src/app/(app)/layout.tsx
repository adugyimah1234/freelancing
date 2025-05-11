import { SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen peer-data-[state=collapsed]:peer-data-[collapsible=icon]:lg:ml-[var(--sidebar-width-icon)] lg:ml-[var(--sidebar-width)] transition-[margin-left] duration-300 ease-in-out">
        <AppHeader />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
