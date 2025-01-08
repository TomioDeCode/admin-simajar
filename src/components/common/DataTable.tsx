import { ColumnConfig, TableData } from "@/types/tableReus";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";

interface DataTableProps<T> {
  columns: ColumnConfig[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  currentPage: number;
  perPage: number;
  total_data: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  onSearch?: (search: string) => void;
}

export function DataTable<T extends TableData>({
  columns,
  data,
  onEdit,
  onDelete,
  currentPage,
  perPage,
  total_data,
  isLoading,
  onPageChange,
  onPerPageChange,
  onSearch,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const totalPages = Math.ceil(total_data / perPage);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!data?.length && !isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">No data available</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Rows per page:</span>
          <Select
            value={String(perPage)}
            onValueChange={(value) => onPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 bg-gray-50">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id}>
                {columns.map((column) => (
                  <td
                    key={`${item.id}-${column.accessor}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {item[column.accessor]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {onEdit && (
                      <Button
                        onClick={() => onEdit(item)}
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        onClick={() => onDelete(item)}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * perPage + 1} to{" "}
          {Math.min(currentPage * perPage, total_data)} of {total_data} results
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
