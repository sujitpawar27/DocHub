"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PatientLayout({ children }) {
  const pathname = usePathname();

  const isDashboard = pathname === "/patient/dashboard";
  const [sidebarMode, setSidebarMode] = useState(isDashboard ? "full" : "mini");

  useEffect(() => {
    setSidebarMode(pathname === "/patient/dashboard");
  }, [pathname]);

  const handleSidebarToggle = () => {
    setSidebarMode((prev) => (prev === "full" ? "mini" : "full"));
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <Sidebar
          mode={sidebarMode}
          onToggleMode={isDashboard ? handleSidebarToggle : undefined}
          isDoctor={false}
        />
        <div className="flex-1 flex flex-col">
        <Navbar
            open={sidebarMode === "full"}
            setOpen={handleSidebarToggle}
          />
<main className={`flex-1 transition-all duration-300  px-4 ${sidebarMode === "full" ? "ml-64" : "ml-20"}`}>
  {children}
</main>        
</div>
      </div>
    </ProtectedRoute>
  );
} 