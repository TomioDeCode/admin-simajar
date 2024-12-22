import { API_BASE_URL } from "@/constants/api.constants";

export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = API_BASE_URL?.replace(/\/$/, "");
  const cleanEndpoint = endpoint.replace(/^\//, "");
  return `${baseUrl}/${cleanEndpoint}`;
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};
