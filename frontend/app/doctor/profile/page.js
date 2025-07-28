"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/separator";
import { Badge } from "@/components/ui/badge";
import { Camera, Plus, X, User, Mail, Phone, MapPin, Calendar, Clock, Award, Briefcase } from "lucide-react";
import { getProfile, updateProfile, uploadAvatar } from "@/app/api/doctor/profile";
import TimeSlotPicker from "@/components/timeSlotPicker";
import { supabase } from "@/lib/supabase";

const initialProfile = {
  avatarUrl: null,
  fullName: "",
  email: "",
  phone: "",
  gender: "",
  age: "",
  address: { country: "" },
  qualifications: [],
  availability: [], // Array of { day, slots: [{start, end}] }
  specialization: "",
  experience: "",
};

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    async function fetchProfile() {
      const id = localStorage.getItem("userId");
      setLoading(true);
      try {
        const data = await getProfile(id);
        let avail = Array.isArray(data.availability)
          ? data.availability
          : [];
        // Migrate from old format if needed
        if (data.availability && data.availability.days && data.availability.timeSlots) {
          avail = data.availability.days.map((day, i) => ({
            day,
            slots: (data.availability.timeSlots || []).map(ts => {
              const [start, end] = ts.split("-");
              return { start, end };
            })
          }));
        }
        setProfile({
          ...initialProfile,
          ...data,
          address: { ...initialProfile.address, ...data.address },
          availability: avail,
        });
        setAvailability(avail);
        setAvatarUrl(data.avatarUrl);
      } catch (err) {
        // handle error
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setProfile((prev) => ({ ...prev, address: { ...prev.address, [field]: value } }));
  };

  const handleAvailabilityChange = (field, value) => {
    setProfile((prev) => ({ ...prev, availability: { ...prev.availability, [field]: value } }));
  };

  const handleQualificationsChange = (idx, value) => {
    setProfile((prev) => {
      const qualifications = [...prev.qualifications];
      qualifications[idx] = value;
      return { ...prev, qualifications };
    });
  };

  const addQualification = () => {
    setProfile((prev) => ({ ...prev, qualifications: [...prev.qualifications, ""] }));
  };

  const removeQualification = (idx) => {
    setProfile((prev) => {
      const qualifications = prev.qualifications.filter((_, i) => i !== idx);
      return { ...prev, qualifications };
    });
  };

  const handleDayChange = (idx, value) => {
    setAvailability(prev => prev.map((a, i) => i === idx ? { ...a, day: value } : a));
  };

  const addDay = () => {
    setAvailability(prev => [...prev, { day: "", slots: [] }]);
  };

  const removeDay = (idx) => {
    setAvailability(prev => prev.filter((_, i) => i !== idx));
  };

  const addTimeSlot = (dayIdx) => {
    setAvailability(prev => prev.map((a, i) => i === dayIdx ? { ...a, slots: [...a.slots, { start: "", end: "" }] } : a));
  };

  const handleTimeSlotChange = (dayIdx, slotIdx, newSlot) => {
    setAvailability(prev => prev.map((a, i) =>
      i === dayIdx
        ? { ...a, slots: a.slots.map((s, j) => j === slotIdx ? newSlot : s) }
        : a
    ));
  };

  const removeTimeSlot = (dayIdx, slotIdx) => {
    setAvailability(prev => prev.map((a, i) =>
      i === dayIdx
        ? { ...a, slots: a.slots.filter((_, j) => j !== slotIdx) }
        : a
    ));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
  
    setUploading(true);
  
    const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(`${fileName}`, file, {
      cacheControl: '3600',
      upsert: true,
    });
  
    if (uploadError) {
      console.error("Error uploading:", uploadError);
      setUploading(false);
      return;
    }
  
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const avatarUrl = urlData.publicUrl;
  
    setAvatarUrl(avatarUrl); // update avatar for display
    setProfile((prev) => ({ ...prev, avatarUrl })); // update profile state
     setUploading(false);
  };
    
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedUser = await updateProfile({ ...profile, availability });
      localStorage.setItem("user", JSON.stringify({
        fullName: updatedUser.fullName,
        avatarUrl: updatedUser.avatarUrl
      }));   
         alert("Profile saved!");
    } catch (err) {
      alert("Failed to save profile");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        {/* <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Doctor Profile
          </h1>
          <p className="text-gray-600">Manage your professional information</p>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Header Card */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar Section */}
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-gray-200 shadow-2xl">
                    <AvatarImage
                      src={avatarUrl || "/default-avatar.png"}
                      alt={profile.fullName}
                      onError={(e) => {
                        e.currentTarget.src = "/default-avatar.png";
                      }}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-gray-500 to-gray-600 text-white">
                      {profile?.fullName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute -bottom-2 -right-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full p-3 cursor-pointer shadow-lg transition-all duration-200 hover:scale-105">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <Camera className="w-4 h-4" />
                  </label>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

                {/* Name and Specialization */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </label>
                      <Input
                        value={profile.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        placeholder="Dr. John Smith"
                        className="text-lg font-semibold border-2 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Specialization
                      </label>
                      <Input
                        value={profile.specialization}
                        onChange={(e) => handleChange("specialization", e.target.value)}
                        placeholder="Cardiology"
                        className="text-lg border-2 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <Input
                  value={profile.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="doctor@example.com"
                  type="email"
                  className="border-2 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <Input
                  value={profile.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="border-2 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <Input
                  value={profile.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  placeholder="Male/Female/Other"
                  className="border-2 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Age</label>
                <Input
                  value={profile.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                  placeholder="35"
                  type="number"
                  className="border-2 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Country
                </label>
                <Input
                  value={profile.address.country}
                  onChange={(e) => handleAddressChange("country", e.target.value)}
                  placeholder="United States"
                  className="border-2 focus:border-blue-500"
                />
              </div>
            </div>
          </Card>

          {/* Qualifications */}
          <Card className="p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Qualifications & Certifications</h2>
            </div>

            <div className="space-y-4">
              {profile.qualifications.map((q, idx) => (
                <div key={idx} className="flex gap-3 items-center group">
                  <Input
                    value={q}
                    onChange={(e) => handleQualificationsChange(idx, e.target.value)}
                    placeholder="e.g., MD in Cardiology, Harvard Medical School"
                    className="border-2 focus:border-green-500 flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeQualification(idx)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addQualification}
                className="w-full border-dashed border-2 border-green-300 text-green-600 hover:bg-green-50 py-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Qualification
              </Button>
            </div>
          </Card>

          {/* Availability */}
          <Card className="p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Availability Schedule</h2>
            </div>
            <div className="space-y-6">
              {availability.map((a, dayIdx) => (
                <div key={dayIdx} className="mb-6 border-b pb-4">
                  <div className="flex gap-3 items-center mb-2">
                    <Input
                      value={a.day}
                      onChange={e => handleDayChange(dayIdx, e.target.value)}
                      placeholder="e.g., Monday"
                      className="border-2 focus:border-purple-500 flex-1"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => removeDay(dayIdx)} className="border-red-200 text-red-600 hover:bg-red-50">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 ml-4">
                    {a.slots.map((slot, slotIdx) => (
                      <TimeSlotPicker
                        key={slotIdx}
                        timeSlot={slot}
                        onChange={newSlot => handleTimeSlotChange(dayIdx, slotIdx, newSlot)}
                        onRemove={() => removeTimeSlot(dayIdx, slotIdx)}
                      />
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addTimeSlot(dayIdx)} className="mt-2 border-dashed border-2 border-purple-300 text-purple-600 hover:bg-purple-50">
                      <Plus className="w-4 h-4 mr-1" /> Add Time Range
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addDay} className="w-full border-dashed border-2 border-purple-300 text-purple-600 hover:bg-purple-50 py-4">
                <Plus className="w-4 h-4 mr-2" /> Add Day
              </Button>
            </div>
          </Card>

          {/* Experience */}
          <Card className="p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Briefcase className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Professional Experience</h2>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Years of Experience</label>
              <Input
                value={profile.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                placeholder="10"
                type="number"
                className="border-2 focus:border-orange-500 max-w-xs"
              />
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={saving}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {saving ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving Changes...
                </div>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
