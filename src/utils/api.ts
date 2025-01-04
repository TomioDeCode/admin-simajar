import { API_BASE_URL } from "@/constants/api";

/**
 * Builds a complete API URL by combining the base URL with an endpoint
 * @param endpoint - The API endpoint path
 * @returns The complete API URL
 * @throws Error if API_BASE_URL is not defined
 */
export const buildApiUrl = (endpoint: string): string => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined');
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');

  return `${baseUrl}/${cleanEndpoint}`;
};

/**
 * Handles API errors and returns appropriate error messages
 * @param error - The error object to handle
 * @returns A user-friendly error message
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  return 'An unexpected error occurred';
};
