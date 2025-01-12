"use client";
import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import { TableDialog } from "@/components/common/TableDialog";
import { createTableStore } from "@/hooks/useTableStore";
import { toast } from "sonner";
import { ColumnConfig, TableData } from "@/types/tableReus";
import { useDialog } from "@/hooks/useDialog";
import { useStore } from "zustand";

export interface GenerationType extends TableData {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  is_operating: boolean;
  school_hours: any;
}

const INITIAL_FORM_DATA: Partial<GenerationType> = {
  name: "",
  is_operating: false,
};

const BASE_COLUMNS: ColumnConfig[] = [
  {
    header: "Number",
    accessor: "name",
    type: "text",
    validation: { required: true },
  },
  {
    header: "Start Date",
    accessor: "is_operating",
    type: "switch",
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const GENERATIONS_ENDPOINT = `${API_URL}/days`;
const DEFAULT_PER_PAGE = 5;

export default function Generation() {
  const dialog = useDialog<GenerationType>();
  const tableStore = useMemo(() => createTableStore<GenerationType>(), []);
  const {
    filteredData,
    meta,
    isLoading,
    error,
    fetchData,
    updateItem,
    setSearch,
    pageData,
  } = useStore(tableStore);

  const handleSubmit = async (formData: Partial<GenerationType>) => {
    try {
      if (dialog.selectedItem) {
        const updatedItem = {
          ...dialog.selectedItem,
          ...formData,
        } as GenerationType;
        await updateItem(GENERATIONS_ENDPOINT, updatedItem);
        toast.success("Generation updated successfully");
      }
      dialog.close();
    } catch (error) {
      console.error("Operation error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
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

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Days</h1>
      </div>

      <DataTable<GenerationType>
        columns={BASE_COLUMNS}
        renderMobile={true}
        data={filteredData}
        onEdit={dialog.openEdit}
        currentPage={meta?.currentPage ?? 1}
        perPage={meta?.perPage ?? DEFAULT_PER_PAGE}
        total_data={pageData}
        isLoading={isLoading}
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
        columns={BASE_COLUMNS}
        initialData={dialog.selectedItem ?? (INITIAL_FORM_DATA as any)}
        isSubmitting={isLoading}
      />
    </div>
  );
}
