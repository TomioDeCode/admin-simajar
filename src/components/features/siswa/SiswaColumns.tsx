import { ColumnDef } from "@tanstack/react-table";
import { SiswaType } from "@/types/table";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { DialogForm } from "@/components/common/DialogForm";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SISWA_FIELDS } from "@/constants/field.constants";
import { TbGenderDemiboy, TbGenderDemigirl } from "react-icons/tb";

export const SiswaColumns = (
  data: SiswaType[],
  setData: React.Dispatch<React.SetStateAction<SiswaType[]>>
): ColumnDef<SiswaType>[] => {
  const createSortableHeader = (label: string, column: any) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="hover:bg-transparent p-0 font-semibold"
    >
      {label}
      <ArrowUpDown className="ml-2 w-4 h-4" />
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
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "studentId",
      header: ({ column }) => createSortableHeader("NIS", column),
      cell: ({ row }) => (
        <div className="font-medium text-gray-600">
          {row.getValue("studentId")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => createSortableHeader("Email", column),
      cell: ({ row }) => (
        <div className="text-blue-600 hover:underline">
          <a href={`mailto:${row.getValue("email")}`}>
            {row.getValue("email")}
          </a>
        </div>
      ),
    },
    {
      accessorKey: "class",
      header: ({ column }) => createSortableHeader("Kelas", column),
      cell: ({ row }) => (
        <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-center w-fit">
          {row.getValue("class")}
        </div>
      ),
    },
    {
      accessorKey: "gender",
      header: ({ column }) => createSortableHeader("Jenis Kelamin", column),
      cell: ({ row }) => {
        const gender = row.getValue("gender");
        return (
          <div className="flex items-center gap-2 font-medium">
            {gender === "L" ? (
              <>
                <TbGenderDemiboy className="w-5 h-5 text-blue-600" />
                <span>Laki-laki</span>
              </>
            ) : (
              <>
                <TbGenderDemigirl className="w-5 h-5 text-pink-600" />
                <span>Perempuan</span>
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
          <div className="text-gray-600">
            {phone ? (
              <a href={`tel:${phone}`} className="hover:text-blue-600">
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
          <div className="flex gap-2">
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
