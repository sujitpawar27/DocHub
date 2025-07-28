"use client";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getPatientAppointments, updateAppointmentStatus } from "@/app/api/patient/appointment";

const statusColor = {
  confirmed: "green",
  pending: "yellow",
  cancelled: "red",
  completed: "blue",
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function isToday(dateStr) {
  const today = new Date();
  const d = new Date(dateStr);
  return d.toDateString() === today.toDateString();
}

export default function MyAppointmentsPage() {
  const [tab, setTab] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = () => {
    setLoading(true);
    getPatientAppointments(tab)
      .then((data) => setAppointments(data))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, [tab]);



  return (
    <div className=" bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-10 text-center drop-shadow">
          My Appointments
        </h1>

        <Tabs value={tab} onValueChange={setTab} className="mb-8">
          <TabsList className="bg-white p-1 rounded-full shadow">
            <TabsTrigger
              value="upcoming"
              className="px-6 py-2 text-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-full transition"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="px-6 py-2 text-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-full transition"
            >
              Past
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <AppointmentList appointments={appointments} type="upcoming" loading={loading}  refreshAppointments={fetchAppointments}
 />
          </TabsContent>
          <TabsContent value="past">
            <AppointmentList appointments={appointments} type="past" loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AppointmentList({ appointments, type, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-pulse text-blue-500 text-xl font-medium">Loading appointments...</div>
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <span className="text-6xl mb-4">📅</span>
        <div className="text-gray-500 text-lg">
          No {type === "upcoming" ? "upcoming" : "past"} appointments found.
        </div>
      </div>
    );
  }

  const handleCancel = async (apptId) => {
    try {
      await updateAppointmentStatus(apptId, "cancelled");
      alert("Appointment Cancelled")
      if (refreshAppointments) refreshAppointments();
    } catch (err) {
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {appointments.map((appt) => (
        <Card
          key={appt._id}
          className="rounded-2xl shadow-md hover:shadow-xl transition-all bg-white border-0 p-5"
        >
          <CardHeader className="flex items-center gap-4 p-0 pb-4 border-b border-gray-100">
            <Avatar className="w-14 h-14 border-2 border-blue-100 shadow-sm">
              <AvatarImage
                src={appt.doctor?.avatarUrl ? `http://localhost:5000${appt.doctor.avatarUrl}` : "/default-avatar.png"}
              />
              <AvatarFallback>{appt.doctor?.fullName?.charAt(0) || "D"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-blue-900">
                {appt.doctor.fullName}
              </CardTitle>
              <div className="text-sm text-blue-500 font-medium">{appt.doctor.specialization}</div>
            </div>
            <Badge className={`capitalize bg-${statusColor[appt.status] || "gray"}-100 text-${statusColor[appt.status] || "gray"}-800`}>
              {appt.status}
            </Badge>
          </CardHeader>

          <CardContent className="pt-4 flex flex-col text-sm text-gray-700 gap-2">
            <div>
              <span className="font-medium text-gray-600">📅 Date:</span> {formatDate(appt.date)}
            </div>
            <div>
              <span className="font-medium text-gray-600">⏰ Time:</span> {appt.time}
            </div>
            <div className="flex gap-2 mt-3">
              {type === "upcoming" && isToday(appt.date) && (
                <Button size="sm" className="bg-green-600 text-white rounded-full px-4 hover:bg-green-700 shadow">
                  Join Video
                </Button>
              )}
              {type === "upcoming" && appt.status !== "Cancelled" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-100 px-4"
                  onClick={() => handleCancel(appt._id)}
                >
                  Cancel Appointment
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
