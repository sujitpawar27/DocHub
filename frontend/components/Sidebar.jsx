"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  CalendarCheck,
  UserPlus,
  FileText,
  User,
  Stethoscope,
  NotebookPen,
  CalendarPlus,
  Menu
} from "lucide-react";
import { useState } from "react";

const patientLinks = [
  { name: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { name: "Appointments", href: "/patient/appointments", icon: CalendarCheck },
  { name: "Doctors", href: "/patient/doctors", icon: Stethoscope },
  { name: "Profile", href: "/patient/profile", icon: User },
  { name: "Health History", href: "/patient/health-history", icon: FileText },
];

// Doctor sidebar links with icons
const doctorLinks = [
  { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
  {
    name: "My Appointments",
    href: "/doctor/appointments",
    icon: CalendarCheck,
  },
  { name: "Patients", href: "/doctor/patients", icon: UserPlus },
  { name: "Profile", href: "/doctor/profile", icon: User },
];

export default function Sidebar({ mode = "full", onToggleMode, isDoctor }) {
  const pathname = usePathname();

  const isDashboard = pathname === "/patient/dashboard";

  const [sidebarMode, setSidebarMode] = useState(isDashboard ? "full" : "mini");

  const linksToRender = isDoctor ? doctorLinks : patientLinks;
  const isFull = mode === "full";

  const handleSidebarToggle = () => {
    setSidebarMode((prev) => (prev === "full" ? "mini" : "full"));
  };

  return (
    <aside
    className={`bg-white shadow-[2px_0_8px_-4px_rgba(0,0,0,0.08)] 
      transition-all duration-300 flex flex-col
      ${isFull ? "w-64 p-4" : "w-20 p-4"}
      h-screen fixed top-0 left-0 z-40`}
  >
    <div className="flex items-center mb-10 mt-3">
      <Button variant="ghost" size="icon" onClick={onToggleMode}>
        <Menu className="w-6 h-6" />
      </Button>
      {isFull && (
        <span className="ml-3 text-xl font-bold tracking-wide text-blue-700">
          DocHub
        </span>
      )}
    </div>
    {/* Navigation Links */}
    <nav className="flex flex-col gap-2 ">
      {linksToRender.map(({ name, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center transition-colors rounded-lg
            ${isFull ? "gap-4 px-4 py-3" : "justify-center py-3"}
            hover:bg-blue-50
            ${
              pathname === href
                ? "bg-blue-100 font-semibold text-blue-700"
                : "text-gray-600"
            }
          `}
        >
          <Icon className="w-6 h-6" />
          {isFull && <span className="text-base">{name}</span>}
        </Link>
      ))}
    </nav>
    {/* Optionally, add a flex-1 spacer or bottom items (logout, version, etc)*/}
  </aside>
  
  );
}
