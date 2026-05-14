import API from "./Api";

export const getAllJobs = () =>
  API.get("/jobs/all");

export const getSingleJob = (id) =>
  API.get(`/jobs/${id}`);