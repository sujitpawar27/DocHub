import React from "react";

export function Separator({ orientation = "horizontal", className = "" }) {
  return orientation === "vertical" ? (
    <div className={`w-px h-full bg-gray-200 ${className}`} />
  ) : (
    <div className={`h-px w-full bg-gray-200 ${className}`} />
  );
} 