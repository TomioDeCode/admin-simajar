import React from "react";
import { MainCard } from "@/components/core/MainCard";
import { WalletIcon } from "lucide-react";
import { DataTable } from "@/components/core/DataTable";
import {
  TbGenderDemigirl,
  TbGenderDemiboy,
  TbGenderBigender,
} from "react-icons/tb";

const page = () => {
  return (
    <div>
      <div className="flex w-full justify-evenly space-x-5">
        <MainCard
          amount={2}
          title="Semua Murid"
          icon={<TbGenderBigender className="text-primary w-6 h-6" />}
        />
        <MainCard
          amount={1}
          title="Laki - Laki"
          icon={<TbGenderDemiboy className="text-primary w-6 h-6" />}
        />
        <MainCard
          amount={1}
          title="Perempuan"
          icon={<TbGenderDemigirl className="text-primary w-6 h-6" />}
        />
      </div>
      <DataTable />
    </div>
  );
};

export default page;
