"use client";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getProfile, updateProfile } from "@/app/api/patient/profile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";

const GENDERS = ["male", "female", "other"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const MEDICAL_HISTORY_OPTIONS = [
  "Diabetes", "Hypertension", "Cancer", "Heart", "Asthma", "Allergy", "Other"
];

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "",
    address: {
      country: "",
    },
    medicalHistory: [],
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();
  const [newMedicalHistory, setNewMedicalHistory] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    async function fetchProfile() {
      const userId = localStorage.getItem("userId");
      setLoading(true);
      const res = await getProfile(userId);
      setUser(res);
      setForm({
        fullName: res.fullName || "",
        email: res.email || "",
        phone: res.phone || "",
        age: res.age || "",
        gender: res.gender || "",
        bloodGroup: res.bloodGroup || "",
        address: {
          country: res.address.country || "",
        },
        medicalHistory: res.medicalHistory || [],
        avatarUrl: res.avatarUrl || "",
      });
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateProfile(form);
    if (res.ok) {
      const data = await res;
      setUser(data);
      alert("Profile updated!");
    }
    setLoading(false);
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
    .upload(filePath, file, {
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
  
    setAvatarUrl(avatarUrl);
    setForm((prev) => ({ ...prev, avatarUrl }));

    // Save to backend
    await updateProfile({ ...form, avatarUrl });
  
    setUploading(false);
  };

  const handleAddMedicalHistory = () => {
    const value = newMedicalHistory.trim();
    if (value && !form.medicalHistory.includes(value)) {
      setForm({ ...form, medicalHistory: [...form.medicalHistory, value] });
      setNewMedicalHistory("");
    }
  };
  

  const handleRemoveMedicalHistory = (item) => {
    setForm({ ...form, medicalHistory: form.medicalHistory.filter((mh) => mh !== item) });
  };

  if (loading && !user) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8">No user found.</div>;


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-2 py-8">
  <div className="w-full max-w-2xl h-full overflow-auto bg-white/90 p-10 rounded-3xl shadow-2xl border-0 ">
      <h2 className="text-3xl font-extrabold text-blue-800 mb-7 drop-shadow">My Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Avatar & Photo Change */}
        <div className="flex items-center gap-7 mb-2">
          <Avatar className="w-24 h-24 bg-blue-100 border-4 border-white shadow-lg">
            <AvatarImage   src={avatarUrl || user.avatarUrl} alt={user.fullName} />
            <AvatarFallback className="text-2xl font-bold text-blue-700">{user.fullName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <Button
            type="button"
            variant="outline"
            className="bg-blue-600 text-white rounded-full px-6 py-2 shadow hover:bg-blue-700 border-0"
            onClick={() => fileInputRef.current.click()}
          >
            Change Photo
          </Button>
          <input
  type="file"
  accept="image/*"
  ref={fileInputRef}
  className="hidden"
  onChange={handleAvatarUpload}
/>
        </div>
  
        {/* Profile Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block font-semibold text-blue-700 mb-1">Full Name</label>
            <Input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="rounded-lg shadow bg-blue-50 border-blue-100 focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block font-semibold text-blue-700 mb-1">Email</label>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled
              className="rounded-lg shadow bg-gray-100 text-gray-400 border-gray-200"
            />
          </div>
          <div>
            <label className="block font-semibold text-blue-700 mb-1">Phone</label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="rounded-lg shadow bg-blue-50 border-blue-100 focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block font-semibold text-blue-700 mb-1">Age</label>
            <Input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              className="rounded-lg shadow bg-blue-50 border-blue-100 focus:ring-2 focus:ring-blue-300"
            />
          </div>
<div>
  <label className="block font-semibold text-blue-700 mb-1">Gender</label>
  <Select
    name="gender"
    value={form.gender}
    onValueChange={v => handleSelectChange('gender', v)}
  >
    <SelectTrigger className="rounded-lg shadow bg-blue-50 border-blue-100 focus:ring-2 focus:ring-blue-300">
      <SelectValue placeholder="Select gender" />
    </SelectTrigger>
    <SelectContent>
      {GENDERS.map(g => (
        <SelectItem className="capitalize" key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
<div>
  <label className="block font-semibold text-blue-700 mb-1">Blood Group</label>
  <Select
    name="bloodGroup"
    value={form.bloodGroup}
    onValueChange={v => handleSelectChange('bloodGroup', v)}
  >
    <SelectTrigger className="rounded-lg shadow bg-blue-50 border-blue-100 focus:ring-2 focus:ring-blue-300">
      <SelectValue placeholder="Select blood group" />
    </SelectTrigger>
    <SelectContent>
      {BLOOD_GROUPS.map(bg => (
        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
          <div className="md:col-span-2">
            <label className="block font-semibold text-blue-700 mb-1">Address</label>
            <Input
              name="address.country"
              value={form.address.country}
              onChange={handleChange}
              className="rounded-lg shadow bg-blue-50 border-blue-100 focus:ring-2 focus:ring-blue-300"
            />
          </div>
          {/* Medical History Section */}
          <div className="md:col-span-2">
            <label className="block font-semibold text-blue-700 mb-2">Medical History</label>
            <div className="flex flex-wrap gap-3 mb-2">
              {form.medicalHistory.map(item => (
                <span key={item} className="inline-flex items-center px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
                  {item}
                  <button
                    type="button"
                    className="ml-2 px-1 rounded-full hover:bg-blue-200"
                    onClick={() => handleRemoveMedicalHistory(item)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                value={newMedicalHistory}
                onChange={e => setNewMedicalHistory(e.target.value)}
                placeholder="Add medical history"
                className="rounded-lg shadow bg-blue-50 border-blue-100 focus:ring-2 focus:ring-blue-300"
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-blue-500 text-blue-700 px-6 shadow hover:bg-blue-50"
                onClick={handleAddMedicalHistory}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-6 rounded-full py-3 px-8 font-semibold bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  </div>
  
  );
} 