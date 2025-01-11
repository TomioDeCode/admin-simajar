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

export interface GenerationType extends TableData {
  id: string;
  number: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  is_graduated: boolean;
}

const INITIAL_FORM_DATA: Partial<GenerationType> = {
  number: 0,
  start_date: "",
  end_date: "",
  is_graduated: false,
};

const BASE_COLUMNS: ColumnConfig[] = [
  {
    header: "Number",
    accessor: "number",
    type: "number",
    validation: { required: true },
  },
  {
    header: "Start Date",
    accessor: "start_date",
    type: "date",
    validation: { required: true },
  },
  {
    header: "End Date",
    accessor: "end_date",
    type: "date",
    validation: { required: true },
  },
];

const COLUMNS_WITH_GRADUATION: ColumnConfig[] = [
  ...BASE_COLUMNS,
  {
    header: "Graduated",
    accessor: "is_graduated",
    type: "switch",
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const GENERATIONS_ENDPOINT = `${API_URL}/generations`;
const DEFAULT_PER_PAGE = 5;

const formatDateForInput = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const ensureBooleanValue = (value: any): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
};

export default function Generation() {
  const dialog = useDialog<GenerationType>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GenerationType | null>(null);

  const tableStore = useMemo(() => createTableStore<GenerationType>(), []);
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

  const formatGenerationData = (item: GenerationType) => ({
    ...item,
    start_date: formatDateForInput(item.start_date),
    end_date: formatDateForInput(item.end_date),
    is_graduated: ensureBooleanValue(item.is_graduated),
  });

  const formattedData = filteredData.map(formatGenerationData);

  const handleSubmit = async (formData: Partial<GenerationType>) => {
    try {
      const processedFormData = {
        ...formData,
        is_graduated: formData.is_graduated ?? false,
      };

      if (dialog.selectedItem) {
        const updatedItem = {
          ...dialog.selectedItem,
          ...processedFormData,
        } as GenerationType;

        await updateItem(GENERATIONS_ENDPOINT, updatedItem);
        toast.success("Generation updated successfully");
      } else {
        await addItem(GENERATIONS_ENDPOINT, processedFormData);
        toast.success("Generation added successfully");
      }
      dialog.close();
    } catch (error) {
      console.error("Operation error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const openDeleteDialog = (item: GenerationType) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await deleteItem(GENERATIONS_ENDPOINT, itemToDelete.id);
      toast.success("Generation deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(GENERATIONS_ENDPOINT, {
        page: meta?.currentPage ?? 1,
        perPage: meta?.perPage ?? DEFAULT_PER_PAGE,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData, meta?.currentPage, meta?.perPage]);

  if (error) {
    return (
      <div className="p-4 text-red-500">Error loading generations: {error}</div>
    );
  }

  const initialFormData = dialog.selectedItem
    ? formatGenerationData(dialog.selectedItem)
    : INITIAL_FORM_DATA;

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Generation</h1>
        <Button onClick={dialog.openAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Generation</span>
        </Button>
      </div>

      <DataTable<GenerationType>
        columns={COLUMNS_WITH_GRADUATION}
        data={formattedData}
        onEdit={dialog.openEdit}
        currentPage={meta?.currentPage ?? 1}
        perPage={meta?.perPage ?? DEFAULT_PER_PAGE}
        total_data={pageData}
        isLoading={isLoading}
        onDelete={openDeleteDialog}
        onPageChange={(page) =>
          fetchData(GENERATIONS_ENDPOINT, {
            page,
            perPage: meta?.perPage ?? DEFAULT_PER_PAGE,
          })
        }
        onPerPageChange={(perPage) =>
          fetchData(GENERATIONS_ENDPOINT, { page: 1, perPage })
        }
        onSearch={(term) => setSearch(term, ["number"])}
      />

      <TableDialog
        open={dialog.isOpen}
        onClose={dialog.close}
        onSubmit={handleSubmit}
        columns={dialog.selectedItem ? COLUMNS_WITH_GRADUATION : BASE_COLUMNS}
        initialData={initialFormData as any}
        isSubmitting={isLoading}
      />

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        itemName="Generation"
      />
    </div>
  );
}
