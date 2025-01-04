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
import { TableSearch } from "@/components/fragments/TableSearch";
import { ArrowUpDown, Plus, ChevronDown, CloudCog, ChevronsRight, ChevronRight, ChevronLeft, ChevronsLeft } from "lucide-react";
import { DialogForm } from "@/components/common/DialogForm";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { Generation } from "@/types/table";
import { GENERATION_FIELDS } from "@/constants/field";
import { createColumns } from "./GenerasiColums";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { toast } from "sonner";
import { fetchData } from "@/utils/fetchData";
import { useMutation } from "@tanstack/react-query";

export function AngkatanTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 5;

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
  const ANGKATAN_ENDPOINT = `${API_URL}/generations`;

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useCustomQuery<{ data: Generation[]; total_data: number }>({
    url: `${ANGKATAN_ENDPOINT}?perPage=${pageSize}&page=${pageIndex + 1}`,
    queryKey: ["angkatan", pageIndex, pageSize],
    fetchConfig: {
      requireAuth: true,
    },
  });

  const { mutateAsync: createAngkatan } = useMutation({
    mutationFn: (data: Partial<Generation>) =>
      fetchData(ANGKATAN_ENDPOINT, {
        method: 'POST',
        requireAuth: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
  });

  const { mutateAsync: updateAngkatan } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Generation> }) =>
      fetchData(`${ANGKATAN_ENDPOINT}/${id}`, {
        method: 'PUT',
        requireAuth: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
  });

  const { mutateAsync: deleteAngkatan } = useMutation({
    mutationFn: (id: string) =>
      fetchData(`${ANGKATAN_ENDPOINT}/${id}`, {
        method: 'DELETE',
        requireAuth: true
      })
  });

  const data = response?.data?.data || [];
  const totalItems = response?.data?.total_data || 0;

  const handleSubmit = useCallback(
    async (formData: Partial<Generation>) => {
      try {
        const response = await createAngkatan({
          ...formData,
          number: parseInt(String(formData.number)),
          start_date: formData.start_date
            ? new Date(formData.start_date).toISOString().split('T')[0] + 'T00:00:00Z'
            : undefined,
          end_date: formData.end_date
            ? new Date(formData.end_date).toISOString().split('T')[0] + 'T00:00:00Z'
            : undefined
        });

        if (response.is_success) {
          toast.success("Berhasil menambahkan angkatan baru");
          refetch();
        } else {
          throw new Error(response.error || "Gagal menambahkan angkatan");
        }
      } catch (err) {
        toast.error("Gagal menambahkan angkatan");
        console.error("Error creating angkatan:", err);
      }
    },
    [createAngkatan, refetch]
  );

  const handleUpdate = useCallback(
    async (id: string, formData: Partial<Generation>) => {
      try {
        const formattedFormData = {
          ...formData,
          number: parseInt(String(formData.number)),
          start_date: formData.start_date
            ? new Date(formData.start_date).toISOString().split('T')[0] + 'T00:00:00Z'
            : undefined,
          end_date: formData.end_date
            ? new Date(formData.end_date).toISOString().split('T')[0] + 'T00:00:00Z'
            : undefined,
          is_graduated: Boolean(formData.is_graduated)
        };

        const response = await updateAngkatan({
          id,
          data: formattedFormData
        });

        if (response.is_success && response.data) {
          toast.success("Berhasil memperbarui angkatan");
          refetch();
        } else {
          throw new Error(response.error || "Gagal memperbarui angkatan");
        }
      } catch (err) {
        toast.error("Gagal memperbarui angkatan");
        console.error("Error updating angkatan:", err);
      }
    },
    [updateAngkatan, refetch]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const response = await deleteAngkatan(id);

        if (response.is_success) {
          toast.success("Berhasil menghapus angkatan");
          refetch();
        } else {
          throw new Error(response.error || "Gagal menghapus angkatan");
        }
      } catch (err) {
        toast.error("Gagal menghapus angkatan");
        console.error("Error deleting angkatan:", err);
      }
    },
    [deleteAngkatan, refetch]
  );

  const columns = useMemo(
    () => createColumns(data, handleUpdate, handleDelete),
    [data, handleUpdate, handleDelete]
  );

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
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    manualPagination: true,
    pageCount: Math.ceil(totalItems / pageSize),
  });

  const PaginationControls = () => {
    const totalPages = Math.ceil(totalItems / pageSize);

    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(0)}
            disabled={pageIndex === 0}
            className="hidden sm:inline-flex"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(prev => Math.max(0, prev - 1))}
            disabled={pageIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="flex items-center gap-1 text-sm font-medium">
            Halaman {pageIndex + 1} dari {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={pageIndex >= totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(totalPages - 1)}
            disabled={pageIndex >= totalPages - 1}
            className="hidden sm:inline-flex"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          Total {totalItems} item
        </div>
      </div>
    );
  };

  const toggleRowExpansion = useCallback((rowId: string) => {
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
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
            onClick={() => toggleRowExpansion(row.id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggleRowExpansion(row.id);
              }
            }}
          >
            <div className="flex-1">
              <div className="font-medium text-gray-900">Angkatan {rowData.number}</div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                }`}
            />
          </div>
          {isExpanded && (
            <div className="px-4 pb-4 space-y-3 bg-gray-50">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Nomor:</span>
                <span className="font-medium text-gray-900">
                  {rowData.is_graduated ? "Lulus" : "Belum Lulus"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Tanggal Mulai:</span>
                <span className="font-medium text-gray-900">
                  {new Date(rowData.start_date).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Tanggal Selesai:</span>
                <span className="font-medium text-gray-900">
                  {new Date(rowData.end_date).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t">
                <DialogForm
                  title="Perbarui Angkatan"
                  description="Edit informasi angkatan"
                  fields={GENERATION_FIELDS}
                  initialData={rowData}
                  isUpdate
                  onSubmit={(newData) => handleUpdate(rowData.id, newData)}
                />
                <DeleteDialog
                  text="Angkatan"
                  onConfirm={() => handleDelete(rowData.id)}
                />
              </div>
            </div>
          )}
        </div>
      );
    },
    [expandedRows, handleUpdate, handleDelete, toggleRowExpansion]
  );

  const renderDesktopTable = useCallback(
    () => (
      <div className="border-gray-200 bg-white ring-opacity-5 shadow-lg border rounded-xl ring-1 ring-black overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gradient-to-r from-gray-50 hover:from-gray-100 to-gray-100 hover:to-gray-200 transition-colors duration-200"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-50/50 transition-colors duration-200"
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex justify-center items-center">
                    <span className="text-gray-500">Memuat data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex justify-center items-center text-red-500">
                    {error.message}
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-gray-100 hover:bg-gray-50/80 transition-colors duration-200"
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
    [table, columns, isLoading, error]
  );

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
        <TableSearch
          value={filtering}
          onChange={setFiltering}
          className="w-full sm:w-72 lg:w-96 transition-all duration-200"
        />
        <DialogForm
          title="Tambah Angkatan"
          description="Tambahkan data angkatan baru ke sistem"
          fields={GENERATION_FIELDS}
          onSubmit={handleSubmit}
          trigger={
            <Button
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              aria-label="Tambah Angkatan Baru"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Tambah Angkatan
            </Button>
          }
        />
      </div>

      <div className="hidden md:block">{renderDesktopTable()}</div>

      <div className="md:hidden bg-white shadow rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center">
            <span className="text-gray-500">Memuat data...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error.message}</div>
        ) : table.getRowModel().rows.length ? (
          table.getRowModel().rows.map(renderMobileRow)
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">Tidak ada data ditemukan.</p>
            <p className="text-sm text-gray-400">
              Coba sesuaikan pencarian atau filter Anda
            </p>
          </div>
        )}
      </div>

      <div className="px-4">
        <PaginationControls />
      </div>
    </div>
  );
}
