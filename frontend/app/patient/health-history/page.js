"use client";
import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { getHealthHistory } from "@/app/api/patient/appointment";

const MOCK_REPORTS = [
  {
    id: 1,
    name: "Blood_Test_Report.pdf",
    date: "2024-05-20",
    type: "pdf",
    url: "#",
  },
  {
    id: 2,
    name: "Xray_Chest.png",
    date: "2024-05-10",
    type: "image",
    url: "#",
  },
];

const FILE_ICONS = {
  pdf: (
    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 8L14 2.586A2 2 0 0 0 12.586 2H6z" /><path d="M14 2v6h6" /></svg>
  ),
  image: (
    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect width="20" height="14" x="2" y="5" rx="2" /><circle cx="8.5" cy="10.5" r="1.5" /><path d="M21 19l-5.5-5.5a2 2 0 0 0-2.8 0L3 19" /></svg>
  ),
};

function formatDateTime(dt) {
  const d = new Date(dt);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function HealthHistoryPage() {
  const [consultations, setConsultations] = useState([]);
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("consultations");
  const fileInputRef = useRef();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getHealthHistory();
        console.log("data",data);
        const timeline = [];
        data.groupedByDoctor.forEach(group => {
          group.appointments.forEach(appt => {
            timeline.push({
              id: appt._id,
              date: appt.date,
              doctor: {
                name: group.doctor.fullName,
                specialization: group.doctor.specialization,
                avatar: group.doctor.avatarUrl,
              },
              summary: appt.notes || "Consultation with " + group.doctor.fullName,
              prescription: group.prescriptions.some(rx => rx.appointmentid === appt._id),
              appointmentid: appt._id,
              appointment: appt,
            });
          });
        });
        // Sort by date descending
        timeline.sort((a, b) => new Date(b.date) - new Date(a.date));
        setConsultations(timeline);
      } catch (err) {
        setConsultations([]);
      }
    }
    fetchData();
  }, []);

  // Filter consultations by doctor name or date
  const filteredConsultations = consultations.filter((c) =>
    c.doctor.name.toLowerCase().includes(search.toLowerCase()) ||
    formatDateTime(c.date).toLowerCase().includes(search.toLowerCase()) 
  );

  // Handle file upload (mock)
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const type = file.type.includes("pdf") ? "pdf" : "image";
    setReports([
      ...reports,
      {
        id: Date.now(),
        name: file.name,
        date: new Date().toISOString().slice(0, 10),
        type,
        url: "#",
      },
    ]);
  };

  // Handle delete report (mock)
  const handleDelete = (id) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  console.log("Consultations",filteredConsultations);
  

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-2 flex justify-center">
    <div className="w-full max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-blue-800 drop-shadow">Health History</h1>
      <Tabs value={tab} onValueChange={setTab} className="mb-8">
        <TabsList className="rounded-full bg-blue-100/70 p-1 flex gap-4">
          <TabsTrigger value="consultations" className="px-6 py-2 rounded-full text-lg font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 hover:bg-blue-200 transition">
            Consultation Timeline
          </TabsTrigger>
          <TabsTrigger value="reports" className="px-6 py-2 rounded-full text-lg font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 hover:bg-blue-200 transition">
            Uploaded Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="consultations">
          <Card className="mb-6 p-7 rounded-3xl bg-white shadow-xl border-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center bg-blue-50 px-3 py-2 rounded-full">
                <Search className="text-blue-400 mr-2" size={18} />
                <Input
                  placeholder="Search by doctor, date, or appointment ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="text-base w-60 border-0 shadow-none"
                />
              </div>
            </div>
            {filteredConsultations.length === 0 ? (
              <div className="flex flex-col items-center py-16">
                <span className="text-6xl mb-2">🩺</span>
                <div className="text-gray-400 text-xl font-medium">No consultations found.</div>
              </div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {filteredConsultations.map((c) => (
                  <AccordionItem key={c.id} value={String(c.id)} className="mb-3 border-b border-blue-50 last:border-0">
                    <AccordionTrigger className="hover:bg-blue-50 px-3 py-2 rounded-lg transition">
                      <div className="flex items-center gap-4 w-full">
                        <Avatar className="w-12 h-12 border border-blue-100 shadow-sm">
                          <AvatarImage src={c.doctor.avatar} alt={c.doctor.name} />
                          <AvatarFallback>{c.doctor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-bold text-xl text-blue-900">{c.doctor.name}</div>
                          <div className="text-blue-500 text-base capitalize">{c.doctor.specialization}</div>
                        </div>
                        <Badge color="gray" className="px-3 py-1 text-base bg-blue-100 text-blue-700 border-0">{formatDateTime(c.date)}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-blue-50/40 py-4 px-6 rounded-b-lg shadow-inner">
                      <div className="mb-2 text-md text-gray-700">{c.summary}</div>
                      {c.prescription && c.appointmentid && (
                        <Button
                          size="sm"
                          className="bg-blue-600 text-white hover:bg-blue-700 mt-3 rounded-full px-6 py-2 shadow"
                          onClick={() => router.push(`/patient/health-history/prescription/${c.appointmentid}`)}
                        >
                          View Prescription
                        </Button>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card className="mb-6 p-7 rounded-3xl bg-white shadow-xl border-0">
            <div className="flex items-center justify-between mb-6">
              <div className="font-bold text-lg text-blue-800">Uploaded Reports</div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current.click()}
                className="bg-blue-600 text-white border-0 rounded-full px-6 py-2 hover:bg-blue-700 shadow"
              >
                Upload Report
              </Button>
              <input
                type="file"
                accept="application/pdf,image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleUpload}
              />
            </div>
            {reports.length === 0 ? (
              <div className="flex flex-col items-center py-16">
                <span className="text-6xl mb-2">📄</span>
                <div className="text-gray-400 text-xl font-medium">No reports uploaded yet.</div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {reports.map((r) => (
                  <div key={r.id} className="flex items-center gap-5 py-4">
                    <div>{FILE_ICONS[r.type]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 truncate">{r.name}</div>
                      <div className="text-xs text-gray-500">Uploaded: {r.date}</div>
                    </div>
                    <Button size="sm" variant="outline" className="mr-2 rounded-full bg-blue-50 text-blue-700 border-0">
                      View
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(r.id)} className="rounded-full">
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
  );
} 