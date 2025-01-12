"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import { TableDialog } from "@/components/common/TableDialog";
import { createTableStore } from "@/hooks/useTableStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TableData } from "@/types/tableReus";
import { useDialog } from "@/hooks/useDialog";
import { useStore } from "zustand";
import DeleteConfirmationDialog from "@/components/common/DialogDelete";
import { Plus, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";

export interface SchoolHoursType extends TableData {
  id: string;
  created_at: string;
  updated_at: string;
  number: number;
  day_id: string;
  type: string;
  start: string;
  end: string;
  day: Day;
}

export interface Day {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  is_operating: boolean;
  school_hours: any;
}

const INITIAL_FORM_DATA: Partial<SchoolHoursType> = {
  number: 0,
  type: undefined,
  start: undefined,
  end: undefined,
};

const COLUMNS = [
  {
    header: "Nomor Ruangan",
    accessor: "number",
    validation: { required: true },
  },
  {
    header: "Tipe Ruang",
    accessor: "type",
    type: "select",
    optionsUrl: [
      { value: "lesson", label: "Lesson" },
      { value: "rest", label: "Rest" },
    ],
    validation: { required: true },
  },
  {
    accessor: "start",
    header: "Mulai",
    type: "time",
    validation: { required: true },
  },
  {
    accessor: "end",
    header: "Akhir",
    type: "time",
    validation: { required: true },
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const ROOMS_ENDPOINT = `${API_URL}/school_hours`;
const DAYS_ENDPOINT = `${API_URL}/days`;
const DEFAULT_PER_PAGE = 5;

interface FilterParams {
  page: number;
  perPage: number;
  dayId?: string;
}

export default function SchoolHours() {
  const dialog = useDialog<SchoolHoursType>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SchoolHoursType | null>(
    null
  );
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [days, setDays] = useState<Day[]>([]);

  const tableStore = useMemo(() => createTableStore<SchoolHoursType>(), []);
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

  const fetchDataWithDay = async (params: FilterParams) => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      perPage: params.perPage.toString(),
    });

    if (params.dayId) {
      queryParams.append("day_id", params.dayId);
    }

    await fetchData(ROOMS_ENDPOINT, {
      page: params.page,
      perPage: params.perPage,
    });
  };

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const response = await fetch(DAYS_ENDPOINT);
        const result = await response.json();

        console.log(result);
        if (result.data.data) {
          setDays(result.data.data);
          if (result.data.length > 0 && !selectedDayId) {
            setSelectedDayId(result.data[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching days:", error);
        toast.error("Failed to fetch days");
      }
    };
    fetchDays();
  }, []);

  const handleDaySelect = (dayId: string) => {
    setSelectedDayId(dayId);
    fetchDataWithDay({
      page: 1,
      perPage: meta?.perPage ?? DEFAULT_PER_PAGE,
      dayId: dayId,
    });
  };

  const handleSubmit = async (formData: Partial<SchoolHoursType>) => {
    if (!selectedDayId) {
      toast.error("Please select a day first");
      return;
    }

    try {
      if (dialog.selectedItem) {
        const updatedItem = {
          ...dialog.selectedItem,
          ...formData,
        } as SchoolHoursType;

        await updateItem(`${ROOMS_ENDPOINT}`, updatedItem);
        toast.success("School hour updated successfully");
      } else {
        await addItem(`${ROOMS_ENDPOINT}/${selectedDayId}`, formData);
        toast.success("School hour added successfully");
      }
      dialog.close();
    } catch (error) {
      console.error("Operation error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const openDeleteDialog = (item: SchoolHoursType) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await deleteItem(ROOMS_ENDPOINT, itemToDelete.id);
      toast.success("School hour deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  useEffect(() => {
    if (selectedDayId) {
      const timer = setTimeout(() => {
        fetchDataWithDay({
          page: meta?.currentPage ?? 1,
          perPage: meta?.perPage ?? DEFAULT_PER_PAGE,
          dayId: selectedDayId,
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [meta?.currentPage, meta?.perPage, selectedDayId]);

  const DayCard = ({ day }: { day: Day }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isSelected = selectedDayId === day.id;

    return (
      <Card
        className={`mb-2 cursor-pointer transition-colors ${
          isSelected ? "border-primary" : ""
        }`}
        onClick={() => handleDaySelect(day.id)}
      >
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">{day.name}</h3>
              <p className="text-sm text-muted-foreground">
                {day.is_operating ? "Operating" : "Not Operating"}
              </p>
            </div>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => e.stopPropagation()}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="p-4 pt-0">
              <p className="text-sm text-muted-foreground">
                Created: {new Date(day.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Updated: {new Date(day.updated_at).toLocaleDateString()}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  if (error) {
    return <div className="p-4 text-red-500">Error loading data: {error}</div>;
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Days</h2>
        <div className="space-y-2">
          {Array.isArray(days) &&
            days.map((day) => <DayCard key={day.id} day={day} />)}
        </div>
      </div>

      <div className="md:col-span-3 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Ruangan</h1>
          <Button
            onClick={dialog.openAdd}
            className="flex items-center gap-2"
            disabled={!selectedDayId}
          >
            <Plus className="h-4 w-4" />
            <span>Add Ruangan</span>
          </Button>
        </div>

        <DataTable<SchoolHoursType>
          columns={COLUMNS as any}
          data={filteredData}
          onEdit={dialog.openEdit}
          currentPage={meta?.currentPage ?? 1}
          perPage={meta?.perPage ?? DEFAULT_PER_PAGE}
          total_data={pageData}
          isLoading={isLoading}
          onDelete={openDeleteDialog}
          onPageChange={(page) =>
            fetchDataWithDay({
              page,
              perPage: meta?.perPage ?? DEFAULT_PER_PAGE,
              dayId: selectedDayId ?? undefined,
            })
          }
          onPerPageChange={(perPage) =>
            fetchDataWithDay({
              page: 1,
              perPage,
              dayId: selectedDayId ?? undefined,
            })
          }
          onSearch={(term) => setSearch(term, ["number"])}
        />

        <TableDialog
          open={dialog.isOpen}
          onClose={dialog.close}
          onSubmit={handleSubmit}
          columns={COLUMNS as any}
          initialData={dialog.selectedItem ?? (INITIAL_FORM_DATA as any)}
          isSubmitting={isLoading}
        />

        <DeleteConfirmationDialog
          isOpen={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          itemName="School Hour"
        />
      </div>
    </div>
  );
}
