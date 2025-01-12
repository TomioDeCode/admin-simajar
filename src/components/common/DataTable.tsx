import React, { useState } from "react";
import { Pencil, Trash2, Search, ChevronDown } from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ColumnConfig } from "@/types/tableReus";

export interface ColumnConfigR extends ColumnConfig  {
  formatter?: (value: any, row?: any) => string | number;
}

export interface TableData {
  id: string | number;
  [key: string]: any;
}

interface DataTableProps<T> {
  columns: ColumnConfigR[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  currentPage?: number;
  perPage: number;
  total_data: number;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onSearch?: (search: string) => void;
  className?: string;
}

const formatValue = (
  value: any,
  formatter?: (value: any, row?: any) => string | number,
  row?: any
) => {
  if (formatter) return formatter(value, row);
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";

  if (
    value instanceof Date ||
    (typeof value === "string" && value.includes("T"))
  ) {
    try {
      return format(new Date(value), "dd MMM yyyy HH:mm");
    } catch {
      return String(value);
    }
  }

  return String(value ?? "");
};

const MobileTableRow = <T extends TableData>({
  item,
  columns,
  onEdit,
  onDelete,
}: {
  item: T;
  columns: ColumnConfigR[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full rounded-md border border-border bg-card hover:bg-accent/5 transition-colors"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex-1 space-y-1">
          <div className="font-medium">
            {formatValue(item[columns[0].accessor], columns[0].formatter, item)}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatValue(
              item[columns[1]?.accessor],
              columns[1]?.formatter,
              item
            )}
          </div>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="hover:bg-transparent">
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="px-4 pb-4 space-y-3 border-t pt-3">
          {columns.slice(2).map((column) => (
            <div
              key={column.accessor}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-muted-foreground font-medium">
                {column.header}
              </span>
              <span>
                {formatValue(item[column.accessor], column.formatter, item)}
              </span>
            </div>
          ))}
          {(onEdit || onDelete) && (
            <div className="flex justify-end space-x-2 mt-4 pt-2 border-t">
              {onEdit && (
                <Button
                  onClick={() => onEdit(item)}
                  variant="ghost"
                  size="sm"
                  className="h-8 hover:bg-primary/10"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  onClick={() => onDelete(item)}
                  variant="ghost"
                  size="sm"
                  className="h-8 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export function DataTable<T extends TableData>({
  columns,
  data,
  onEdit,
  onDelete,
  currentPage = 1,
  perPage,
  total_data,
  isLoading,
  onPageChange,
  onPerPageChange,
  onSearch,
  className,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const totalPages = Math.ceil(total_data / perPage);
  const startIndex = (currentPage - 1) * perPage + 1;
  const endIndex = Math.min(currentPage * perPage, total_data);

  // Handle responsive breakpoint
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  if (isLoading) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground animate-pulse">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const tableData = Array.isArray(data) ? data : [];

  return (
    <Card className={cn("border shadow-sm", className)}>
      <CardHeader className="space-y-4 px-4 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:w-72">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 bg-background/50 focus:bg-background w-full"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Rows per page
            </span>
            <Select
              value={String(perPage)}
              onValueChange={(value) => onPerPageChange?.(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 25, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="overflow-x-auto">
          {isMobile ? (
            <div className="space-y-3">
              {tableData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-sm text-muted-foreground">
                  <p>No data available</p>
                </div>
              ) : (
                tableData.map((item) => (
                  <MobileTableRow
                    key={item.id}
                    item={item}
                    columns={columns}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="rounded-md border min-w-full inline-block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    {columns.map((column) => (
                      <TableHead
                        key={column.accessor}
                        className="font-semibold whitespace-nowrap"
                      >
                        {column.header}
                      </TableHead>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                        className="h-32 text-center"
                      >
                        <div className="text-sm text-muted-foreground">
                          No data available
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    tableData.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/50">
                        {columns.map((column) => (
                          <TableCell
                            key={`${item.id}-${column.accessor}`}
                            className="py-3 whitespace-nowrap"
                          >
                            {formatValue(
                              item[column.accessor],
                              column.formatter,
                              item
                            )}
                          </TableCell>
                        ))}
                        {(onEdit || onDelete) && (
                          <TableCell className="text-right whitespace-nowrap">
                            <div className="flex justify-end space-x-2">
                              {onEdit && (
                                <Button
                                  onClick={() => onEdit(item)}
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-primary/10"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              )}
                              {onDelete && (
                                <Button
                                  onClick={() => onDelete(item)}
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-4">
          <div className="text-sm text-muted-foreground order-2 sm:order-1">
            {total_data > 0
              ? `Showing ${startIndex} to ${endIndex} of ${total_data} results`
              : "No results"}
          </div>
          <div className="flex space-x-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1 || total_data === 0}
              className="hover:bg-muted/50"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages || total_data === 0}
              className="hover:bg-muted/50"
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
