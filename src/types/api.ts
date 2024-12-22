export interface ApiResponse<T> {
  status: number;
  is_success: boolean;
  message: string;
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export interface FetchConfig<T = any> extends RequestInit {
  requireAuth?: boolean;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
}