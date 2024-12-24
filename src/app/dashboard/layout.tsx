import { MainLayout } from "@/components/layouts/MainLayout";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}
