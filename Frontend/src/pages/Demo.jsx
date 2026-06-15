import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  AppBar,
  Toolbar,
  InputAdornment,
  Select,
  MenuItem,
  Grid
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { requestDemo } from "../services/AdminApi";

export default function RequestDemo() {
  const navigate = useNavigate();

  // FORM STATE
  const [form, setForm] = useState({
    company: "",
    website: "",
    size: "",
    email: "",
    phone: "",
    countryCode: "+92"
  });

  const countryCodes = [
    { code: "+92", label: "Pakistan" },
    { code: "+91", label: "India" },
    { code: "+1", label: "USA" },
    { code: "+44", label: "UK" },
    { code: "+971", label: "UAE" }
  ];

  // ✅ SUGGESTIONS STATE
  const [suggestions, setSuggestions] = useState({});

  // ✅ SUBMIT HANDLER (top-level so button's onClick can access it)
  const handleReqeustDemo = async () => {
    try {
      // Map form field names to what the backend expects
      const payload = {
        companyName: form.company,
        website: form.website,
        companySize: form.size,
        officialEmail: form.email,
        contactNumber: form.countryCode + form.phone
      };

      const res = await requestDemo(payload);
      console.log(res.data);
      alert("Demo requested successfully!")
      navigate("/demo");
    } catch (error) {
      console.log(error);

        if (
      error.response?.status === 400 
    ) {
      alert("This email has already been used for a demo request.");
    } else {
      alert("Something went wrong. Please try again.");
    }
    }
  };

  // ✅ LIVE CHECK FUNCTION
  const handleLiveCheck = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    let msg = "";

    if (name === "company") {
      if (value.length > 0 && value.length < 3)
        msg = "Company name too short";
    }

    if (name === "website") {
      if (value && !value.includes(".") && !value.includes("www"))
        msg = "Invalid website format (example.com)";
    }

    if (name === "email") {
      if (value && !/\S+@\S+\.\S+/.test(value))
        msg = "Invalid email format";
    }

    if (name === "phone") {
      if (value && !/^\d*$/.test(value))
        msg = "Only numbers allowed";
    }

    setSuggestions({ ...suggestions, [name]: msg });
  };

  return (
    <>
      {/* MAIN BG */}
      <Box
        sx={{
          background: "#020617",
          minHeight: "100vh",
          color: "white"
        }}
      >

        <Box
          sx={{
            py: 14,
            textAlign: "center",
            color: "white",
            position: "relative",
            overflow: "hidden",
            backgroundImage:
              "url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d)",
            backgroundSize: "cover",
            backgroundPosition: "center",

            "@keyframes fadeUp": {
              from: { opacity: 0, transform: "translateY(40px)" },
              to: { opacity: 1, transform: "translateY(0)" }
            }
          }}
        >
          {/* OVERLAY */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(2,6,23,0.96), rgba(15,23,42,0.88))"
            }}
          />

          {/* BLOBS */}
          <Box
            sx={{
              position: "absolute",
              width: 250,
              height: 250,
              background: "#42a5f5",
              borderRadius: "50%",
              filter: "blur(120px)",
              top: 50,
              left: -80,
              opacity: 0.5
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 250,
              height: 250,
              background: "#1976d2",
              borderRadius: "50%",
              filter: "blur(120px)",
              bottom: 50,
              right: -80,
              opacity: 0.5
            }}
          />

          {/* CONTENT */}
          <Box
            sx={{
              position: "relative",
              maxWidth: 700,
              mx: "auto",
              animation: "fadeUp 1s ease"
            }}
          >
            <Typography
              sx={{
                background: "rgba(66,165,245,0.12)",
                border: "1px solid rgba(255,255,255,0.08)",
                px: 3,
                py: 1,
                borderRadius: "20px",
                display: "inline-block",
                mb: 3,
                color: "#90caf9"
              }}
            >
              AI-Powered Platform
            </Typography>

            <Typography variant="h3" fontWeight="bold">
              Request a Demo
            </Typography>

            <Typography mt={2} fontSize="18px" color="#cbd5e1">
              See how RecruitAI can transform your hiring process.
            </Typography>

            {/* BUTTONS */}
            <Box
              mt={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "20px"
              }}
            >

              {/* GET DEMO */}
              <Button
                variant="contained"
                size="large"
                sx={{
                  minWidth: "180px",
                  px: 4,
                  py: 1.2,
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg,#1976d2,#42a5f5)",
                  color: "#fff",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#1565c0,#1e88e5)",
                    transform: "translateY(-3px) scale(1.05)",
                    boxShadow:
                      "0 10px 25px rgba(66,165,245,0.4)"
                  }
                }}
              >
                Get Demo
              </Button>

              {/* LEARN MORE */}
              <Button
                variant="outlined"
                size="large"
                sx={{
                  minWidth: "180px",
                  px: 4,
                  py: 1.2,
                  borderRadius: "14px",
                  borderColor: "#42a5f5",
                  color: "#90caf9",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",

                  "&:hover": {
                    background: "rgba(66,165,245,0.1)",
                    borderColor: "#90caf9",
                    color: "#fff",
                    transform: "translateY(-3px) scale(1.05)",
                    boxShadow:
                      "0 10px 25px rgba(66,165,245,0.25)"
                  }
                }}
              >
                Learn More
              </Button>
            </Box>
          </Box>
        </Box>

        {/* WHAT YOU GET */}
        <Box
          sx={{
            textAlign: "center",
            mt: 8,
            mb: 2,
            animation: "fadeUp 1s ease"
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="white">
            What you'll get in the demo
          </Typography>

          <Typography color="#94a3b8" mt={1}>
            Our product specialists will walk you through a live demo tailored to your company.
          </Typography>
        </Box>

        {/* GREEN CARD */}
        <Container sx={{ mt: 4, mb: 6 }}>
          <Box
            sx={{
              p: 4,
              borderRadius: "25px",
              background:
                "linear-gradient(135deg,#0f172a,#111827)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "white",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.25)",
              textAlign: "center",
              transition: "0.3s",

              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow:
                  "0 20px 40px rgba(66,165,245,0.18)"
              }
            }}
          >
            <Typography
              fontWeight="bold"
              fontSize="18px"
              color="#42a5f5"
            >
              Trusted by 500+ companies
            </Typography>

            <Typography variant="body2" mt={1} color="#cbd5e1">
              From startups to Fortune 500 enterprises, RecruitAI helps teams hire 3x faster.
            </Typography>
          </Box>
        </Container>

        {/* MAIN SECTION */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            py: 10,
            background:
              "linear-gradient(180deg,#020617,#0f172a)"
          }}
        >

          {/* FORM */}
          <Container maxWidth="md">
            <Paper
              sx={{
                p: 5,
                borderRadius: "28px",
                background:
                  "rgba(15,23,42,0.9)",
                backdropFilter: "blur(18px)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "0 25px 60px rgba(0,0,0,0.45)"
              }}
            >

              <Typography
                variant="h5"
                fontWeight="bold"
                textAlign="center"
                sx={{
                  mb: 5,
                  color: "#fff",
                  letterSpacing: "1px",
                  textShadow: "0 0 12px rgba(255,255,255,0.25)"
                }}
              >
                Company Details
              </Typography>s

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                {/* COMPANY */}
                <TextField
                  label="Company Name"
                  name="company"
                  value={form.company}
                  onChange={handleLiveCheck}
                  error={!!suggestions.company}
                  helperText={suggestions.company}
                  fullWidth
                  InputLabelProps={{
                    style: { color: "#94a3b8" }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      borderRadius: "14px",

                      "& fieldset": {
                        borderColor: "rgba(255,255,255,0.15)"
                      },

                      "&:hover fieldset": {
                        borderColor: "#42a5f5"
                      },

                      "&.Mui-focused fieldset": {
                        borderColor: "#42a5f5"
                      }
                    }
                  }}
                />

                {/* WEBSITE */}
                <TextField
                  label="Website"
                  name="website"
                  value={form.website}
                  onChange={handleLiveCheck}
                  error={!!suggestions.website}
                  helperText={suggestions.website}
                  fullWidth
                  InputLabelProps={{
                    style: { color: "#94a3b8" }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      borderRadius: "14px",

                      "& fieldset": {
                        borderColor: "rgba(255,255,255,0.15)"
                      },

                      "&:hover fieldset": {
                        borderColor: "#42a5f5"
                      },

                      "&.Mui-focused fieldset": {
                        borderColor: "#42a5f5"
                      }
                    }
                  }}
                />

                {/* SIZE */}
                <TextField
                  label="Company Size"
                  name="size"
                  value={form.size}
                  onChange={handleLiveCheck}
                  error={!!suggestions.size}
                  helperText={suggestions.size}
                  fullWidth
                  InputLabelProps={{
                    style: { color: "#94a3b8" }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      borderRadius: "14px",

                      "& fieldset": {
                        borderColor: "rgba(255,255,255,0.15)"
                      },

                      "&:hover fieldset": {
                        borderColor: "#42a5f5"
                      },

                      "&.Mui-focused fieldset": {
                        borderColor: "#42a5f5"
                      }
                    }
                  }}
                />

                {/* EMAIL */}
                <TextField
                  label="Work Email"
                  name="email"
                  value={form.email}
                  onChange={handleLiveCheck}
                  error={!!suggestions.email}
                  helperText={suggestions.email}
                  fullWidth
                  InputLabelProps={{
                    style: { color: "#94a3b8" }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      borderRadius: "14px",

                      "& fieldset": {
                        borderColor: "rgba(255,255,255,0.15)"
                      },

                      "&:hover fieldset": {
                        borderColor: "#42a5f5"
                      },

                      "&.Mui-focused fieldset": {
                        borderColor: "#42a5f5"
                      }
                    }
                  }}
                />

                {/* PHONE */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border:
                      "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "14px",
                    px: 1.5,
                    py: 1.2,
                    transition: "0.3s",
                    background:
                      "rgba(255,255,255,0.03)",

                    "&:focus-within": {
                      borderColor: "#42a5f5",
                      boxShadow:
                        "0 0 0 2px rgba(66,165,245,0.15)"
                    }
                  }}
                >

                  {/* COUNTRY CODE */}
                  <select
                    value={form.countryCode}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        countryCode: e.target.value
                      })
                    }
                    style={{
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontSize: "14px",
                      cursor: "pointer",
                      paddingRight: "8px",
                      color: "#fff",
                      minWidth: "75px"
                    }}
                  >
                    {countryCodes.map((item, i) => (
                      <option
                        key={i}
                        value={item.code}
                        style={{
                          background: "#0f172a",
                          color: "#fff"
                        }}
                      >
                        {item.code}
                      </option>
                    ))}
                  </select>

                  {/* DIVIDER */}
                  <span
                    style={{
                      color: "#475569",
                      marginRight: "10px",
                      marginLeft: "5px",
                      fontSize: "18px"
                    }}
                  >
                    |
                  </span>

                  {/* PHONE INPUT */}
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleLiveCheck}
                    placeholder="Phone number"
                    style={{
                      border: "none",
                      outline: "none",
                      flex: 1,
                      fontSize: "15px",
                      color: "#fff",
                      background: "transparent"
                    }}
                  />
                </Box>

                {/* ERROR MESSAGE */}
                {suggestions.phone && (
                  <Typography
                    sx={{
                      color: "#ef4444",
                      fontSize: "12px",
                      mt: 0.5,
                      ml: 1
                    }}
                  >
                    {suggestions.phone}
                  </Typography>
                )}
              </Box>

              <Button
                variant="contained"
                onClick={handleReqeustDemo}
                fullWidth
                sx={{
                  mt: 4,
                  py: 1.6,
                  borderRadius: "14px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  background:
                    "linear-gradient(135deg,#1976d2,#42a5f5)",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#1565c0,#1e88e5)",
                    transform: "translateY(-2px)",
                    boxShadow:
                      "0 10px 25px rgba(66,165,245,0.35)"
                  }
                }}
              >
                Submit Request
              </Button>
            </Paper>
          </Container>
        </Box>
        {/* 🔵 PREMIUM FOOTER */}
        <Box
          sx={{
            background:
              "linear-gradient(180deg, #020617 0%, #0f172a 50%, #111827 100%)",
            color: "#cbd5e1",
            pt: 10,
            pb: 4,
            position: "relative",
            overflow: "hidden",
            borderTop: "1px solid rgba(255,255,255,0.08)"
          }}
        >

          {/* FLOATING PARTICLES */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              zIndex: 0
            }}
          >
            {[...Array(15)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  width: `${6 + i}px`,
                  height: `${6 + i}px`,
                  borderRadius: "50%",
                  background: "rgba(66,165,245,0.12)",
                  left: `${i * 7}%`,
                  top: `${(i * 13) % 100}%`,
                  filter: "blur(2px)",
                  animation: `floatParticle ${8 + i}s linear infinite`
                }}
              />
            ))}
          </Box>

          {/* BACKGROUND GLOWS */}
          <Box
            sx={{
              position: "absolute",
              top: -120,
              left: -120,
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: "rgba(25,118,210,0.12)",
              filter: "blur(100px)"
            }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: -120,
              right: -120,
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: "rgba(66,165,245,0.12)",
              filter: "blur(100px)"
            }}
          />

          {/* GRID PATTERN */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
              opacity: 0.15
            }}
          />

          <Container
            maxWidth="xl"
            sx={{
              position: "relative",
              zIndex: 2
            }}
          >

            {/* MAIN GRID */}
            <Grid
              container
              spacing={6}
              alignItems="flex-start"
              justifyContent="space-between"
            >

              {/* LEFT BRAND */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    animation: "fadeUp 0.8s ease"
                  }}
                >

                  {/* LOGO */}
                  <Box display="flex" alignItems="center" mb={3}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "18px",
                        background:
                          "linear-gradient(135deg,#1976d2,#42a5f5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: "22px",
                        mr: 2,
                        boxShadow: "0 12px 35px rgba(25,118,210,0.35)",
                        animation: "pulseGlow 3s infinite",
                        transition: "0.4s ease",

                        "&:hover": {
                          transform: "translateY(-6px) rotate(-2deg)",
                          boxShadow:
                            "0 20px 50px rgba(25,118,210,0.45)"
                        }
                      }}
                    >
                      AI
                    </Box>

                    <Box>
                      <Typography
                        variant="h5"
                        fontWeight="900"
                        sx={{
                          background:
                            "linear-gradient(135deg,#fff,#90caf9)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent"
                        }}
                      >
                        RecruitAI
                      </Typography>

                      <Typography
                        sx={{
                          color: "#94a3b8",
                          fontSize: "14px"
                        }}
                      >
                        AI Recruitment Platform
                      </Typography>
                    </Box>
                  </Box>

                  {/* DESC */}
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      lineHeight: 2,
                      maxWidth: "350px"
                    }}
                  >
                    Smart hiring software powered by artificial intelligence.
                    Automate recruitment workflows, screen candidates,
                    and hire top talent faster.
                  </Typography>

                  {/* STATS */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 5,
                      mt: 5,
                      flexWrap: "wrap",
                      p: 2,
                      borderRadius: "20px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      backdropFilter: "blur(12px)"
                    }}
                  >
                    {[
                      ["10K+", "Companies"],
                      ["95%", "Success"],
                      ["24/7", "AI Support"]
                    ].map((item, i) => (
                      <Box key={i}>
                        <Typography
                          sx={{
                            color: "#42a5f5",
                            fontSize: "24px",
                            fontWeight: 900
                          }}
                        >
                          {item[0]}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#94a3b8",
                            fontSize: "13px"
                          }}
                        >
                          {item[1]}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>

              {/* CENTER LINKS */}
              <Grid item xs={12} md={4}>
                <Grid container spacing={4}>

                  {/* PLATFORM */}
                  <Grid item xs={6}>
                    <Box sx={{ animation: "fadeUp 1s ease" }}>
                      <Typography
                        sx={{
                          color: "#fff",
                          fontWeight: 800,
                          mb: 3,
                          fontSize: "18px"
                        }}
                      >
                        Platform
                      </Typography>

                      {[
                        "Jobs",
                        "About",
                        "Candidates",
                        "Employers",
                        "Dashboard",
                        "Pricing"
                      ].map((item, i) => (
                        <Typography
                          key={i}
                          onClick={() => {
                            if (item === "Jobs") {
                              navigate("/jobs");
                            }
                            else if (item === "About") {
                              navigate("/about");
                            }
                          }}
                          sx={{
                            color: "#94a3b8",
                            mb: 1.8,
                            cursor: "pointer",
                            transition: "0.3s ease",
                            position: "relative",
                            width: "fit-content",

                            "&::after": {
                              content: '""',
                              position: "absolute",
                              left: 0,
                              bottom: -4,
                              width: 0,
                              height: "2px",
                              background: "#42a5f5",
                              transition: "0.4s"
                            },

                            "&:hover": {
                              color: "#42a5f5",
                              transform: "translateX(6px)"
                            },

                            "&:hover::after": {
                              width: "70%"
                            }
                          }}
                        >
                          {item}
                        </Typography>
                      ))}
                    </Box>
                  </Grid>

                  {/* COMPANY */}
                  <Grid item xs={6}>
                    <Box sx={{ animation: "fadeUp 1.2s ease" }}>
                      <Typography
                        sx={{
                          color: "#fff",
                          fontWeight: 800,
                          mb: 3,
                          fontSize: "18px"
                        }}
                      >
                        Company
                      </Typography>

                      {[
                        "About",
                        "Careers",
                        "Blog",
                        "Press",
                        "Contact"
                      ].map((item, i) => (
                        <Typography
                          key={i}
                          sx={{
                            color: "#94a3b8",
                            mb: 1.8,
                            cursor: "pointer",
                            transition: "0.3s ease",
                            position: "relative",
                            width: "fit-content",

                            "&::after": {
                              content: '""',
                              position: "absolute",
                              left: 0,
                              bottom: -4,
                              width: 0,
                              height: "2px",
                              background: "#42a5f5",
                              transition: "0.4s"
                            },

                            "&:hover": {
                              color: "#42a5f5",
                              transform: "translateX(6px)"
                            },

                            "&:hover::after": {
                              width: "70%"
                            }
                          }}
                        >
                          {item}
                        </Typography>
                      ))}
                    </Box>
                  </Grid>

                </Grid>
              </Grid>

              {/* RIGHT SIDE */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" }
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: "380px",
                    p: 4,
                    borderRadius: "30px",
                    background:
                      "rgba(15,23,42,0.72)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(20px)",
                    animation: "fadeUp 1.4s ease",
                    transition: "0.4s ease",
                    position: "relative",
                    overflow: "hidden",

                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow:
                        "0 20px 70px rgba(25,118,210,0.18)"
                    },

                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      borderRadius: "30px",
                      padding: "1px",
                      background:
                        "linear-gradient(135deg, rgba(66,165,245,0.4), transparent, rgba(25,118,210,0.35))",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      pointerEvents: "none"
                    }
                  }}
                >

                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: "24px",
                      fontWeight: 900,
                      mb: 1
                    }}
                  >
                    Stay Updated
                  </Typography>

                  <Typography
                    sx={{
                      color: "#94a3b8",
                      lineHeight: 1.8,
                      mb: 4
                    }}
                  >
                    Get AI recruitment tips, hiring trends,
                    and HR insights every week.
                  </Typography>

                  {/* INPUT */}
                  <Box
                    sx={{
                      display: "flex",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.08)"
                    }}
                  >
                    <Box
                      component="input"
                      placeholder="Enter your email"
                      sx={{
                        flex: 1,
                        px: 2,
                        py: 1.8,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#fff",

                        "&::placeholder": {
                          color: "#94a3b8"
                        }
                      }}
                    />

                    <Button
                      variant="contained"
                      sx={{
                        px: 3,
                        borderRadius: 0,
                        background:
                          "linear-gradient(135deg,#1976d2,#42a5f5)",
                        transition: "0.3s ease",

                        "&:hover": {
                          background:
                            "linear-gradient(135deg,#1565c0,#1e88e5)",
                          transform: "scale(1.05)"
                        }
                      }}
                    >
                      Join
                    </Button>
                  </Box>

                  {/* SOCIALS */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 4
                    }}
                  >
                    {["FB", "IN", "TW", "YT"].map((item, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(255,255,255,0.06)",
                          color: "#fff",
                          cursor: "pointer",
                          transition: "0.4s ease",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.2)",

                          "&:hover": {
                            transform: "translateY(-6px) scale(1.1)",
                            background:
                              "linear-gradient(135deg,#1976d2,#42a5f5)",
                            boxShadow:
                              "0 15px 35px rgba(25,118,210,0.45)"
                          }
                        }}
                      >
                        {item}
                      </Box>
                    ))}
                  </Box>

                </Box>
              </Grid>

            </Grid>

            {/* DIVIDER */}
            <Box
              sx={{
                mt: 8,
                mb: 4,
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)"
              }}
            />

            {/* BOTTOM */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 3,
                pt: 2
              }}
            >

              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: "14px",
                  letterSpacing: "0.5px"
                }}
              >
                © 2026 RecruitAI. All rights reserved.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  flexWrap: "wrap"
                }}
              >
                {[
                  "Privacy Policy",
                  "Terms & Conditions",
                  "Rules & Regulations",
                  "Cookie Policy"
                ].map((item, i) => (
                  <Typography
                    key={i}
                    sx={{
                      color: "#94a3b8",
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "0.3s",

                      "&:hover": {
                        color: "#42a5f5"
                      }
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>

            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}