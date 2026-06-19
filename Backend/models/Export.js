import mongoose from "mongoose";
const exportLogSchema = new mongoose.Schema({
  exportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  exportType: {
    type: String,
    enum: ["applications", "jobs", "interviews"],
    required: true
  },

 
 

  status: {
    type: String,
    enum: ["queued", "processing", "completed", "failed"],
    default: "queued"
  },

  // filters sent to n8n
  filters: {
    status: String,
    jobId: mongoose.Schema.Types.ObjectId,
    minScore: Number,
    dateFrom: Date,
    dateTo: Date
  },

  // result tracking
  totalRecords: {
    type: Number,
    default: 0
  },

  fileUrl: {
    type: String
  },

  error: {
    type: String
  },

  requestedAt: {
    type: Date,
    default: Date.now
  },

  completedAt: Date

}, { timestamps: true });

export default mongoose.model("Export", exportLogSchema);