import express from "express";
import { exportApplications, exportWebhook, getExportData } from "../../controllers/companyadmin/exportController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/applications", protect, exportApplications);
router.get("/data/:type", protect, getExportData);
router.post("/webhook", exportWebhook);


export default router;