import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import User from "../models/user.model.js";
import { getMatchScore } from "../services/ai.service.js";
import { extractResumeText } from "../utils/extractResumeText.js";
import { notifyRecruiter } from "../utils/notifyRecruiter.js";


// =====================================================
// 🧠 ANALYZE RESUME
// =====================================================
export const analyzeResume = async (req, res) => {
    try {

        const { id } =
            req.params;

        // =========================
        // VALIDATE JOB
        // =========================
        const job =
            await Job.findById(id);

        if (!job) {

            return res
                .status(404)
                .json({
                    message:
                        "Job not found",
                });
        }

        // =========================
        // VALIDATE FILE
        // =========================
        if (!req.file) {

            return res
                .status(400)
                .json({
                    message:
                        "Resume is required",
                });
        }

        // =========================
        // RESUME URL
        // =========================
        const resumeUrl =

            req.file.location ||

            `/uploads/resumes/${req.file.filename}`;

        // =========================
        // EXTRACT TEXT
        // =========================
        let resumeText = "";

        try {

            resumeText =
                await extractResumeText(
                    req.file.path
                );

        } catch (err) {

            console.error(
                "RESUME EXTRACTION ERROR:",
                err.message
            );

            return res
                .status(500)
                .json({
                    message:
                        "Failed to extract resume text",
                });
        }

        // =========================
        // SAVE TO USER
        // =========================
        try {

            await User.findByIdAndUpdate(
                req.user.id,
                {
                    resumeUrl,
                    resumeText,
                }
            );

        } catch (err) {

            console.error(
                "USER UPDATE ERROR:",
                err.message
            );
        }

        // =========================
        // AI ANALYSIS
        // =========================
        let aiMatch = null;

        try {

            aiMatch =
                await getMatchScore(
                    resumeText,
                    job.description
                );


        } catch (err) {

            console.error(
                "AI ERROR:",
                err.message
            );

            return res
                .status(500)
                .json({
                    message:
                        "AI analysis failed",
                });
        }

        // =========================
        // RESPONSE
        // =========================
        return res.status(200).json({

            success: true,

            aiMatch,

            resumeUrl,

            resumeText,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message:
                "Server error",
        });
    }
};

// =====================================================
// 🚀 FINAL APPLY
// =====================================================
export const applyToJob = async (req, res) => {
    const user = await User.findById(
        req.user.id
    );
    try {
        const { id } = req.params;

        const aiMatch = req.body?.aiMatch || {
            score: 0,
            matchedSkills: [],
            missingSkills: [],
            summary: "",
        };

        // GET JOB
        const job = await Job.findById(id);

        if (!job) {
            return res
                .status(404)
                .json({
                    message:
                        "Job not found",
                });
        }

        // GET USER
        const user = await User.findById(req.user.id);



        if (!user || !user.resumeUrl) {
            return res
                .status(400)
                .json({
                    message:
                        "Please upload resume first",
                });
        }

        // DUPLICATE CHECK
        const alreadyApplied =
            await Application.findOne({
                job: id,
                applicant:
                    req.user.id,
            });

        if (alreadyApplied) {
            return res
                .status(400)
                .json({
                    message:
                        "Already applied",
                });
        }
        // CREATE
        const application = await Application.create({
            job: id,
            applicant: req.user.id,
            resumeUrl: user.resumeUrl,
            resumeText: user.resumeText,
            aiMatch,
            status: "applied"
        });
        // SOCKET
        try {
            notifyRecruiter(job.createdBy.toString(), {
                type: "NEW_APPLICATION",
                message: `${user.name} applied for ${job.title}`,
                jobId: job._id,
                applicationId: application._id,
                aiScore: aiMatch?.score || 0,
                resumeUrl: user.resumeUrl,
                applicant: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        } catch (err) {

            console.error("SOCKET ERROR:", err.message);
        }
        return res.status(201).json(
            {
                success: true,
                message: "Application submitted successfully",
                application
            });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message:
                "Server error",
        });
    }
};


// =====================================================
// 👤 MY APPLICATIONS
// =====================================================
export const getMyApplications = async (
    req,
    res
) => {
    try {
        const applications =
            await Application.find({
                applicant: req.user.id,
            })
                .populate(
                    "job",
                    "title company location type salary"
                )
                .sort({ createdAt: -1 });

        return res.json(applications);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message:
                "Error fetching applications",
        });
    }
};


// =====================================================
// 🏢 RECRUITER JOB APPLICATIONS
// =====================================================
export const getApplicationsForJob =
    async (req, res) => {
        try {
            const { jobId } = req.params;

            // 🔍 Validate ownership
            const job =
                await Job.findById(jobId);

            if (!job) {
                return res.status(404).json({
                    message:
                        "Job not found",
                });
            }

            // 🔒 Recruiter access
            if (
                job.createdBy.toString() !==
                req.user.id
            ) {
                return res.status(403).json({
                    message:
                        "Unauthorized access",
                });
            }

            // 📄 Applications
            const applications =
                await Application.find({
                    job: jobId,
                })
                    .populate(
                        "applicant",
                        "name email profileImage"
                    )
                    .sort({
                        createdAt: -1,
                    });

            return res.json(applications);

        } catch (err) {
            console.error(err);

            return res.status(500).json({
                message:
                    "Error fetching applications",
            });
        }
    };