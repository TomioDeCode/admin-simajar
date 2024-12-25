import { ColumnDef } from "@tanstack/react-table";
import { RuanganType } from "@/types/table";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { DialogForm } from "@/components/common/DialogForm";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RUANGAN_FIELDS } from "@/constants/field.constants";

export const RuanganColumns = (
  data: RuanganType[],
  setData: React.Dispatch<React.SetStateAction<RuanganType[]>>
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

  const handleUpdate = (
    rowData: RuanganType,
    newData: Partial<RuanganType>
  ): void => {
    setData((prev) =>
      prev.map((item) =>
        item.id === rowData.id ? { ...item, ...newData } : item
      )
    );
  };

  const handleDelete = (id: number): void => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return [
    {
      accessorKey: "name",
      header: ({ column }) => createSortableHeader("Nama Ruangan", column),
    },
    {
      accessorKey: "capacity",
      header: ({ column }) => createSortableHeader("Kapasitas", column),
    },
    {
      accessorKey: "type",
      header: ({ column }) => createSortableHeader("Tipe Ruangan", column),
      cell: ({ row }) => {
        const type = row.getValue("type");
        const typeLabels = {
          kelas: "Ruang Kelas",
          lab: "Laboratorium",
          other: "Lainnya",
        };
        return typeLabels[type as keyof typeof typeLabels];
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => createSortableHeader("Status", column),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusConfig = {
          available: {
            label: "Tersedia",
            className: "text-green-600",
          },
          maintenance: {
            label: "Dalam Perbaikan",
            className: "text-yellow-600",
          },
          used: {
            label: "Sedang Digunakan",
            className: "text-red-600",
          },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || {
          label: status,
          className: "text-gray-600"
        };
        return (
          <div className={`font-medium ${config.className}`}>
            {config.label}
          </div>
        );
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
              onSubmit={(newData) => handleUpdate(rowData, newData)}
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
