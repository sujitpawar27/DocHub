"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { createPrescription, getPrescriptions } from "@/app/api/doctor/prescription";
import { 
  Plus, 
  Trash2, 
  Pill, 
  Clock, 
  FileText, 
  Calendar,
  Send,
  History,
  Stethoscope,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function NewPrescriptionPage() {
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", duration: "", notes: "" },
  ]);
  const [previousMedicines, setPreviousMedicines] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id, appointmentid } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchPrevious = async () => {
      try {
        const data = await getPrescriptions(id);
        if (Array.isArray(data)) {
          setPreviousMedicines(data);
        }
      } catch (err) {
        console.error("Error fetching previous prescription:", err);
      }
    };
    fetchPrevious();
  }, [id]);

  const handleMedicineChange = (idx, field, value) => {
    setMedicines((prev) =>
      prev.map((med, i) => (i === idx ? { ...med, [field]: value } : med))
    );
  };

  const addMedicine = () => {
    setMedicines((prev) => [...prev, { name: "", dosage: "", duration: "", notes: "" }]);
  };

  const removeMedicine = (idx) => {
    setMedicines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const prescriptionData = { patientId: id, medicines, appointmentid };
    
    try {
      await createPrescription(prescriptionData);
      router.push(`/doctor/patients/history/${id}/${appointmentid}`);
    } catch (err) {
      console.error("Error submitting prescription:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-indigo-50/30">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">New Prescription</h1>
              <p className="text-gray-600">Create a detailed prescription for your patient</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Prescription Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="relative overflow-hidden rounded-3xl border-0 bg-white shadow-lg">
              {/* Decorative header */}
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Pill className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Medication Details</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {medicines.map((med, idx) => (
                    <div key={idx} className="group relative">
                      <Card className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
                        {/* Medicine number indicator */}
                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                          {idx + 1}
                        </div>

                        <div className="space-y-4">
                          {/* Medicine Name and Dosage Row */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Pill className="w-4 h-4 text-blue-500" />
                                Medicine Name
                              </label>
                              <Input 
                                value={med.name} 
                                onChange={(e) => handleMedicineChange(idx, "name", e.target.value)} 
                                placeholder="Enter medicine name"
                                className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <AlertCircle className="w-4 h-4 text-orange-500" />
                                Dosage
                              </label>
                              <Input 
                                value={med.dosage} 
                                onChange={(e) => handleMedicineChange(idx, "dosage", e.target.value)} 
                                placeholder="e.g., 500mg twice daily"
                                className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required 
                              />
                            </div>
                          </div>

                          {/* Duration and Instructions Row */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Clock className="w-4 h-4 text-green-500" />
                                Duration
                              </label>
                              <Input 
                                value={med.duration} 
                                onChange={(e) => handleMedicineChange(idx, "duration", e.target.value)} 
                                placeholder="e.g., 7 days"
                                className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <FileText className="w-4 h-4 text-purple-500" />
                                Instructions
                              </label>
                              <Textarea 
                                value={med.notes} 
                                onChange={(e) => handleMedicineChange(idx, "notes", e.target.value)} 
                                placeholder="Take after meals..."
                                rows={2}
                                className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                required 
                              />
                            </div>
                          </div>
                        </div>

                        {/* Remove button */}
                        {medicines.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors p-0"
                            onClick={() => removeMedicine(idx)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </Card>
                    </div>
                  ))}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addMedicine} 
                      className="flex-1 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 py-3 font-medium transition-all duration-300"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Another Medicine
                    </Button>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Submit Prescription
                      </div>
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* Right: Previous Prescriptions */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">Previous Prescriptions</h2>
            </div>
            
            {previousMedicines.length > 0 ? (
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                {previousMedicines.map((prescription, idx) => (
                  <Card key={idx} className="rounded-2xl border-0 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-indigo-600" />
                          </div>
                          <h3 className="text-sm font-semibold text-indigo-800">
                            Prescription #{idx + 1}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                          <Calendar className="w-3 h-3" />
                          {new Date(prescription.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>

                      {/* Medicine List */}
                      <div className="space-y-3">
                        {prescription.medicines.map((med, i) => (
                          <div key={i} className="bg-white/60 rounded-xl p-3">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">{med.name}</p>
                                <p className="text-xs text-gray-600">{med.dosage} • {med.duration}</p>
                                {med.notes && (
                                  <p className="text-xs text-gray-500 italic mt-1 bg-gray-50 p-2 rounded-lg">
                                    {med.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="rounded-2xl border-0 bg-white shadow-sm">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Previous Prescriptions</h3>
                  <p className="text-gray-500 text-sm">This patient doesn't have any previous prescriptions.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
