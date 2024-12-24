import { MainLayout } from "@/components/layouts/MainLayout";
import { ReactNode } from "react";

interface SiswaLayoutProps {
  children: ReactNode;
}

export default function SiswaLayout({ children }: SiswaLayoutProps) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}
