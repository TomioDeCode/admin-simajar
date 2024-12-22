export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const DEFAULT_API_RESPONSE = {
  status: 0,
  is_success: false,
  message: "",
  data: null,
  error: null,
  isLoading: true,
} as const;
