import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent
} from "@mui/material";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [rect, setRect] = useState(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tutorialRect, setTutorialRect] = useState(null);
  const showStep = (id, step) => {
    const el = document.getElementById(id);

    if (el) {
      const rect = el.getBoundingClientRect();
      setTutorialRect(rect);
      setTutorialStep(step);
    }
  };
  const images = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      text: "RecruitAI reduced our hiring time by 60%",
      name: "Sarah Mitchell",
      role: "HR Manager",
      initials: "SM"
    },
    {
      text: "Best AI recruitment platform we ever used",
      name: "Ali Khan",
      role: "Talent Lead",
      initials: "AK"
    },
    {
      text: "Smart automation made hiring so much easier",
      name: "James Chen",
      role: "Recruiter",
      initials: "JC"
    }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);



  useEffect(() => {
    setTimeout(() => {
      showStep("jobs-btn", 1);
    }, 500);
  }, []);

  return (
    <>
      {/* GLOBAL DARK BG */}
      <Box
        sx={{
          background: "#020617",
          color: "white",
          minHeight: "100vh"
        }}
      >
        {/* ADVANCED WEBSITE TUTORIAL */}

        {tutorialStep !== 0 && (
          <>
            {/* DARK OVERLAY */}
            <Box
              sx={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(4px)",
                zIndex: 9998,
                animation: "fadeIn 0.4s ease"
              }}
            />

            {/* STEP 1 */}
            {tutorialStep === 1 && (
              <>
                {/* HIGHLIGHT */}
                <Box
                  sx={{
                    position: "fixed",
                    top: tutorialRect?.top - 5,
                    left: tutorialRect?.left - 5,
                    width: tutorialRect?.width + 10,
                    height: tutorialRect?.height + 10,
                    // width: 90,
                    // height: 45,
                    borderRadius: "12px",
                    border: "2px solid #42a5f5",
                    boxShadow: "0 0 25px #42a5f5",
                    zIndex: 9999,
                    animation: "pulse 1.5s infinite"
                  }}
                />

                {/* TOOLTIP */}
                <Box
                  sx={{
                    position: "fixed",
                    top: tutorialRect?.bottom + 20,
                    left: tutorialRect?.left - 80,
                    width: 340,
                    background:
                      "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.96))",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "20px",
                    p: 3,
                    color: "white",
                    zIndex: 10000,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
                    animation: "slideUp 0.4s ease"
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    Browse Jobs
                  </Typography>

                  <Typography sx={{ opacity: 0.9, lineHeight: 1.7 }}>
                    Users can browse the latest AI-powered jobs in this section and apply directly.
                  </Typography>

                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <Button
                      onClick={() => setTutorialStep(0)}
                      sx={{ color: "#fff" }}
                    >
                      Skip
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() => setTutorialStep(2)}
                      sx={{
                        borderRadius: "10px",
                        background:
                          "linear-gradient(135deg,#1976d2,#42a5f5)"
                      }}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              </>
            )}

            {/* STEP 2 */}
            {tutorialStep === 2 && (
              <>
                {/* HIGHLIGHT */}
                <Box
                  sx={{
                    position: "fixed",
                    top: 10,
                    right: 45,
                    width: 170,
                    height: 45,
                    borderRadius: "12px",
                    border: "2px solid #42a5f5",
                    boxShadow: "0 0 25px #42a5f5",
                    zIndex: 9999,
                    animation: "pulse 1.5s infinite"
                  }}
                />

                {/* TOOLTIP */}
                <Box
                  sx={{
                    position: "fixed",
                    top: 90,
                    right: 20,
                    width: 340,
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "20px",
                    p: 3,
                    color: "white",
                    zIndex: 10000,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
                    animation: "slideUp 0.4s ease"
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    Request a Demo
                  </Typography>

                  <Typography sx={{ opacity: 0.9, lineHeight: 1.7 }}>
                    “Companies can submit live platform demo requests from here and explore AI-powered recruitment features.”
                  </Typography>

                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <Button
                      onClick={() => setTutorialStep(1)}
                      sx={{ color: "#fff" }}
                    >
                      Back
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() => setTutorialStep(0)}
                      sx={{
                        borderRadius: "10px",
                        background:
                          "linear-gradient(135deg,#1976d2,#42a5f5)"
                      }}
                    >
                      Finish
                    </Button>
                  </Box>
                </Box>
              </>
            )}

            {/* ANIMATIONS */}
            <style>
              {`
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 15px #42a5f5;
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 0 35px #42a5f5;
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 15px #42a5f5;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
   
`}
            </style>
          </>
        )}
        <Box
          sx={{
            minHeight: "90vh",
            position: "relative",
            display: "flex",
            alignItems: "center",
            backgroundImage: `url(${images[index]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden"
          }}
        >
          {/* DARK OVERLAY */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(2,6,23,0.96), rgba(15,23,42,0.82))"
            }}
          />

          <Container sx={{ position: "relative", zIndex: 2 }}>
            <Grid container spacing={5} alignItems="center">

              {/* LEFT */}
              <Grid item xs={12} md={6}>

                <Typography
                  sx={{
                    display: "inline-block",
                    px: 2.5,
                    py: 1,
                    borderRadius: "30px",
                    background: "rgba(66,165,245,0.12)",
                    color: "#90caf9",
                    border: "1px solid rgba(144,202,249,0.18)",
                    backdropFilter: "blur(8px)",
                    mb: 2,
                    mt: 3,
                    fontWeight: "600",
                    letterSpacing: "0.5px"
                  }}
                >
                  AI Recruitment Platform
                </Typography>

                <Typography
                  variant="h2"
                  fontWeight="900"
                  sx={{
                    lineHeight: 1.15,
                    mb: 3,
                    fontSize: {
                      xs: "2.7rem",
                      md: "4rem"
                    },
                    background:
                      "linear-gradient(135deg,#ffffff,#cbd5e1)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  Hire Smarter <br />
                  With AI Automation
                </Typography>

                <Typography
                  sx={{
                    color: "#cbd5e1",
                    lineHeight: 2,
                    maxWidth: "550px",
                    mb: 4,
                    fontSize: "16px"
                  }}
                >
                  Smart recruitment system that helps companies
                  screen candidates, automate interviews,
                  and hire top talent faster.
                </Typography>

                {/* HERO BUTTONS */}
                <Box
                  sx={{
                    mt: 5,
                    display: "flex",
                    gap: 2.5,
                    flexWrap: "wrap"
                  }}
                >

                  {/* REQUEST DEMO BUTTON */}
                  <Button
                    id="demo-btn-hero"
                    variant="contained"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: "14px",
                      background:
                        "linear-gradient(135deg,#1976d2,#42a5f5)",
                      color: "#fff",
                      fontWeight: "bold",
                      letterSpacing: "0.4px",
                      transition: "all 0.35s ease",
                      position: "relative",
                      overflow: "hidden",
                      boxShadow:
                        "0 10px 30px rgba(66,165,245,0.25)",

                      "&:hover": {
                        transform: "translateY(-4px) scale(1.04)",
                        boxShadow:
                          "0 15px 35px rgba(66,165,245,0.45)",
                        background:
                          "linear-gradient(135deg,#1565c0,#1e88e5)"
                      },

                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(120deg, transparent, rgba(255,255,255,0.25), transparent)",
                        transition: "0.6s"
                      },

                      "&:hover::before": {
                        left: "100%"
                      }
                    }}
                    onClick={() => navigate("/request-demo")}
                  >
                    Request a Demo
                  </Button>

                  {/* BROWSE JOBS BUTTON */}
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: "14px",
                      color: "#e2e8f0",
                      border: "1px solid rgba(255,255,255,0.18)",
                      background: "rgba(255,255,255,0.03)",
                      backdropFilter: "blur(10px)",
                      fontWeight: "bold",
                      letterSpacing: "0.5px",
                      transition: "all 0.35s ease",

                      "&:hover": {
                        background:
                          "rgba(66,165,245,0.12)",
                        borderColor: "#42a5f5",
                        color: "#90caf9",
                        transform: "translateY(-4px) scale(1.04)",
                        boxShadow:
                          "0 12px 30px rgba(66,165,245,0.18)"
                      },

                      "&:active": {
                        transform: "scale(0.96)"
                      }
                    }}
                    onClick={() => navigate("/jobs")}
                  >
                    Browse Jobs
                  </Button>
                </Box>
              </Grid>

              {/* RIGHT CARD */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: "30px",
                    background:
                      "rgba(15,23,42,0.72)",
                    backdropFilter: "blur(20px)",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    boxShadow:
                      "0 25px 60px rgba(0,0,0,0.45)"
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={4}
                    color="#fff"
                  >
                    Recruitment Analytics
                  </Typography>

                  <Grid container spacing={3}>
                    {[
                      ["50K+", "Candidates"],
                      ["12K+", "Jobs"],
                      ["500+", "Companies"],
                      ["94%", "Success"]
                    ].map((item, i) => (
                      <Grid item xs={6} key={i}>
                        <Box
                          sx={{
                            p: 3,
                            borderRadius: "22px",
                            background:
                              "rgba(255,255,255,0.04)",
                            border:
                              "1px solid rgba(255,255,255,0.05)",
                            textAlign: "center",
                            transition: "0.35s ease",

                            "&:hover": {
                              transform: "translateY(-6px)",
                              background:
                                "rgba(66,165,245,0.08)",
                              boxShadow:
                                "0 15px 30px rgba(66,165,245,0.12)"
                            }
                          }}
                        >
                          <Typography
                            variant="h4"
                            fontWeight="bold"
                            color="#42a5f5"
                          >
                            {item[0]}
                          </Typography>

                          <Typography
                            sx={{
                              color: "#94a3b8",
                              mt: 1
                            }}
                          >
                            {item[1]}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/*  FEATURES */}
        <Container sx={{ py: 8 }}>
          <Box textAlign="center" mb={6}>

            <Typography
              sx={{
                border: "1px solid #1976d2",
                display: "inline-block",
                px: 2,
                py: 0.5,
                borderRadius: "20px",
                color: "#1976d2",
                mb: 3   // ⭐ gap increased (tag → heading)
              }}
            >
              Platform Features
            </Typography>

            <Typography variant="h4" fontWeight="bold" mb={3}>
              Everything you need to hire{" "}
              <span style={{ color: "#1976d2" }}>smarter</span>
            </Typography>

            <Typography mt={4} color="text.secondary" sx={{ lineHeight: 2 }}>
              From AI-powered screening to automated scheduling, RecruitAI handles
              the entire recruitment lifecycle.
            </Typography>

          </Box>

          {/* FLEXBOX 3 COLUMNS FIX */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",   // ⭐ equal alignment center
              gap: 8,                     // ⭐ equal spacing between all cards
            }}
          >
            {[
              {
                title: <b>AI Resume Screening</b>,
                desc: "Automatically rank and filter candidates using advanced AI matching algorithms."
              },
              {
                title: <b>Smart Scheduling</b>,
                desc: "Automate interview scheduling with calendar sync and candidate availability."
              },
              {
                title: <b>Candidate Pipeline</b>,
                desc: "Visualize and manage your entire hiring funnel from application to offer."
              },
              {
                title: <b>Analytics Dashboard</b>,
                desc: "Real-time insights on time-to-hire, source quality, and team performance."
              },
              {
                title: <b>Team Collaboration</b>,
                desc: "Share feedback, scorecards, and decisions across your hiring team."
              },
              {
                title: <b>ATS Integration</b>,
                desc: "Seamlessly connect with your existing HR tools and applicant tracking systems."
              }
            ].map((item, i) => (
              <Box
                key={i}
                sx={{
                  flex: "1 1 300px",
                  maxWidth: "350px",
                  minWidth: "300px",
                  display: "flex"
                }}
              >
                <Card

                  sx={{
                    p: 3,
                    borderRadius: "20px",
                    height: "100%",
                    transition: "0.4s",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    color: "#fff",

                    backgroundImage: `url(${[
                      "https://media.istockphoto.com/id/2258807282/photo/ai-recruiting-and-automated-screening-cv-parsing-and-talent-analytics-platform.jpg?b=1&s=612x612&w=0&k=20&c=-Cium7w_bsAXvM6tRz-toiet8N2QldxNa2d7ctbXQfE=", // AI Resume
                      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f", // Scheduling
                      "https://images.pexels.com/photos/8730284/pexels-photo-8730284.jpeg", // Pipeline
                      "https://images.pexels.com/photos/7887816/pexels-photo-7887816.jpeg", // Analytics
                      "https://images.pexels.com/photos/7652039/pexels-photo-7652039.jpeg", // Team
                      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"  // ATS
                    ][i]
                      })`,

                    backgroundSize: "cover",
                    backgroundPosition: "center",

                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",

                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(15,23,42,0.92), rgba(15,23,42,0.45))"
                    },

                    "&:hover": {
                      transform: "translateY(-10px) scale(1.02)",
                      boxShadow: "0 20px 50px rgba(0,0,0,0.25)"
                    }
                  }}
                >
                  <CardContent
                    sx={{
                      position: "relative",
                      zIndex: 2
                    }}>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      {item.title}
                    </Typography>
                    {/* <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}> */}
                    <Typography
                      sx={{
                        lineHeight: 1.7,
                        color: "rgba(255,255,255,0.85)"
                      }}
                    >
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
        {/* HOW IT WORKS - PREMIUM INTERACTIVE DESIGN */}
        <Box
          sx={{
            py: 12,
            background: "#020617",
            position: "relative",
            overflow: "hidden"
          }}
        >

          {/* LIGHT GLOW */}
          <Box
            sx={{
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "rgba(66,165,245,0.10)",
              filter: "blur(130px)",
              top: "-150px",
              right: "-120px"
            }}
          />

          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>

            {/* HEADER */}
            <Box textAlign="center" mb={10}>
              <Typography
                sx={{
                  display: "inline-block",
                  px: 2,
                  py: 0.7,
                  borderRadius: "30px",
                  background: "rgba(66,165,245,0.08)",
                  border: "1px solid rgba(66,165,245,0.18)",
                  color: "#42a5f5",
                  fontSize: "12px",
                  letterSpacing: "2px",
                  fontWeight: "bold",
                  mb: 3
                }}
              >
                HOW IT WORKS
              </Typography>

              <Typography
                variant="h3"
                fontWeight="900"
                sx={{
                  color: "#fff",
                  mb: 2,
                  fontSize: {
                    xs: "2.1rem",
                    md: "3.2rem"
                  }
                }}
              >
                Smarter Hiring Workflow
              </Typography>

              <Typography
                sx={{
                  color: "#94a3b8",
                  maxWidth: "650px",
                  mx: "auto",
                  lineHeight: 2
                }}
              >
                Modern AI-powered recruitment process designed for fast and intelligent hiring.
              </Typography>
            </Box>

            {/* INTERACTIVE STEPS */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 4,
                position: "relative"
              }}
            >

              {[
                {
                  num: "01",
                  title: "Create Job",
                  desc: "Generate optimized job posts instantly."
                },
                {
                  num: "02",
                  title: "AI Screening",
                  desc: "Automatically analyze candidate profiles."
                },
                {
                  num: "03",
                  title: "Hire Faster",
                  desc: "Select top talent with smart insights."
                }
              ].map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "280px"
                    },
                    position: "relative"
                  }}
                >

                  {/* CONNECTOR LINE */}
                  {i !== 2 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 40,
                        right: "-40px",
                        width: "40px",
                        height: "2px",
                        background:
                          "linear-gradient(to right, rgba(66,165,245,0.6), transparent)",
                        display: {
                          xs: "none",
                          md: "block"
                        }
                      }}
                    />
                  )}

                  {/* CARD */}
                  <Box
                    sx={{
                      p: 3.5,
                      borderRadius: "22px",
                      background:
                        "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.85))",
                      border: "1px solid rgba(255,255,255,0.06)",
                      backdropFilter: "blur(14px)",
                      transition: "all 0.4s ease",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",

                      "&:hover": {
                        transform: "translateY(-8px)",
                        borderColor: "rgba(66,165,245,0.35)",
                        boxShadow:
                          "0 20px 40px rgba(66,165,245,0.16)"
                      },

                      "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.04), transparent)",
                        pointerEvents: "none"
                      }
                    }}
                  >

                    {/* TOP */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 3
                      }}
                    >

                      {/* STEP */}
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: "16px",
                          background:
                            "linear-gradient(135deg,#1976d2,#42a5f5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "18px",
                          boxShadow:
                            "0 10px 25px rgba(66,165,245,0.3)"
                        }}
                      >
                        {item.num}
                      </Box>

                      {/* MINI DOT */}
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: "#42a5f5",
                          boxShadow:
                            "0 0 18px rgba(66,165,245,0.8)"
                        }}
                      />
                    </Box>

                    {/* TITLE */}
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        color: "#fff",
                        mb: 1.5
                      }}
                    >
                      {item.title}
                    </Typography>

                    {/* DESC */}
                    <Typography
                      sx={{
                        color: "#94a3b8",
                        lineHeight: 1.9,
                        fontSize: "14px"
                      }}
                    >
                      {item.desc}
                    </Typography>

                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
        {/* TESTIMONIAL */}
        <Box
          sx={{
            py: 12,
            background:
              "linear-gradient(180deg,#020617,#0f172a)"
          }}
        >
          <Container maxWidth="md">

            <Typography
              variant="h3"
              fontWeight="bold"
              textAlign="center"
              mb={6}
            >
              What Clients Say
            </Typography>

            <Box
              key={current}
            >
              <Card
                sx={{
                  p: 5,
                  borderRadius: "30px",
                  background:
                    "rgba(15,23,42,0.9)",
                  border:
                    "1px solid rgba(255,255,255,0.06)",
                  color: "white",
                  textAlign: "center"
                }}
              >
                <Typography
                  fontSize="22px"
                  sx={{
                    lineHeight: 2,
                    mb: 4,
                    color: "#e2e8f0"
                  }}
                >
                  "{testimonials[current].text}"
                </Typography>

                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap={2}
                >
                  <Box
                    sx={{
                      width: 55,
                      height: 55,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg,#1976d2,#42a5f5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold"
                    }}
                  >
                    {testimonials[current].initials}
                  </Box>

                  <Box textAlign="left">
                    <Typography fontWeight="bold">
                      {testimonials[current].name}
                    </Typography>

                    <Typography color="#94a3b8">
                      {testimonials[current].role}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>
          </Container>
        </Box>

        {/* 🔥 CTA SECTION */}
        <Box
          sx={{
            minHeight: "78vh", // ⭐ HEIGHT INCREASED
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",

            backgroundImage:
              "url(https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=1920&auto=format&fit=crop)",

            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            overflow: "hidden"
          }}
        >
          {/* 🔵 OVERLAY */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(2,6,23,0.92), rgba(15,23,42,0.80))"
            }}
          />

          {/* 🔥 BLUE GLOW */}
          <Box
            sx={{
              position: "absolute",
              width: "420px",
              height: "420px",
              borderRadius: "50%",
              background: "rgba(66,165,245,0.16)",
              filter: "blur(140px)",
              top: "-120px",
              right: "-120px"
            }}
          />

          {/* 🔥 CONTENT */}
          <Container
            sx={{
              position: "relative",
              zIndex: 2
            }}
          >
            {/* TOP TAG */}
            <Typography
              sx={{
                display: "inline-block",
                px: 2.5,
                py: 1,
                borderRadius: "30px",

                background: "rgba(66,165,245,0.12)",
                color: "#90caf9",

                border:
                  "1px solid rgba(144,202,249,0.18)",

                backdropFilter: "blur(8px)",

                mb: 4,

                fontWeight: "600",
                letterSpacing: "0.5px"
              }}
            >
              AI Recruitment Platform
            </Typography>

            {/* HEADING */}
            <Typography
              variant="h3"
              fontWeight="900"
              sx={{
                mb: 3,
                lineHeight: 1.2,

                fontSize: {
                  xs: "2.4rem",
                  md: "3.8rem"
                },

                background:
                  "linear-gradient(135deg,#ffffff,#cbd5e1)",

                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Ready To Transform Hiring?
            </Typography>

            {/* TEXT */}
            <Typography
              sx={{
                color: "#cbd5e1",
                lineHeight: 2,
                maxWidth: "760px",
                mx: "auto",
                mb: 6,
                fontSize: "16px"
              }}
            >
              Join 500+ companies using RecruitAI to hire smarter,
              automate recruitment workflows, and find top talent
              faster using AI-powered automation.
            </Typography>

            {/* 🔥 BUTTONS */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 3, // ⭐ SPACE FIXED
                flexWrap: "wrap",
                mb: 5
              }}
            >
              {/* REQUEST DEMO */}
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 5,
                  py: 1.5,

                  borderRadius: "14px",

                  background:
                    "linear-gradient(135deg,#1976d2,#42a5f5)",

                  color: "#fff",

                  fontWeight: "bold",
                  letterSpacing: "0.5px",

                  transition: "all 0.35s ease",

                  position: "relative",
                  overflow: "hidden",

                  boxShadow:
                    "0 10px 30px rgba(66,165,245,0.28)",

                  "&:hover": {
                    transform:
                      "translateY(-4px) scale(1.04)",

                    boxShadow:
                      "0 16px 38px rgba(66,165,245,0.45)",

                    background:
                      "linear-gradient(135deg,#1565c0,#1e88e5)"
                  },

                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",

                    background:
                      "linear-gradient(120deg, transparent, rgba(255,255,255,0.25), transparent)",

                    transition: "0.6s"
                  },

                  "&:hover::before": {
                    left: "100%"
                  }
                }}
                onClick={() => navigate("/request-demo")}
              >
                Request a Demo
              </Button>

              {/* SIGN UP */}
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 5,
                  py: 1.5,

                  borderRadius: "14px",

                  color: "#e2e8f0",

                  border:
                    "1px solid rgba(255,255,255,0.18)",

                  background:
                    "rgba(255,255,255,0.03)",

                  backdropFilter: "blur(10px)",

                  fontWeight: "bold",
                  letterSpacing: "0.5px",

                  transition: "all 0.35s ease",

                  "&:hover": {
                    background:
                      "rgba(66,165,245,0.12)",

                    borderColor: "#42a5f5",

                    color: "#90caf9",

                    transform:
                      "translateY(-4px) scale(1.04)",

                    boxShadow:
                      "0 12px 30px rgba(66,165,245,0.18)"
                  }
                }}
                onClick={() => navigate("/auth")}
              >
                Sign Up Free
              </Button>
            </Box>

            {/* 🔹 BOTTOM TEXTS */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={4}
              flexWrap="wrap"
            >
              <Typography
                sx={{
                  color: "#cbd5e1",
                  fontSize: "14px"
                }}
              >
                ✔ No credit card required
              </Typography>

              <Typography
                sx={{
                  color: "#cbd5e1",
                  fontSize: "14px"
                }}
              >
                ✔ Free 14-day trial
              </Typography>

              <Typography
                sx={{
                  color: "#cbd5e1",
                  fontSize: "14px"
                }}
              >
                ✔ Cancel anytime
              </Typography>
            </Box>
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