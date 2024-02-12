import { Document, Schema, model } from "mongoose";

interface PrescriptionItem {
  medicineName: string;
  medicineType: string;
  numberOfTablets: string;
  frequency: {
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
  };
  dose: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  timing: {
    afterFood: boolean;
    beforeFood: boolean;
  };
  notes: string;
}

interface Prescription extends Document {
  appointmentId: Schema.Types.ObjectId;
  items: PrescriptionItem[];
}

const prescriptionItemSchema = new Schema<PrescriptionItem>({
  medicineName: { type: String, required: true },
  medicineType: { type: String, required: true },
  numberOfTablets: { type: String, required: true },
  frequency: {
    daily: { type: Boolean, required: true },
    weekly: { type: Boolean, required: true },
    monthly: { type: Boolean, required: true },
  },
  dose: {
    breakfast: { type: Boolean, required: true },
    lunch: { type: Boolean, required: true },
    dinner: { type: Boolean, required: true },
  },
  timing: {
    afterFood: { type: Boolean, required: true },
    beforeFood: { type: Boolean, required: true },
  },
  notes: { type: String, required: true },
});

const prescriptionSchema = new Schema<Prescription>({
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  items: [prescriptionItemSchema],
});

export default model<Prescription>("Prescription", prescriptionSchema);
