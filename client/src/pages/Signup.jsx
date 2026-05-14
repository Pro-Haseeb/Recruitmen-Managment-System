import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// import AuthLayout from "./AuthLayout";
import API from "../services/Api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      if (form.password !== form.confirm) {
        return alert("Passwords do not match");
      }

      await API.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      alert("Signup successful");

      navigate("/login");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (

      <div>
        <h2>Signup</h2>

        <form onSubmit={handleSignup}>
          <div>
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
            />
          </div>

          <button type="submit">
            Signup
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
   
  );
}