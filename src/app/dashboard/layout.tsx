import { MainLayout } from "@/components/layouts/MainLayout";
import React from "react";

export default function Page({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
