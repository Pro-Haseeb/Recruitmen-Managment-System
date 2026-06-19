import express from "express";
import { getMyInterviews } from "../../controllers/candidate/interviewController.js";
import { protect } from "../../middlewares/authMiddleware.js";
import { authorizeRoles } from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("candidate"), getMyInterviews);

export default router;
