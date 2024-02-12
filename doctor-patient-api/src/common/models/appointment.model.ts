import mongoose, { Document, Schema, model } from "mongoose";
import userModel from "./user.model";

export interface Appointment extends Document {
  patientId: Schema.Types.ObjectId;
  doctorId: Schema.Types.ObjectId;
  date: Date;
  time: string;
  status: string;
  patientDetails: {
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
    age: string;
    medicalHistory: string;
    medicalDocument: Array<string>;
  };
}

const appointmentSchema = new Schema<Appointment>({
  patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  patientDetails: {
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    dob: { type: String },
    age: { type: String },
    medicalHistory: { type: String },
    medicalDocument: { type: Array, default: [] },
  },
});
const AppointmentModel = mongoose.model<Appointment>(
  "Appointment",
  appointmentSchema
);

export default AppointmentModel;
