import { Document, Schema, model } from "mongoose";

interface Notification extends Document {
  patientId: Schema.Types.ObjectId;
  email: String;
  fcmToken: string;
}

const notificationSchema = new Schema<Notification>({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  email: {
    type: String,
  },
  fcmToken: { type: String },
});

export default model<Notification>("Notification", notificationSchema);
