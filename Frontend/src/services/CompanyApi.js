import API from "./Api";

export const getHRs = () => API.get("/company/all");

export const createHR = (data) => API.post("/company/create", data);

export const deleteHR = (id) => API.delete(`/company/${id}`);

export const createJob = (data) => API.post("/jobs/create", data);

export const updateJobCriteria = (jobId, criteriaWeights) => 
    API.put(`/jobs/${jobId}/criteria`, { criteriaWeights });

// Export APIs
export const exportApplications = (filters) =>
    API.post("/company/export/applications", filters);

export const getExportHistory = () =>
    API.get("/company/export/history");

export const downloadExportFile = async (fileName) => {
    const axiosInstance = API;
    axiosInstance.defaults.responseType = "blob";
    try {
        return await axiosInstance.post("/company/export/download", { file: fileName });
    } finally {
        axiosInstance.defaults.responseType = "json";
    }
};

// Activity Log APIs
export const logActivity = (action, entityType, entityId, details) =>
    API.post("/company/activity/log", { action, entityType, entityId, details });

export const getCompanyActivityLogs = () =>
    API.get("/company/activity/logs");

export const getActivityStats = () =>
    API.get("/company/activity/stats");


//Interview APIS
export const getInterviewers = () =>
    API.get("/interview/interviewers");

export const scheduleInterview = (applicationId, interviewer, interviewDate, interviewType)=>API.post("/interview/schedule", {
    applicationId, interviewer, interviewDate, interviewType
})

export const getInterview = () =>
    API.get("/interview");

export const updateInterview = (interviewId, feedback, result) =>
    API.put(`/interview/${interviewId}`, {feedback, result});

export const deleteInterview = (interviewId) =>
    API.delete(`/interview/${interviewId}`);