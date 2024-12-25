import React from "react";
import { MainCard } from "@/components/core/MainCard";
import { RuanganTable } from "@/components/features/ruangan/RuanganTable";
import {
  TbGenderDemigirl,
  TbGenderDemiboy,
  TbGenderBigender,
} from "react-icons/tb";

const RuanganPage = () => {
  const ruanganStats = [
    {
      amount: 2,
      title: "Semua Ruangan",
      icon: <TbGenderBigender className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />,
    },
    {
      amount: 1,
      title: "Laki - Laki",
      icon: <TbGenderDemiboy className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />,
    },
    {
      amount: 1,
      title: "Perempuan",
      icon: <TbGenderDemigirl className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />,
    },
  ];

  return (
    <main className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="gap-4 sm:gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {ruanganStats.map((stat, index) => (
          <MainCard
            key={index}
            amount={stat.amount}
            title={stat.title}
            icon={stat.icon}
            className="w-full"
          />
        ))}
      </div>
      <div className="w-full overflow-x-auto rounded-lg shadow-sm border border-gray-100">
        <RuanganTable />
      </div>
    </main>
  );
};

export default RuanganPage;
