import Interview from "../../models/Interview.js";
import Application from "../../models/Application.js";
import User from "../../models/User.js";
import crypto from "crypto";

/**
 * @route POST /api/interviews
 * @desc Schedule interview (with Jitsi meeting)
 */
export const scheduleInterview = async (req, res) => {
  try {
    const {
      applicationId,
      interviewer,
      interviewDate,
      interviewType
    } = req.body;

    // 1. Validate application
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // 2. Company security check (IMPORTANT)
    if (application.company.toString() !== req.user.company.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    // 3. Only shortlisted allowed
    if (application.status !== "shortlisted") {
      return res.status(400).json({
        success: false,
        message: "Only shortlisted candidates can be interviewed"
      });
    }

    // 4. Validate interviewer (must be a company admin or HR user id)
    if (!interviewer) {
      return res.status(400).json({
        success: false,
        message: "Please select an interviewer"
      });
    }

    const interviewerUser = await User.findOne({
      _id: interviewer,
      company: req.user.company,
      role: { $in: ["company_admin", "hr"] }
    });

    if (!interviewerUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid interviewer selected"
      });
    }

    // 5. Generate Jitsi meeting link
    const roomName = `rms-${crypto.randomUUID()}`;
    const meetingLink = `https://meet.jit.si/${roomName}`;

    // 6. Create interview
    const interview = await Interview.create({
      application: application._id,
      candidate: application.candidate,
      company: application.company,
      job: application.job,
      interviewer,
      interviewDate,
      interviewType: interviewType || "online",
      meetingLink,
      result: "pending"
    });

    return res.status(201).json({
      success: true,
      message: "Interview scheduled successfully",
      data: interview
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.name === "ValidationError"
        ? "Invalid interview data"
        : "Failed to schedule interview"
    });
  }
};


/**
 * @route GET /api/interview/interviewers
 */
export const getInterviewers = async (req, res) => {
  try {
    const interviewers = await User.find({
      company: req.user.company,
      role: { $in: ["company_admin", "hr"] }
    })
      .select("name email role")
      .sort({ name: 1 });

    return res.json({
      success: true,
      data: interviewers
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interviewers"
    });
  }
};


/**
 * @route GET /api/interviews
 */
export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      company: req.user.company
    })
      .populate("candidate", "name email")
      .populate("job", "title")
      .populate("company", "name")
      .populate("interviewer", "name")
      .sort({ interviewDate: -1 });

    return res.json({
      success: true,
      data: interviews
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interviews"
    });
  }
};


/**
 * @route PUT /api/interviews/:id
 */
export const updateInterview = async (req, res) => {
  try {
    const { feedback, result } = req.body;

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found"
      });
    }

    // company security check
    if (interview.company.toString() !== req.user.company.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    interview.feedback = feedback ?? interview.feedback;
    interview.result = result ?? interview.result;

    await interview.save();

    return res.json({
      success: true,
      message: "Interview updated",
      data: interview
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update interview"
    });
  }
};


/**
 * @route DELETE /api/interviews/:id
 */
export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found"
      });
    }

    // company security check
    if (interview.company.toString() !== req.user.company.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    await Interview.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: "Interview deleted"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete interview"
    });
  }
};