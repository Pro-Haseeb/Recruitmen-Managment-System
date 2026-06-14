import API from "./Api";

export const applyJob = (data) =>
    API.post(
        "/application/apply",
        data,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );

export const getCompanyApplications = () =>
    API.get(
        "/application/company-applications"
    );

export const getJobRanking = (jobId) =>
    API.get(
        `/application/job-ranking/${jobId}`
    );

export const updateApplicationStatus = (id, status) =>
    API.patch(
        `/application/status/${id}`,
        { status }
    );