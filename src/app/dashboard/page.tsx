import React from "react";
import { MainCard } from "@/components/core/MainCard";
import { WalletIcon } from "lucide-react";

const Dashboard = () => {
  const cardData = [
    { amount: 1, label: "Total Balance" },
    { amount: 2, label: "Total Income" },
    { amount: 3, label: "Total Expenses" }
  ];

  return (
    <main className="p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cardData.map((card, index) => (
          <MainCard
            key={index}
            amount={card.amount}
            title={card.label}
            icon={<WalletIcon className="text-primary w-5 h-5 sm:w-6 sm:h-6" />}
          />
        ))}
      </div>
    </main>
  );
};

export default Dashboard;
