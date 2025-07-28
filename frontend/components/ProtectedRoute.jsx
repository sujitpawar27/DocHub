"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      JSON.parse(atob(token.split(".")[1]));
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  if (!isAuthenticated) return null;
  return children;
} 