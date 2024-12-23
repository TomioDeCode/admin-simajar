import { Icons } from "@/components/ellements/Icons";
import { PiStudent } from "react-icons/pi";
import React from "react";
import { WalletCard } from "@/components/fragments/WalletCard";
import { WalletIcon } from "lucide-react";

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
    </div>
  );
};

export default page;
