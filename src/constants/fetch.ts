/**
 * Constants used for fetch request configuration and status codes
 */
export const FETCH_CONSTANTS = {
  TIMEOUT: 30_000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1_000,
  STATUS: {
    TIMEOUT: 408,
    UNAUTHORIZED: 401,
    SERVER_ERROR: 500,
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
  },
} as const;
