import { ColumnDef } from "@tanstack/react-table";
import { DataType } from "@/types/table";
import { DeleteDialog } from "../common/DeleteDialog";
import { FormField } from "@/types/form";
import { DialogForm } from "../common/DialogForm";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const createColumns = (
  data: DataType[],
  setData: React.Dispatch<React.SetStateAction<DataType[]>>
): ColumnDef<DataType>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className={`font-medium ${
          row.getValue("status") === "Active" ? "text-green-600" : "text-red-600"
        }`}>
          {row.getValue("status")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex gap-2">
            <DialogForm
              title="Update User"
              description="Edit user information"
              fields={USER_FIELDS}
              initialData={rowData}
              isUpdate
              onSubmit={(newData) => {
                setData((prev) =>
                  prev.map((item) =>
                    item.id === rowData.id ? { ...item, ...newData } : item
                  )
                );
              }}
            />
            <DeleteDialog
              text="User"
              onConfirm={() => {
                setData((prev) => prev.filter((item) => item.id !== rowData.id));
              }}
            />
          </div>
        );
      },
    },
  ];
};

const USER_FIELDS: FormField[] = [
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
    required: true,
  },
  {
    id: "role",
    label: "Role",
    type: "select",
    options: [
      { value: "Admin", label: "Admin" },
      { value: "User", label: "User" },
    ],
    required: true,
  },
  {
    id: "status",
    label: "Status",
    type: "select", 
    options: [
      { value: "Active", label: "Active" },
      { value: "Inactive", label: "Inactive" },
    ],
    required: true,
  },
];
