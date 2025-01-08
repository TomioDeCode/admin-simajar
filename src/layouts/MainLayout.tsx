import React, { memo } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/core/Sidebar"
import BreadcrumbItems from "@/components/common/BreadcrumbHeader";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = memo(function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <BreadcrumbItems />
        <main
          className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8 pt-0 w-full max-w-7xl mx-auto"
          role="main"
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
});
