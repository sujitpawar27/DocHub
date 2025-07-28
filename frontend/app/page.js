import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="mt-80 grid grid-rows-[20px_1fr_20px] min-h-screen pb-20 sm:p-20 font-sans gap-16 bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto text-center flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
          Empowering Better Doctor-Patient Interaction
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
          Dochub is a modern platform to streamline appointments, consultations, prescriptions, and medical records — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link href="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 text-base">
              Join as Doctor
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="text-blue-600 border-blue-600 px-6 text-base">
              Book Appointment
            </Button>
          </Link>
        </div>
        <Image
          src="/doctor-patient.svg" // Place your illustration in /public
          alt="Doctor and Patient"
          width={600}
          height={400}
          className="mt-8"
        />
      </section>

      {/* Features Section */}
      <section className="w-full max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
        {[
          { title: "Online Appointments", desc: "Book and manage your appointments with ease." },
          { title: "Video Consultations", desc: "Secure and real-time consultations with your doctor." },
          { title: "Digital Prescriptions", desc: "Get your prescriptions instantly after each consultation." },
          { title: "Health History", desc: "Access all your reports, prescriptions and visits in one place." },
          { title: "Doctor Profiles", desc: "Find the best doctors by specialization, experience, and ratings." },
          { title: "Mobile Friendly", desc: "Access Dochub from any device, anytime, anywhere." },
        ].map((feature, i) => (
          <div key={i} className="p-6 rounded-xl shadow-md bg-white">
            <h3 className="text-xl font-semibold text-blue-700">{feature.title}</h3>
            <p className="text-gray-600 mt-2 text-sm">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
