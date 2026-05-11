import { useState } from "react";
import API from "../services/Api";

export default function Demo() {
  const [form, setForm] = useState({
    companyName: "",
    website: "",
    companySize: "",
    officialEmail: "",
    contactNumber: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    await API.post("/system/demo-request", form);

    alert("Demo request sent");
  };

  return (
    <form onSubmit={submit}>
      <h2>Company Demo</h2>

      <input name="companyName" placeholder="company name" onChange={handleChange} />
      <input name="website" placeholder="website" onChange={handleChange} />
      <input name="companySize" placeholder="company size" onChange={handleChange} />
      <input name="officialEmail" placeholder="official email" onChange={handleChange} />
      <input name="contactNumber" placeholder="contact number" onChange={handleChange} />

      <button>Submit</button>
    </form>
  );
}