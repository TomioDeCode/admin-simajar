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
import { TablePagination } from "@/fragments/TablePagination";
import { TableSearch } from "@/fragments/TableSearch";
import { createColumns } from "@/components/features/guru/GuruColums";
import { GuruType } from "@/types/table";
import { ArrowUpDown, Plus, ChevronDown } from "lucide-react";
import { DialogForm } from "@/components/common/DialogForm";
import { GURU_FIELDS } from "@/constants/field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TbGenderDemiboy, TbGenderDemigirl } from "react-icons/tb";
import { DeleteDialog } from "@/components/common/DeleteDialog";

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
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const handleSubmit = useCallback(
    (formData: Partial<GuruType>) => {
      const newItem: GuruType = {
        id: data.length + 1,
        ...formData,
      } as GuruType;
      setData((prev) => [...prev, newItem]);
    },
    [data.length]
  );

  const handleUpdate = useCallback((id: number, newData: Partial<GuruType>) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...newData } : item))
    );
  }, []);

  const handleDelete = useCallback((id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const columns = useMemo(() => createColumns(data, setData), [data]);

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
        pageSize: 1,
      },
    },
  });

  const toggleRowExpansion = useCallback((rowId: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  }, []);

  const renderMobileRow = useCallback(
    (row: any) => {
      const isExpanded = expandedRows[row.id];
      const rowData = row.original;

      return (
        <div key={row.id} className="border-b border-gray-200 last:border-0">
          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleRowExpansion(row.id)}
          >
            <div className="flex-1">
              <div className="font-medium">{rowData.name}</div>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <Badge variant="outline" className="text-xs">
                  {rowData.mapel}
                </Badge>
                {rowData.gender === "L" ? (
                  <TbGenderDemiboy className="w-4 h-4 text-blue-600" />
                ) : (
                  <TbGenderDemigirl className="w-4 h-4 text-pink-600" />
                )}
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
          {isExpanded && (
            <div className="px-4 pb-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">NIP:</span>
                <span className="font-medium">{rowData.nip}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Status:</span>
                <Badge className="capitalize">{rowData.status}</Badge>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t">
                <DialogForm
                  title="Update Guru"
                  description="Edit informasi guru"
                  fields={GURU_FIELDS}
                  initialData={rowData}
                  isUpdate
                  onSubmit={(newData) => handleUpdate(rowData.id, newData)}
                />
                <DeleteDialog
                  text="Guru"
                  onConfirm={() => handleDelete(rowData.id)}
                />
              </div>
            </div>
          )}
        </div>
      );
    },
    [expandedRows, handleUpdate, handleDelete]
  );

  const renderDesktopTable = useCallback(
    () => (
      <div className="border-gray-200 bg-white ring-opacity-5 shadow-lg border rounded-xl ring-1 ring-black overflow-x-auto">
        <Table>
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
                    className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <ArrowUpDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-gray-100 hover:bg-gray-50/80"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-3 text-sm text-gray-600"
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
                  className="h-32 text-center"
                >
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
        </Table>
      </div>
    ),
    [table, columns]
  );

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
        <TableSearch
          value={filtering}
          onChange={setFiltering}
          className="w-full sm:w-72 lg:w-96 transition-all"
        />
        <DialogForm
          title="Tambah Guru"
          description="Tambahkan data guru baru ke sistem"
          fields={GURU_FIELDS}
          onSubmit={handleSubmit}
          trigger={
            <Button
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
              aria-label="Tambah Guru Baru"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Tambah Guru
            </Button>
          }
        />
      </div>

      <div className="hidden md:block">{renderDesktopTable()}</div>

      <div className="md:hidden bg-white shadow rounded-xl overflow-hidden">
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map(renderMobileRow)
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p className="text-sm">Tidak ada data ditemukan.</p>
            <p className="text-sm text-gray-400">
              Coba sesuaikan pencarian atau filter Anda
            </p>
          </div>
        )}
      </div>

      <div className="px-4">
        <TablePagination table={table as any} />
      </div>
    </div>
  );
}
