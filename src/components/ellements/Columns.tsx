import { ColumnDef } from "@tanstack/react-table";
import { DataType } from "@/types/table";

export const columns: ColumnDef<DataType>[] = [
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
];
