import API from "./Api";

export const getHRs = () => API.get("/company/all");

export const createHR = (data) => API.post("/company/create", data);

export const deleteHR = (id) => API.delete(`/company/${id}`);

export const createJob = (data) => API.post("/job/create", data);