import { ColumnDef } from "@tanstack/react-table";
import { SiswaType } from "@/types/table";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { DialogForm } from "@/components/common/DialogForm";
import { ArrowUpDown, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SISWA_FIELDS } from "@/constants/field.constants";
import { TbGenderDemiboy, TbGenderDemigirl } from "react-icons/tb";
import { Badge } from "@/components/ui/badge";

export const SiswaColumns = (
  data: SiswaType[],
  setData: React.Dispatch<React.SetStateAction<SiswaType[]>>
): ColumnDef<SiswaType>[] => {
  const createSortableHeader = (label: string, column: any) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="hover:bg-transparent p-0 font-medium"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  const handleUpdate = (rowData: SiswaType, newData: Partial<SiswaType>) => {
    try {
      setData((prev) =>
        prev.map((item) =>
          item.id === rowData.id ? { ...item, ...newData } : item
        )
      );
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleDelete = (id: number) => {
    try {
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return [
    {
      accessorKey: "name",
      header: ({ column }) => createSortableHeader("Nama", column),
      cell: ({ row }) => (
        <div className="flex flex-col md:flex-row md:items-center gap-1">
          <span className="font-medium">{row.getValue("name")}</span>
          <div className="flex items-center gap-2 md:hidden text-gray-500">
            <Badge variant="outline" className="text-xs">
              {row.getValue("studentId")}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {row.getValue("class")}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "studentId",
      header: ({ column }) => createSortableHeader("NIS", column),
      cell: ({ row }) => (
        <div className="hidden md:block font-medium text-gray-600">
          {row.getValue("studentId")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => createSortableHeader("Email", column),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500 md:hidden" />
          <a
            href={`mailto:${row.getValue("email")}`}
            className="text-blue-600 hover:underline truncate max-w-[200px] md:max-w-none"
          >
            {row.getValue("email")}
          </a>
        </div>
      ),
    },
    {
      accessorKey: "class",
      header: ({ column }) => createSortableHeader("Kelas", column),
      cell: ({ row }) => (
        <div className="hidden md:block">
          <Badge variant="secondary" className="font-medium">
            {row.getValue("class")}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "gender",
      header: ({ column }) => createSortableHeader("Jenis Kelamin", column),
      cell: ({ row }) => {
        const gender = row.getValue("gender");
        return (
          <div className="flex items-center gap-2">
            {gender === "L" ? (
              <>
                <TbGenderDemiboy className="h-4 w-4 text-blue-600" />
                <span className="hidden md:inline">Laki-laki</span>
                <span className="md:hidden">L</span>
              </>
            ) : (
              <>
                <TbGenderDemigirl className="h-4 w-4 text-pink-600" />
                <span className="hidden md:inline">Perempuan</span>
                <span className="md:hidden">P</span>
              </>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => createSortableHeader("Nomor Telepon", column),
      cell: ({ row }) => {
        const phone = row.getValue("phoneNumber");
        return (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500 md:hidden" />
            {phone ? (
              <a
                href={`tel:${phone}`}
                className="text-gray-600 hover:text-blue-600 truncate max-w-[150px] md:max-w-none"
              >
                {phone as string}
              </a>
            ) : (
              <span className="text-gray-400">-</span>
            )}
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
          <div className="flex items-center justify-end gap-2">
            <DialogForm
              title="Update Siswa"
              description="Edit informasi siswa"
              fields={SISWA_FIELDS}
              initialData={rowData}
              isUpdate
              onSubmit={(newData) => handleUpdate(rowData, newData)}
            />
            <DeleteDialog
              text="Siswa"
              onConfirm={() => handleDelete(rowData.id)}
            />
          </div>
        );
      },
    },
  ];
};
