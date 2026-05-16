import React from "react";
import {
  Box,
   AppBar,
  Toolbar,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Stack,
  Chip,
  Divider
} from "@mui/material";

import {
  Psychology,
  Security,
  CloudQueue,
  Speed,
  Insights,
  Verified,
  AutoAwesome,
  Work,
  DataObject,
  RocketLaunch,
  Groups2,
  TrendingUp,
  CheckCircle,
  EmojiObjects,
  Timeline,
  SupportAgent,
  Public
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const MotionBox = Box;
const MotionCard = Card;

export default function About() {
  const navigate = useNavigate();
  const features = [
    {
  title: "AI Resume Screening",
  icon: <Psychology sx={{ fontSize: 42 }} />,
  desc: "AI-powered resume analysis for faster and smarter candidate shortlisting.",
  image:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop"
},
    
    {
      title: "Secure Recruitment",
      icon: <Security sx={{ fontSize: 42 }} />,
      desc: "Advanced authentication, encrypted passwords, and secure recruitment workflow.",
      image: "https://media.istockphoto.com/id/1624686457/photo/document-management-of-human-resources-and-customer-relations-concept-business-people-review.jpg?b=1&s=612x612&w=0&k=20&c=2g7aiVzDCsY0yBCml1qQt08N-7pBFH69xtJ-CWZ2Lik="
    },
    {
      title: "Fast Hiring Workflow",
      icon: <Speed sx={{ fontSize: 42 }} />,
      desc: "Automated candidate filtering, ranking, and HR shortlisting process.",
      image: "https://media.istockphoto.com/id/2208274742/photo/approval-workflow-and-business-process-management-bpm-document-approval-process-and.jpg?b=1&s=612x612&w=0&k=20&c=9XcA_6qcFdDL9T4BmLPqbP4M6a0HzCx4tZD77MSHEpk="
    },
    {
      title: "Recruitment Analytics",
      icon: <Insights sx={{ fontSize: 42 }} />,
      desc: "Track hiring performance, candidate insights, and application analytics.",
      image: "https://images.pexels.com/photos/7947663/pexels-photo-7947663.jpeg"
    },
    {
      title: "Bias-Aware AI",
      icon: <Verified sx={{ fontSize: 42 }} />,
      desc: "Fair candidate evaluation by minimizing bias during recruitment.",
      image: "https://media.istockphoto.com/id/1500889944/photo/no-ai-artificial-intelligence-ban-ai-stop-ai-technology-robot-futuristic-data-science-data.jpg?b=1&s=612x612&w=0&k=20&c=-WO72RMH92gZwf9fau_VAxsIG5H6KzXuk-1Y6v8v2f0="
    },
    // {
    //   title: "AI Resume Screening",
    //   icon: <Psychology sx={{ fontSize: 42 }} />,
    //   desc: "Smart AI-powered candidate evaluation with explainable scoring and transparent hiring support.",
    //   image: "https://plus.unsplash.com/premium_photo-1771835259074-2e054d524cd0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGFpJTIwcmVzdW1lJTIwc2NyZWVuaW5nJTIwaW1nJTIwbGVuZ3RoJTIwa2FtJTIwaHV8ZW58MHx8MHx8fDA%3D"
    // },
    {
      title: "Smart Dashboard",
      icon: <DataObject sx={{ fontSize: 42 }} />,
      desc: "Interactive dashboards with beautiful visual management experience.",
      image: "https://media.istockphoto.com/id/2221051487/photo/businessmen-use-laptops-to-manage-virtual-digital-resumes-or-profiles-representing-online.jpg?b=1&s=612x612&w=0&k=20&c=vM5DL1gD4M8jP2xw_-3z8_DHC1RmUmP5EmFEQ5-3Cqs="
    }
  ];

  const stats = [
    { value: "99.9%", label: "System Reliability" },
    { value: "500+", label: "Active Users" },
    { value: "24/7", label: "Support Available" },
    { value: "5 Sec", label: "AI Processing Time" }
  ];

  const team = [
    {
      name: "Ayesha Altaf",
      role: "Frontend Developer & UI Designer",
      img: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Haseeb Mushtaq",
      role: "Backend & API Developer",
      img: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Awais Ali",
      role: "Project Documentation Manager",
      img: "https://randomuser.me/api/portraits/men/41.jpg"
    }
  ];

  return (
    <Box
      sx={{
        background:
          "linear-gradient(to bottom right,#050d18,#071b31,#081321)",
        minHeight: "100vh",
        overflow: "hidden",
        color: "white",
        position: "relative"
      }}
    >
      {/* GLOW EFFECT */}
      <Box
        sx={{
          position: "absolute",
          width: 350,
          height: 350,
          background: "rgba(33,150,243,0.18)",
          borderRadius: "50%",
          filter: "blur(120px)",
          top: -120,
          left: -100
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 350,
          height: 350,
          background: "rgba(0,229,255,0.12)",
          borderRadius: "50%",
          filter: "blur(120px)",
          bottom: -120,
          right: -80
        }}
      />
      <Container sx={{ py: 14, position: "relative", zIndex: 2 }}>
        <Grid container spacing={8} alignItems="center">
          {/* LEFT */}
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: -70 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <Chip
                icon={<RocketLaunch />}
                label="AI Recruitment Platform"
                sx={{
                  mb: 4,
                  px: 1,
                  py: 2.5,
                  background:
                    "linear-gradient(45deg,#1976d2,#00e5ff)",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "15px"
                }}
              />

              <Typography
                variant="h2"
                fontWeight="bold"
                sx={{
                  lineHeight: 1.2,
                  mb: 4,
                  fontSize: {
                    xs: "40px",
                    md: "65px"
                  },
                  background:
                    "linear-gradient(45deg,#ffffff,#90caf9,#00e5ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                About Our <br />
                Recruitment <br />
                Management System
              </Typography>

              <Typography
                sx={{
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: 2,
                  fontSize: "17px",
                  mb: 5,
                  maxWidth: "600px"
                }}
              >
                Modern AI-powered Recruitment Management System designed
                to automate hiring workflows, candidate evaluation,
                recruitment analytics, and HR management with an
                interactive dashboard experience.
              </Typography>

              {/* BUTTONS */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                mb={6}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 5,
                    py: 1.8,
                    borderRadius: "16px",
                    fontWeight: "bold",
                    fontSize: "15px",
                    background:
                      "linear-gradient(45deg,#2196f3,#00e5ff)",
                    boxShadow:
                      "0px 12px 35px rgba(33,150,243,0.4)"
                  }}
                >
                  Explore Platform
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 5,
                    py: 1.8,
                    borderRadius: "16px",
                    borderColor: "#90caf9",
                    color: "white",
                    "&:hover": {
                      borderColor: "#00e5ff",
                      background: "rgba(255,255,255,0.05)"
                    }
                  }}
                >
                  Learn More
                </Button>
              </Stack>

              {/* MINI FEATURES */}
              <Grid container spacing={3}>
                {[
                  {
                    icon: <TrendingUp color="primary" />,
                    text: "Smart Hiring"
                  },
                  {
                    icon: <Timeline color="primary" />,
                    text: "Recruitment Analytics"
                  },
                  {
                    icon: <Groups2 color="primary" />,
                    text: "Team Collaboration"
                  }
                ].map((item, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      {item.icon}
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "14px"
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </MotionBox>
          </Grid>

          {/* RIGHT IMAGE */}
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Box
                sx={{
                  position: "relative",
                  maxWidth: "520px",
                  mx: "auto"
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070&auto=format&fit=crop"
                  alt="team"
                  sx={{
                    width: "100%",
                    height: "420px",
                    objectFit: "cover",
                    borderRadius: "35px",
                    boxShadow:
                      "0px 25px 70px rgba(0,0,0,0.55)"
                  }}
                />

                {/* FLOATING CARD */}
                <Card
                  sx={{
                    position: "absolute",
                    bottom: -30,
                    left: -30,
                    width: "220px",
                    background:
                      "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(18px)",
                    borderRadius: "25px",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    color: "white",
                    p: 3
                  }}
                >
                  <Stack direction="row" spacing={2}>
                    <Avatar
                      sx={{
                        background:
                          "linear-gradient(45deg,#1976d2,#00e5ff)"
                      }}
                    >
                      <CheckCircle />
                    </Avatar>

                    <Box>
                      <Typography fontWeight="bold">
                        AI Shortlisting
                      </Typography>

                      <Typography
                        sx={{
                          color:
                            "rgba(255,255,255,0.7)",
                          fontSize: "14px"
                        }}
                      >
                        Faster candidate selection
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Box>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>

      {/* ABOUT INFO SECTION */}
      <Container sx={{ py: 16 }}>
        <Grid container spacing={10} alignItems="center">
          {/* IMAGE */}
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
                alt="dashboard"
                sx={{
                  width: "100%",
                  maxHeight: "500px",
                  objectFit: "cover",
                  borderRadius: "30px",
                  boxShadow:
                    "0px 20px 60px rgba(0,0,0,0.5)"
                }}
              />
            </MotionBox>
          </Grid>

          {/* CONTENT */}
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  mb: 4,
                  background:
                    "linear-gradient(45deg,#42a5f5,#00e5ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                Smart AI Recruitment Experience
              </Typography>

              <Typography
                sx={{
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: 2.1,
                  mb: 4,
                  fontSize: "16px"
                }}
              >
                Our Recruitment Management System simplifies the hiring
                lifecycle using AI-powered automation, candidate ranking,
                analytics dashboards, and recruitment workflow
                management.
              </Typography>

              <Grid container spacing={3}>
                {[
                  {
                    icon: <EmojiObjects color="primary" />,
                    text: "AI Candidate Scoring"
                  },
                  {
                    icon: <Public color="primary" />,
                    text: "Modern Dashboard"
                  },
                  {
                    icon: <SupportAgent color="primary" />,
                    text: "24/7 Management Support"
                  },
                  {
                    icon: <Work color="primary" />,
                    text: "Complete Hiring Workflow"
                  }
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                    >
                      {item.icon}

                      <Typography
                        sx={{
                          color:
                            "rgba(255,255,255,0.85)"
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>

{/* CORE FEATURES - VISION PRO SCROLL EXPERIENCE */}
<Box sx={{ py: 18, position: "relative" }}>

  {/* HEADER (sticky feel) */}
  <Box
    sx={{
      textAlign: "center",
      mb: 10,
      position: "sticky",
      top: 80,
      zIndex: 2
    }}
  >
    <Typography
      variant="h2"
      fontWeight={600}
      sx={{
        letterSpacing: "-2px",
        color: "white",
        mb: 2
      }}
    >
      Core Features
    </Typography>

    <Typography
      sx={{
        color: "rgba(255,255,255,0.55)",
        maxWidth: "700px",
        mx: "auto"
      }}
    >
      A cinematic AI recruitment experience inspired by Apple Vision Pro design philosophy.
    </Typography>
  </Box>

  {/* SCROLL STACK */}
  <Container>
    <Stack spacing={8}>

      {features.map((item, index) => (
        <MotionCard
          key={index}
          initial={{ opacity: 0, y: 120, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
            delay: index * 0.1
          }}
          viewport={{ once: false, amount: 0.4 }}
          whileHover={{ scale: 1.01 }}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "32px",
            padding: "50px",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(25px)",
            color: "white",
            boxShadow: "0 30px 80px rgba(0,0,0,0.4)"
          }}
        >

          {/* BACKGROUND LIGHT (Vision Pro depth) */}
          <Box
            sx={{
              position: "absolute",
              top: "-50%",
              right: "-30%",
              width: 300,
              height: 300,
              background:
                "radial-gradient(circle, rgba(66,165,245,0.18), transparent 70%)",
              filter: "blur(60px)"
            }}
          />

          <Grid container spacing={6} alignItems="center">

            {/* LEFT CONTENT */}
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.06)",
                  mb: 3
                }}
              >
                {item.icon}
              </Box>

              <Typography
                variant="h4"
                fontWeight={600}
                sx={{
                  letterSpacing: "-1px",
                  mb: 2
                }}
              >
                {item.title}
              </Typography>

              <Typography
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "16px",
                  lineHeight: 1.8,
                  mb: 3
                }}
              >
                {item.desc}
              </Typography>

              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CheckCircle sx={{ fontSize: 18, color: "#90caf9" }} />
                  <Typography fontSize="14px" color="rgba(255,255,255,0.7)">
                    AI Powered System
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CheckCircle sx={{ fontSize: 18, color: "#90caf9" }} />
                  <Typography fontSize="14px" color="rgba(255,255,255,0.7)">
                    Smart Workflow Automation
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CheckCircle sx={{ fontSize: 18, color: "#90caf9" }} />
                  <Typography fontSize="14px" color="rgba(255,255,255,0.7)">
                    Real-time Analytics
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

   {/* RIGHT VISUAL PANEL */}
<Grid
  item
  xs={12}
  md={5}
  sx={{
    display: "flex",
    justifyContent: "flex-end"
  }}
>
  <Box
    sx={{
      width: "100%",
      maxWidth: "520px",
      height: 260,
      borderRadius: "28px",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      ml: "auto",
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      background: "#0b1628"
    }}
  >
    <Box
  component="img"
  src={item.image}
  alt="feature"
  sx={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    display: "block"
  }}
/>
  </Box>
</Grid>
          </Grid>
        </MotionCard>
      ))}

    </Stack>
  </Container>
</Box>

{/* TEAM SECTION */}
<Container sx={{ py: 15 }}>
  <MotionBox
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    viewport={{ once: true }}
  >
    <Typography
      variant="h3"
      textAlign="center"
      fontWeight="bold"
      mb={3}
      sx={{
        background:
          "linear-gradient(45deg,#42a5f5,#00e5ff)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}
    >
      Meet Our Team
    </Typography>

    <Typography
      textAlign="center"
      sx={{
        color: "rgba(255,255,255,0.7)",
        mb: 10,
        maxWidth: "700px",
        mx: "auto",
        lineHeight: 1.9
      }}
    >
      Creative and passionate developers behind the
      Recruitment Management System platform.
    </Typography>
  </MotionBox>

  <Grid container spacing={5}>
    {team.map((member, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <MotionCard
          initial={{
            opacity: 0,
            y: 70
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.7,
            delay: index * 0.2
          }}
          viewport={{ once: true }}
          whileHover={{
            y: -12,
            scale: 1.03
          }}
          sx={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
            backdropFilter: "blur(14px)",
            borderRadius: "30px",
            border:
              "1px solid rgba(255,255,255,0.08)",
            textAlign: "center",
            color: "white",
            p: 5,
            position: "relative",
            overflow: "hidden",

            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "5px",
              background:
                "linear-gradient(90deg,#42a5f5,#00e5ff)"
            }
          }}
        >
          <Avatar
            src={member.img}
            sx={{
              width: 120,
              height: 120,
              mx: "auto",
              mb: 3,
              border: "4px solid #1976d2",
              boxShadow:
                "0px 10px 35px rgba(33,150,243,0.4)"
            }}
          />

          <Typography
            variant="h5"
            fontWeight="bold"
            mb={1}
          >
            {member.name}
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.8,
              mb: 3
            }}
          >
            {member.role}
          </Typography>

          <Stack
            direction="row"
            justifyContent="center"
            spacing={1}
          >
            <Chip
              label="UI/UX"
              sx={{
                background:
                  "rgba(66,165,245,0.15)",
                color: "#90caf9"
              }}
            />

            <Chip
              label="Development"
              sx={{
                background:
                  "rgba(0,229,255,0.12)",
                color: "#80deea"
              }}
            />
          </Stack>
        </MotionCard>
      </Grid>
    ))}
  </Grid>
</Container>
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
  );
}