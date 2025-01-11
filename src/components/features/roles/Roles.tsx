"use client";

import React, { useEffect, useMemo } from "react";
import { createTableStore } from "@/hooks/useTableStore";
import { TableData } from "@/types/tableReus";
import { useStore } from "zustand";
import { ColumnConfigR, DataTable } from "@/components/common/DataTable";

export interface RoleType extends TableData {
  id: string;
  name: string;
  type: string;
}

const formatRoleName = (value: string) => {
  const words = value.split("_");
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const COLUMNS: ColumnConfigR[] = [
  {
    header: "Nama Role",
    accessor: "name",
    formatter: formatRoleName,
  },
  {
    header: "Tipe Role",
    accessor: "type",
    formatter: (value: string) => {
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const ROLES_ENDPOINT = `${API_URL}/roles/list`;
const DEFAULT_PER_PAGE = 5;

export default function Roles() {
  const tableStore = useMemo(() => createTableStore<RoleType>(), []);
  const {
    filteredData,
    meta,
    isLoading,
    error,
    fetchData,
    setSearch,
    pageData,
  } = useStore(tableStore);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(ROLES_ENDPOINT, {
        page: 1,
        perPage: DEFAULT_PER_PAGE,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchData]);

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 p-4 rounded-md bg-red-50 border border-red-200">
          Error loading roles: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Roles</h1>
      </div>

      <DataTable<RoleType>
        columns={COLUMNS}
        data={filteredData}
        perPage={DEFAULT_PER_PAGE}
        total_data={pageData}
        isLoading={isLoading}
        onSearch={(term) => setSearch(term, ["name", "type"])}
      />
    </div>
  );
}
