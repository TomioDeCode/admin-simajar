import { MainLayout } from "@/layouts/MainLayout";
import { ReactNode } from "react";

interface GenerasiLayoutProps {
  children: ReactNode;
}
  
export default function GenerasiLayout({ children }: GenerasiLayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
