import { MainLayout } from "@/components/layouts/MainLayout";
import { ReactNode } from "react";

interface RuanganLayoutProps {
  children: ReactNode;
}

export default function RuanganLayout({ children }: RuanganLayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
