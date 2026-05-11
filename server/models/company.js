import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: String,
  website: String,
  size: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  isBlocked: {
      type: Boolean,
      default: false,
    },
  

}, { timestamps: true });

export default mongoose.model("Company", companySchema);