import React from "react";

type IconsType = {
  icon: React.ElementType;
  size: number;
};

export const Icons = ({ icon: Icon, size }: IconsType) => {
  return <Icon size={size} />;
};
