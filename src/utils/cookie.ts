"use server";

import { cookies } from "next/headers";

const TOKEN_NAME = "access_token";

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value;
}

export async function setServerToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: TOKEN_NAME,
    value: token,
  });
}

export async function removeServerToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}
