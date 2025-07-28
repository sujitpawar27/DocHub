import React from "react";
import {Card} from "./ui/card";
import { Avatar } from "./ui/avatar";
import {Badge} from "./ui/badge";
import {Button} from "./ui/button";
import { Separator } from "./separator";

export default function AppointmentCard({
  patientName,
  patientAvatar,
  date,
  time,
  type,
  typeIcon: TypeIcon,
  onStart,
}) {
  return (
    <Card className="flex items-center gap-4 p-4 hover:shadow-lg transition-shadow">
      <Avatar src={patientAvatar} alt={patientName} />
      <div className="flex-1">
        <div className="font-semibold text-gray-800">{patientName}</div>
        <div className="text-xs text-gray-500">{date} • {time}</div>
        <div className="flex items-center gap-2 mt-1">
          {TypeIcon && <TypeIcon className="w-4 h-4 text-blue-500" />}
          <Badge>{type}</Badge>
        </div>
      </div>
      <Separator orientation="vertical" className="h-10 mx-2" />
      <Button onClick={onStart} className="ml-auto">Start Consultation</Button>
    </Card>
  );
} 