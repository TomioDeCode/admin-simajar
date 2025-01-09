"use client";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import { TableDialog } from "@/components/common/TableDialog";
import { createTableStore } from "@/hooks/useTableStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ColumnConfig, TableData } from "@/types/tableReus";
import { useDialog } from "@/hooks/useDialog";
import { useStore } from "zustand";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface GenerationType extends TableData {
  id: string;
  number: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  is_graduated: boolean;
}

const columns: ColumnConfig[] = [
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

const columsUpdate: ColumnConfig[] = [
  ...columns,
  {
    header: "Lulus",
    accessor: "is_graduated",
    type: "switch",
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const GENERATIONS_ENDPOINT = `${API_URL}/generations`;

const formatDateForInput = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

// Helper function to ensure boolean values
const ensureBooleanValue = (value: any): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
};

export default function Generation() {
  const dialog = useDialog<GenerationType>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
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
    setSearch(searchTerm, ["number"]);
  }, [searchTerm, setSearch]);

  const formatSelectedItemDates = (item: GenerationType) => {
    return {
      ...item,
      start_date: formatDateForInput(item.start_date),
      end_date: formatDateForInput(item.end_date),
      is_graduated: ensureBooleanValue(item.is_graduated), // Ensure boolean
    };
  };

  const formattedData = filteredData.map((item) => ({
    ...item,
    start_date: formatDateForInput(item.start_date),
    end_date: formatDateForInput(item.end_date),
    is_graduated: ensureBooleanValue(item.is_graduated), // Ensure boolean
  }));

  const handleSubmit = async (formData: Partial<GenerationType>) => {
    setIsSubmitting(true);
    try {
      const processedFormData = {
        ...formData,
        is_graduated:
          formData.is_graduated !== undefined
            ? ensureBooleanValue(formData.is_graduated)
            : undefined,
      };

      if (dialog.selectedItem) {
        const updatedItem = {
          ...dialog.selectedItem,
          ...processedFormData,
        } as GenerationType;

        console.log("Updating with data:", updatedItem); // Debug log
        await updateItem(GENERATIONS_ENDPOINT, updatedItem);
        toast.success("Angkatan Update Berhasil");
      } else {
        await addItem(GENERATIONS_ENDPOINT, processedFormData);
        toast.success("Angkatan Tambah Berhasil");
      }
      dialog.close();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
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
      toast.success("Angakatan Delete Berhasil");
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

  const formattedInitialData = dialog.selectedItem
    ? formatSelectedItemDates(dialog.selectedItem)
    : undefined;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={dialog.openAdd}>Add User</Button>
      </div>

      <DataTable<GenerationType>
        columns={columsUpdate}
        data={formattedData}
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
        columns={dialog.selectedItem ? columsUpdate : columns}
        initialData={formattedInitialData}
        isSubmitting={isSubmitting}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              Angkatan
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
