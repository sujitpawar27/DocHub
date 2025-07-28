import React from "react";
import { cn } from "@/lib/utils";

export function Badge({ color = "gray", children, className = "", ...props }) {
  const colorMap = {
    gray: "bg-gray-200 text-gray-800",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
  };
  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1 text-xs font-semibold", 
        colorMap[color] || colorMap.gray,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
} 