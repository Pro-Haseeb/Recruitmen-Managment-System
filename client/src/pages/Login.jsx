import {
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import AuthLayout from "./AuthLayout";
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
      }

      else if (
        res.data.role === "company_admin" ||
        res.data.role === "hr"
      ) {
        navigate("/company");
      }

      else {
        navigate("/");
      }

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <AuthLayout>

      <Box
        sx={{
          width: "80%",
          maxWidth: "400px",
          background: "white",
          p: 4,
          borderRadius: 3,
        }}
      >

        <Typography
          variant="h4"
          fontWeight="bold"
          mb={3}
        >
          Login
        </Typography>

        <form onSubmit={handleLogin}>

          <TextField
            fullWidth
            label="Email"
            name="email"
            sx={{ mb: 2 }}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            sx={{ mb: 2 }}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
          >
            Login
          </Button>

        </form>

        <Typography mt={2}>
          Don't have an account?
          <Link to="/signup">
            Signup
          </Link>
        </Typography>

      </Box>

    </AuthLayout>
  );
}