"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Video,
  MessageCircle,
  Stethoscope,
  DollarSign,
  Star,
  Users,
  Clock,
  Search,
  FileText,
  TrendingUp,
  Activity,
  Bell,
  Settings,
  LogOut,
  Plus,
  ArrowRight,
  BarChart3,
  Heart,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { getAppointments } from "@/app/api/doctor/appointments";
import { getStats } from "@/app/api/doctor/profile";

// Enhanced StatCard component
function StatCard({ label, value, icon: Icon, progress, trend }) {
  return (
    <Card className="relative overflow-hidden rounded-2xl border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Gradient background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-2xl opacity-30 -translate-y-10 translate-x-10"></div>

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                trend > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <TrendingUp
                className={`w-3 h-3 ${trend < 0 ? "rotate-180" : ""}`}
              />
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600 font-medium">{label}</p>

          {progress && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// Enhanced AppointmentCard component
function AppointmentCard({
  patientName,
  patientAvatar,
  date,
  time,
  type,
  typeIcon: TypeIcon,
  onStart,
}) {
  return (
    <Card className="group rounded-2xl border-0 bg-gradient-to-r from-white to-blue-50/30 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-12 h-12 ring-2 ring-white shadow-md">
                <AvatarImage src={patientAvatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {patientName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                {patientName}
              </h4>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-500" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-green-500" />
                  <span>{time}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 border-blue-200 font-medium">
              <TypeIcon className="w-3 h-3 mr-1" />
              {type}
            </Badge>
            <Button
              size="sm"
              className="rounded-xl bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-medium"
              onClick={onStart}
            >
              Start
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Enhanced PatientCard component
function PatientCard({ patientName, lastVisit, avatar, onViewHistory }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card
      className="group rounded-xl border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
      onClick={onViewHistory}
    >
      <div className="p-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-white shadow-sm">
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-sm font-semibold">
              {patientName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm truncate">
              {patientName}
            </p>
            <p className="text-xs text-gray-500">
              Last visit: {formatDate(lastVisit)}
            </p>
          </div>

          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [availability, setAvailability] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([]);
  const [search, setSearch] = useState("");
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

  // Mock data with enhanced stats
  // const doctor = {
  //   name: user?.name || "Dr. Sharma",
  //   avatar: "/globe.svg",
  //   specialization: "Cardiologist",
  // };

  // const stats = [
  //   {
  //     label: "Consultations This Week",
  //     value: 18,
  //     icon: Stethoscope,
  //     progress: 72,
  //     trend: 12,
  //   },
  //   {
  //     label: "Monthly Earnings",
  //     value: "$4,200",
  //     icon: DollarSign,
  //     trend: 8,
  //   },
  //   {
  //     label: "Avg. Rating",
  //     value: "4.8",
  //     icon: Star,
  //     trend: 5,
  //   },
  //   {
  //     label: "New Patients",
  //     value: 6,
  //     icon: Users,
  //     trend: -2,
  //   },
  // ];

  const pastPatients = [
    { patientName: "Amit Verma", lastVisit: "2024-05-10", avatar: "/file.svg" },
    {
      patientName: "Priya Singh",
      lastVisit: "2024-05-02",
      avatar: "/window.svg",
    },
    {
      patientName: "Rahul Mehra",
      lastVisit: "2024-04-28",
      avatar: "/vercel.svg",
    },
  ];

  const filteredPatients = pastPatients.filter((p) =>
    p.patientName.toLowerCase().includes(search.toLowerCase())
  );

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointments("today"); // Fetch only today's appointments
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching today's appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getStats();
      console.log("Stats data:", data);

      // Transform object to array for StatCard
      const statsArray = [
        {
          label: "Consultations This Week",
          value: data.consultationsThisWeek,
          icon: Stethoscope,
          progress: 0, // or any logic you want
          trend: 0, // or any logic you want
        },
        {
          label: "New Patients",
          value: data.newPatients,
          icon: Users,
          progress: 0,
          trend: 0,
        },
        // Add more cards if needed
      ];

      setStats(statsArray);
    } catch (err) {
      console.error("Error fetching today's appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchStats();
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Appointments Section */}
          <div className="lg:col-span-2">
            <Card className="rounded-3xl border-0 bg-white shadow-lg overflow-hidden">
              {/* Header with gradient */}
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Today's Schedule
                    </h2>
                  </div>
                  {/* <Button variant="outline" size="sm" className="rounded-xl">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View All
                    </Button> */}
                </div>

                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                      <div className="text-lg font-semibold">
                        No appointments scheduled for today
                      </div>
                      <div className="text-sm mt-2 text-gray-400">
                        Looks like you’ve got some free time — perfect moment to
                        relax, recharge, or catch up on things you love ✨
                      </div>
                    </div>
                  ) : (
                    appointments.map((appt, i) => (
                      <AppointmentCard
                        key={i}
                        {...appt}
                        onStart={() =>
                          alert(`Start consultation with ${appt.patientName}`)
                        }
                      />
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
