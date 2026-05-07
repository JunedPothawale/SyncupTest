import Job from "../models/job.model.js";
import { redisClient } from '../configs/redis.config.js'
import { formatSalary } from "../utils/salaryFormater.js";



export const createJob = async (req, res) => {
    try {
        const payload = {

            title: req.body.title,

            company: req.body.company,

            location: req.body.location,

            employmentType:
                req.body.type,

            experienceLevel:
                req.body.experienceLevel,

            workSetting:
                req.body.workSetting,

            description:
                req.body.description,

            responsibilities:
                req.body.responsibilities,

            requirements:
                req.body.requirements,

            benefits:
                req.body.benefits,

            website:
                req.body.website,

            companyDescription:
                req.body.companyDescription,

            salary: formatSalary({
                currency: req.body.salary?.currency,
                min: req.body.salary?.min,
                max: req.body.salary?.max,
            }),
            createdBy: req.user.id,
        };

        const job = await Job.create(payload);
        await redisClient.del("jobs");
        return res.status(201).json({

            success: true,
            message:
                "Job created successfully",

            job,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            message:
                "Error creating job",

            error:
                err.message,
        });
    }
};

// ==============================
// 📄 Get Jobs (with cache + filters)
// ==============================
export const getJobs = async (req, res) => {
    try {
        let { page = 1, limit = 10, keyword, location, type } = req.query;

        const normalize = (val) => {
            if (!val) return undefined;
            const trimmed = val.trim();
            return trimmed === "" ? undefined : trimmed;
        };

        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(20, parseInt(limit) || 10);

        const keywordClean = normalize(keyword);
        const locationClean = normalize(location);
        const typeClean = normalize(type);

        // 🔥 IMPORTANT: bump cache version
        const cacheKey = `jobs:v2:${pageNum}:${limitNum}:${keywordClean || "all"}:${locationClean || "all"}:${typeClean || "all"}`;

        // 🔥 CACHE
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json(JSON.parse(cached));
        }

        // 🔥 base query (WITHOUT type)
        let baseQuery = {};

        if (keywordClean) {
            baseQuery.title = { $regex: keywordClean, $options: "i" };
        }

        if (locationClean) {
            baseQuery.location = { $regex: locationClean, $options: "i" };
        }

        // 🔥 full query (WITH type)
        let query = { ...baseQuery };

        if (typeClean) {
            const types = typeClean.split(",");
            query.type = { $in: types };
        }

        // 🚀 RUN IN PARALLEL
        const [jobs, total, typeStats] = await Promise.all([

            // jobs
            Job.find(query)
                .select("title company location type createdAt salary")
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .lean(),

            // total count
            Job.countDocuments(query),

            // 🔥 FILTER AGGREGATION
            Job.aggregate([
                { $match: baseQuery },
                {
                    $group: {
                        _id: "$type",
                        count: { $sum: 1 },
                    },
                },
            ]),
        ]);

        // ✅ FORMAT FILTERS
        const filters = {
            jobTypes: typeStats.map((item) => ({
                label: item._id,
                count: item.count,
            })),
        };

        const response = {
            jobs,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            filters,
        };

        // 🔥 CACHE
        await redisClient.set(
            cacheKey,
            JSON.stringify(response),
            "EX",
            30
        );

        res.json(response);

    } catch (err) {
        console.error("GET JOBS ERROR:", err);
        res.status(500).json({
            message: "Error fetching jobs",
            error: err.message,
        });
    }
};

export const getJobById = async (req, res) => {
    try {
        const cacheKey = `job:${req.params.id}`;

        // 🔥 check cache
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json(JSON.parse(cached));
        }

        const job = await Job.findById(req.params.id).populate(
            "createdBy",
            "name email"
        );

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // cache single job
        await redisClient.set(cacheKey, JSON.stringify(job), "Ex", 60);

        res.json(job);
    } catch (err) {
        res.status(500).json({ message: "Error fetching job" });
    }
};