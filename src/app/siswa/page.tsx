import React from "react";
import { WalletCard } from "@/components/core/WalletCard";
import { WalletIcon } from "lucide-react";
import { DataTable } from "@/components/core/DataTable";

const page = () => {
  return (
    <div>
      <div className="flex w-full justify-evenly space-x-5">
        <WalletCard
          amount="$53,000"
          percentage="+55%"
          icon={<WalletIcon className="text-primary w-6 h-6" />}
        />
        <WalletCard
          amount="$53,000"
          percentage="+55%"
          icon={<WalletIcon className="text-primary w-6 h-6" />}
        />
        <WalletCard
          amount="$53,000"
          percentage="+55%"
          icon={<WalletIcon className="text-primary w-6 h-6" />}
        />
      </div>
      <DataTable />
    </div>
  );
};

export default page;
