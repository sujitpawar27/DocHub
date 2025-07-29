import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DoctorCard({
  doctor,
  onBook,
  actionLabel = "Book Now",
}) {
  const router = useRouter();
  const handleProfile = () =>
    router.push(`/patient/doctorProfile/${doctor._id || doctor.id}`);
  const handleBook = () => onBook?.(doctor);

  return (
    <Card className="rounded-2xl shadow-xl border-0 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 bg-white flex flex-col items-center p-7">
      <Avatar className="w-20 h-20 shadow-lg border-4 border-white bg-blue-50 mb-2">
        <AvatarImage
          src={doctor?.avatarUrl || "/default-avatar.png"}
          alt={doctor?.fullName || "Doctor Avatar"}
          onError={(e) => {
            e.currentTarget.src = "/default-avatar.png";
          }}
        />
        <AvatarFallback className="text-2xl text-blue-700 font-bold">
          {doctor?.fullName?.[0] || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="text-xl font-bold text-blue-900 text-center mb-1">
        {doctor.fullName}
      </div>
      <Badge className="mb-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full capitalize tracking-wide text-md border-none">
        {doctor.specialization}
      </Badge>
      <div className="text-gray-500 text-sm mb-1">
        {doctor.experience} yrs experience
      </div>
      <div className="flex items-center gap-1 mb-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={
              i < (doctor.rating || 0)
                ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                : "text-gray-200"
            }
          />
        ))}
        <span className="text-xs text-gray-500 ml-2">
          {doctor.rating?.toFixed(1) || "-"}
        </span>
      </div>
      <Separator className="my-2 w-full" />
      <div className="flex gap-3 w-full mt-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 rounded-full border-blue-500 text-blue-700 hover:bg-blue-50 font-semibold"
          onClick={handleProfile}
        >
          Book an appointment
        </Button>
        {/* <Button
          size="sm"
          className="flex-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow"
          onClick={handleBook}
        >
          {actionLabel}
        </Button> */}
      </div>
    </Card>
  );
}
