"use server";

import { cookies } from "next/headers";

const TOKEN_NAME = "token";
const MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * Gets the authentication token from cookies
 * @returns The token value if present, undefined otherwise
 */
export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value;
}

/**
 * Sets the authentication token in cookies with secure defaults
 * @param token - The token value to store
 */
export async function setServerToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
    httpOnly: true
  });
}

/**
 * Removes the authentication token from cookies
 */
export async function removeServerToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete({
    name: TOKEN_NAME,
    path: "/",
    secure: true
  });
}
