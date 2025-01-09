import { create } from "zustand";
import { fetchData } from "@/utils/fetchData";
import { FetchConfig } from "@/types/api";

interface PaginationParams {
  page: number;
  perPage: number;
  search?: string;
}

interface TableState<T> {
  data: {
    data: T[];
    total_data: number;
    current_page: number;
    per_page: number;
  };
  filteredData: T[];
  pageData: number;
  isLoading: boolean;
  error: string | null;
  meta: {
    currentPage: number;
    perPage: number;
    total_data: number;
  } | null;
  fetchData: (endpoint: string, params: PaginationParams) => Promise<void>;
  addItem: (endpoint: string, item: Partial<T>) => Promise<void>;
  updateItem: (endpoint: string, item: T) => Promise<void>;
  deleteItem: (endpoint: string, id: string) => Promise<void>;
  setSearch: (search: string, searchFields: (keyof T)[]) => void;
}

export const createTableStore = <T extends { id: string }>() => {
  return create<TableState<T>>((set, get) => ({
    data: {
      data: [],
      total_data: 0,
      current_page: 1,
      per_page: 10,
    },
    pageData: 0,
    filteredData: [],
    isLoading: false,
    error: null,
    meta: null,

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

        const result = await fetchData<{
          data: T[];
          total_data: number;
          current_page: number;
          per_page: number;
        }>(`${endpoint}?${queryParams}`, config);

        if (!result.data || !result.is_success) {
          throw new Error(result.error || "Failed to fetch data");
        }

        const dataPage = result.data.total_data;

        const newData = {
          data: result.data.data || [],
          total_data: result.data.total_data || 0,
          current_page: result.data.current_page || 1,
          per_page: result.data.per_page || 10,
        };

        set({
          data: newData,
          filteredData: newData.data,
          pageData: dataPage ?? 0,
          meta: {
            currentPage: params.page,
            perPage: params.perPage,
            total_data: newData.total_data,
          },
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
        set({ filteredData: data.data });
        return;
      }

      const searchLower = search.toLowerCase();
      const filtered = data.data.filter((item) => {
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

      set({ filteredData: filtered });
    },

    addItem: async (endpoint: string, item: Partial<T>) => {
      try {
        const formattedItem = {
          ...item,
          ...("number" in item && {
            number:
              typeof item.number === "string"
                ? parseInt(item.number)
                : item.number,
          }),
          ...("start_date" in item && {
            start_date: item.start_date
              ? new Date(item.start_date as string)
                  .toISOString()
                  .split("T")[0] + "T00:00:00Z"
              : undefined,
          }),
          ...("end_date" in item && {
            end_date: item.end_date
              ? new Date(item.end_date as string).toISOString().split("T")[0] +
                "T00:00:00Z"
              : undefined,
          }),
        };

        const config: FetchConfig = {
          method: "POST",
          requireAuth: true,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedItem),
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
        throw new Error(
          error instanceof Error ? error.message : "Failed to add item"
        );
      }
    },

    updateItem: async (endpoint: string, item: T) => {
      try {
        const formattedItem = {
          ...item,
          ...("number" in item && {
            number:
              typeof item.number === "string"
                ? parseInt(item.number)
                : item.number,
          }),
          ...("start_date" in item && {
            start_date: item.start_date
              ? new Date(item.start_date as string)
                  .toISOString()
                  .split("T")[0] + "T00:00:00Z"
              : undefined,
          }),
          ...("end_date" in item && {
            end_date: item.end_date
              ? new Date(item.end_date as string).toISOString().split("T")[0] +
                "T00:00:00Z"
              : undefined,
          }),
        };

        const config: FetchConfig = {
          method: "PUT",
          requireAuth: true,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedItem),
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
        throw new Error(
          error instanceof Error ? error.message : "Failed to update item"
        );
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
        throw new Error(
          error instanceof Error ? error.message : "Failed to delete item"
        );
      }
    },
  }));
};

export const createJurusanStore = createTableStore;
