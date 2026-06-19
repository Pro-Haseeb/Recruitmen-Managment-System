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
      resumetxt: {
        type: String
      },

      resume: {
        type: String,
      },

      parsedResume: {
        fullName: String,
        email: String,
        phone: String,
        skills: mongoose.Schema.Types.Mixed,
        education: mongoose.Schema.Types.Mixed,
        experience: mongoose.Schema.Types.Mixed,
        projects: mongoose.Schema.Types.Mixed,
      },

      score: {
        type: Number,
        default: 0,
      },

      scoreBreakdown: {
        skills: { type: Number, default: 0 },
        experience: { type: Number, default: 0 },
        education: { type: Number, default: 0 },
        certifications: { type: Number, default: 0 },
        projects: { type: Number, default: 0 },
      },

      feedback: {
        type: String,
      },

      status: {
        type: String,
        enum: [
          "pending",
          "shortlisted",
          "rejected",
          "interviewed",
          "selected"
        ],
        default: "pending",
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