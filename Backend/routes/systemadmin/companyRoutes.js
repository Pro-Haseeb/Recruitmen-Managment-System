import express from "express";
import { getAllCompanies, toggleCompanyStatus } from "../../controllers/systemadmin/companyController.js";

const router = express.Router();

router.get("/companies", getAllCompanies);
router.put('/companies/toggle-status/:id', toggleCompanyStatus);

export default router;