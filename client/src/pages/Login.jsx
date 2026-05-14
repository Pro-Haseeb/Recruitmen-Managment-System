import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// import AuthLayout from "./AuthLayout";
import API from "../services/Api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      if (res.data.role === "System_Owner") {
        navigate("/admin/demo-requests");
      } else if (
        res.data.role === "company_admin" ||
        res.data.role === "hr"
      ) {
        navigate("/company");
      } else {
        navigate("/candidate");
      }
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
  
      <div>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
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

          <button type="submit">
            Login
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    
  );
}