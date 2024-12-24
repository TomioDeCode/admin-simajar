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
import { useState, useCallback } from "react";
import { fetchData } from "@/utils/fetchData";
import { useRouter } from "next/navigation";
import { clientAuth } from "@/utils/clientAuth.ts";

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

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchData<LoginResponse>(LOGIN_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(credentials),
        requireAuth: false,
        timeout: 10000,
        retryCount: 2,
        retryDelay: 1000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.is_success) {
        throw new Error(response.error || "Login failed. Please try again.");
      }

      if (!response.data?.token) {
        throw new Error("Invalid response from server");
      }

      clientAuth.setToken(response.data.token);
      router.push("/dashboard");

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred during login.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [credentials, router]);

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)} {...props}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={credentials.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                autoComplete="email"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                autoComplete="current-password"
                className="w-full"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 font-medium text-center">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !credentials.email || !credentials.password}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
