import BreadcrumbItems from "@/components/common/BreadcrumbItems";
import { AppSidebar } from "@/components/core/AppSidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <BreadcrumbItems />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
