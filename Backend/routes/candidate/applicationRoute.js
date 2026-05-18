import express from "express";

import {
    applyJob,
    getCompanyApplications,
} from "../../controllers/candidate/applicationController.js";

import {
    protect,
} from "../../middlewares/authMiddleware.js";

import {
    authorizeRoles,
} from "../../middlewares/roleMiddleware.js";

import upload from "../../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post(
    "/apply",
    protect,
    authorizeRoles("candidate"),
    upload.single("resume"),
    applyJob
);

router.get(
    "/company-applications",
    protect,
    authorizeRoles(
        "company_admin",
        "hr"
    ),
    getCompanyApplications
);

export default router;