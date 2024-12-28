import { ColumnDef } from "@tanstack/react-table";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { DialogForm } from "@/components/common/DialogForm";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAPEL_FIELDS } from "@/constants/field.constants";

type MapelType = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  abbreviation: string;
  is_vocational_subject: boolean;
  major_id: string;
}

export const MapelColumns = (
  data: MapelType[],
  handleUpdate: (id: string, newData: Partial<MapelType>) => void,
  handleDelete: (id: string) => void
): ColumnDef<MapelType>[] => {
  const createSortableHeader = (label: string, column: any) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="hover:bg-transparent p-0"
    >
      {label}
      <ArrowUpDown className="ml-2 w-4 h-4" />
    </Button>
  );

  return [
    {
      accessorKey: "name",
      header: ({ column }) => createSortableHeader("Nama Mapel", column),
    },
    {
      accessorKey: "abbreviation", 
      header: ({ column }) => createSortableHeader("Singkatan", column),
    },
    {
      accessorKey: "is_vocational_subject",
      header: ({ column }) => createSortableHeader("Mapel Kejuruan", column),
      cell: ({ row }) => row.original.is_vocational_subject ? "Ya" : "Tidak"
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex gap-2">
            <DialogForm
              title="Update Mapel"
              description="Edit informasi mata pelajaran"
              fields={MAPEL_FIELDS}
              initialData={rowData}
              isUpdate
              onSubmit={(newData) => handleUpdate(rowData.id, newData)}
            />
            <DeleteDialog
              text="Mapel"
              onConfirm={() => handleDelete(rowData.id)}
            />
          </div>
        );
      },
    },
  ];
};
