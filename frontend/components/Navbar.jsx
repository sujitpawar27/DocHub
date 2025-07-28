"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "@/components/ui/button";
import { Activity, Menu } from "lucide-react";
import { Switch } from "./ui/switch";

export default function Navbar({
  open,
  setOpen,
  doctorName,
  specialization,
  availability,
  isDoctor,
  setAvailability,
}) {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("/default-avatar.png");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch {
        setUser(null);
      }
    }
  }, []);


  useEffect(() => {
    const storedUrl = JSON.parse(localStorage.getItem("user"))?.avatarUrl;
    if (storedUrl) {
      setAvatarUrl(storedUrl);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };
// const avatarUrl = JSON.parse(localStorage.getItem("user"))?.avatarUrl;
// console.log("avatarUrl",avatarUrl);

return (
    <nav
    className="flex items-center justify-between bg-white shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] 
      px-6 h-16 sticky top-0 z-50"
  >
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
        <Menu className="w-6 h-6" />
      </Button>
      <span className="text-2xl font-extrabold tracking-wide text-blue-700">DocHub</span>
    </div>
    <div className="flex items-center">
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-4 cursor-pointer">
              <Avatar>
                <AvatarImage  src={avatarUrl || "/default-avatar.png"} alt="User Avatar" />
                <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
              </Avatar>



              
              {isDoctor && (
  <div className="flex items-center gap-2 mt-1 ml-auto">
    <div className="text-sm font-semibold text-gray-900 leading-tight">
      {user.fullName}
    <div className="text-xs text-gray-500">{specialization}</div>
    </div>
    <div className="flex items-center gap-2 mt-1">
    <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${availability ? 'text-green-500' : 'text-gray-400'}`} />
                <span className="text-sm font-medium text-gray-700">Available</span>
                <Switch
                  checked={availability}
                  onCheckedChange={setAvailability}
                />
              </div>
    </div>
  </div>
)}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => router.push("/patient/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  </nav>
  
  );
}
