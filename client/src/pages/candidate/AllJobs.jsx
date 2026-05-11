import { useEffect, useState } from "react";
import { getAllJobs } from "../../services/CandidateApi";

const Jobs = () => {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();
      setJobs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>

      <h2>All Jobs</h2>

      {jobs.map((job) => (
        <div key={job._id} style={{ border: "1px solid black", margin: 10, padding: 10 }}>

          <h3>{job.title}</h3>

          <p>{job.description}</p>

          <p>Location: {job.location}</p>

          <p>Salary: {job.salary}</p>

          <p>Company: {job.company?.name}</p>

          <button>Apply</button>

        </div>
      ))}

    </div>
  );
};

export default Jobs;