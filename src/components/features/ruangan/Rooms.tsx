"use client";
import React, { useEffect, useMemo, useState } from "react";
import { ColumnConfigR, DataTable } from "@/components/common/DataTable";
import { TableDialog } from "@/components/common/TableDialog";
import { createTableStore } from "@/hooks/useTableStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TableData } from "@/types/tableReus";
import { useDialog } from "@/hooks/useDialog";
import { useStore } from "zustand";
import DeleteConfirmationDialog from "@/components/common/DialogDelete";
import { Plus } from "lucide-react";

export interface RoomsType extends TableData {
  id: string;
  created_at: string;
  updated_at: string;
  number: number;
  is_practice_room: boolean;
  major_id: string | null;
}

const INITIAL_FORM_DATA: Partial<RoomsType> = {
  number: 0,
  major_id: null,
  is_practice_room: false,
};

const COLUMNS: ColumnConfigR[] = [
  {
    accessor: "number",
    header: "Nomor Ruangan",
  },
  {
    accessor: "is_practice_room",
    header: "Ruang Latihan",
    formatter: (value) => (value ? "Ruang Latihan" : "Ruang Regular"),
    type: "switch",
  },
  {
    accessor: "major_id",
    header: "Jurusan",
    type: "select",
    optionsUrl: "/majors/list",
    formatter: (value) => value ?? "-",
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const ROOMS_ENDPOINT = `${API_URL}/rooms`;

const DEFAULT_PER_PAGE = 5;

export default function Rooms() {
  const dialog = useDialog<RoomsType>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<RoomsType | null>(null);

  const tableStore = useMemo(() => createTableStore<RoomsType>(), []);
  const {
    filteredData,
    meta,
    isLoading,
    error,
    fetchData,
    addItem,
    updateItem,
    deleteItem,
    setSearch,
    pageData,
  } = useStore(tableStore);

  const handleSubmit = async (formData: Partial<RoomsType>) => {
    try {
      if (dialog.selectedItem) {
        const updatedItem = {
          ...dialog.selectedItem,
          ...formData,
        } as RoomsType;

        await updateItem(ROOMS_ENDPOINT, updatedItem);
        toast.success("Major updated successfully");
      } else {
        await addItem(ROOMS_ENDPOINT, formData);
        toast.success("Major added successfully");
      }
      dialog.close();
    } catch (error) {
      console.error("Operation error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const openDeleteDialog = (item: RoomsType) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await deleteItem(ROOMS_ENDPOINT, itemToDelete.id);
      toast.success("Major deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(ROOMS_ENDPOINT, {
        page: meta?.currentPage ?? 1,
        perPage: meta?.perPage ?? DEFAULT_PER_PAGE,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData, meta?.currentPage, meta?.perPage]);

  if (error) {
    return (
      <div className="p-4 text-red-500">Error loading majors: {error}</div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ruangan</h1>
        <Button onClick={dialog.openAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Ruangan</span>
        </Button>
      </div>

      <DataTable<RoomsType>
        columns={COLUMNS}
        data={filteredData}
        onEdit={dialog.openEdit}
        currentPage={meta?.currentPage ?? 1}
        perPage={meta?.perPage ?? DEFAULT_PER_PAGE}
        total_data={pageData}
        isLoading={isLoading}
        onDelete={openDeleteDialog}
        onPageChange={(page) =>
          fetchData(ROOMS_ENDPOINT, {
            page,
            perPage: meta?.perPage ?? DEFAULT_PER_PAGE,
          })
        }
        onPerPageChange={(perPage) =>
          fetchData(ROOMS_ENDPOINT, { page: 1, perPage })
        }
        onSearch={(term) => setSearch(term, ["number"])}
      />

      <TableDialog
        open={dialog.isOpen}
        onClose={dialog.close}
        onSubmit={handleSubmit}
        columns={COLUMNS}
        initialData={dialog.selectedItem ?? (INITIAL_FORM_DATA as any)}
        isSubmitting={isLoading}
      />

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        itemName="Major"
      />
    </div>
  );
}
