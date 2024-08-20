import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    userName: String,
    email: String,
    password: String,
    recoveryEmail: String,
    DOB: Date,

    mobileNumber: Number,
    role: {
      type: String,
      enum: ["user", "company_HR"],
    },
    status: {
      type: String,
      default: "offline",
      enum: ["online", "offline"],
    },
    OTP: Number,
    isVerified: {
      type: Boolean,
      default: false,
    },
    producedAT: {
      type: Date,
      default: null,
    },
    expiredAt: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
  }
);

export const User = model("User", userSchema);
