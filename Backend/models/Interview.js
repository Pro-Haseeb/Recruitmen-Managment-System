import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({

  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true
  },

  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  interviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  interviewDate: {
    type: Date,
    required: true
  },

  interviewType: {
    type: String,
    enum: ["online", "onsite"],
    default: "online"
  },

  meetingLink: String,

  feedback: String,

  result: {
    type: String,
    enum: [
      "pending",
      "selected",
      "rejected"
    ],
    default: "pending"
  }

},
{
 timestamps:true
});

export default mongoose.model(
 "Interview",
 interviewSchema
);