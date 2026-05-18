import API from "./Api";

export const getDemoRequests = () => API.get("/system/demo-requests");

export const requestDemo = (data) => API.post("/system/demo-request", data)

export const updateDemoStatus = (id, status) => API.patch(`/system/demo/status/${id}`, { status });

export const companiesData = () => API.get("/system/companies");

export const toggleCompanyStatus = (id) => API.put(`/system/companies/toggle-status/${id}`);

// Users
export const getAllUsers = () => API.get("/system/users/all");
export const blockUser = (id) => API.put(`/system/users/block/${id}`);
export const unblockUser = (id) => API.put(`/system/users/unblock/${id}`);
export const getSingleUser = (id) => API.get(`/system/users/${id}`);