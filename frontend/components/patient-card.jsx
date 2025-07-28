import React from "react";
import { Card } from "./ui/card";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";

export default function PatientCard({ patientName, lastVisit, onViewHistory, avatar }) {
  return (
    <Card className="flex items-center gap-4 p-3 hover:shadow-md transition-shadow">
      <Avatar src={avatar} alt={patientName} />
      <div className="flex-1">
        <div className="font-medium text-gray-800">{patientName}</div>
        <div className="text-xs text-gray-500">Last visit: {lastVisit}</div>
      </div>
      <Button size="sm" onClick={onViewHistory}>View History</Button>
    </Card>
  );
} 