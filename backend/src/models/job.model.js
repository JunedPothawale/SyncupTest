import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        company: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            required: true,
        },

        employmentType: {
            type: String,

            enum: [
                "Full-time",
                "Part-time",
                "Contract",
                "Internship",
            ],

            required: true,
        },

        salary: [
            {
                type: String,
            },
        ],

        experienceLevel: {

            type: String,

            enum: [
                "Junior",
                "Mid Level",
                "Senior",
            ],

            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        skills: [
            {
                type: String,
            },
        ],

        requirements: [
            {
                type: String,
            },
        ],

        benefits: [
            {
                type: String,
            },
        ],

        companyDescription: {
            type: String,
        },

        isRemote: {
            type: Boolean,
            default: false,
        },

        openings: {
            type: Number,
            default: 1,
        },

        status: {

            type: String,

            enum: [
                "active",
                "closed",
                "draft",
            ],

            default: "active",
        },

        applicationsCount: {
            type: Number,
            default: 0,
        },

        views: {
            type: Number,
            default: 0,
        },

        createdBy: {

            type:
                mongoose.Schema.Types.ObjectId,

            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;