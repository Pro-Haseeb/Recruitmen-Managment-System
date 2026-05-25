import Job from "../../models/Job.js";

export const createJob = async (req, res) => {
  try {

    const user = req.user;

    const {
      title,
      description,
      location,
      salary,
      deadline,
      skills,
      experienceLevel,
      education,
    } = req.body;

    if (!user.company) {
      return res.status(400).json({
        message: "Your account is not linked to a company. Contact support.",
      });
    }

    const parsedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
        ? skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      deadline,
      skills: parsedSkills,
      experienceLevel,
      education,
      status: "open",
      company: user.company,
      createdBy: user._id,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {

    const jobs = await Job.find()
      .populate("company", "name")
      .populate("createdBy", "name email");

    res.json(jobs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};