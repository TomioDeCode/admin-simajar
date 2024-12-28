import { MainLayout } from "@/components/layouts/MainLayout";
import { ReactNode } from "react";

interface JurusanLayoutProps {
    children: ReactNode;
}

export default function JurusanLayout({ children }: JurusanLayoutProps) {
    return <MainLayout>{children}</MainLayout>;
}
