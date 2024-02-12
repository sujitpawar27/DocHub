import { Document, Schema, model } from "mongoose";
export interface Coordinates {
  latitude: number;
  longitude: number;
}
export interface User extends Document {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  password: string;
  role: string;
  resetToken?: string;
  specialization?: string;
  experience?: number;
  mobileNumber?: string;
  rating?:number;
  address?: {
    country: string;
    state: string;
    city: string;
    zipcode: string;
    coordinates: Coordinates;
  };
  profilePicUrl?: string;
}

const userSchema = new Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String },
  resetToken: { type: String },
  specialization: { type: String },
  experience: { type: Number },
  mobileNumber: { type: String },
  rating:{type:String},
  address: {
    country: { type: String },
    state: { type: String },
    city: { type: String },
    zipcode: { type: String },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  profilePicUrl: { type: String },
});
userSchema.index({ "address.coordinates": "2dsphere" });

export default model<User>("User", userSchema);
