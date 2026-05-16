import { detailJob } from "../../controllers/candidate/detailJobController.js";
import express from 'express';

const router = express.Router();

router.get("/:id", detailJob);

export default router;