import mongoose, { model, Schema } from "mongoose";

const jobSchema = new Schema(
  {
    jobTitle: String,
    jobLocation: {
      type: String,
      enum: ["onsite", "remotely", "hybrid "],
    },
    workingTime: {
      type: String,
      enum: ["full-time", "part-time"],
    },
    seniorityLevel: {
      type: String,
      enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO "],
    },
    jobDescription: String,
    technicalSkills: [String],
    softSkills: [String],
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    companyId: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
    },
  },
  {
    versionKey: false,
  }
);

export const Job = model("Job", jobSchema);
