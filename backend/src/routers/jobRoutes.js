import express from "express";
import { createJob, getJobs, getJobById } from "../controllers/job.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { getMatchScore } from "../services/ai.service.js";
import { analyzeResume } from "../controllers/application.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/:id/match-score", protect, upload.single("resume"), analyzeResume);

// recruiter only
router.post("/", protect, allowRoles("recruiter"), createJob);

export default router;