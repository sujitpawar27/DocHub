const { CopilotRuntime } = require("@copilotkit/runtime");
const Appointment = require("../models/Appointment");
const User = require("../models/User").User || require("../models/User");

function getCopilotActions() {
  return [
    {
      name: "suggestDoctor",
      description:
        "Suggest a doctor based on a condition or specialty (e.g., skin, diabetes, heart).",
      parameters: [{ name: "condition", type: "string", required: true }],
      handler: async ({ condition }) => {
        console.log(
          "🔍 [Copilot] suggestDoctor triggered with condition:",
          condition
        );

        // Create regex to match specialization
        const regex = new RegExp(condition, "i");
        console.log("📌 Using RegExp for specialization search:", regex);

        try {
          const doctors = await User.find({
            role: "doctor",
            specialization: regex,
          }).limit(3);

          console.log(
            "✅ Doctors found:",
            doctors.length,
            doctors.map((d) => d.fullName)
          );

          if (!doctors.length) {
            console.warn(
              "⚠️ No matching doctors found for condition:",
              condition
            );
            return {
              message: `I am sorry, I cannot fulfill this request. There were no doctors found for the condition "${condition}". Please try again with a different condition.`,
            };
          }

          return doctors.map((doc) => ({
            name: doc.fullName,
            specialization: doc.specialization,
            qualifications: doc.qualifications,
            experience: doc.experience,
            location: doc.address?.city,
          }));
        } catch (err) {
          console.error("❌ Error while fetching doctors:", err);
          return {
            message: "An internal error occurred while searching for doctors.",
          };
        }
      },
    },
    {
      name: "bookAppointment",
      description:
        "Book appointment with a doctor by name and redirect to profile",
      parameters: [{ name: "doctorName", type: "string", required: true }],
      handler: async ({ doctorName }) => {
        // Find doctor by name (case-insensitive)
        const doctor = await User.findOne({
          name: new RegExp(`^${doctorName}$`, "i"),
        });
        if (!doctor) {
          return { message: "Doctor not found" };
        }
        // Return redirect URL to doctor's profile
        const url = `http://localhost:3000/patient/doctorProfile/${doctor._id}`;
        return {
          message: "Redirect to doctor profile page",
          url,
        };
      },
    },
    {
      name: "viewPrescription",
      description: "View a prescription by appointment and patient",
      parameters: [
        { name: "patientId", type: "string", required: true },
        { name: "appointmentId", type: "string", required: true },
      ],
      handler: async ({ patientId, appointmentId }) => {
        const url = `/patient/health-history/prescription/${appointmentId}`;
        return {
          message: "Redirect to prescription page",
          url,
        };
      },
    },
  ];
}

module.exports = { getCopilotActions };
