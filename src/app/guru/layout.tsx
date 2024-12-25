import { MainLayout } from "@/components/layouts/MainLayout";
import { ReactNode } from "react";

interface GuruLayoutProps {
  children: ReactNode;
}

export default function GuruLayout({ children }: GuruLayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
