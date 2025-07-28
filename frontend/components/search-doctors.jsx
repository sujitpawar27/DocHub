import { useState, useMemo } from "react";
import DoctorCard from "./DoctorCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MOCK_DOCTORS = [
  {
    id: 1,
    name: "Dr. Mehta",
    specialization: "Cardiologist",
    experience: 12,
    rating: 4.8,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Dr. Sharma",
    specialization: "Dermatologist",
    experience: 8,
    rating: 4.5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Dr. Patel",
    specialization: "Pediatrician",
    experience: 10,
    rating: 4.7,
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    id: 4,
    name: "Dr. Gupta",
    specialization: "Orthopedic",
    experience: 15,
    rating: 4.9,
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    id: 5,
    name: "Dr. Reddy",
    specialization: "Cardiologist",
    experience: 7,
    rating: 4.3,
    avatar: "https://randomuser.me/api/portraits/women/55.jpg",
  },
];

const SPECIALIZATIONS = [
  ...Array.from(new Set(MOCK_DOCTORS.map((d) => d.specialization))),
];

export default function SearchDoctorsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [rating, setRating] = useState(0);

  // Debounce search
  useMemo(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const filteredDoctors = useMemo(() => {
    return MOCK_DOCTORS.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesSpec = specialization ? doc.specialization === specialization : true;
      const matchesRating = rating ? doc.rating >= rating : true;
      return matchesSearch && matchesSpec && matchesRating;
    });
  }, [debouncedSearch, specialization, rating]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Find a Doctor</h1>
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/2"
        />
        <select
          className="border rounded-md p-2 text-gray-700 bg-white"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        >
          <option value="">All Specializations</option>
          {SPECIALIZATIONS.map((spec) => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
        <select
          className="border rounded-md p-2 text-gray-700 bg-white"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value={0}>All Ratings</option>
          <option value={4.5}>4.5+</option>
          <option value={4.7}>4.7+</option>
          <option value={4.9}>4.9+</option>
        </select>
      </div>
      {/* Doctor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No doctors found.</div>
        ) : (
          filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              actionLabel="Book Now"
              onAction={() => alert(`Booking with ${doctor.name}`)}
            />
          ))
        )}
      </div>
    </div>
  );
} 