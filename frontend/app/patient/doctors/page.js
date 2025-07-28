"use client";
import { useState, useMemo, useEffect } from "react";
import DoctorCard from "@/components/DoctorCard";
import { Input } from "@/components/ui/input";
import { getAllDoctors } from "@/app/api/patient/appointment";

export default function SearchDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchDoctors = async () => {
      const allDoctors = await getAllDoctors();
      setDoctors(allDoctors);

      const uniqueSpecs = [
        ...new Set(allDoctors.map((doc) => doc.specialization)),
      ];
      setSpecializations(uniqueSpecs);
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        doc.fullName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesSpec = specialization
        ? doc.specialization === specialization
        : true;
      const matchesRating = rating ? doc.rating >= rating : true;
      return matchesSearch && matchesSpec && matchesRating;
    });
  }, [debouncedSearch, specialization, rating, doctors]);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-extrabold text-blue-800 text-center mb-10 drop-shadow">
          Book an Appointment
        </h1>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-6 mb-10 rounded-xl shadow border border-blue-100">
          <Input
            type="text"
            placeholder="Search doctor by name or specialization"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 rounded-lg border-blue-200 shadow-sm"
          />

          <select
            className="w-full md:w-1/3 border border-blue-200 rounded-lg p-2 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option value="">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 text-lg mt-12">
              🩺 No doctors found matching your criteria.
            </div>
          ) : (
            filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor._id || doctor.id}
                doctor={doctor}
                actionLabel="Book Now"
                onAction={() => alert(`Booking with ${doctor.fullName}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
