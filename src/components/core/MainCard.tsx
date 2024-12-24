import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CardProps {
  amount: number;
  icon?: React.ReactNode;
  className?: string;
  title?: string;
}

export const MainCard = ({
  amount,
  icon,
  className,
  title,
}: CardProps) => {
  return (
    <Card className={cn("overflow-hidden w-full", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <Typography variant="muted" className="text-gray-500">
              {title}
            </Typography>
            <div className="flex items-center gap-3">
              <Typography variant="h3" className="font-bold">
                {amount}
              </Typography>
            </div>
          </div>
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MainCard;
