import { FETCH_CONSTANTS } from "@/constants/fetch";
import { FetchError } from "./errors";
import { getToken } from "./cookie";

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

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
