import { ColumnDef } from "@tanstack/react-table";
import { RuanganType } from "@/types/table";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { DialogForm } from "@/components/common/DialogForm";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RUANGAN_FIELDS } from "@/constants/field";

export const RuanganColumns = (
  data: RuanganType[],
  handleUpdate: (id: string, newData: Partial<RuanganType>) => void,
  handleDelete: (id: string) => void
): ColumnDef<RuanganType>[] => {
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
      accessorKey: "number",
      header: ({ column }) => createSortableHeader("Nomor Ruangan", column),
    },
    {
      accessorKey: "is_practice_room",
      header: ({ column }) => createSortableHeader("Jenis Ruangan", column),
      cell: ({ row }) => {
        const isPracticeRoom = row.getValue("is_practice_room");
        return isPracticeRoom ? "Ruang Praktik" : "Ruang Teori";
      },
    },
    {
      accessorKey: "major_id",
      header: ({ column }) => createSortableHeader("Jurusan", column),
      cell: ({ row }) => {
        const majorId = row.getValue("major_id");
        return majorId ? "Ada" : "Umum";
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex gap-2">
            <DialogForm
              title="Update Ruangan"
              description="Edit informasi ruangan"
              fields={RUANGAN_FIELDS}
              initialData={rowData}
              isUpdate
              onSubmit={(newData) => handleUpdate(rowData.id, newData)}
            />
            <DeleteDialog
              text="Ruangan"
              onConfirm={() => handleDelete(rowData.id)}
            />
          </div>
        );
      },
    },
  ];
};
