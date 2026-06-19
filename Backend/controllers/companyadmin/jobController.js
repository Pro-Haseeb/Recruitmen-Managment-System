import Job from "../../models/Job.js";
import Application from "../../models/Application.js";
import { scoreResumeWithAI } from "../../utils/scoreResumeWithAi.js";
import { parseResumeWithAI } from "../../utils/parseResumeWithAi.js";

export const createJob = async (req, res) => {
  try {
    const user = req.user;

    const {
      title,
      description,
      location,
      salary,
      degree,
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
      degree,
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
    const jobs = await Job.find({
      deadline: { $gt: new Date() },
      status: "open"
    })
      .populate("company", "name")
      .populate("createdBy", "name email");

    res.json(jobs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJobCriteria = async (req, res) => {
  try {
    const { jobId } = req.params;
    const criteriaWeights = req.body.criteriaWeights || req.body || {};

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Assign custom weights safely
    job.criteriaWeights = {
      skills: Number(criteriaWeights.skills !== undefined ? criteriaWeights.skills : 40),
      experience: Number(criteriaWeights.experience !== undefined ? criteriaWeights.experience : 25),
      education: Number(criteriaWeights.education !== undefined ? criteriaWeights.education : 20),
      projects: Number(criteriaWeights.projects !== undefined ? criteriaWeights.projects : 15),
      certifications: 0,
    };

    job.screeningStarted = true;
    job.rankingGenerated = true;
    await job.save();

    // Trigger candidate scoring for all applications of this job
    const applications = await Application.find({ job: jobId });

    for (const app of applications) {
      let parsedData = app.parsedResume;
      if (!parsedData || !parsedData.skills || parsedData.skills.length === 0) {
        if (app.resumetxt) {
          try {
            const parsed = await parseResumeWithAI(app.resumetxt);
            if (parsed) {
              parsedData = parsed;
            }
          } catch (err) {
            console.error("Error parsing resume in batch:", err);
          }
        }
      }

      if (!parsedData) {
        parsedData = {
          skills: [],
          experience: "",
          education: "",
          projects: [],
        };
      }

      const scoringResult = await scoreResumeWithAI(job, parsedData);
      if (scoringResult) {
        app.score = scoringResult.score || 0;
        app.scoreBreakdown = scoringResult.scoreBreakdown || {};
        app.feedback = scoringResult.feedback || "";
        app.parsedResume = parsedData;
        await app.save();
      }
    }

    res.json({
      message: "Job criteria updated and candidate ranking generated successfully",
      job,
    });
  } catch (error) {
    console.error("updateJobCriteria error details:", error);
    res.status(500).json({ message: error.message });
  }
};