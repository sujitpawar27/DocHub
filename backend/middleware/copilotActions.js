import { suggestDoctor } from "../controllers/suggestDoctor.js";

export function getCopilotActions() {
  return [
    {
      name: "suggestDoctor",
      description: "Suggest a doctor based on a medical condition",
      parameters: [{ name: "condition", type: "string", required: true }],
      handler: suggestDoctor,
    },
    // {
    //   name: "bookAppointment",
    //   description:
    //     "Book appointment with a doctor by name and redirect to profile",
    //   parameters: [{ name: "doctorName", type: "string", required: true }],
    //   handler: async ({ doctorName }) => {
    //     // Find doctor by name (case-insensitive)
    //     const doctor = await User.findOne({
    //       name: new RegExp(`^${doctorName}$`, "i"),
    //     });
    //     if (!doctor) {
    //       return { message: "Doctor not found" };
    //     }
    //     // Return redirect URL to doctor's profile
    //     const url = `http://localhost:3000/patient/doctorProfile/${doctor._id}`;
    //     return {
    //       message: "Redirect to doctor profile page",
    //       url,
    //     };
    //   },
    // },
    // {
    //   name: "viewPrescription",
    //   description: "View a prescription by appointment and patient",
    //   parameters: [
    //     { name: "patientId", type: "string", required: true },
    //     { name: "appointmentId", type: "string", required: true },
    //   ],
    //   handler: async ({ patientId, appointmentId }) => {
    //     const url = `/patient/health-history/prescription/${appointmentId}`;
    //     return {
    //       message: "Redirect to prescription page",
    //       url,
    //     };
    //   },
    // },
  ];
}
