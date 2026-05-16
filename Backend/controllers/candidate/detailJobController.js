import Job from "../../models/Job.js";

export const detailJob = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id)
      .populate("company", "name")
      .populate("createdBy", "name");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json(job);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};