"use client"
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPatientHistory } from "@/app/api/doctor/patients";
import { 
  MessageCircle, 
  FileText, 
  Calendar, 
  Video, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Clock,
  User,
  Phone,
  Mail
} from "lucide-react";

const history = [
  {
    id: 1,
    date: "2024-06-10",
    type: "Video",
    status: "completed",
    notes: "Follow-up on blood pressure medication. Patient is responding well.",
  },
  {
    id: 2,
    date: "2024-05-15",
    type: "In-person",
    status: "completed",
    notes: "Annual physical exam. All vitals normal.",
  },
  {
    id: 3,
    date: "2024-04-01",
    type: "Video",
    status: "cancelled",
    notes: "Appointment cancelled by patient due to scheduling conflict.",
  },
];

function HistoryItem({ item }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-3 h-3" />;
      case "cancelled": return <XCircle className="w-3 h-3" />;
      case "pending": return <Clock className="w-3 h-3" />;
      default: return null;
    }
  };

  const getTypeIcon = (type) => {
    return type === "In-person" ? <MapPin className="w-4 h-4" /> : <Video className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      {/* Status indicator line */}
      <div className={`absolute top-0 left-0 w-full h-1 ${
        item.status === "completed" ? "bg-green-500" : 
        item.status === "cancelled" ? "bg-red-500" : "bg-yellow-500"
      }`} />
      
      <div className="p-5">
        {/* Header with date and badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-900">{formatDate(item.date)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
              {getTypeIcon(item.type)}
              <span className="ml-1">{item.type}</span>
            </Badge>
            <Badge className={`px-3 py-1 rounded-full font-medium border ${getStatusColor(item.status)}`}>
              {getStatusIcon(item.status)}
              <span className="ml-1">{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
            </Badge>
          </div>
        </div>

        {/* Notes section */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 text-sm leading-relaxed">{item.notes}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function ViewHistoryPage() {
  const { id, appointmentid } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("appointmentid", appointmentid);
  
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getPatientHistory(id);
        if (Array.isArray(data.appointments) && data.appointments.length > 0) {
          setPatient(data.appointments[0].patient); 
        } else {
          setPatient(null);
        }
      } catch (err) {
        console.error("Error fetching patient history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  console.log("getPatientHistory", patient);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-4">Loading patient history...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Patient not found</h3>
          <p className="text-gray-500">Unable to load patient information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Profile</h1>
        <p className="text-gray-600">View patient information and appointment history</p>
      </div>

      {/* Patient Profile Card */}
      <Card className="relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-white to-blue-50/30 shadow-lg mb-8">
        {/* Decorative background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 -translate-y-16 translate-x-16"></div>
        
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Patient Info Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 ring-4 ring-white shadow-lg">
                  <AvatarImage src={patient.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                    {patient.fullName?.split(' ').map(n => n[0]).join('') || 'P'}
                  </AvatarFallback>
                </Avatar>
                {/* Online status indicator */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">{patient.fullName}</h2>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Age: {patient.age}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="text-sm font-medium">Gender: {patient.gender}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    Patient ID: #{patient._id?.slice(-8) || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-2.5 font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button
                size="sm"
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 font-medium transition-colors shadow-md"
                onClick={() => router.push(`/doctor/prescription/${patient._id}/${appointmentid}`)}
              >
                <FileText className="w-4 h-4 mr-2" />
                Add Prescription
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Appointment History Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Appointment History</h3>
        <p className="text-gray-600">Previous consultations and medical records</p>
      </div>

      <div className="space-y-4">
        {history.length ? (
          history.map((item) => (
            <HistoryItem key={item.id} item={item} />
          ))
        ) : (
          <Card className="rounded-2xl border-0 bg-white shadow-sm">
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointment history</h3>
              <p className="text-gray-500">This patient doesn't have any previous appointments.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
