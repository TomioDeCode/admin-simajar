import { ColumnDef } from "@tanstack/react-table";
import { DataType } from "@/types/table";
import { DeleteDialog } from "../common/DeleteDialog";
import { FormField } from "@/types/form";
import { DialogForm } from "../common/DialogForm";

export const createColumns = (
  data: DataType[],
  setData: React.Dispatch<React.SetStateAction<DataType[]>>
): ColumnDef<DataType>[] => {
  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex gap-2 -ml-1.5">
            <DialogForm
              title="Update User"
              description="Edit user information"
              fields={fields}
              initialData={rowData}
              isUpdate
              onSubmit={(newData) => {
                setData(
                  data.map((item) =>
                    item.id === rowData.id ? { ...item, ...newData } : item
                  )
                );
              }}
            />
            <DeleteDialog
              text="Siswa"
              onConfirm={() => {
                setData(data.filter((item) => item.id !== rowData.id));
              }}
            />
          </div>
        );
      },
    },
  ];
};

const fields: FormField[] = [
  {
    id: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter name",
    required: true,
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter email",
  },
  {
    id: "role",
    label: "Role",
    type: "select",
    options: [
      { value: "Admin", label: "Admin" },
      { value: "User", label: "User" },
    ],
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "Active", label: "Active" },
      { value: "Inactive", label: "Inactive" },
    ],
  },
];
