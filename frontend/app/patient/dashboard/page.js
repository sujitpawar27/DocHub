"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Calendar,
  FileText,
  Stethoscope,
  Video,
  X,
} from "lucide-react";
import { CopilotPopup } from "@copilotkit/react-ui";
const { getPatientAppointments } = await import(
  "@/app/api/patient/appointment"
);

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const recentDoctors = [
    {
      name: "Dr. Mehta",
      specialization: "Cardiologist",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Dr. Sharma",
      specialization: "Dermatologist",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Dr. Patel",
      specialization: "Pediatrician",
      avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    },
  ];
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointments = await getPatientAppointments("upcoming");
        setUpcomingAppointments(appointments);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setAppointmentsLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="w-full flex flex-col p-4 gap-8">
      <Card className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1">
          <CardTitle className="text-2xl md:text-3xl text-blue-600 font-bold">
            Welcome, Sujit
          </CardTitle>
          <CardDescription className="text-gray-500 mt-1">
            Your next appointment:{" "}
            <span className="font-semibold text-blue-600">Dr. Mehta</span>{" "}
            (Today at 5:30 PM)
          </CardDescription>
        </div>
      </Card>

      {/* 2x2 Grid of Icon Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="flex flex-col items-center justify-center p-6 cursor-pointer hover:scale-105 transition bg-white rounded-xl shadow-md group">
          <Search className="text-blue-600 mb-2" size={36} />
          <span className="font-semibold text-lg text-blue-600">
            Search Doctors
          </span>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 cursor-pointer hover:scale-105 transition bg-white rounded-xl shadow-md group">
          <Calendar className="text-blue-600 mb-2" size={36} />
          <span className="font-semibold text-lg text-blue-600">
            Book Appointment
          </span>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 cursor-pointer hover:scale-105 transition bg-white rounded-xl shadow-md group">
          <FileText className="text-blue-600 mb-2" size={36} />
          <span className="font-semibold text-lg text-blue-600">
            View Prescriptions
          </span>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 cursor-pointer hover:scale-105 transition bg-white rounded-xl shadow-md group">
          <Stethoscope className="text-blue-600 mb-2" size={36} />
          <span className="font-semibold text-lg text-blue-600">
            Health History
          </span>
        </Card>
      </div>

      {/* Separator */}
      <div className="h-px bg-gray-200 my-2 w-full" />

      {/* Side-by-side sections */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Recent Doctors */}
        <Card className="flex-1 bg-white rounded-xl shadow-md p-4 flex flex-col">
          <CardHeader>
            <CardTitle className="text-blue-600 text-xl">
              Recent Doctors
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {recentDoctors.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-gray-50 rounded-lg p-3"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={doc.avatar} alt={doc.name} />
                  <AvatarFallback>{doc.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{doc.name}</div>
                  <div className="text-gray-500 text-sm">
                    {doc.specialization}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View Profile
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="flex-1 bg-white rounded-xl shadow-md p-4 flex flex-col">
          <CardHeader>
            <CardTitle className="text-blue-600 text-xl">
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-sm">
                    <th className="py-2 pr-4">Doctor</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Time</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-gray-500"
                      >
                        Loading appointments...
                      </td>
                    </tr>
                  ) : upcomingAppointments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-gray-500"
                      >
                        No upcoming appointments
                      </td>
                    </tr>
                  ) : (
                    upcomingAppointments.map((appt) => (
                      <tr key={appt._id} className="border-b last:border-b-0">
                        <td className="py-2 pr-4 font-medium text-gray-800">
                          {appt.doctor.fullName}
                        </td>
                        <td className="py-2 pr-4">
                          {new Date(appt.date).toLocaleDateString()}
                        </td>
                        <td className="py-2 pr-4">
                          {new Date(appt.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-2 flex gap-2">
                          {appt.type === "video" && (
                            <Button
                              size="sm"
                              className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                              <Video className="mr-1" size={16} />
                              Join Video
                            </Button>
                          )}
                          {appt.status === "confirmed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-gray-600 border-gray-300 hover:bg-gray-100"
                            >
                              <X className="mr-1" size={16} />
                              Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      <CopilotPopup
        instructions={
          "You are assisting the user as best as you can. Answer in the best way possible given the data you have."
        }
        labels={{
          title: "Popup Assistant",
          initial: "Need any help?",
        }}
      />
    </div>
  );
}
