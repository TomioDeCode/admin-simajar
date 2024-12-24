import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";
import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface MainCardProps {
  amount: number;
  icon?: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  onClick?: () => void;
}

export const MainCard = memo(({
  amount,
  icon,
  className,
  title,
  description,
  onClick
}: MainCardProps) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden w-full transition-all hover:shadow-lg", 
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            {title && (
              <Typography variant="muted" className="text-gray-500">
                {title}
              </Typography>
            )}
            <div className="flex flex-col gap-2">
              <Typography variant="h3" className="font-bold">
                {amount.toLocaleString()}
              </Typography>
              {description && (
                <Typography variant="small" className="text-gray-500">
                  {description}
                </Typography>
              )}
            </div>
          </div>
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-transform hover:scale-105">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

MainCard.displayName = "MainCard";

export default MainCard;
