export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export const DEFAULT_API_RESPONSE = {
  status: 0,
  is_success: false,
  message: "",
  data: null,
  error: null,
  isLoading: true,
  timestamp: new Date().toISOString(),
} as const;

export type ApiResponse<T = unknown> = typeof DEFAULT_API_RESPONSE & {
  data: T | null;
};
