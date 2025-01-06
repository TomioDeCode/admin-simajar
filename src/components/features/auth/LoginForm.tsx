"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { fetchData } from "@/utils/fetchData";
import { useRouter } from "next/navigation";
import { clientAuth } from "@/utils/clientAuth";

interface LoginResponse {
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const LOGIN_ENDPOINT = `${API_URL}/auth/login`;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchData<LoginResponse>(LOGIN_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(credentials),
        requireAuth: false,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.is_success) {
        setError(response.error || "Login gagal. Silakan coba lagi.");
        return;
      }

      if (response.data?.token) {
        clientAuth.setToken(response.data.token);
        router.push("/dashboard");
      } else {
        setError("Respon server tidak valid");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">Selamat Datang Kembali</CardTitle>
        <CardDescription>
          Masukkan email Anda untuk login ke akun Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@contoh.com"
                value={credentials.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sedang Login..." : "Login"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
