import { Document, Schema, model } from "mongoose";

interface Feedback extends Document {
  appointmentId: Schema.Types.ObjectId;
  review: string;
  rating: number;
}

const feedbackSchema = new Schema<Feedback>({
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  review: { type: String, required: true },
  rating: { type: Number, required: true },
});

export default model<Feedback>("Feedback", feedbackSchema);
