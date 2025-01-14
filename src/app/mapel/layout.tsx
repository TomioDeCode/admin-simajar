import { MainLayout } from "@/layouts/MainLayout";
import { ReactNode } from "react";

interface MapelLayoutProps {
  children: ReactNode;
}

export default function MapelLayout({ children }: MapelLayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}