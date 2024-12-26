import { ApiResponse, FetchConfig } from "@/types/api";
import { FETCH_CONSTANTS } from "@/constants/fetch.constants";
import { FetchError } from "@/utils/errors";
import { delay, createHeaders } from "@/utils/helpers";
import { getToken } from "./serverAuth";

/**
 * Performs a fetch request with retry capability and timeout handling
 */
async function fetchWithRetry(
  url: string,
  config: FetchConfig,
  attempt: number = 1
): Promise<Response> {
  const controller = new AbortController();
  const timeout = config.timeout ?? FETCH_CONSTANTS.TIMEOUT;

  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        controller.abort();
        reject(
          new FetchError(
            `Request timeout after ${timeout}ms`,
            FETCH_CONSTANTS.STATUS.TIMEOUT
          )
        );
      }, timeout);
    });

    const fetchPromise = fetch(url, {
      ...config,
      headers: config.headers,
      signal: controller.signal,
    });

    const response = await Promise.race([fetchPromise, timeoutPromise]);

    if (response.status === 401) {
      throw new FetchError(
        "Unauthorized - Please login again",
        FETCH_CONSTANTS.STATUS.UNAUTHORIZED
      );
    }

    const shouldRetry =
      !response.ok &&
      response.status !== 401 &&
      attempt < (config.retryCount ?? FETCH_CONSTANTS.RETRY_COUNT);

    if (shouldRetry) {
      await delay(config.retryDelay ?? FETCH_CONSTANTS.RETRY_DELAY);
      return fetchWithRetry(url, config, attempt + 1);
    }

    return response;
  } catch (error) {
    if (error instanceof FetchError) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new FetchError(
        `Request timeout after ${timeout}ms`,
        FETCH_CONSTANTS.STATUS.TIMEOUT
      );
    }
    throw error;
  }
}

/**
 * Parses the API response into a standardized format
 */
async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const responseData = await response.json().catch(() => ({}));

  return {
    status: response.status,
    is_success: response.ok,
    message: responseData.message ?? "",
    data: response.ok ? responseData.data : null,
    error: response.ok ? null : responseData.message ?? "An error occurred",
    isLoading: false,
  };
}

/**
 * Handles various error types and returns a standardized error response
 */
function handleError(error: unknown): ApiResponse<never> {
  if (error instanceof FetchError) {
    return {
      status: error.status,
      is_success: false,
      message: error.message,
      data: null,
      error: error.message,
      isLoading: false,
    };
  }

  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";

  return {
    status: FETCH_CONSTANTS.STATUS.SERVER_ERROR,
    is_success: false,
    message: errorMessage,
    data: null,
    error: errorMessage,
    isLoading: false,
  };
}

/**
 * Main fetch function that handles authentication and error handling
 */
export async function fetchData<T>(
  url: string,
  config: FetchConfig = {}
): Promise<ApiResponse<T>> {
  const { requireAuth = false, ...restConfig } = config;

  try {
    const headers = createHeaders(requireAuth, restConfig.headers);

    if (requireAuth) {
      const token = await getToken();
      if (!token) {
        throw new FetchError(
          "Unauthorized - Please login again",
          FETCH_CONSTANTS.STATUS.UNAUTHORIZED
        );
      }
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetchWithRetry(url, {
      ...restConfig,
      headers,
    });

    return parseResponse<T>(response);
  } catch (error) {
    return handleError(error);
  }
}
