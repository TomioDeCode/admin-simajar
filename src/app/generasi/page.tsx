import React from "react";
import { MainCard } from "@/components/core/MainCard";
import { AngkatanTable } from "@/components/features/generasi/GenerasiTable";

const GenerasiPage = () => {
  const generasiStats = [
    {
      amount: 2,
      title: "Semua Generasi",
    },
  ];

  return (
    <main className="space-y-3 sm:space-y-4 lg:space-y-6 p-3 sm:p-4 lg:p-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 -mt-5">
        {generasiStats.map((stat, index) => (
          <MainCard
            key={index}
            amount={stat.amount}
            title={stat.title}
            className="w-full transition-transform duration-200 hover:scale-[1.02]"
          />
        ))}
      </div>
      <div className="w-full overflow-x-auto rounded-lg shadow-sm border border-gray-100">
        <AngkatanTable />
      </div>
    </main>
  );
};

export default GenerasiPage;
