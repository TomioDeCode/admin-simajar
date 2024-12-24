import React from "react";
import { MainCard } from "@/components/core/MainCard";
import { WalletIcon } from "lucide-react";

const page = () => {
  return (
    <div>
      <div className="flex w-full justify-evenly space-x-5">
        <MainCard
          amount={1}
          icon={<WalletIcon className="text-primary w-6 h-6" />}
        />
        <MainCard
          amount={2}
          icon={<WalletIcon className="text-primary w-6 h-6" />}
        />
        <MainCard
          amount={3}
          icon={<WalletIcon className="text-primary w-6 h-6" />}
        />
      </div>
    </div>
  );
};

export default page;
