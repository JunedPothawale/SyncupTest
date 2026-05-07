import express from "express";
import {
    applyToJob,
    getMyApplications,
    getApplicationsForJob,
} from "../controllers/application.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();


router.post("/apply/:id", protect, applyToJob);

router.get("/me", protect, getMyApplications);

// recruiter
router.get("/job/:id", protect, allowRoles("recruiter"), getApplicationsForJob);

export default router;