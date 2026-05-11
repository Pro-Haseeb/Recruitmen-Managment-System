import { useEffect, useState } from "react";

import {
  getHRs,
  createHR,
  deleteHR,
} from "../../services/CompanyApi.js";

const TeamManagement = () => {
  const [hrs, setHrs] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // FETCH HRs
  const fetchHRs = async () => {
    try {
      const res = await getHRs();
      setHrs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHRs();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // CREATE HR
  const handleCreateHR = async (e) => {
    e.preventDefault();

    try {
      await createHR(formData);

      alert("HR Created Successfully");

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      fetchHRs();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // DELETE HR
  const handleDeleteHR = async (id) => {
    try {
      await deleteHR(id);

      alert("HR Deleted");

      fetchHRs();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>

      <h1>Team Management</h1>

      <h3>Total HRs: {hrs.length} / 3</h3>

      {/* CREATE HR FORM */}

      <form onSubmit={handleCreateHR}>

        <input
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <br />
        <br />

        <button
          type="submit"
          disabled={hrs.length >= 3}
        >
          Add HR
        </button>

      </form>

      <hr />

      {/* HR LIST */}

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {hrs.map((hr) => (
            <tr key={hr._id}>

              <td>{hr.name}</td>

              <td>{hr.email}</td>

              <td>{hr.role}</td>

              <td>
                <button onClick={() => handleDeleteHR(hr._id)}>
                  Delete
                </button>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default TeamManagement;