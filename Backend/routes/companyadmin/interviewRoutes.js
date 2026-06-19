import express from "express";
import {
  scheduleInterview,
  getInterviews,
  getInterviewers,
  updateInterview,
  deleteInterview
} from "../../controllers/companyadmin/interviewController.js";

import {protect} from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/schedule", protect, scheduleInterview);

router.get("/interviewers", protect, getInterviewers);

router.get("/", protect, getInterviews);

router.put("/:id", protect, updateInterview);

router.delete("/:id", protect, deleteInterview);

export default router;