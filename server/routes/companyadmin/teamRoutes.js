import express from "express";
import {
  createHR,
  getAllHRs,
  deleteHR,
} from "../../controllers/companyadmin/teamController.js";

import { protect } from "../../middlewares/authMiddleware.js";
import { authorizeRoles } from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/create", protect, authorizeRoles("company_admin"), createHR);

router.get("/all", protect, authorizeRoles("company_admin"), getAllHRs);

router.delete("/:id", protect, authorizeRoles("company_admin"), deleteHR);

export default router;