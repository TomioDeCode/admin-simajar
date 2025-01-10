"use client";
import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import { TableDialog } from "@/components/common/TableDialog";
import { createTableStore } from "@/hooks/useTableStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ColumnConfig, TableData } from "@/types/tableReus";
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

const columns: ColumnConfig[] = [
  {
    header: "Name",
    accessor: "name",
    type: "text",
    validation: { required: true },
  },
  {
    header: "Abbreviation",
    accessor: "abbreviation",
    type: "text",
    validation: { required: true },
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const GENERATIONS_ENDPOINT = `${API_URL}/majors`;

export default function Majors() {
  const dialog = useDialog<MajorsType>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
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

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(GENERATIONS_ENDPOINT, {
        page: currentPage,
        perPage: perPage,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData, currentPage, perPage]);

  useEffect(() => {
    setSearch(searchTerm, ["name", "abbreviation"]);
  }, [searchTerm, setSearch]);

  const handleSubmit = async (formData: Partial<MajorsType>) => {
    setIsSubmitting(true);
    try {
      if (dialog.selectedItem) {
        const updatedItem = {
          ...dialog.selectedItem,
          ...formData,
        } as MajorsType;

        await updateItem(GENERATIONS_ENDPOINT, updatedItem);
        toast.success("Jurusan Update Berhasil");
      } else {
        await addItem(GENERATIONS_ENDPOINT, formData);
        toast.success("Jurusan Tambah Berhasil");
      }
      dialog.close();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteDialog = (item: MajorsType) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await deleteItem(GENERATIONS_ENDPOINT, itemToDelete.id);
      toast.success("Jurusan Delete Berhasil");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-2 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Jurusan</h1>
        <Button onClick={dialog.openAdd}>
          <Plus /> Jurusan
        </Button>
      </div>

      <DataTable<MajorsType>
        columns={columns}
        data={filteredData}
        onEdit={dialog.openEdit}
        currentPage={meta?.currentPage || 1}
        perPage={meta?.perPage || 10}
        total_data={pageData}
        isLoading={isLoading}
        onDelete={openDeleteDialog}
        onPageChange={setCurrentPage}
        onPerPageChange={setPerPage}
        onSearch={setSearchTerm}
      />

      <TableDialog
        open={dialog.isOpen}
        onClose={dialog.close}
        onSubmit={handleSubmit}
        columns={columns}
        initialData={dialog.selectedItem}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        itemName="Jurusan"
      />
    </div>
  );
}
