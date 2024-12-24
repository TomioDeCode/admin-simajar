import React from "react";

interface IconProps {
  icon: React.ElementType;
  size?: number;
  className?: string;
  color?: string;
}

export const Icons = ({
  icon: Icon,
  size = 24,
  className,
  color
}: IconProps) => {
  return (
    <Icon
      size={size}
      className={className}
      color={color}
    />
  );
};
