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

export interface SubjectsType extends TableData {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  abbreviation: string;
  is_vocational_subject: boolean;
  major_id: string | null;
}

const INITIAL_FORM_DATA: Partial<SubjectsType> = {
  name: "",
  abbreviation: "",
  is_vocational_subject: false,
  major_id: null,
};

const COLUMNS: ColumnConfigR[] = [
  {
    header: "Nama Kelas",
    accessor: "name",
    type: "text",
    validation: { required: true },
  },
  {
    header: "Singkatan Kelas",
    accessor: "abbreviation",
    type: "text",
    validation: { required: true },
  },
  {
    header: "Mapel Jurusan",
    accessor: "is_vocational_subject",
    type: "switch",
    formatter: (value) => (value ? "Ya" : "Tidak"),
  },
  {
    header: "Jurusan",
    accessor: "major_id",
    type: "select",
    optionsUrl: "/majors/list",
    formatter: (value) => value ?? "-",
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const SUBJECTS_ENDPOINT = `${API_URL}/subjects`;

const DEFAULT_PER_PAGE = 5;

export default function Subjects() {
  const dialog = useDialog<SubjectsType>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SubjectsType | null>(null);

  const tableStore = useMemo(() => createTableStore<SubjectsType>(), []);
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

  const handleSubmit = async (formData: Partial<SubjectsType>) => {
    try {
      if (dialog.selectedItem) {
        const updatedItem = {
          ...dialog.selectedItem,
          ...formData,
        } as SubjectsType;

        await updateItem(SUBJECTS_ENDPOINT, updatedItem);
        toast.success("Subject updated successfully");
      } else {
        await addItem(SUBJECTS_ENDPOINT, formData);
        toast.success("Subject added successfully");
      }
      dialog.close();
    } catch (error) {
      console.error("Operation error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const openDeleteDialog = (item: SubjectsType) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await deleteItem(SUBJECTS_ENDPOINT, itemToDelete.id);
      toast.success("Subject deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(SUBJECTS_ENDPOINT, {
        page: meta?.currentPage ?? 1,
        perPage: meta?.perPage ?? DEFAULT_PER_PAGE,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData, meta?.currentPage, meta?.perPage]);

  if (error) {
    return (
      <div className="p-4 text-red-500">Error loading subjects: {error}</div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <Button onClick={dialog.openAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Subject</span>
        </Button>
      </div>

      <DataTable<SubjectsType>
        columns={COLUMNS}
        data={filteredData}
        onEdit={dialog.openEdit}
        currentPage={meta?.currentPage ?? 1}
        perPage={meta?.perPage ?? DEFAULT_PER_PAGE}
        total_data={pageData}
        isLoading={isLoading}
        onDelete={openDeleteDialog}
        onPageChange={(page) =>
          fetchData(SUBJECTS_ENDPOINT, {
            page,
            perPage: meta?.perPage ?? DEFAULT_PER_PAGE,
          })
        }
        onPerPageChange={(perPage) =>
          fetchData(SUBJECTS_ENDPOINT, { page: 1, perPage })
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
        itemName="Subject"
      />
    </div>
  );
}
