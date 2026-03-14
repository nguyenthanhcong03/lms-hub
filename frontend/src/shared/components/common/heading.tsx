import { cn } from "@/utils/common";
import React from "react";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}
const Heading = ({ children, className = "" }: HeadingProps) => {
  return (
    <h1 className={cn("text-2xl font-bold uppercase", className)}>
      {children}
    </h1>
  );
};

export default Heading;
