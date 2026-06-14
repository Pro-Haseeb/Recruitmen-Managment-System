import User from "../../models/User.js";
import bcrypt from "bcryptjs";

/**
 * CREATE HR
 */


export const createHR = async (req, res) => {
  try {
    const admin = req.user; // from auth middleware

    const hrCount = await User.countDocuments({
      companyId: admin.company,
      role: "hr",
    });

    if (hrCount >= 3) {
      return res.status(400).json({
        message: "HR limit reached (max 3 allowed)",
      });
    }

    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

// if(!admin.company){
//   res.status(400).json({message: "Company Id missing"});
//   console.log("company id missing!");
// }
    const hashedPassword = await bcrypt.hash(password, 10);

    const hr = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "hr",
      company: admin.company,
    });

    res.status(201).json({
      message: "HR created successfully",
      hr,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllHRs = async (req, res) => {
  try {
    const admin = req.user;

    const hrs = await User.find({
      company: admin.company,
      role: "hr",
    }).select("-password");

    res.json(hrs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteHR = async (req, res) => {
  try {
    const admin = req.user;
    const { id } = req.params;

    const hr = await User.findById(id);

    // console.log("HR:", hr);
    // console.log("ADMIN:", admin);

    if (!hr) {
      return res.status(404).json({ message: "HR not found" });
    }

    // SAFE CHECK (NO CRASH)
    if (
      !hr.company ||
      !admin.company ||
      hr.company.toString() !== admin.company.toString()
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (hr.role !== "hr") {
      return res.status(400).json({ message: "Not an HR user" });
    }

    await User.findByIdAndDelete(id);

    res.json({ message: "HR deleted successfully" });

  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};