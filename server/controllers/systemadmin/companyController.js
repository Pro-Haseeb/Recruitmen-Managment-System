import Company from "../../models/company.js";

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });

    res.json(companies);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const toggleCompanyStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // toggle status
    company.isBlocked = !company.isBlocked;

    await company.save();

    res.status(200).json({
      message: company.isBlocked
        ? "Company blocked successfully"
        : "Company unblocked successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};