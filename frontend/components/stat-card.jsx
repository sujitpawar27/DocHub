import React from "react";

export default function StatCard({ icon: Icon, label, value, progress, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-6 h-6 text-blue-600" />}
        <span className="text-gray-500 text-sm font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      {typeof progress === "number" && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
} 