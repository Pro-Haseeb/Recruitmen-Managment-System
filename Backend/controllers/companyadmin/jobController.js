import Job from "../../models/Job.js";

export const createJob = async (req, res) => {
  try {

    const user = req.user;

    const {
      title,
      description,
      location,
      salary,
      deadline
    } = req.body;

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      deadline,

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