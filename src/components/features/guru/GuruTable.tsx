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
import { createColumns } from "@/components/features/guru/GuruColums"; // Updated import path
import { GuruType } from "@/types/table"; // Fixed import
import { ArrowUpDown, Plus } from "lucide-react";
import { DialogForm } from "@/components/common/DialogForm";
import { GURU_FIELDS } from "@/constants/field.constants";

const INITIAL_DATA: GuruType[] = [
  {
    id: 1,
    name: "Budi Santoso",
    nip: "198501152010011001",
    mapel: "Matematika",
    gender: "L",
    status: "active",
  },
  {
    id: 2,
    name: "Siti Aminah",
    nip: "198703222011012002",
    mapel: "Bahasa Indonesia",
    gender: "P",
    status: "active",
  },
];

export function GuruTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [data, setData] = useState<GuruType[]>(INITIAL_DATA);

  const handleSubmit = useCallback(
    (formData: Partial<GuruType>) => {
      const newItem: GuruType = {
        id: data.length + 1,
        ...formData,
      } as GuruType;
      setData((prevData) => [...prevData, newItem]);
    },
    [data.length]
  );

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
                onClick={header.column.getToggleSortingHandler()}
                className={`
                px-6 py-4 text-left text-sm font-semibold text-gray-700
                transition-all duration-200 first:rounded-tl-xl last:rounded-tr-xl
                ${
                  header.column.getCanSort()
                    ? "cursor-pointer hover:text-gray-900"
                    : ""
                }
              `}
              >
                <div className="flex items-center gap-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getCanSort() && (
                    <ArrowUpDown className="w-4 h-4 text-gray-400 hover:text-gray-600" />
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
                  className="px-6 py-4 text-gray-600 text-sm"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-32 text-center">
              <div className="flex flex-col justify-center items-center space-y-2">
                <p className="text-gray-500 text-sm">
                  Tidak ada data ditemukan.
                </p>
                <p className="text-gray-400 text-sm">
                  Coba sesuaikan pencarian atau filter Anda
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
      <div className="flex justify-between items-center px-4">
        <TableSearch
          value={filtering}
          onChange={setFiltering}
          className="w-72 focus-within:w-96 transition-all"
        />
        <DialogForm
          title="Tambah Guru"
          description="Tambahkan data guru baru ke sistem"
          fields={GURU_FIELDS}
          onSubmit={handleSubmit}
          trigger={
            <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-sm text-white transition-all focus:outline-none">
              <Plus className="w-4 h-4" />
              Tambah Guru
            </button>
          }
        />
      </div>

      <div className="border-gray-200 bg-white ring-opacity-5 shadow-lg border rounded-xl ring-1 ring-black overflow-hidden">
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
