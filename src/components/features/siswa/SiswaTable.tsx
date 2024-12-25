"use client";

import { useState, useCallback, useMemo } from "react";
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
import { SiswaColumns } from "@/components/features/siswa/SiswaColumns";
import { SiswaType } from "@/types/table";
import { ArrowUpDown, Plus } from "lucide-react";
import { DialogForm } from "@/components/common/DialogForm";
import { SISWA_FIELDS } from "@/constants/field.constants";
import { Button } from "@/components/ui/button";

const INITIAL_DATA: SiswaType[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    studentId: "STD001",
    phoneNumber: "08123456789",
    class: "XII",
    gender: "L",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "student",
    status: "inactive",
    studentId: "STD002",
    phoneNumber: "08198765432",
    class: "XI",
    gender: "P",
  },
];

export function SiswaTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [data, setData] = useState<SiswaType[]>(INITIAL_DATA);

  const handleSubmit = useCallback((formData: Partial<SiswaType>) => {
    const newItem: SiswaType = {
      id: Date.now(),
      name: formData.name?.trim() || "",
      email: formData.email?.trim() || "",
      role: formData.role || "student",
      status: formData.status || "active",
      studentId: formData.studentId?.trim(),
      phoneNumber: formData.phoneNumber?.trim(),
      class: formData.class?.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setData((prevData) => [...prevData, newItem]);
  }, []);

  const columns = useMemo(() => SiswaColumns(data, setData), [data]);

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
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const renderTableHeader = useCallback(
    () => (
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="bg-gradient-to-r from-gray-50 hover:from-gray-100 to-gray-100 hover:to-gray-200"
          >
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                onClick={
                  header.column.getCanSort()
                    ? header.column.getToggleSortingHandler()
                    : undefined
                }
                className={`
                  px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700
                  transition-all duration-200 first:rounded-tl-xl last:rounded-tr-xl
                  ${
                    header.column.getCanSort()
                      ? "cursor-pointer hover:text-gray-900"
                      : ""
                  }
                `}
                role={header.column.getCanSort() ? "button" : undefined}
                aria-sort={
                  header.column.getIsSorted()
                    ? header.column.getIsSorted() === "desc"
                      ? "descending"
                      : "ascending"
                    : undefined
                }
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getCanSort() && (
                    <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-gray-600" />
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
    ),
    [table]
  );

  const renderTableBody = useCallback(
    () => (
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="border-gray-100 data-[state=selected]:bg-blue-50 hover:bg-gray-50/80 border-b transition-all"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-gray-600 text-xs sm:text-sm"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 sm:h-32 text-center text-gray-500 text-xs sm:text-sm"
            >
              <div className="flex flex-col justify-center items-center space-y-1 sm:space-y-2">
                <p>No results found.</p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Try adjusting your search or filters
                </p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    ),
    [table, columns.length]
  );

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2 sm:px-4">
        <TableSearch
          value={filtering}
          onChange={setFiltering}
          className="w-full sm:w-72 sm:focus-within:w-96 transition-all"
        />
        <DialogForm
          title="Tambah Siswa"
          description="Tambahkan data siswa baru"
          fields={SISWA_FIELDS}
          onSubmit={handleSubmit}
          trigger={
            <Button
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm px-3 sm:px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-xs sm:text-sm text-white transition-all focus:outline-none"
              aria-label="Tambah Siswa Baru"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
              Tambah Siswa
            </Button>
          }
        />
      </div>

      <div className="border-gray-200 bg-white ring-opacity-5 shadow-lg border rounded-xl ring-1 ring-black overflow-x-auto">
        <Table>
          {renderTableHeader()}
          {renderTableBody()}
        </Table>
      </div>

      <div className="px-2 sm:px-4">
        <TablePagination table={table} />
      </div>
    </div>
  );
}
