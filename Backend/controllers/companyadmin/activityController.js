import ActivityLog from "../../models/ActivityLog.js";
import Application from "../../models/Application.js";
import Job from "../../models/Job.js";

/**
 * LOG ACTIVITY
 */
export const logActivity = async (req, res) => {
  try {
    const { action, entityType, entityId, details } = req.body;
    const user = req.user;

    const log = await ActivityLog.create({
      user: user._id,
      action,
      entityType,
      entityId,
      details,
    });

    res.status(201).json({
      message: "Activity logged successfully",
      log,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET COMPANY ACTIVITY LOGS (Only for company_admin)
 */
export const getCompanyActivityLogs = async (req, res) => {
  try {
    const user = req.user;

    // Only company_admin can view audit logs
    if (user.role !== "company_admin") {
      return res.status(403).json({
        message: "Only company admins can view audit activity",
      });
    }

    // Get all users in the company
    const { User } = await import("../../models/User.js");
    const companyUsers = await User.find({ company: user.company }).select("_id");
    const userIds = companyUsers.map((u) => u._id);

    // Get activity logs for this company's users
    const logs = await ActivityLog.find({ user: { $in: userIds } })
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      message: "Activity logs retrieved",
      count: logs.length,
      logs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ACTIVITY STATISTICS
 */
export const getActivityStats = async (req, res) => {
  try {
    const user = req.user;

    // Only company_admin can view stats
    if (user.role !== "company_admin") {
      return res.status(403).json({
        message: "Only company admins can view activity statistics",
      });
    }

    // Get all users in the company
    const { User } = await import("../../models/User.js");
    const companyUsers = await User.find({ company: user.company }).select("_id");
    const userIds = companyUsers.map((u) => u._id);

    // Get logs
    const allLogs = await ActivityLog.find({ user: { $in: userIds } })
      .populate("user", "name email role")
      .lean();

    // Calculate statistics
    const totalActivities = allLogs.length;
    const recentActivities = allLogs.slice(0, 10);
    
    const actionBreakdown = {};
    allLogs.forEach((log) => {
      actionBreakdown[log.action] = (actionBreakdown[log.action] || 0) + 1;
    });

    const entityBreakdown = {};
    allLogs.forEach((log) => {
      entityBreakdown[log.entityType] = (entityBreakdown[log.entityType] || 0) + 1;
    });

    res.json({
      totalActivities,
      recentActivities,
      actionBreakdown,
      entityBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
