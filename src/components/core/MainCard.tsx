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

export const MainCard = memo(
  ({ amount, icon, className, title, description, onClick }: MainCardProps) => {
    return (
      <Card
        className={cn(
          "overflow-hidden w-full transition-all hover:shadow-lg",
          onClick && "cursor-pointer",
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 sm:space-y-3">
              {title && (
                <Typography
                  variant="muted"
                  className="text-gray-500 text-sm sm:text-base"
                >
                  {title}
                </Typography>
              )}
              <div className="flex flex-col gap-1 sm:gap-2">
                <Typography
                  variant="h3"
                  className="font-bold text-lg sm:text-xl lg:text-2xl"
                >
                  {amount.toLocaleString()}
                </Typography>
                {description && (
                  <Typography
                    variant="small"
                    className="text-gray-500 text-xs sm:text-sm"
                  >
                    {description}
                  </Typography>
                )}
              </div>
            </div>
            {icon && (
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 transition-transform hover:scale-105">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

MainCard.displayName = "MainCard";

export default MainCard;
