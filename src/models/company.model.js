import mongoose, { model, Schema } from "mongoose";

const companySchema = new Schema(
  {
    companyName: String,
    description: String,
    industry: String,
    address: String,
    numberOfEmployees: Number,
    companyEmail: String,
    companyHR: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
  }
);

export const Company = model("Company", companySchema);
