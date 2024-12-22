"use client";

export const clientAuth = {
  setToken: (token: string) => {
    document.cookie = `token=${token}; path=/; secure; samesite=strict`;
  },

  removeToken: () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  },

  getToken: (): string | null => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    return token ? token.split("=")[1] : null;
  },
};
