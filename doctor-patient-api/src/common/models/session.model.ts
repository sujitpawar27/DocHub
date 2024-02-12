import mongoose, { Schema, Document } from "mongoose";

interface Session extends Document {
  email: string;
  accesstoken: string;
  refreshtoken: string;
  role: string;
}

const sessionSchema = new Schema<Session>({
  email: { type: String, required: true, unique: true },
  accesstoken: { type: String, required: true },
  refreshtoken: { type: String, requireds: true },
  role: { type: String, required: true },
});

const SessionModel = mongoose.model<Session>("Session", sessionSchema);

export default SessionModel;
