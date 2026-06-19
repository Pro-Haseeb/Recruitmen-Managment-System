import Interview from "../../models/Interview.js";

/**
 * @route GET /api/candidate/interviews
 * @desc Get interviews for the logged-in candidate (scheduled/active only)
 */
export const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      candidate: req.user._id,
      result: "pending",
    })
      .populate("job", "title")
      .populate("company", "name")
      .populate("interviewer", "name")
      .sort({ interviewDate: 1 });

    return res.json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interviews",
    });
  }
};
