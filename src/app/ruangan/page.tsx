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
      icon: <TbGenderBigender className="w-6 h-6 text-primary" />,
    },
    {
      amount: 1,
      title: "Laki - Laki",
      icon: <TbGenderDemiboy className="w-6 h-6 text-primary" />,
    },
    {
      amount: 1,
      title: "Perempuan",
      icon: <TbGenderDemigirl className="w-6 h-6 text-primary" />,
    },
  ];

  return (
    <main className="space-y-2 p-6">
      <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
        {ruanganStats.map((stat, index) => (
          <MainCard
            key={index}
            amount={stat.amount}
            title={stat.title}
            icon={stat.icon}
          />
        ))}
      </div>
      <RuanganTable />
    </main>
  );
};

export default RuanganPage;
