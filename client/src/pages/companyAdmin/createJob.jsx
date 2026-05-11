import { useState } from "react";
import { createJob } from "../../services/CompanyApi";

const CreateJob = () => {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    deadline: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await createJob(formData);

      alert(res.data.message);

      setFormData({
        title: "",
        description: "",
        location: "",
        salary: "",
      });

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Failed"
      );
    }
  };

  return (
    <div>

      <h1>Create Job</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Job Title</label>
          <br />

          <input
            type="text"
            name="title"
            placeholder="Enter job title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />

          <textarea
            name="description"
            placeholder="Enter description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Location</label>
          <br />

          <input
            type="text"
            name="location"
            placeholder="Enter location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Salary</label>
          <br />

          <input
            type="text"
            name="salary"
            placeholder="Enter salary"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>

        <br />


    <div>
          <label>Deadline</label>
          <br />

          <input
            type="date"
            name="deadline"
            placeholder="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
        </div>

        <br />
        

        <button type="submit">
          Create Job
        </button>

      </form>

    </div>
  );
};

export default CreateJob;