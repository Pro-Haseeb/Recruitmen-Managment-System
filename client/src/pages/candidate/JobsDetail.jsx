import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getSingleJob } from "../../services/CandidateApi";

const JobsDetails = () => {

  const { id } = useParams();

  const [job, setJob] = useState(null);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {

      const res = await getSingleJob(id);

      setJob(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  if (!job) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>

      <h1>{job.title}</h1>

      <p>
        <strong>Company:</strong>
        {job.company?.name}
      </p>

      <p>
        <strong>Location:</strong>
        {job.location}
      </p>

      <p>
        <strong>Salary:</strong>
        {job.salary}
      </p>

      <p>
        <strong>Status:</strong>
        {job.status}
      </p>

      <p>
        <strong>Description:</strong>
      </p>

      <p>{job.description}</p>

      <button>
        Final Apply
      </button>

    </div>
  );
};

export default JobsDetails;