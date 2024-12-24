import { Metadata } from "next";
import LoginLayout from "@/components/layouts/LoginLayout";

export const metadata: Metadata = {
  title: "Login - Sistem Informasi Sekolah",
  description: "Halaman login untuk Sistem Informasi Sekolah"
};

export default function Home() {
  return (
    <main>
      <LoginLayout />
    </main>
  );
}
