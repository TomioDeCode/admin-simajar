import { Typography } from "@/components/ellements/Typography";
import { cn } from "@/lib/utils";
import React from "react";

interface WalletCardProps {
  amount: string;
  percentage: string;
  icon?: React.ReactNode;
  className?: string;
}

export const WalletCard = ({
  amount,
  percentage,
  icon,
  className,
}: WalletCardProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-evenly p-4 rounded-lg shadow bg-white w-full",
        className
      )}
    >
      <div className="w-full">
        <Typography variant="h4" className="text-muted-foreground">
          Today's Money
        </Typography>
        <Typography variant="h2" className="text-primary mt-2">
          {amount}
        </Typography>
        <Typography variant="small" className="text-green-500 mt-1">
          {percentage}
        </Typography>
      </div>
      {icon && <div className="text-4xl text-primary">{icon}</div>}
    </div>
  );
};
