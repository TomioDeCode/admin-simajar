import { ApiResponse, FetchConfig } from "@/types/api";
import { FETCH_CONSTANTS } from "@/constants/fetch.constants";
import { FetchError } from "@/utils/errors";
import { delay, createHeaders } from "@/utils/helpers";

async function fetchWithRetry(
  url: string,
  config: FetchConfig,
  attempt: number = 1
): Promise<Response> {
  const controller = new AbortController();
  const timeout = config.timeout || FETCH_CONSTANTS.TIMEOUT;

  try {
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const shouldRetry =
      !response.ok &&
      attempt < (config.retryCount || FETCH_CONSTANTS.RETRY_COUNT);

    if (shouldRetry) {
      await delay(config.retryDelay || FETCH_CONSTANTS.RETRY_DELAY);
      return fetchWithRetry(url, config, attempt + 1);
    }

    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new FetchError(
        `Request timeout after ${timeout}ms`,
        FETCH_CONSTANTS.STATUS.TIMEOUT
      );
    }
    throw error;
  }
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const responseData = await response.json();

  return {
    status: response.status,
    is_success: response.ok,
    message: responseData.message || "",
    data: response.ok ? responseData.data : null,
    error: response.ok ? null : responseData.message || "An error occurred",
    isLoading: false,
  };
}

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
    error instanceof Error ? error.message : "An error occurred";

  return {
    status: FETCH_CONSTANTS.STATUS.SERVER_ERROR,
    is_success: false,
    message: errorMessage,
    data: null,
    error: errorMessage,
    isLoading: false,
  };
}

export async function fetchData<T>(
  url: string,
  config: FetchConfig = {}
): Promise<ApiResponse<T>> {
  const { requireAuth = false, ...restConfig } = config;

  try {
    const headers = createHeaders(requireAuth, restConfig.headers);

    const response = await fetchWithRetry(url, {
      ...restConfig,
      headers,
      credentials: "include",
    });

    return parseResponse<T>(response);
  } catch (error) {
    return handleError(error);
  }
}