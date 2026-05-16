import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    enum: ["system_owner", "company_admin", "hr", "candidate"]
  },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: null
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);
