"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export default function TimeSlotPicker({ timeSlot, onChange, onRemove }) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (timeSlot && typeof timeSlot === 'object') {
      setStartTime(timeSlot.start || "");
      setEndTime(timeSlot.end || "");
    } else if (typeof timeSlot === 'string' && timeSlot.includes("-")) {
      const [start, end] = timeSlot.split("-");
      setStartTime(start);
      setEndTime(end);
    }
  }, [timeSlot]);

  const handleStartTimeChange = (e) => {
    const value = e.target.value;
    setStartTime(value);
    if (value && endTime) onChange({ start: value, end: endTime });
  };

  const handleEndTimeChange = (e) => {
    const value = e.target.value;
    setEndTime(value);
    if (startTime && value) onChange({ start: startTime, end: value });
  };

  return (
    <div className="flex items-center gap-4 group">
      <div className="flex-1 grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium text-gray-600">Start</label>
          <Input type="time" value={startTime} onChange={handleStartTimeChange} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">End</label>
          <Input type="time" value={endTime} onChange={handleEndTimeChange} />
        </div>
      </div>
      {onRemove && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onRemove}
          className="text-red-600 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
