import mongoose from "mongoose";

const aiMatchSchema = new mongoose.Schema(
    {
        score: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        matchedSkills: {
            type: [String],
            default: [],
        },
        missingSkills: {
            type: [String],
            default: [],
        },
        suggestions: {
            type: [String],
            default: [],
        },
    },
    { _id: false }
);

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
            index: true,
        },

        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        resumeUrl: {
            type: String,
            required: true,
        },

        // 🔥 Needed for AI reprocessing
        resumeText: {
            type: String,
            required: true,
        },

        // 🧠 AI result
        aiMatch: {
            type: aiMatchSchema,
            default: () => ({}),
        },

        status: {
            type: String,
            enum: ["applied", "shortlisted", "rejected", "hired"],
            default: "applied",
            index: true,
        },

        // optional recruiter notes
        notes: {
            type: String,
        },
    },
    { timestamps: true }
);

// 🔥 Prevent duplicate applications (VERY IMPORTANT)
applicationSchema.index({ applicant: 1, job: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);