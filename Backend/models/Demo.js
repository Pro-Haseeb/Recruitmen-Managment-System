import mongoose from "mongoose";

const demoRequestSchema = new mongoose.Schema({
  companyName: String,
  website: String,
  companySize: String,
  officialEmail: String,
  contactNumber: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }

}, { timestamps: true });

export default mongoose.model("DemoRequest", demoRequestSchema);