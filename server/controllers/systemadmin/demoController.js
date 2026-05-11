import DemoRequest from "../../models/Demo.js";
import Company from "../../models/company.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";

export const createDemoRequest = async (req, res) => {
  try {
    const {
      companyName,
      website,
      companySize,
      officialEmail,
      contactNumber
    } = req.body;

    // basic validation (important)
    if (!companyName || !officialEmail) {
      return res.status(400).json({
        message: "Company name and official email are required"
      });
    }

    const demoRequest = await DemoRequest.create({
      companyName,
      website,
      companySize,
      officialEmail,
      contactNumber
    });

    res.status(201).json({
      message: "Demo request submitted",
      demoRequest
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// import DemoRequest from "../models/DemoRequest.js";

// GET ALL REQUESTS
export const getAllDemoRequests = async (req, res) => {
  try {
    const requests = await DemoRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// APPROVE / REJECT (CORE LOGIC)
export const updateDemoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await DemoRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // prevent duplicate processing
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    // 🔴 REJECT
    if (status === "rejected") {
      request.status = "rejected";
      await request.save();

      return res.json({ message: "Request rejected" });
    }

    // 🟢 APPROVE

    // 1. Create Company
    const company = await Company.create({
      name: request.companyName,
      website: request.website,
      size: request.companySize,
      status: "approved"
    });

    // 2. Create Company Admin
    const tempPassword = "123456";
    const hashed = await bcrypt.hash(tempPassword, 10);

    const adminUser = await User.create({
      name: request.companyName + " Admin",
      email: request.officialEmail,
      password: hashed,
      role: "company_admin",
      company: company._id
    });

    // 3. Update request
    request.status = "approved";
    await request.save();

    res.json({
      message: "Company approved",
      company,
      adminUser
    });

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message });
  }
};