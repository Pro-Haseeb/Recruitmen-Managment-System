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