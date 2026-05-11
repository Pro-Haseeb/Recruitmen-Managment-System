import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  salary: String,
  skills: [String],
  experienceLevel: String,
  education: String,
  location: String,
  deadline: Date,

  status: {
    type: String,
    enum: ["open", "closed"]
  },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

export default mongoose.model("Job", jobSchema);