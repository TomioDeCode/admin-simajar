import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { fetchData } from '@/utils/fetchData'
import { ApiResponse, FetchConfig } from '@/types/api'

interface UseCustomQueryOptions<T> extends Omit<UseQueryOptions<ApiResponse<T>, Error>, 'queryFn'> {
  url: string
  fetchConfig?: FetchConfig
}

export function useCustomQuery<T>({
  url,
  fetchConfig,
  ...options
}: UseCustomQueryOptions<T>) {
  return useQuery({
    ...options,
    queryFn: async () => {
      const response = await fetchData<T>(url, fetchConfig)
      return response
    }
  })
} 