"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import clsx from "clsx";
import { getDoctorSlotsOnDemand } from "@/app/api/doctor/generateSlots";

export function SlotPicker({ doctorId, consultType = 'inperson', slotDuration = 30, value, onChange }) {
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [slots, setSlots] = React.useState([]);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
      if (!doctorId || !selectedDate) return;
      setLoading(true);
      setError(null);      
      getDoctorSlotsOnDemand({
        doctorId,
        date: selectedDate.toLocaleDateString('en-CA'),
        type: consultType,
        slotDuration,
      })
        .then((res) => setSlots(res.slots || []))
        .catch((err) => {
          setSlots([]);
          setError(err?.response?.data?.error || 'Failed to fetch slots');
        })
        .finally(() => setLoading(false));
    }, [doctorId, selectedDate, consultType, slotDuration]);

    const availableSlots = React.useMemo(() => {
      if (!selectedDate) return [];
      return slots;
    }, [slots, selectedDate]);

    console.log("Slots", slots);
    

    return (
      <div className="flex flex-col gap-4">
        <div>
          <Label className="mb-1">Select a Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-48 justify-between">
                {selectedDate ? selectedDate.toDateString() : "Choose date"}
                <ChevronDownIcon size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={(d) => setSelectedDate(d ?? null)}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
        </div>

        {selectedDate && (
          <>
            <Label className="mb-1">Available Time Slots</Label>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading slots...</div>
            ) : error ? (
              <div className="text-sm text-red-500">{error}</div>
            ) : availableSlots.length === 0 ? (
              <div className="text-sm text-muted-foreground">No slots available for this date.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {availableSlots.map((slot, index) => {
                  const isSelected = value?.datetime === slot.datetime;
                  const isBooked = !slot.available;
                  const time = new Date(slot.datetime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <Button
                      key={index}
                      variant={isSelected ? "default" : "outline"}
                      className={clsx("text-sm", { "bg-blue-100": isSelected })}
                      onClick={() => !isBooked && onChange(slot)}
                      disabled={isBooked}
                    >
                      {time}
                    </Button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    );
}
