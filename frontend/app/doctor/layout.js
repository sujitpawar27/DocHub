"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

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
        isDoctor={true} />
<main className={`flex-1 transition-all duration-300 px-4 ${sidebarMode === "full" ? "ml-64" : "ml-20"}`}>
  {children}
</main>
    </div>
  </div>
</ProtectedRoute>

  );
}
