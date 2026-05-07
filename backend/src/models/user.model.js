import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,

            enum: [
                "candidate",
                "recruiter",
                "admin",
            ],

            default: "candidate",
        },

        avatar: {
            type: String,
            default: "",
        },

        phone: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
        },

        skills: [
            {
                type: String,
            },
        ],

        experience: {
            type: Number,
            default: 0,
        },

        location: {
            type: String,
            default: "",
        },

        company: {
            type: String,
            default: "",
        },

        website: {
            type: String,
            default: "",
        },

        linkedin: {
            type: String,
            default: "",
        },

        github: {
            type: String,
            default: "",
        },

        // =========================
        // RESUME
        // =========================
        resumeUrl: {
            type: String,
            default: "",
        },

        resumeText: {
            type: String,
            default: "",
        },

        // =========================
        // SAVED JOBS
        // =========================
        savedJobs: [
            {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "Job",
            },
        ],

        // =========================
        // PROFILE STATUS
        // =========================
        isProfileCompleted: {
            type: Boolean,
            default: false,
        },

        // =========================
        // AUTH
        // =========================
        isVerified: {
            type: Boolean,
            default: false,
        },

        refreshToken: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);


userSchema.index({
    role: 1,
});

userSchema.index({
    skills: "text",
});

// =========================
// MODEL
// =========================
const User = mongoose.model(
    "User",
    userSchema
);

export default User;