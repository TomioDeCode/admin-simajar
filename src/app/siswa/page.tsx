import React from "react";
import { MainCard } from "@/components/core/MainCard";
import { SiswaTable } from "@/components/features/siswa/SiswaTable";
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
      icon: (
        <TbGenderBigender className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary" />
      ),
    },
    {
      amount: 1,
      title: "Laki - Laki", 
      icon: (
        <TbGenderDemiboy className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary" />
      ),
    },
    {
      amount: 1,
      title: "Perempuan",
      icon: (
        <TbGenderDemigirl className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary" />
      ),
    },
  ];

  return (
    <main className="space-y-3 sm:space-y-4 lg:space-y-6 p-3 sm:p-4 lg:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {studentStats.map((stat, index) => (
          <MainCard
            key={index}
            amount={stat.amount}
            title={stat.title}
            icon={stat.icon}
            className="w-full transition-transform duration-200 hover:scale-[1.02]"
          />
        ))}
      </div>
      <div className="w-full overflow-x-auto rounded-lg shadow-sm border border-gray-100">
        <SiswaTable />
      </div>
    </main>
  );
};

export default SiswaPage;
