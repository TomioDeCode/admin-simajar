export interface TableData {
  id: string;
  [key: string]: any;
}

export interface ColumnConfig {
  header: string;
  accessor: string;
  type?: "text" | "number" | "date" | "select" | "switch" | "time";
  optionsUrl?: string | SelectOption[];
  options?: SelectOption[];
  validation?: {
    required?: boolean;
    pattern?: RegExp;
    min?: number;
    max?: number;
  };
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface TableState<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data_per_page: number;
  total_page: number;
  total_data: number;
  data: T[];
}

export interface ApiResponse<T> {
  status: number;
  is_success: boolean;
  message: string;
  data: PaginatedResponse<T>;
  error: string | null;
  isLoading: boolean;
}

export interface TableActions<T> {
  fetchData: (url: string) => Promise<void>;
  addItem: (url: string, item: Partial<T>) => Promise<void>;
  updateItem: (url: string, item: T) => Promise<void>;
  deleteItem: (url: string, id: string) => Promise<void>;
}
