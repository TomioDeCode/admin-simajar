export interface BaseColumnConfig {
  accessor: string;
  header: string;
}

export interface ColumnConfigR extends ColumnConfig {
  formatter?: (value: any) => string | number;
}

import { ColumnConfig, TableData } from "@/types/tableReus";
import { useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DataTableProps<T> {
  columns: ColumnConfigR[];
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

const formatValue = (
  value: any,
  formatter?: (value: any) => string | number
) => {
  if (formatter) {
    return formatter(value);
  }

  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Ya" : "Tidak";
  }

  if (
    value instanceof Date ||
    (typeof value === "string" && value.includes("T"))
  ) {
    try {
      const date = new Date(value);
      return format(date, "dd MMM yyyy HH:mm");
    } catch {
      return String(value);
    }
  }

  return String(value ?? "");
};

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
  const startIndex = (currentPage - 1) * perPage + 1;
  const endIndex = Math.min(currentPage * perPage, total_data);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const renderEmptyState = () => (
    <TableRow>
      <TableCell
        colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
        className="h-32 text-center"
      >
        <div className="flex flex-col items-center justify-center text-sm">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </TableCell>
    </TableRow>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-transparent">
      <CardHeader className="mb-5">
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={String(perPage)}
              onValueChange={(value) => onPerPageChange(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 15, 25, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessor}>{column.header}</TableHead>
              ))}
              {(onEdit || onDelete) && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0
              ? renderEmptyState()
              : data.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((column) => (
                      <TableCell key={`${item.id}-${column.accessor}`}>
                        {formatValue(item[column.accessor], column.formatter)}
                      </TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {onEdit && (
                            <Button
                              onClick={() => onEdit(item)}
                              variant="ghost"
                              size="icon"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              onClick={() => onDelete(item)}
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            {total_data > 0
              ? `Showing ${startIndex} to ${endIndex} of ${total_data} results`
              : "No results"}
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
              disabled={currentPage === totalPages || total_data === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DataTable;
