import Application from "../../models/Application.js";
import Job from "../../models/Job.js";
import { extractResumeText } from "../../utils/extractResumeText.js";
import { parseResumeWithAI } from "../../utils/parseResumeWithAi.js";
export const applyJob = async (
    req,
    res
) => {

    try {

        const candidate = req.user;

        const { jobId } = req.body;

        const job = await Job.findById(jobId);

        const resumeText = await extractResumeText(req.file);
        
        const parsedData = await parseResumeWithAI(resumeText);

        console.log(parsedData);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        // already applied check
        const alreadyApplied =
            await Application.findOne({
                candidate: candidate._id,
                job: jobId,
            });

        if (alreadyApplied) {
            return res.status(400).json({
                message: "Already applied",
            });
        }

        const application =
            await Application.create({

                candidate: candidate._id,

                company: job.company,

                job: job._id,

                candidateName: candidate.name,

                candidateEmail: candidate.email,

                resume: req.file?.path,

                resumetxt : resumeText

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

export const getCompanyApplications =
    async (req, res) => {

        try {

            const admin = req.user;

            const applications =
                await Application.find({
                    company: admin.company,
                })

                    .populate(
                        "job",
                        "title"
                    )

                    .populate(
                        "candidate",
                        "name email"
                    )

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