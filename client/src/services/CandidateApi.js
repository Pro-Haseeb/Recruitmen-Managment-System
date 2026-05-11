import API from "./Api";

export const getAllJobs = () =>
  API.get("/jobs/all");