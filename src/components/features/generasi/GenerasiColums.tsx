import { ColumnDef } from "@tanstack/react-table";
import { Generation } from "@/types/table";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { DialogForm } from "@/components/common/DialogForm";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GENERATION_FIELDS } from "@/constants/field.constants";

export const createColumns = (
  data: Generation[],
  handleUpdate: (id: string, newData: Partial<Generation>) => Promise<void>,
  handleDelete: (id: string) => Promise<void>
): ColumnDef<Generation>[] => {
  const createSortableHeader = (label: string, column: any) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="hover:bg-transparent p-0 font-semibold text-gray-700"
    >
      {label}
      <ArrowUpDown className="ml-2 w-4 h-4 text-gray-400" />
    </Button>
  );

  return [
    {
      accessorKey: "number",
      header: ({ column }) => createSortableHeader("Nomor", column),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("number")}</span>
      ),
    },
    {
      accessorKey: "start_date",
      header: ({ column }) => createSortableHeader("Tanggal Mulai", column),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("start_date")}</span>
      ),
    },
    {
      accessorKey: "end_date", 
      header: ({ column }) => createSortableHeader("Tanggal Selesai", column),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("end_date")}</span>
      ),
    },
    {
      accessorKey: "is_graduated",
      header: ({ column }) => createSortableHeader("Status", column),
      cell: ({ row }) => {
        const isGraduated = row.getValue("is_graduated");
        return (
          <div
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isGraduated
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isGraduated ? "Graduated" : "Not Graduated"}
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
              title="Update Generasi"
              description="Edit informasi generasi"
              fields={GENERATION_FIELDS}
              initialData={rowData}
              isUpdate
              onSubmit={(newData) => handleUpdate(rowData.id, newData)}
            />
            <DeleteDialog
              text="Generasi"
              onConfirm={() => handleDelete(rowData.id)}
            />
          </div>
        );
      },
    },
  ];
};
