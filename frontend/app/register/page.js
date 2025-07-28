"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../api/auth";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar as CalendarIcon,
  Briefcase,
  Heart,
} from "lucide-react";
import TimeSlotPicker from "@/components/timeSlotPicker";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "patient",
    phone: "",
    gender: "",
    age: "",
    specialization: "",
    qualifications: "",
    experience: "",
    availability: [],
    medicalHistory: "",
    bloodGroup: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelect = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      console.log("formData",formData);
      const res = await register(formData);
      console.log("res",res);
      if (!["patient registered successfully", "doctor registered successfully"].includes(res.message)) {
        throw new Error(res.message || "Registration failed");
      }
      
      router.push("/login");
    } catch (err) {
      console.log("erro",err);
      setError(err.message);
    }
  };

  const isDoctor = formData.role === "doctor";

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const exists = prev.availability.find((d) => d.day === day);
      if (exists) {
        return {
          ...prev,
          availability: prev.availability.filter((d) => d.day !== day),
        };
      } else {
        return {
          ...prev,
          availability: [...prev.availability, { day, slots: [] }],
        };
      }
    });
  };

  const handleSlotChange = (day, idx, newSlot) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((d) =>
        d.day === day
          ? {
              ...d,
              slots: d.slots.map((slot, i) => (i === idx ? newSlot : slot)),
            }
          : d
      ),
    }));
  };

  const handleAddSlot = (day) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((d) =>
        d.day === day ? { ...d, slots: [...d.slots, { start: "", end: "" }] } : d
      ),
    }));
  };

  const handleRemoveSlot = (day, idx) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((d) =>
        d.day === day
          ? { ...d, slots: d.slots.filter((_, i) => i !== idx) }
          : d
      ),
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <Card className="w-full max-w-lg bg-white/70 backdrop-blur-lg shadow-2xl rounded-xl overflow-hidden py-0">
        <CardHeader className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          {/* <p className="mt-1 text-sm opacity-90">
            Join us as a patient or doctor
          </p> */}
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <Label
                  htmlFor="fullName"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter Your Name"
                  required
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label
                  htmlFor="password"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <Lock className="w-4 h-4 text-gray-500" />
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <Label
                  htmlFor="phone"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <Phone className="w-4 h-4 text-gray-500" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 555 123 4567"
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 text-gray-500" />
                  Gender
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(val) => handleSelect("gender", val)}
                >
                  <SelectTrigger className="border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Age */}
              <div className="space-y-1">
                <Label
                  htmlFor="age"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  Age
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="30"
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>

              {/* Role */}
              <div className="space-y-1">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Heart className="w-4 h-4 text-gray-500" />
                  Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(val) => handleSelect("role", val)}
                >
                  <SelectTrigger className="border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* DOCTOR FIELDS */}
            {isDoctor && (
              <div className="pt-6 space-y-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gray-600" />
                  Doctor Details
                </h3>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="specialization"
                      className="text-sm font-medium text-gray-700"
                    >
                      Specialization
                    </Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="e.g. Cardiology"
                      className="border-gray-200 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="qualifications"
                      className="text-sm font-medium text-gray-700"
                    >
                      Qualifications
                      <span className="text-xs text-gray-500 ml-1">
                        (comma-separated)
                      </span>
                    </Label>
                    <Input
                      id="qualifications"
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleChange}
                      placeholder="MD, PhD"
                      className="border-gray-200 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="experience"
                      className="text-sm font-medium text-gray-700"
                    >
                      Experience (years)
                    </Label>
                    <Input
                      id="experience"
                      name="experience"
                      type="number"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="10"
                      className="border-gray-200 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Availability
                    </Label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {daysOfWeek.map((day) => (
                        <label key={day} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            value={day}
                            checked={formData.availability.some((d) => d.day === day)}
                            onChange={() => handleDayToggle(day)}
                            className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <span>{day}</span>
                        </label>
                      ))}
                    </div>
                    {/* Per-day slot pickers */}
                    {formData.availability.map((d) => (
                      <div key={d.day} className="mb-4 border rounded p-2 bg-gray-50">
                        <div className="font-semibold mb-2">{d.day}</div>
                        {d.slots.map((slot, idx) => (
                          <TimeSlotPicker
                            key={idx}
                            timeSlot={slot}
                            onChange={(newSlot) => handleSlotChange(d.day, idx, newSlot)}
                            onRemove={() => handleRemoveSlot(d.day, idx)}
                          />
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddSlot(d.day)}
                          className="mt-2"
                        >
                          + Add Time Slot
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PATIENT FIELDS */}
            {!isDoctor && (
              <div className="pt-6 space-y-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-gray-600" />
                  Patient Details
                </h3>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="medicalHistory"
                      className="text-sm font-medium text-gray-700"
                    >
                      Medical History
                      <span className="text-xs text-gray-500 ml-1">
                        (comma-separated)
                      </span>
                    </Label>
                    <Input
                      id="medicalHistory"
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleChange}
                      placeholder="Asthma, Diabetes"
                      className="border-gray-200 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Blood Group
                    </Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(val) => handleSelect("bloodGroup", val)}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-blue-500">
                        <SelectValue placeholder="Select Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (bg) => (
                            <SelectItem key={bg} value={bg}>
                              {bg}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-6 pt-0 flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-md shadow-lg hover:from-blue-700 hover:to-indigo-700 transition"
            >
              Register
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Log in
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
