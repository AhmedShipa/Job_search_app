import mongoose, { model, Schema } from "mongoose";

const applicationSchema = new Schema(
  {
    jobId: {
      type: mongoose.Types.ObjectId,
      ref: "Job",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    userResume: String,
  },
  {
    versionKey: false,
    timestamps: {
      updatedAt: false,
      createdAt: true,
    },
  }
);

applicationSchema.post("init", function (doc) {
  if (doc.userResume)
    doc.userResume = process.env.BASE_URL + "cv/" + doc.userResume;
});
export const Application = model("Application", applicationSchema);
