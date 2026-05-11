import {
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "./AuthLayout";
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

      alert(
        error.response?.data?.message || "Signup failed"
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
          Signup
        </Typography>

        <form onSubmit={handleSignup}>

          <TextField
            fullWidth
            label="Full Name"
            name="name"
            sx={{ mb: 2 }}
            onChange={handleChange}
          />

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

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            name="confirm"
            sx={{ mb: 2 }}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
          >
            Signup
          </Button>

        </form>

        <Typography mt={2}>
          Already have an account?
          <Link to="/login">
            Login
          </Link>
        </Typography>

      </Box>

    </AuthLayout>
  );
}