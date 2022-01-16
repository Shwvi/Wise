import React, { ReactNode } from "react";
export function HoverWindow({
  children,
  classname,
  onClick,
}: {
  children?: ReactNode;
  classname: string;
  onClick?: any;
}) {
  return (
    <div
      onClick={onClick}
      className={`opacity-0 hover:opacity-100 rounded transition-all duration-200 ease-in-out ${classname}`}
    >
      {children}
    </div>
  );
}
