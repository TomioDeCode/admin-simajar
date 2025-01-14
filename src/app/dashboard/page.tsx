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

interface JurusanType extends TableData {
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
    header: "Email",
    accessor: "abbreviation",
    type: "text",
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const USERS_ENDPOINT = `${API_URL}/majors`;

export default function UsersPage() {
  const dialog = useDialog<JurusanType>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<JurusanType | null>(null);

  const tableStore = useMemo(() => createTableStore<JurusanType>(), []);
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
      fetchData(USERS_ENDPOINT, {
        page: currentPage,
        perPage: perPage,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData, currentPage, perPage]);

  useEffect(() => {
    setSearch(searchTerm, ["name", "abbreviation"]);
  }, [searchTerm, setSearch]);

  const handleSubmit = async (formData: Partial<JurusanType>) => {
    setIsSubmitting(true);
    try {
      if (dialog.selectedItem) {
        await updateItem(USERS_ENDPOINT, {
          ...dialog.selectedItem,
          ...formData,
        } as JurusanType);
        toast.success("User updated successfully");
      } else {
        await addItem(USERS_ENDPOINT, formData);
        toast.success("User added successfully");
      }
      dialog.close();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteDialog = (item: JurusanType) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await deleteItem(USERS_ENDPOINT, itemToDelete.id);
      toast.success("User deleted successfully");
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={dialog.openAdd}>Add User</Button>
      </div>

      <DataTable<JurusanType>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user
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
