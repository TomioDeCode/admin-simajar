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

export interface MajorsType extends TableData {
  id: string;
  name: string;
  abbreviation: string;
  created_at: string;
  updated_at: string;
}

const INITIAL_FORM_DATA: Partial<MajorsType> = {
  name: "",
  abbreviation: "",
};

const COLUMNS: ColumnConfigR[] = [
  {
    header: "Nama Jurusan",
    accessor: "name",
    type: "text",
    validation: { required: true },
  },
  {
    header: "Singkatan Jurusan",
    accessor: "abbreviation",
    type: "text",
    validation: { required: true },
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const MAJORS_ENDPOINT = `${API_URL}/majors`;

const DEFAULT_PER_PAGE = 5;

export default function Majors() {
  const dialog = useDialog<MajorsType>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MajorsType | null>(null);

  const tableStore = useMemo(() => createTableStore<MajorsType>(), []);
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

  const handleSubmit = async (formData: Partial<MajorsType>) => {
    try {
      if (dialog.selectedItem) {
        const updatedItem = {
          ...dialog.selectedItem,
          ...formData,
        } as MajorsType;

        await updateItem(MAJORS_ENDPOINT, updatedItem);
        toast.success("Major updated successfully");
      } else {
        await addItem(MAJORS_ENDPOINT, formData);
        toast.success("Major added successfully");
      }
      dialog.close();
    } catch (error) {
      console.error("Operation error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const openDeleteDialog = (item: MajorsType) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await deleteItem(MAJORS_ENDPOINT, itemToDelete.id);
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
      fetchData(MAJORS_ENDPOINT, {
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
        <h1 className="text-2xl font-bold">Majors</h1>
        <Button onClick={dialog.openAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Major</span>
        </Button>
      </div>

      <DataTable<MajorsType>
        columns={COLUMNS}
        data={filteredData}
        onEdit={dialog.openEdit}
        currentPage={meta?.currentPage ?? 1}
        perPage={meta?.perPage ?? DEFAULT_PER_PAGE}
        total_data={pageData}
        isLoading={isLoading}
        onDelete={openDeleteDialog}
        onPageChange={(page) =>
          fetchData(MAJORS_ENDPOINT, {
            page,
            perPage: meta?.perPage ?? DEFAULT_PER_PAGE,
          })
        }
        onPerPageChange={(perPage) =>
          fetchData(MAJORS_ENDPOINT, { page: 1, perPage })
        }
        onSearch={(term) => setSearch(term, ["name", "abbreviation"])}
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
