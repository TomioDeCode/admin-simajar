import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { fetchData } from '@/utils/fetchData'
import { ApiResponse, FetchConfig } from '@/types/api'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface UseCustomQueryOptions<T> extends Omit<UseQueryOptions<ApiResponse<T>, Error>, 'queryFn'> {
  url: string
  method?: HttpMethod
  body?: any
  fetchConfig?: FetchConfig
}

export function useCustomQuery<T>({
  url,
  method = 'GET',
  body,
  fetchConfig,
  ...options
}: UseCustomQueryOptions<T>) {
  return useQuery({
    ...options,
    queryFn: async () => {
      const config: FetchConfig = {
        ...fetchConfig,
        method,
        ...(body && { body: JSON.stringify(body) })
      }
      const response = await fetchData<T>(url, config)
      return response
    }
  })
}