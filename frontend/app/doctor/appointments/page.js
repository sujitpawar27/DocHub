"use client"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAppointments, updateAppointmentStatus } from "@/app/api/doctor/appointments";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Video, User, Phone, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

function AppointmentCard({ appointment, onStatusUpdate }) {
  const router = useRouter();

  const handleConfirm = async () => {
    try {
      await updateAppointmentStatus(appointment._id, "confirmed");
      onStatusUpdate?.();
    } catch (err) {
      console.error("Failed to confirm appointment:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type) => {
    return type === "inperson" ? <MapPin className="w-3 h-3" /> : <Video className="w-3 h-3" />;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Status indicator line */}
      <div className={`absolute top-0 left-0 w-full h-1 ${
        appointment.status === "confirmed" ? "bg-green-500" : 
        appointment.status === "pending" ? "bg-yellow-500" : "bg-red-500"
      }`} />
      
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-12 h-12 ring-2 ring-white shadow-md">
                <AvatarImage src={appointment.patient.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {appointment.patient.fullName?.split(' ').map(n => n[0]).join('') || 'P'}
                </AvatarFallback>
              </Avatar>
              {appointment.status === "confirmed" && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">
                {appointment.patient.fullName}
              </h3>
              <p className="text-gray-500 text-sm">Patient ID: #{appointment.patient._id?.slice(-6)}</p>
            </div>
          </div>

          <Badge className={`px-3 py-1 rounded-full font-medium border ${getStatusColor(appointment.status)}`}>
            {appointment.status === "confirmed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
            {appointment.status === "pending" && <AlertCircle className="w-3 h-3 mr-1" />}
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Badge>
        </div>

        {/* Appointment Details */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">{formatDate(appointment.date)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">{appointment.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            {getTypeIcon(appointment.type)}
            <span className="text-sm font-medium">
              {appointment.type === "inperson" ? "In-person" : "Video Call"}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">General Consultation</span>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            size="sm"
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium transition-colors"
            onClick={() => router.push(`/doctor/patients/history/${appointment.patient._id}/${appointment._id}`)}
            disabled={appointment.status !== "confirmed"}
          >
            <User className="w-4 h-4 mr-2" />
            View Profile
          </Button>

          {appointment.status !== "confirmed" && (
            <Button
              size="sm"
              variant="secondary"
              className="rounded-xl bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-4 py-2 font-medium transition-colors"
              onClick={handleConfirm}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirm
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            className="rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 font-medium transition-colors"
            disabled={appointment.status !== "confirmed"}
          >
            <Phone className="w-4 h-4 mr-2" />
            {appointment.type === "inperson" ? "Call Patient" : "Join Call"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function DoctorAppointmentsPage() {
  const [activeTab, setActiveTab] = useState("today");
  const [appointments, setAppointments] = useState({
    today: [],
    upcoming: [],
    past: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async (tab) => {
    try {
      setLoading(true);
      const data = await getAppointments(tab);
      setAppointments((prev) => ({ ...prev, [tab]: data }));
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(activeTab);
  }, [activeTab]);

  return (
    <div className="w-full py-8 px-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
        <p className="text-gray-600">Manage your patient appointments efficiently</p>
      </div>
      
      <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger value="today" className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Today
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="past" className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Past
          </TabsTrigger>
        </TabsList>

        {["today", "upcoming", "past"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-500 mt-4">Loading appointments...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments[tab]?.length > 0 ? (
                  appointments[tab].map((appt) => (
                    <AppointmentCard 
                      key={appt._id} 
                      appointment={appt} 
                      onStatusUpdate={() => fetchAppointments(activeTab)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No {tab} appointments</h3>
                    <p className="text-gray-500">You don't have any {tab} appointments scheduled.</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
