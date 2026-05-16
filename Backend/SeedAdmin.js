import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: "admin@rms.com" });

    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashed = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "System Owner",
      email: "admin@rms.com",
      password: hashed,
      role: "system_owner"
    });

    console.log("Admin created");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();