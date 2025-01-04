import { ColumnDef } from "@tanstack/react-table";
import { GuruType } from "@/types/table";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { DialogForm } from "@/components/common/DialogForm";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GURU_FIELDS } from "@/constants/field";

export const createColumns = (
  data: GuruType[],
  setData: React.Dispatch<React.SetStateAction<GuruType[]>>
): ColumnDef<GuruType>[] => {
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

  const handleUpdate = (rowData: GuruType, newData: Partial<GuruType>) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === rowData.id ? { ...item, ...newData } : item
      )
    );
  };

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return [
    {
      accessorKey: "name",
      header: ({ column }) => createSortableHeader("Nama", column),
    },
    {
      accessorKey: "nip",
      header: ({ column }) => createSortableHeader("NIP", column),
    },
    {
      accessorKey: "mapel",
      header: ({ column }) => createSortableHeader("Mata Pelajaran", column),
    },
    {
      accessorKey: "status",
      header: ({ column }) => createSortableHeader("Status", column),
      cell: ({ row }) => (
        <div
          className={`font-medium ${
            row.getValue("status") === "active"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {row.getValue("status") === "active" ? "Aktif" : "Tidak Aktif"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex gap-2">
            <DialogForm
              title="Update Guru"
              description="Edit informasi guru"
              fields={GURU_FIELDS}
              initialData={rowData}
              isUpdate
              onSubmit={(newData) => handleUpdate(rowData, newData)}
            />
            <DeleteDialog
              text="Guru"
              onConfirm={() => handleDelete(rowData.id)}
            />
          </div>
        );
      },
    },
  ];
};
