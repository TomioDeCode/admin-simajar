"use client";

import { useState, useCallback } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/fragments/TablePagination";
import { TableSearch } from "@/components/fragments/TableSearch";
import { createColumns } from "@/components/ellements/ColumnsTable";
import { DataType } from "@/types/form";
import { FormField } from "@/types/form";
import { ArrowUpDown } from "lucide-react";
import { DialogForm } from "../common/DialogForm";

const USER_FIELDS: FormField[] = [
  {
    id: "name",
    label: "Name",
    type: "text", 
    placeholder: "Enter name",
    required: true,
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter email",
  },
  {
    id: "role",
    label: "Role",
    type: "select",
    options: [
      { value: "Admin", label: "Admin" },
      { value: "User", label: "User" },
    ],
  },
  {
    id: "status",
    label: "Status", 
    type: "select",
    options: [
      { value: "Active", label: "Active" },
      { value: "Inactive", label: "Inactive" },
    ],
  },
];

const INITIAL_DATA: DataType[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com", 
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User", 
    status: "Inactive",
  },
];

export function DataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [data, setData] = useState<DataType[]>(INITIAL_DATA);

  const handleSubmit = useCallback((formData: Record<string, any>) => {
    const newItem: DataType = {
      id: data.length + 1,
      name: formData.name as string,
      email: formData.email as string,
      role: formData.role as string,
      status: formData.status as string,
    };
    setData((prevData) => [...prevData, newItem]);
  }, [data.length]);

  const columns = createColumns(data, setData);
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  const renderTableHeader = useCallback(() => (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          key={headerGroup.id}
          className="bg-gray-50/80 hover:bg-gray-50"
        >
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              onClick={header.column.getToggleSortingHandler()}
              className={`
                px-6 py-2 text-left text-sm font-semibold text-gray-900
                transition-colors duration-200
                ${header.column.getCanSort() ? "cursor-pointer hover:bg-gray-100" : ""}
              `}
            >
              <div className="flex items-center gap-2">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                {header.column.getCanSort() && (
                  <ArrowUpDown className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                )}
              </div>
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  ), [table]);

  const renderTableBody = useCallback(() => (
    <TableBody>
      {table.getRowModel().rows.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            className="border-b border-gray-100 transition-colors hover:bg-gray-50/60 data-[state=selected]:bg-gray-50"
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className="px-6 py-1 text-sm text-gray-600"
              >
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            className="h-32 text-center text-sm text-gray-500"
          >
            No results found.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  ), [table, columns.length]);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between px-4">
        <TableSearch
          value={filtering}
          onChange={setFiltering}
          className="w-64"
        />
        <DialogForm
          title="Create User"
          description="Add a new user to the system"
          fields={USER_FIELDS}
          onSubmit={handleSubmit}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
        <Table>
          {renderTableHeader()}
          {renderTableBody()}
        </Table>
      </div>

      <div className="px-4">
        <TablePagination table={table} />
      </div>
    </div>
  );
}
