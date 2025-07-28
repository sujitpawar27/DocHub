"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { SlotPicker } from "@/components/SlotPicker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import { getProfile } from "@/app/api/doctor/profile";
import { bookAppointment } from "@/app/api/patient/appointment";

const mockPatient = {
  name: "John Doe",
  email: "john@example.com",
};

export default function DoctorProfilePage() {
  const { id } = useParams();
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [consultType, setConsultType] = useState("video");
  const [duration, setDuration] = useState("15");
  const [notes, setNotes] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  console.log("id", id);
  useEffect(() => {
    const fetchDoctor = async () => {      
      try {
        setLoading(true);
        const res = await getProfile(id);
        console.log("Doctor Profile res", res);
        setDoctor(res);
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError("Doctor not found or server error.");
      } finally {
        setLoading(false);
      }
    };
  
    if (id) fetchDoctor();
  }, [id]);

  console.log("Doctor" , doctor);
  
  
  const handleBook = () => setBookingOpen(true);

  const handleBookingConfirm = async () => {
    const patientId = localStorage.getItem("userId");
    try {
      const payload = {
        patientId:patientId,
        doctorId: doctor._id,
        date: selectedSlot?.datetime, 
        time: new Date(selectedSlot?.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: consultType,
        notes,
      };
  
      const res = await bookAppointment(payload);
  
      setBookingOpen(false);
      setBookingSuccess(true);
      setConfirmation({
        date: selectedSlot,
        doctor,
        joinLink: consultType === "video" ? "https://video.consult/join/abc123" : null,
      });
  
      console.log("Appointment booked:", res);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Failed to book appointment. Try again.");
    }
  };
  
  if (loading) return <div className="p-6 text-center">Loading doctor profile...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  if (!doctor) return null;
  
  const patientName = localStorage.getItem("user.fullName") 
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Doctor Info Section */}
      <Card className="mb-6">
        <CardContent className="flex flex-col sm:flex-row gap-6 items-center p-6">
          <Avatar className="w-24 h-24">
          <AvatarImage src={doctor?.avatarUrl ? `http://localhost:5000${doctor.avatarUrl}` : "/default-avatar.png"} />
          <AvatarFallback>{doctor?.fullName[0] || "D"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-800">{doctor?.fullName}</div>
            <Badge className="mt-1 mb-2">{doctor?.specialization}</Badge>
            <div className="text-gray-600 text-sm mb-1">{doctor?.address.country || (doctor?.isOnline ? "Online Only" : "-")}</div>
            <div className="flex gap-4 text-xs text-gray-500 mb-1">
              <span>{doctor?.experience} yrs exp</span>
              <span>⭐ {doctor?.rating}</span>
              {/* <span>{doctor?.languages.join(", ")}</span> */}
            </div>
            {/* <Button className="mt-2" onClick={handleBook}>Book Appointment</Button> */}
          </div>
        </CardContent>
      </Card>
<Card className="mb-8 rounded-3xl bg-white/90 shadow border-0">
  <CardContent className="p-8">
    <div className="font-bold text-lg text-blue-900 mb-2 border-l-4 border-blue-200 pl-2">About</div>
    <Textarea value={doctor?.bio} readOnly className="resize-none bg-blue-50 min-h-[72px] rounded-lg focus:ring-0 text-gray-700 shadow-inner" />
  </CardContent>
</Card>

{/* Available Slots Section */}
<Card className="mb-8 rounded-3xl bg-white/90 shadow border-0">
  <CardContent className="p-8">
    <div className="font-bold text-lg text-blue-900 mb-4 border-l-4 border-blue-200 pl-2">Available Slots</div>
    <SlotPicker
      doctorId={doctor?._id}
      consultType={consultType}
      slotDuration={parseInt(duration, 10)}
      value={selectedSlot}
      onChange={setSelectedSlot}
    />
  </CardContent>
</Card>

{/* Consultation Mode & Booking Confirmation UI */}
<Card className="mb-8 rounded-3xl shadow bg-white/95 border-0">
  <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
    <div>
      <div className="font-bold text-lg text-blue-900 mb-3 border-l-4 border-blue-200 pl-2">Consultation Mode</div>
      <Select value={consultType} onValueChange={setConsultType}>
        <SelectTrigger className="w-full rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300">
          <SelectValue placeholder="Select mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="inperson">In-person</SelectItem>
          <SelectItem value="video">Video</SelectItem>
        </SelectContent>
      </Select>
      <div className="mt-6 font-semibold mb-2">Duration</div>
      <div className="flex gap-3">
        <Button
          variant={duration === "15" ? "default" : "outline"}
          onClick={() => setDuration("15")}
          className="rounded-full px-6"
        >
          15 min
        </Button>
        <Button
          variant={duration === "30" ? "default" : "outline"}
          onClick={() => setDuration("30")}
          className="rounded-full px-6"
        >
          30 min
        </Button>
      </div>
    </div>
    <div>
      <div className="font-bold text-lg text-blue-900 mb-3 border-l-4 border-blue-200 pl-2">Booking Details</div>
      <div className="mb-2 text-[15px]">Patient: <span className="font-semibold">{ patientName}</span></div>
      <Textarea
        placeholder="Notes for doctor (optional)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className="mb-3 bg-blue-50 rounded-lg shadow-inner min-h-[48px]"
      />
      <div className="mb-2 text-[15px]">Fee: <span className="font-semibold text-blue-800">₹{doctor?.fee || "200"}</span></div>
      <Button
        className="w-full mt-4 rounded-full bg-green-600 text-white hover:bg-green-700 font-semibold shadow"
        disabled={!selectedSlot}
        onClick={() => setBookingOpen(true)}
      >
        Confirm Booking
      </Button>
    </div>
  </CardContent>
</Card>

{/* Booking Confirmation Dialog */}
<Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
  <DialogContent className="rounded-2xl">
    <DialogHeader>
      <DialogTitle className="text-blue-800 font-extrabold text-2xl mb-4">Confirm Appointment</DialogTitle>
    </DialogHeader>
    <div className="mb-2">Doctor: <span className="font-semibold">{doctor?.fullName || "D"}</span></div>
    <div className="mb-2">Slot: <span className="font-semibold">{selectedSlot ? new Date(selectedSlot.datetime).toLocaleString() : "-"}</span></div>
    <div className="mb-2">Consultation: <span className="font-semibold">{consultType === "video" ? "Video" : "In-person"}</span></div>
    <div className="mb-2">Duration: <span className="font-semibold">{duration} min</span></div>
    <div className="mb-2">Fee: <span className="font-semibold">₹{doctor?.fee || "200"}</span></div>
    <div className="mb-2">Patient: <span className="font-semibold">{patientName}</span></div>
    <div className="mb-2">Notes: <span className="font-semibold">{notes || " ------"}</span></div>
    <DialogFooter>
      <Button className="rounded-full bg-blue-600 text-white hover:bg-blue-700 px-8" onClick={handleBookingConfirm}>
        Book Appointment
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<Dialog open={bookingSuccess} onOpenChange={setBookingSuccess}>
<DialogContent className="rounded-2xl px-6 pt-8 pb-6 flex flex-col items-center justify-center ">
      <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-green-700 ">
        Appointment Confirmed!
      </DialogTitle>
    </DialogHeader>

    <div className="my-4 text-center space-y-2">
      <div className="text-base">
        <strong className="text-gray-700">Doctor:</strong> {doctor?.fullName || "N/A"}
      </div>
      <div className="text-base">
        <strong className="text-gray-700">Date:</strong>{" "}
        {confirmation?.date
          ? new Date(confirmation.date.datetime).toLocaleString()
          : "-"}
      </div>

      {confirmation?.joinLink && (
        <div className="text-base">
          <strong className="text-gray-700">Join Link:</strong>{" "}
          <a
            href={confirmation.joinLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 font-medium underline"
          >
            Join Video Call
          </a>
        </div>
      )}

      <div className="text-sm text-gray-500 mt-3">
        A confirmation email has been sent to your inbox.
      </div>
    </div>

    <DialogFooter className="mt-6">
      <Button
        onClick={() => setBookingSuccess(false)}
        className="rounded-full bg-green-600 hover:bg-green-700 text-white px-6"
      >
        Done
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
}
