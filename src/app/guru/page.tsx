import React from "react";
import { MainCard } from "@/components/core/MainCard";
import { GuruTable } from "@/components/features/guru/GuruTable";
import {
  TbGenderDemigirl,
  TbGenderDemiboy,
  TbGenderBigender,
} from "react-icons/tb";

const GuruPage = () => {
  const guruStats = [
    {
      amount: 2,
      title: "Semua Guru",
      icon: <TbGenderBigender className="w-6 h-6 text-primary" />
    },
    {
      amount: 1,
      title: "Laki - Laki",
      icon: <TbGenderDemiboy className="w-6 h-6 text-primary" />
    },
    {
      amount: 1,
      title: "Perempuan",
      icon: <TbGenderDemigirl className="w-6 h-6 text-primary" />
    }
  ];

  return (
    <main className="space-y-2 p-6">
      <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
        {guruStats.map((stat, index) => (
          <MainCard
            key={index}
            amount={stat.amount}
            title={stat.title}
            icon={stat.icon}
          />
        ))}
      </div>
      <GuruTable />
    </main>
  );
};

export default GuruPage;
