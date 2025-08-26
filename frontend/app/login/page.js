"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../api/auth";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(formData);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem(
        "user",
        JSON.stringify({
          fullName: user.fullName,
          avatarUrl: user.avtarUrl,
        })
      );

      if (user.role === "doctor") {
        localStorage.setItem("specialization", user.specialization || "");
        localStorage.setItem("available", user.isAvailable);
        router.push("/doctor/dashboard");
      } else {
        router.push("/patient/dashboard");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-100 p-6">
      <Card className="w-full max-w-md shadow-xl border border-blue-100 backdrop-blur-md rounded-3xl bg-white/70 py-0">
        <CardHeader className="bg-gradient-to-tr from-indigo-500 to-blue-600 text-white px-6 py-5 rounded-t-3xl">
          <CardTitle className="text-2xl font-bold tracking-wide">
            Welcome To DocHub
          </CardTitle>
          <p className="text-sm text-white/80 mt-1">Sign in to your account</p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-5">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 font-medium">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium flex items-center gap-2 text-gray-700"
              >
                <Mail className="w-4 h-4 text-gray-500" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="focus-visible:ring-2 focus-visible:ring-indigo-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium flex items-center gap-2 text-gray-700"
              >
                <Lock className="w-4 h-4 text-gray-500" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="focus-visible:ring-2 focus-visible:ring-indigo-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0 flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-3 font-medium text-sm rounded-xl hover:from-indigo-600 hover:to-blue-700 transition-all duration-200"
            >
              Log In
            </Button>
            <p className="text-sm text-center text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="text-indigo-600 hover:underline font-medium"
              >
                Register
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
