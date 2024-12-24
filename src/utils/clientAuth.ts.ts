"use client";

export const clientAuth = {
  setToken: (token: string) => {
    const maxAge = 30 * 24 * 60 * 60;
    document.cookie = `token=${token}; path=/; secure; samesite=strict; max-age=${maxAge}`;
  },

  removeToken: () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
  },

  getToken: (): string | null => {
    try {
      const cookies = document.cookie.split(';').map(cookie => cookie.trim());
      const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
      return tokenCookie ? decodeURIComponent(tokenCookie.split('=')[1]) : null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  hasToken: (): boolean => {
    return !!clientAuth.getToken();
  }
};
