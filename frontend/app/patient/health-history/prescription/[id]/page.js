"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Download, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getPrescriptionById } from "@/app/api/patient/appointment";

function formatDate(dt) {
  const d = new Date(dt);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function PrescriptionPage() {
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const  {id} = useParams();

  useEffect(() => {
    async function fetchPrescription() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getPrescriptionById(id);
        setPrescription({
          ...data,
          doctor: {
            name: data.doctor.fullName,
            specialization: data.doctor.specialization,
            avatar: data.doctor.avatarUrl,
          },
          patient: {
            name: data.patientId.fullName,
            age: data.patientId.age,
            gender: data.patientId.gender,
          },
          medicines: data.medicines,
          date: data.date,
          notes: data.notes,
          status: "Active",
        });
      } catch (err) {
        setError("Failed to load prescription.");
      } finally {
        setLoading(false);
      }
    }
    fetchPrescription();
  }, [id  ]);

  if (loading) {
    return <div className="flex flex-col items-center justify-center py-16"><span className="text-6xl mb-4">💊</span><div className="text-gray-500 text-lg">Loading prescription...</div></div>;
  }
  if (error || !prescription) {
    return <div className="flex flex-col items-center justify-center py-16"><span className="text-6xl mb-4">💊</span><div className="text-gray-500 text-lg">No prescription found.</div></div>;
  }

  return (
    <div className="p-5 flex items-center justify-center">
    <div className="w-full max-w-3xl">
      <Card className="rounded-3xl shadow-xl border-0 p-0 bg-white/90">
        {/* Doctor & Header */}
        <CardHeader className="flex flex-row items-center gap-5 p-8 pb-6 border-b border-blue-100 bg-gradient-to-r from-blue-100 to-blue-200 rounded-t-3xl">
          <Avatar className="w-16 h-16 shadow-lg border-4 border-white drop-shadow">
            <AvatarImage src={prescription.doctor.avatarUrl} alt={prescription.doctor.name} />
            <AvatarFallback>{prescription.doctor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-blue-900 mb-1">{prescription.doctor.name}</CardTitle>
            <div className="text-blue-700 text-lg font-medium tracking-wide">{prescription.doctor.specialization}</div>
            <Badge color="green" className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full border-none">Active</Badge>
          </div>
        </CardHeader>
  
        {/* Patient & Date Info */}
        <CardContent className="px-8 pt-7 pb-4 bg-white/95">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-gray-800 text-base font-medium">
            <span><span className="text-gray-500 font-semibold">Patient:</span> {prescription.patient.name}</span>
            <span><span className="text-gray-500 font-semibold">Age:</span> {prescription.patient.age}</span>
            <span><span className="text-gray-500 font-semibold">Gender:</span> {prescription.patient.gender}</span>
            <span><span className="text-gray-500 font-semibold">Date:</span> {formatDate(prescription.date)}</span>
          </div>
        </CardContent>
  
        {/* Medicines Table */}
        <CardContent className="px-8 pt-2 pb-2">
          <div className="font-bold text-lg text-blue-900 mb-3 border-l-4 border-blue-300 pl-3">Prescribed Medicines</div>
          <div className="overflow-x-auto rounded-2xl shadow-inner">
            <table className="min-w-full bg-blue-50/50 rounded-lg text-md border-separate border-spacing-0 mt-1">
              <thead>
                <tr className="bg-blue-100/80 text-blue-800 uppercase text-sm">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Dosage</th>
                  <th className="py-3 px-4 text-left">Duration</th>
                  <th className="py-3 px-4 text-left">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medicines.map((med, idx) => (
                  <tr key={idx} className="border-b border-blue-100 last:border-b-0 hover:bg-blue-50/70 transition">
                    <td className="py-2 px-4 font-semibold">{med.name}</td>
                    <td className="py-2 px-4">{med.dosage}</td>
                    <td className="py-2 px-4">{med.duration}</td>
                    <td className="py-2 px-4">{med.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
  
        {/* Doctor's Notes */}
        <CardContent className="px-8 pt-7 pb-2">
          <div className="font-bold text-lg text-blue-900 mb-2 border-l-4 border-blue-300 pl-3">Doctor's Notes</div>
          <div className="text-gray-700 text-base bg-blue-50/80 border-l-4 border-blue-200 py-4 px-6 rounded-2xl shadow-sm">
            {prescription.notes || <span className="italic text-gray-400">No special instructions provided.</span>}
          </div>
        </CardContent>
  
        {/* Action Buttons */}
        <CardContent className="px-8 pt-6 pb-8 flex flex-wrap gap-4">
          <Button variant="default" className="flex items-center gap-2 px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md font-semibold text-base">
            <Download size={18} /> Download PDF
          </Button>
          <Button variant="outline" className="flex items-center gap-2 px-8 py-2 border-blue-600 text-blue-700 hover:bg-blue-100 rounded-full shadow-md font-semibold text-base">
            <Printer size={18} /> Print
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
  
  );
} 