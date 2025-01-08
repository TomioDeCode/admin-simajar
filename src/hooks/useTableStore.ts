import { create } from "zustand";
import { fetchData } from "@/utils/fetchData";
import { ApiResponse, FetchConfig } from "@/types/api";

interface PaginationParams {
  page: number;
  perPage: number;
  search?: string;
}

interface TableState<T> {
  data: T[];
  filteredData: T[];
  pageData: T[];
  meta: {
    currentPage: number;
    perPage: number;
    total_data: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  fetchData: (endpoint: string, params: PaginationParams) => Promise<void>;
  addItem: (endpoint: string, item: Partial<T>) => Promise<void>;
  updateItem: (endpoint: string, item: T) => Promise<void>;
  deleteItem: (endpoint: string, id: string) => Promise<void>;
  setSearch: (search: string, searchFields: (keyof T)[]) => void;
}

export const createTableStore = <T extends { id: string }>() => {
  return create<TableState<T>>((set, get) => ({
    data: [],
    filteredData: [],
    pageData: [],
    meta: null,
    isLoading: false,
    error: null,

    fetchData: async (endpoint: string, params: PaginationParams) => {
      set({ isLoading: true, error: null });
      try {
        const queryParams = new URLSearchParams({
          page: params.page.toString(),
          perPage: params.perPage.toString(),
        });

        const config: FetchConfig = {
          method: "GET",
          requireAuth: true,
        };

        const result = await fetchData<T[]>(
          `${endpoint}?${queryParams}`,
          config
        );

        const dataPage = result.data.total_data;

        if (!result.is_success) {
          throw new Error(result.message || "Failed to fetch data");
        }

        const newData = result.data.data || [];

        set({
          data: newData,
          pageData: dataPage,
          filteredData: newData,
          meta: result.data
            ? {
                currentPage: params.page,
                perPage: params.perPage,
                total_data: Array.isArray(result.data)
                  ? result.data.total_data
                  : 0,
              }
            : null,
          isLoading: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to fetch data",
          isLoading: false,
        });
      }
    },

    setSearch: (search: string, searchFields: (keyof T)[]) => {
      const { data } = get();
      if (!search.trim()) {
        set({ filteredData: data });
        return;
      }

      const searchLower = search.toLowerCase();
      const filtered = data.filter((item) => {
        return searchFields.some((field) => {
          const value = item[field];
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchLower);
          }
          if (typeof value === "number") {
            return value.toString().includes(searchLower);
          }
          return false;
        });
      });

      set({
        filteredData: filtered,
        meta: get().meta
          ? {
              ...get().meta,
              total_data: filtered.length,
            }
          : null,
      });
    },

    addItem: async (endpoint: string, item: Partial<T>) => {
      try {
        const config: FetchConfig = {
          method: "POST",
          requireAuth: true,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        };

        const result = await fetchData<T>(endpoint, config);

        if (!result.is_success) {
          throw new Error(result.message || "Failed to add item");
        }

        const { meta } = get();
        if (meta) {
          await get().fetchData(endpoint, {
            page: meta.currentPage,
            perPage: meta.perPage,
          });
        }
      } catch (error) {
        throw new Error("Failed to add item");
      }
    },

    updateItem: async (endpoint: string, item: T) => {
      try {
        const config: FetchConfig = {
          method: "PUT",
          requireAuth: true,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        };

        const result = await fetchData<T>(`${endpoint}/${item.id}`, config);

        if (!result.is_success) {
          throw new Error(result.message || "Failed to update item");
        }

        const { meta } = get();
        if (meta) {
          await get().fetchData(endpoint, {
            page: meta.currentPage,
            perPage: meta.perPage,
          });
        }
      } catch (error) {
        throw new Error("Failed to update item");
      }
    },

    deleteItem: async (endpoint: string, id: string) => {
      try {
        const config: FetchConfig = {
          method: "DELETE",
          requireAuth: true,
        };

        const result = await fetchData(`${endpoint}/${id}`, config);

        if (!result.is_success) {
          throw new Error(result.message || "Failed to delete item");
        }

        const { meta } = get();
        if (meta) {
          await get().fetchData(endpoint, {
            page: meta.currentPage,
            perPage: meta.perPage,
          });
        }
      } catch (error) {
        throw new Error("Failed to delete item");
      }
    },
  }));
};

export const createJurusanStore = () => createTableStore();
