import ExportLog from "../../models/Export.js";
import axios from "axios";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Interview from "../models/Interview.js";

/**
 * @route   POST /api/export/applications
 * @desc    Trigger export via n8n workflow
 */
export const exportApplications = async (req, res) => {
  try {
    const { status, jobId, minScore, dateFrom, dateTo } = req.body;

    // 1. Create export log first (queued state)
    const exportLog = await ExportLog.create({
      exportedBy: req.user._id,
      company: req.user.company,
      exportType: "applications",
      filters: {
        status,
        jobId,
        minScore,
        dateFrom,
        dateTo,
      },
      status: "queued",
      requestedAt: new Date(),
    });

    // 2. Call n8n webhook
    const payload = {
      exportId: exportLog._id,
      company: req.user.company,
      exportType: "applications",
      filters: exportLog.filters,
    };

    await axios.post(process.env.N8N_WEBHOOK_URL, payload);

    // 3. Response immediately
    return res.status(200).json({
      success: true,
      message: "Export started",
      exportId: exportLog._id,
    });

  } catch (error) {
    console.error("Export Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to start export",
    });
  }
};


/**
 * @route   POST /api/export/webhook
 * @desc    n8n sends result here
 */
export const exportWebhook = async (req, res) => {
  try {
    const {
      exportId,
      fileUrl,
      totalRecords,
      executionId,
      status,
      error,
    } = req.body;

    const exportLog = await ExportLog.findById(exportId);

    if (!exportLog) {
      return res.status(404).json({ message: "Export not found" });
    }

    exportLog.status = status || "completed";
    exportLog.fileUrl = fileUrl;
    exportLog.totalRecords = totalRecords;
    exportLog.executionId = executionId;
    exportLog.completedAt = new Date();

    if (error) {
      exportLog.status = "failed";
      exportLog.error = error;
    }

    await exportLog.save();

    return res.status(200).json({
      success: true,
      message: "Export updated",
    });

  } catch (error) {
    console.error("Webhook Error:", error);

    return res.status(500).json({
      success: false,
      message: "Webhook failed",
    });
  }
};

export const getExportData = async (req, res) => {
  try {
    const { type } = req.params;
    const { status, jobId, minScore, dateFrom, dateTo } = req.query;

    let filters = { company: req.user.company };

    if (status) filters.status = status;
    if (jobId) filters.job = jobId;
    if (minScore) filters.score = { $gte: minScore };

    if (dateFrom || dateTo) {
      filters.createdAt = {};
      if (dateFrom) filters.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filters.createdAt.$lte = new Date(dateTo);
    }

    let data = [];

    if (type === "applications") {
      data = await Application.find(filters)
        .populate("job", "title")
        .populate("candidate", "name email")
        .lean();
    }

    if (type === "jobs") {
      data = await Job.find({ company: req.user.company }).lean();
    }

    if (type === "interviews") {
      data = await Interview.find({ company: req.user.company }).lean();
    }

    return res.json({
      success: true,
      data
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch export data"
    });
  }
};