import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip
} from "@mui/material";
import { Link } from "react-router-dom";
import { getAllJobs } from "../../services/CandidateApi";
import { companiesData, getDemoRequests } from "../../services/AdminApi";

const drawerWidth = 240;

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [demoRequests, setDemoRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const [jobRes, companyRes, demoRes] = await Promise.all([
          getAllJobs(),
          companiesData(),
          getDemoRequests()
        ]);

        setJobs(jobRes.data || []);
        setCompanies(companyRes.data || []);
        setDemoRequests(demoRes.data || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("Unable to load admin metrics at this time.");
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  const activeJobs = jobs.reduce((count, job) => {
    const status = `${job.status || ""}`.toLowerCase();
    if (["active", "open", "published"].includes(status)) return count + 1;
    return count;
  }, 0);

  const stats = [
    {
      title: "Total Jobs",
      value: loading ? "..." : jobs.length,
      subtitle: "Live roles listed on the platform",
      accent: "linear-gradient(135deg, #38bdf8, #2563eb)"
    },
    {
      title: "Active Jobs",
      value: loading ? "..." : activeJobs || jobs.length,
      subtitle: "Roles currently accepting applications",
      accent: "linear-gradient(135deg, #22c55e, #0ea5e9)"
    },
    {
      title: "Companies",
      value: loading ? "..." : companies.length,
      subtitle: "Employer accounts onboarded",
      accent: "linear-gradient(135deg, #f97316, #fb7185)"
    },
    {
      title: "Demo Requests",
      value: loading ? "..." : demoRequests.length,
      subtitle: "Support and feature requests pending review",
      accent: "linear-gradient(135deg, #8b5cf6, #06b6d4)"
    },
    {
      title: "Candidate Pool",
      value: "Coming Soon",
      subtitle: "Talent analytics and pipeline sizing",
      accent: "linear-gradient(135deg, #ec4899, #f59e0b)"
    },
    {
      title: "Interview Ops",
      value: "Coming Soon",
      subtitle: "Interview scheduling and scoring",
      accent: "linear-gradient(135deg, #4ade80, #38bdf8)"
    }
  ];

  const quickActions = [
    { label: "Review Companies", path: "/admin/companies" },
    { label: "Open HR Team", path: "/admin/hr-team" },
    { label: "Inspect Analytics", path: "/admin/analytics" },
    { label: "Manage Demo Requests", path: "/admin/demo" }
  ];

  const timeline = [
    { time: "Now", label: "System health check passed", status: "Success" },
    { time: "1h ago", label: "New company account approved", status: "Active" },
    { time: "4h ago", label: "Demo request received", status: "Pending" },
    { time: "Yesterday", label: "Platform uptime 99.97%", status: "Success" }
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        top: "64px",
        left: `${drawerWidth}px`,
        right: 0,
        bottom: 0,
        px: 5,
        py: 4,
        background: `
          linear-gradient(
            135deg,
            #020617 0%,
            #0f172a 28%,
            #111827 58%,
            #1e3a8a 100%
          )
        `,
        overflowY: "auto",
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          background: 'rgba(66,165,245,0.18)',
          filter: 'blur(120px)',
          top: '-100px',
          left: '-100px',
          zIndex: 0
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'rgba(30,58,138,0.16)',
          filter: 'blur(120px)',
          bottom: '-80px',
          right: '-80px',
          zIndex: 0
        }
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1, mb: 5 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ color: "#fff", mb: 1 }}
        >
          RecruitAI Admin Dashboard
        </Typography>
        <Typography sx={{ color: "#cbd5e1", fontSize: "17px", maxWidth: 760 }}>
          A modern management workspace that brings hiring analytics, company onboarding, and operational controls into a clean enterprise dashboard.
        </Typography>
      </Box>

      {error && (
        <Box mb={4} sx={{ color: "#f87171" }}>
          {error}
        </Box>
      )}

      <Grid container spacing={4} sx={{ position: "relative", zIndex: 1 }}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.title} sx={{ display: "flex" }}>
            <Card
              sx={{
                width: "100%",
                borderRadius: "24px",
                background: "rgba(15,23,42,0.78)",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
                px: 2,
                py: 3,
                boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "13px", color: "#94a3b8", mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ fontSize: "34px", fontWeight: 900, mb: 1.5, color: "#fff" }}>
                  {item.value}
                </Typography>
                <Typography sx={{ color: "#94a3b8", fontSize: "14px" }}>
                  {item.subtitle}
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 4,
                  width: "100%",
                  borderRadius: "999px",
                  mt: 3,
                  background: "rgba(255,255,255,0.05)",
                  overflow: "hidden"
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: item.value === "Coming Soon" ? "88%" : "100%",
                    background: item.accent,
                    transition: "0.4s ease"
                  }}
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4} mt={1} sx={{ position: "relative", zIndex: 1 }}>
        <Grid item xs={12} lg={7}>
          <Card
            sx={{
              borderRadius: "28px",
              background: "rgba(15,23,42,0.78)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
              minHeight: 360,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)"
            }}
          >
            <CardContent>
              <Typography sx={{ fontWeight: 800, fontSize: "22px", color: "#42a5f5", mb: 2 }}>
                Platform Pulse
              </Typography>

              <Typography sx={{ color: "#cbd5e1", mb: 4, lineHeight: 1.8 }}>
                Track your administrative health with a quick summary of critical hiring operations and platform availability.
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: "#94a3b8", mb: 1 }}>Candidate Engagement</Typography>
                <LinearProgress
                  variant="determinate"
                  value={82}
                  sx={{ height: 10, borderRadius: 6, background: "rgba(255,255,255,0.08)", '& .MuiLinearProgress-bar': { background: "#38bdf8" } }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: "#94a3b8", mb: 1 }}>Interview Readiness</Typography>
                <LinearProgress
                  variant="determinate"
                  value={68}
                  sx={{ height: 10, borderRadius: 6, background: "rgba(255,255,255,0.08)", '& .MuiLinearProgress-bar': { background: "#22c55e" } }}
                />
              </Box>
              <Box>
                <Typography sx={{ color: "#94a3b8", mb: 1 }}>System Availability</Typography>
                <LinearProgress
                  variant="determinate"
                  value={99}
                  sx={{ height: 10, borderRadius: 6, background: "rgba(255,255,255,0.08)", '& .MuiLinearProgress-bar': { background: "#f97316" } }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card
            sx={{
              borderRadius: "28px",
              background: "rgba(15,23,42,0.78)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
              minHeight: 360,
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)"
            }}
          >
            <CardContent>
              <Typography sx={{ fontWeight: 800, fontSize: "22px", color: "#7c3aed", mb: 3 }}>
                Quick Actions
              </Typography>

              <Grid container spacing={2}>
                {quickActions.map((action) => (
                  <Grid item xs={12} sm={6} key={action.label}>
                    <Button
                      variant="contained"
                      fullWidth
                      component={Link}
                      to={action.path}
                      sx={{
                        textTransform: "none",
                        borderRadius: "16px",
                        px: 3,
                        py: 1.5,
                        background: "linear-gradient(135deg,#6366f1,#06b6d4)",
                        boxShadow: "0 18px 30px rgba(99,102,241,0.24)",
                        fontWeight: 700,
                        '&:hover': {
                          background: "linear-gradient(135deg,#4338ca,#0ea5e9)"
                        }
                      }}
                    >
                      {action.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4} mt={1} sx={{ position: "relative", zIndex: 1 }}>
        <Grid item xs={12} md={7}>
          <Card
            sx={{
              borderRadius: "28px",
              background: "rgba(15,23,42,0.78)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)"
            }}
          >
            <CardContent>
              <Typography sx={{ fontWeight: 800, fontSize: "22px", mb: 3, color: "#42a5f5" }}>
                Recent Activity
              </Typography>

              {timeline.map((item) => (
                <Box
                  key={item.time}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    py: 2,
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    '&:last-of-type': {
                      borderBottom: "none"
                    }
                  }}
                >
                  <Box sx={{ maxWidth: 520 }}>
                    <Typography sx={{ fontWeight: 700, color: "#fff" }}>{item.label}</Typography>
                    <Typography sx={{ color: "#94a3b8", fontSize: "14px", mt: 0.5 }}>
                      {item.time}
                    </Typography>
                  </Box>
                  <Chip
                    label={item.status}
                    size="small"
                    sx={{
                      bgcolor:
                        item.status === "Success"
                          ? "rgba(16,185,129,0.12)"
                          : item.status === "Active"
                          ? "rgba(59,130,246,0.12)"
                          : "rgba(251,191,36,0.12)",
                      color:
                        item.status === "Success"
                          ? "#4ade80"
                          : item.status === "Active"
                          ? "#60a5fa"
                          : "#fbbf24",
                      fontWeight: 700
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card
            sx={{
              borderRadius: "28px",
              background: "rgba(15,23,42,0.78)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
              minHeight: 360,
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)"
            }}
          >
            <CardContent>
              <Typography sx={{ fontWeight: 800, fontSize: "22px", mb: 2, color: "#38bdf8" }}>
                Executive Summary
              </Typography>
              <Typography sx={{ color: "#cbd5e1", mb: 3, lineHeight: 1.8 }}>
                Keep a close watch on the platform's strategic performance and identify areas that need action.
              </Typography>

              <Box sx={{ display: "grid", gap: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ color: "#94a3b8" }}>Growth Velocity</Typography>
                  <Typography sx={{ fontWeight: 700 }}>+18%</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ color: "#94a3b8" }}>Conversion Lift</Typography>
                  <Typography sx={{ fontWeight: 700 }}>+12%</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ color: "#94a3b8" }}>Response Time</Typography>
                  <Typography sx={{ fontWeight: 700 }}>1.6h</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
