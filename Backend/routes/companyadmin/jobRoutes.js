import express from "express";

import { createJob, getAllJobs, updateJobCriteria } from "../../controllers/companyadmin/jobController.js";

import { protect } from "../../middlewares/authMiddleware.js";
import { authorizeRoles } from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/create", protect, authorizeRoles("company_admin", "hr"), createJob);

router.get("/all", getAllJobs);

router.put("/:jobId/criteria", protect, authorizeRoles("company_admin", "hr"), updateJobCriteria);

export default router;