import API from "./Api";

export const getHRs = () => API.get("/company/all");

export const createHR = (data) => API.post("/company/create", data);

export const deleteHR = (id) => API.delete(`/company/${id}`);

export const createJob = (data) => API.post("/jobs/create", data);

export const updateJobCriteria = (jobId, criteriaWeights) => 
    API.put(`/jobs/${jobId}/criteria`, { criteriaWeights });

// Export APIs
export const exportApplications = (applicationIds) =>
    API.post("/company/export", { applicationIds });

export const getExportHistory = () =>
    API.get("/company/export/history");

export const getExportStats = () =>
    API.get("/company/export/stats");

// Activity Log APIs
export const logActivity = (action, entityType, entityId, details) =>
    API.post("/company/activity/log", { action, entityType, entityId, details });

export const getCompanyActivityLogs = () =>
    API.get("/company/activity/logs");

export const getActivityStats = () =>
    API.get("/company/activity/stats");