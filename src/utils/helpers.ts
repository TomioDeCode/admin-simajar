import { FETCH_CONSTANTS } from "@/constants/fetch.constants";
import { FetchError } from "./errors";
import { getToken } from "./serverAuth";

/**
 * Delays execution for specified milliseconds
 * @param ms - Number of milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates headers for API requests with optional authentication
 * @param requireAuth - Whether authentication is required
 * @param existingHeaders - Optional existing headers to include
 * @returns Headers object with content-type and optional auth token
 * @throws FetchError if authentication is required but token is missing
 */
export const createHeaders = (
  requireAuth: boolean,
  existingHeaders?: HeadersInit
): Headers => {
  const headers = new Headers({
    "Content-Type": "application/json",
    ...(existingHeaders || {}) 
  });
  
  if (requireAuth) {
    const token = getToken();
    if (!token) {
      throw new FetchError(
        "Authentication token is missing",
        FETCH_CONSTANTS.STATUS.UNAUTHORIZED
      );
    }
    headers.append("Authorization", `Bearer ${token}`);
  }

  return headers;
};
