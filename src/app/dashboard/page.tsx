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
    <main className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardData.map((card, index) => (
          <MainCard
            key={index}
            amount={card.amount}
            title={card.label}
            icon={<WalletIcon className="text-primary w-6 h-6" />}
          />
        ))}
      </div>
    </main>
  );
};

export default Dashboard;
