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
import { RuanganType } from "@/types/table";
import { ArrowUpDown, Plus } from "lucide-react";
import { DialogForm } from "@/components/common/DialogForm";
import { RUANGAN_FIELDS } from "@/constants/field.constants";
import { RuanganColumns } from "./RuanganColums";

const INITIAL_DATA: RuanganType[] = [
  {
    id: 1,
    name: "Ruang 101",
    capacity: 30,
    type: "kelas",
    status: "available",
  },
  {
    id: 2,
    name: "Lab Komputer",
    capacity: 25,
    type: "lab",
    status: "maintenance",
  },
];

export function RuanganTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [data, setData] = useState<RuanganType[]>(INITIAL_DATA);

  const handleSubmit = useCallback(
    (formData: Partial<RuanganType>) => {
      const newItem: RuanganType = {
        id: data.length + 1,
        name: formData.name || "",
        capacity: formData.capacity || 0,
        type: formData.type || "kelas",
        status: formData.status || "available",
      };
      setData((prevData) => [...prevData, newItem]);
    },
    [data.length]
  );

  const columns = RuanganColumns(data, setData);

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
              data-testid="table-row"
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
            <TableCell
              colSpan={columns.length}
              className="h-32 text-center text-gray-500 text-sm"
            >
              <div className="flex flex-col justify-center items-center space-y-2">
                <p>Tidak ada data ditemukan.</p>
                <p className="text-gray-400">
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
          placeholder="Cari ruangan..."
        />
        <DialogForm
          title="Tambah Ruangan"
          description="Tambahkan ruangan baru ke sistem"
          fields={RUANGAN_FIELDS}
          onSubmit={handleSubmit}
          trigger={
            <button
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-sm text-white transition-all focus:outline-none"
              data-testid="add-room-button"
            >
              <Plus className="w-4 h-4" />
              Tambah Ruangan
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
