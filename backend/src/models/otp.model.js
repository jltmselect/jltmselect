import {Schema, model} from "mongoose";

const otpSchema = new Schema({
  phone: String,
  otp: String,
  expiresAt: Date
}, { timestamps: true });

otpSchema.index({ phone: 1 });

const Otp = model("Otp", otpSchema);

export default Otp;