import API from "./Api";

export const getDemoRequests = () =>  API.get("/system/demo-requests");

export const updateDemoStatus = (id, status)=>  API.patch(`/system/demo/status/${id}`, {status} );

export const companiesData = () => API.get("/system/companies");

export const toggleCompanyStatus = (id) => API.put(`/system/companies/toggle-status/${id}`);