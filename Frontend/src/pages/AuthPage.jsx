import {
  Box,
  TextField,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  IconButton,
  Link
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser, loginUser } from "../services/AuthApi";
import Navbar from "../layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
  AutoAwesome,
  Speed,
  Analytics
} from "@mui/icons-material";

const images = [
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80"
];

const features = [
  {
    title: "AI-Powered Matching",
    description: "Our advanced algorithms find the perfect candidate in seconds, reducing time-to-hire by up to 60%.",
    icon: AutoAwesome,
    badge: "98% Match Rate"
  },
  {
    title: "Streamlined Workflows",
    description: "Automate tedious screening tasks and focus on what matters most: building your world-class team.",
    icon: Speed,
    badge: "3x Faster Hires"
  },
  {
    title: "Data-Driven Insights",
    description: "Make informed, unbiased hiring decisions with real-time analytics and comprehensive reporting.",
    icon: Analytics,
    badge: "Smart Decisions"
  }
];

export default function AuthPage() {
  const [imageIndex, setImageIndex] = useState(0);
  const [tab, setTab] = useState("login");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await signupUser({
        name: form.name,
        email: form.email,
        password: form.password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/Candidate");
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await loginUser({
        email: form.email,
        password: form.password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      if (res.data.role === "company_admin" || res.data.role === "hr") {
        navigate("/company");
      } else if (res.data.role === "system_owner") {
        navigate("/admin");
      } else {
        navigate("/jobs");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const glassInputStyle = {
    input: { color: "#fff" },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(10px)",
      borderRadius: "12px",
      transition: "all 0.3s ease",
      "& fieldset": { borderColor: "rgba(255,255,255,0.1)", transition: "all 0.3s ease" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
      "&.Mui-focused": {
        backgroundColor: "rgba(255,255,255,0.06)",
        "& fieldset": { borderColor: "#3b82f6", borderWidth: "1px" },
        boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)"
      }
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
          bgcolor: "#020617",
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Left Side - Animated Branding */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            height: { xs: "30vh", md: "100vh" },
            position: "relative",
            overflow: "hidden"
          }}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={imageIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${images[imageIndex]})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
          </AnimatePresence>

          {/* Deep overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(2,6,23,0.92) 0%, rgba(15,23,42,0.75) 100%)",
              backdropFilter: "blur(4px)",
              zIndex: 1
            }}
          />

          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "white",
              textAlign: "left",
              p: { xs: 4, md: 8 }
            }}
          >


            <Box sx={{ width: "100%", maxWidth: "500px" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={imageIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {/* Floating Badge */}
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 2,
                      py: 1,
                      borderRadius: "20px",
                      background: "rgba(59, 130, 246, 0.15)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      mb: 3,
                      backdropFilter: "blur(10px)"
                    }}
                  >
                    <Typography variant="body2" fontWeight="600" sx={{ color: "#60a5fa" }}>
                      {features[imageIndex].badge}
                    </Typography>
                  </Box>

                  {/* Dynamic Content */}
                  <Typography variant="h3" fontWeight="800" sx={{ mb: 2, lineHeight: 1.2, color: "#f8fafc" }}>
                    {features[imageIndex].title}
                  </Typography>

                  <Typography variant="h6" sx={{ color: "#94a3b8", mb: 5, lineHeight: 1.6, fontWeight: 400 }}>
                    {features[imageIndex].description}
                  </Typography>

                  {/* Feature Icon Card (Glassmorphism) */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      p: 3,
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "20px",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "16px",
                        background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.2))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {(() => {
                        const IconComponent = features[imageIndex].icon;
                        return <IconComponent sx={{ fontSize: 32, color: "#60a5fa" }} />;
                      })()}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="700" sx={{ color: "#e2e8f0" }}>
                        Enterprise Grade
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        Built for modern HR teams.
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </AnimatePresence>

              {/* Pagination Dots */}
              <Box sx={{ display: "flex", gap: 1, mt: 6 }}>
                {features.map((_, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: idx === imageIndex ? "24px" : "8px",
                      height: "8px",
                      borderRadius: "4px",
                      background: idx === imageIndex ? "#3b82f6" : "rgba(255,255,255,0.2)",
                      transition: "all 0.3s ease"
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right Side - Auth Form */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            height: { xs: "auto", md: "100vh" },
            minHeight: { xs: "70vh", md: "100vh" },
            display: "flex",
            flexDirection: "column",
            position: "relative",
            background: "radial-gradient(circle at center, #0f172a 0%, #020617 100%)",
            overflowY: "auto",
            px: 2,
            pt: { xs: 12, md: 12 }, // Padding for Navbar on all screens
            pb: 4
          }}
        >
          {/* Glow Effects */}
          <Box
            sx={{
              position: "absolute",
              top: "20%",
              right: "20%",
              width: "300px",
              height: "300px",
              background: "rgba(59, 130, 246, 0.15)",
              filter: "blur(100px)",
              borderRadius: "50%",
              zIndex: 0
            }}
          />

          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            sx={{
              width: "100%",
              maxWidth: "460px",
              m: "auto", // Automatically centers vertically and horizontally in a column flexbox
              my: { xs: 4, md: "auto" }, // Prevent form from touching the edges when scrolling
              p: { xs: 4, md: 5 },
              position: "relative",
              zIndex: 1,
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              border: "1px solid rgba(255,255,255,0.05)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              color: "white"
            }}
          >
            <ToggleButtonGroup
              value={tab}
              exclusive
              onChange={(e, val) => {
                if (val) {
                  setTab(val);
                  setError("");
                  setForm({ name: "", email: "", password: "", confirm: "" });
                }
              }}
              fullWidth
              sx={{
                mb: 4,
                p: 0.5,
                background: "rgba(255,255,255,0.03)",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.05)",
                "& .MuiToggleButton-root": {
                  color: "#94a3b8",
                  border: "none",
                  borderRadius: "10px !important",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  py: 1.2,
                  transition: "all 0.3s ease"
                },
                "& .Mui-selected": {
                  background: "rgba(255,255,255,0.1) !important",
                  color: "#fff !important",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }
              }}
            >
              <ToggleButton value="login">Sign In</ToggleButton>
              <ToggleButton value="signup">Create Account</ToggleButton>
            </ToggleButtonGroup>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" fontWeight="700" sx={{ mb: 1, color: "#f8fafc" }}>
                {tab === "signup" ? "Get Started" : "Welcome Back"}
              </Typography>
              <Typography variant="body1" sx={{ color: "#94a3b8" }}>
                {tab === "signup"
                  ? "Join as a candidate to find your dream job."
                  : "Enter your credentials to access your account."}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <AnimatePresence mode="popLayout">
                {tab === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TextField
                      fullWidth
                      placeholder="Full Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      sx={glassInputStyle}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        )
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <TextField
                fullWidth
                placeholder="Email Address"
                name="email"
                value={form.email}
                onChange={handleChange}
                sx={glassInputStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                sx={glassInputStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "#64748b", "&:hover": { color: "#cbd5e1" } }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <AnimatePresence mode="popLayout">
                {tab === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TextField
                      fullWidth
                      placeholder="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm"
                      value={form.confirm}
                      onChange={handleChange}
                      sx={glassInputStyle}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              sx={{ color: "#64748b", "&:hover": { color: "#cbd5e1" } }}
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {tab === "login" && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1 }}>
                  <Link
                    href="#"
                    underline="hover"
                    sx={{
                      color: "#60a5fa",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      transition: "color 0.2s",
                      "&:hover": { color: "#93c5fd" }
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>
              )}

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Typography
                      color="error"
                      sx={{
                        fontSize: "0.875rem",
                        background: "rgba(239, 68, 68, 0.1)",
                        p: 1.5,
                        borderRadius: "8px",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      {error}
                    </Typography>
                  </motion.div>
                )}
              </AnimatePresence>

              <Box component={motion.div} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} sx={{ mt: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "1rem",
                    py: 1.5,
                    borderRadius: "12px",
                    textTransform: "none",
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                      boxShadow: "0 15px 30px -5px rgba(59, 130, 246, 0.6)"
                    },
                    "&.Mui-disabled": {
                      background: "rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.3)"
                    }
                  }}
                  onClick={tab === "signup" ? handleSignup : handleLogin}
                >
                  {isLoading ? "Please wait..." : tab === "signup" ? "Create Account" : "Sign In"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
