"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect, use } from "react";
import { usePathname } from "next/navigation";
import {
  fetchdoctoravailability,
  updateAvailability,
} from "../api/doctor/profile";

export default function DoctorLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/doctor/dashboard";
  const [sidebarMode, setSidebarMode] = useState(isDashboard ? "full" : "mini");
  const [availability, setAvailability] = useState(false);
  const [doctor, setDoctor] = useState({
    name: "",
    specialization: "",
  });

  // Load doctor name and specialization from localStorage
  useEffect(() => {
    const fullName = localStorage.getItem("fullName") || "Doctor";
    const specialization = localStorage.getItem("specialization") || "General";

    setDoctor({
      name: `${fullName}`,
      specialization,
    });

    // Fetch doctor's availability
    const doctorId = localStorage.getItem("userId");
    if (doctorId) {
      console.log("Fetching availability for doctorId:", doctorId);

      fetchdoctoravailability(doctorId)
        .then((res) => {
          console.log("API response for availability:", res);
          setAvailability(!!res.available);
        })
        .catch((err) => {
          console.error("Error fetching doctor availability:", err);
          setAvailability(false);
        });
    } else {
      console.warn("No doctorId found in localStorage");
    }
  }, []);

  useEffect(() => {
    if (isDashboard) {
      setSidebarMode("full");
    } else {
      setSidebarMode("mini");
    }
  }, [pathname]);

  const handleSidebarToggle = () => {
    setSidebarMode((prev) => (prev === "full" ? "mini" : "full"));
  };

  const contentMargin = sidebarMode === "full" ? "ml-64" : "ml-20";

  const handleAvailabilityToggle = async (checked) => {
    const doctorId = localStorage.getItem("userId");
    setAvailability(checked);
    try {
      await updateAvailability(doctorId, checked);
    } catch (error) {
      console.error("Failed to update availability", error);
      setAvailability(!checked);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Sidebar
          mode={sidebarMode}
          onToggleMode={isDashboard ? handleSidebarToggle : undefined}
          isDoctor={true}
        />
        <div className="flex-1 flex flex-col">
          <Navbar
            open={sidebarMode === "full"}
            setOpen={handleSidebarToggle}
            doctorName={doctor.name}
            specialization={doctor.specialization}
            availability={availability}
            isDoctor={true}
            handleAvailabilityToggle={handleAvailabilityToggle} // ✅ PASS THIS
          />
          <main
            className={`flex-1 transition-all duration-300 px-4 ${
              sidebarMode === "full" ? "ml-64" : "ml-20"
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
