import React from "react";
import { MainCard } from "@/components/core/MainCard";
import { DataTable } from "@/components/core/DataTable";
import {
  TbGenderDemigirl,
  TbGenderDemiboy,
  TbGenderBigender,
} from "react-icons/tb";

const SiswaPage = () => {
  const studentStats = [
    {
      amount: 2,
      title: "Semua Murid",
      icon: <TbGenderBigender className="text-primary w-6 h-6" />
    },
    {
      amount: 1,
      title: "Laki - Laki",
      icon: <TbGenderDemiboy className="text-primary w-6 h-6" />
    },
    {
      amount: 1,
      title: "Perempuan",
      icon: <TbGenderDemigirl className="text-primary w-6 h-6" />
    }
  ];

  return (
    <main className="p-6 space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {studentStats.map((stat, index) => (
          <MainCard
            key={index}
            amount={stat.amount}
            title={stat.title}
            icon={stat.icon}
          />
        ))}
      </div>
      <DataTable />
    </main>
  );
};

export default SiswaPage;
