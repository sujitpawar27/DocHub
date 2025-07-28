"use client"
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { getAttendedPatients } from "@/app/api/doctor/patients";
import { 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  User, 
  Clock,
  TrendingUp,
  UserCheck,
  ArrowRight,
  Stethoscope
} from "lucide-react";

const sortOptions = [
  { value: "newest", label: "Most Recent", icon: Clock },
  { value: "oldest", label: "Oldest First", icon: Calendar },
  { value: "most", label: "Most Visits", icon: TrendingUp },
];

function sortPatients(patients, sort) {
  if (sort === "newest") {
    return [...patients].sort((a, b) => new Date(b.lastConsultation) - new Date(a.lastConsultation));
  }
  if (sort === "oldest") {
    return [...patients].sort((a, b) => new Date(a.lastConsultation) - new Date(b.lastConsultation));
  }
  if (sort === "most") {
    return [...patients].sort((a, b) => b.visits - a.visits);
  }
  return patients;
}

function PatientCard({ patient }) {
  const router = useRouter();
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="group relative overflow-hidden rounded-3xl border-0 bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -translate-y-10 translate-x-10"></div>
      
      <div className="relative p-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative mb-3">
            <Avatar className="w-20 h-20 ring-4 ring-white shadow-lg group-hover:ring-blue-100 transition-all duration-300">
              <AvatarImage src={patient.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
                {patient.name?.split(' ').map(n => n[0]).join('') || 'P'}
              </AvatarFallback>
            </Avatar>
            {/* Online/Active indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <UserCheck className="w-3 h-3 text-white" />
            </div>
          </div>
          
          {/* Patient Name */}
          <h3 className="font-bold text-lg text-gray-900 text-center mb-1 group-hover:text-blue-600 transition-colors">
            {patient.name}
          </h3>
          
          {/* Patient ID */}
          <p className="text-xs text-gray-500 mb-3">
            ID: #{patient.id?.slice(-6) || 'Unknown'}
          </p>
        </div>

        {/* Stats Section */}
        <div className="space-y-3 mb-5">
          {/* Last Consultation */}
          <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Last Visit</span>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-1 rounded-full">
              {formatDate(patient.lastConsultation)}
            </Badge>
          </div>

          {/* Visit Count (if available) */}
          {patient.visits && (
            <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Total Visits</span>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-1 rounded-full">
                {patient.visits}
              </Badge>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button 
          size="sm" 
          className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 shadow-lg hover:shadow-xl transition-all duration-300 group"
          onClick={() => router.push(`/doctor/patients/history/${patient.id}`)}
        >
          <User className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          View Profile
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  );
}

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAttendedPatients();
        setPatients(data);
      } catch (err) {
        setError("Failed to load patients");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filtered = sortPatients(
    patients.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    sort
  );

  const selectedSortOption = sortOptions.find(opt => opt.value === sort);
  const SortIcon = selectedSortOption?.icon || Filter;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <Card className="rounded-2xl border-0 bg-white shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search patients by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-4 py-3 rounded-2xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
              <div className="flex items-center gap-2">
                <SortIcon className="w-4 h-4 text-gray-600" />
                <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort by:</label>
              </div>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent border-none text-sm font-medium text-gray-900 focus:outline-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your patients...</p>
          </div>
        ) : error ? (
          <Card className="rounded-2xl border-0 bg-white shadow-sm">
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Patients</h3>
              <p className="text-red-500">{error}</p>
            </div>
          </Card>
        ) : (
          <div>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((patient) => (
                  <PatientCard key={patient.id} patient={patient} />
                ))}
              </div>
            ) : (
              <Card className="rounded-2xl border-0 bg-white shadow-sm">
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Patients Found</h3>
                  <p className="text-gray-500">
                    {search ? `No patients match "${search}"` : 'You haven\'t attended any patients yet.'}
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
