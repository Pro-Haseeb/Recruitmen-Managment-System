import express from "express";
import { exportApplications, getExportHistory, downloadExport} from "../../controllers/companyadmin/exportController.js";
import { protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/export/applications", protect, exportApplications);
router.get("/export/history", protect, getExportHistory);
router.get("/export/download", protect, downloadExport);


export default router;