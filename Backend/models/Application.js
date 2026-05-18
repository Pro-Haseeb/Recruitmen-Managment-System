import mongoose from "mongoose";

const applicationSchema =
  new mongoose.Schema(
    {

      candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },

      job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },

      candidateName: {
        type: String,
      },

      candidateEmail: {
        type: String,
      },

      resume: {
        type: String,
      },

      status: {
        type: String,
        enum: [
          "applied",
          "shortlisted",
          "rejected",
        ],
        default: "applied",
      },

    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Application",
  applicationSchema
);