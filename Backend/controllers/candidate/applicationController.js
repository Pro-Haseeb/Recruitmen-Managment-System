import Application from "../../models/Application.js";
import Job from "../../models/Job.js";
import { extractResumeText } from "../../utils/extractResumeText.js";
import { parseResumeWithAI } from "../../utils/parseResumeWithAi.js";
import { scoreResumeWithAI } from "../../utils/scoreResumeWithAi.js";

export const applyJob = async (req, res) => {
    try {
        const candidate = req.user;
        const { jobId } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        // already applied check
        const alreadyApplied = await Application.findOne({
            candidate: candidate._id,
            job: jobId,
        });

        if (alreadyApplied) {
            return res.status(400).json({
                message: "Already applied",
            });
        }

        // Extract and parse resume
        const resumeText = await extractResumeText(req.file);
        const parsedData = await parseResumeWithAI(resumeText);

        // Score resume against job requirements
        const scoringResult = await scoreResumeWithAI(job, parsedData);

        const application = await Application.create({
            candidate: candidate._id,
            company: job.company,
            job: job._id,
            candidateName: candidate.name,
            candidateEmail: candidate.email,
            resume: req.file?.path,
            resumetxt: resumeText,
            parsedResume: parsedData || {},
            score: scoringResult?.score || 0,
            scoreBreakdown: scoringResult?.scoreBreakdown || {
                skills: 0,
                experience: 0,
                education: 0,
                certifications: 0,
                projects: 0,
            },
            feedback: scoringResult?.feedback || "Scoring failed or not completed.",
        });

        res.status(201).json({
            message: "Applied Successfully",
            application,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getCompanyApplications = async (req, res) => {
    try {
        const admin = req.user;

        const applications = await Application.find({
            company: admin.company,
        })
            .populate("job", "title")
            .populate("candidate", "name email")
            .sort({
                createdAt: -1,
            });

        res.json(applications);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getJobRanking = async (req, res) => {
    try {
        const { jobId } = req.params;
        const admin = req.user;

        const job = await Job.findById(jobId);
        if (!job || !job.company || job.company.toString() !== admin.company.toString()) {
            return res.status(403).json({
                message: "Access denied to this job's rankings",
            });
        }

        const rankings = await Application.find({ job: jobId })
            .populate("candidate", "name email")
            .sort({ score: -1 });

        res.json(rankings);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const admin = req.user;
        const { id } = req.params;
        const { status } = req.body;

        if (!["pending", "shortlisted", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status value",
            });
        }

        const application = await Application.findOne({
            _id: id,
            company: admin.company,
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found or access denied",
            });
        }

        application.status = status;
        await application.save();

        res.json({
            message: `Status updated successfully to ${status}`,
            application,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};