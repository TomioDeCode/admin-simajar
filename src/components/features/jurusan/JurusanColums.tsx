import { ColumnDef } from "@tanstack/react-table";
import { JurusanType } from "@/types/table";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { DialogForm } from "@/components/common/DialogForm";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JURUSAN_FIELDS } from "@/constants/field";

export const createColumns = (
  data: JurusanType[],
  handleUpdate: (id: string, newData: Partial<JurusanType>) => void,
  handleDelete: (id: string) => void
): ColumnDef<JurusanType>[] => {
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
      header: ({ column }) => createSortableHeader("Nama Jurusan", column),
    },
    {
      accessorKey: "abbreviation",
      header: ({ column }) => createSortableHeader("Singkatan", column),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex gap-2">
            <DialogForm
              title="Update Jurusan"
              description="Edit informasi jurusan"
              fields={JURUSAN_FIELDS}
              initialData={rowData}
              isUpdate
              onSubmit={(newData) => handleUpdate(rowData.id, newData)}
            />
            <DeleteDialog
              text="Jurusan"
              onConfirm={() => handleDelete(rowData.id)}
            />
          </div>
        );
      },
    },
  ];
};
