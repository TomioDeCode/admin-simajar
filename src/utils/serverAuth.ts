"use server";

import { cookies } from "next/headers";

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

export async function setServerToken(token: string) {
  (await cookies()).set("token", token, {
    secure: true,
    sameSite: "strict",
    path: "/",
  });
}

export async function removeServerToken() {
  (await cookies()).delete("token");
}
