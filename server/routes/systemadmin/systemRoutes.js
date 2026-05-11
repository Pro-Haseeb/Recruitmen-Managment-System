import express from "express";
import {
  createDemoRequest,
  getAllDemoRequests,
  updateDemoStatus
} from "../../controllers/systemadmin/demoController.js";

const router = express.Router();

// public (company fills form)
router.post("/demo-request", createDemoRequest);

// admin/system owner (later protect lagayega)
router.get("/demo-requests", getAllDemoRequests);
router.patch("/demo/status/:id", updateDemoStatus);

export default router;