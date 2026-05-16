import { useEffect, useState } from "react";
import { getAllJobs } from "../../services/CandidateApi";
import { useNavigate } from "react-router-dom";
import JobList from "../../components/JobList";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      setJobs([]);
    }
  };

  return (
    <div style={{ padding: 24, background: "#020617", minHeight: "100vh" }}>
      <h2 style={{ color: "#ffffff", marginBottom: 16 }}>All Jobs</h2>
      <JobList
        jobs={jobs}
        onView={(job) => navigate(`jobs/${job._id}`)}
      />
    </div>
  );
};

export default AllJobs;