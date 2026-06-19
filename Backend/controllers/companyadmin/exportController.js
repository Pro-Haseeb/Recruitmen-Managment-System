import { Parser } from "json2csv";
import fs from "fs";
import path from "path";
import ExportLog from "../../models/Export.js";
import Application from "../../models/Application.js" ;

export const exportApplications = async (req, res) => {
  try {
    const { status, jobId, minScore, dateFrom, dateTo } = req.body;

    console.log(req.body);
    console.log(req.user);

    const exportLog = await ExportLog.create({
      exportedBy: req.user._id,
      company: req.user.company,
      exportType: "applications",
      filters: { status, jobId, minScore, dateFrom, dateTo },
      status: "processing",
      requestedAt: new Date(),
    });

    // 1. Build query
    let filters = { company: req.user.company };

    if (status) filters.status = status;
    if (jobId) filters.job = jobId;
    if (minScore) filters.score = { $gte: minScore };

    if (dateFrom || dateTo) {
      filters.createdAt = {};
      if (dateFrom) filters.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filters.createdAt.$lte = new Date(dateTo);
    }

    // 2. Fetch data
    const data = await Application.find(filters)
      .populate("job", "title")
      .populate("candidate", "name email")
      .lean();
    console.log("Export data:", data);
    console.log("Data length:", data.length);

    // 3. Transform data for CSV export
    const transformedData = data.map(app => ({
      candidateName: app.candidate?.name || "N/A",
      candidateEmail: app.candidate?.email || "N/A",
      jobTitle: app.job?.title || "N/A",
      status: app.status || "N/A",
      score: app.score || 0,
      appliedDate: app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"
    }));

    console.log("Transformed data:", transformedData);

    // Check if transformed data is empty
    if (transformedData.length === 0) {
      exportLog.status = "completed";
      exportLog.totalRecords = 0;
      exportLog.completedAt = new Date();
      await exportLog.save();

      return res.json({
        success: true,
        exportId: exportLog._id,
        fileUrl: null,
        totalRecords: 0,
        message: "No applications found matching your filters"
      });
    }

    // 3. Convert to CSV with field definitions
    const fields = ["candidateName", "candidateEmail", "jobTitle", "status", "score", "appliedDate"];
    const parser = new Parser({ fields });
    
    let csv;
    try {
      csv = parser.parse(transformedData);
    } catch (parseError) {
      console.error("CSV Parse Error:", parseError);
      exportLog.status = "failed";
      exportLog.completedAt = new Date();
      await exportLog.save();
      
      return res.status(400).json({
        success: false,
        message: "Failed to convert data to CSV"
      });
    }

    // 4. Ensure uploads directory exists
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads", { recursive: true });
    }

    // 5. Save file locally
    const fileName = `export_${Date.now()}.csv`;
    const filePath = path.join("uploads", fileName);

    try {
      fs.writeFileSync(filePath, csv, { encoding: "utf-8" });
    } catch (writeError) {
      console.error("File Write Error:", writeError);
      exportLog.status = "failed";
      exportLog.completedAt = new Date();
      await exportLog.save();
      
      return res.status(500).json({
        success: false,
        message: "Failed to save export file"
      });
    }

    // 6. Update ExportLog
    exportLog.status = "completed";
    exportLog.fileUrl = `/uploads/${fileName}`;
    exportLog.totalRecords = data.length;
    exportLog.completedAt = new Date();

    await exportLog.save();

    return res.json({
      success: true,
      exportId: exportLog._id,
      fileUrl: exportLog.fileUrl,
      totalRecords: data.length
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Export failed"
    });
  }
};

export const getExportHistory = async (req, res) => {
  try {
    console.log("Fetching export history for company:", req.user.company);
    const exports = await ExportLog.find({
      company: req.user.company
    }).sort({ createdAt: -1 });

    console.log("Found exports:", exports.length);
    console.log("Exports:", exports);

    return res.json({
      success: true,
      data: exports
    });

  } catch (error) {
    console.error("Error fetching export history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch export history"
    });
  }
};

export const downloadExport = (req, res) => {
  const filePath = `uploads/${req.params.file}`;

  return res.download(filePath);
};