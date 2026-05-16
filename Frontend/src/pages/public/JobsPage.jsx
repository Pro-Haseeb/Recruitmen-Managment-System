import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  TextField,
  MenuItem,
  Grid,
  Card,
  Avatar,
  Chip,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllJobs } from "../../services/CandidateApi";

const bgImages = [
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
  "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
  "https://images.unsplash.com/photo-1551434678-e076c223a692"
];

const fallbackJobs = [
  {
    title: "Senior Frontend Engineer",
    company: "TechNova Inc.",
    location: "San Francisco",
    experience: "5+ years",
    level: "Senior",
    salary: "$130k - $160k",
    posted: "2 days ago",
    status: "Open"
  },
  {
    title: "AI/ML Engineer",
    company: "DeepMind Solutions",
    location: "New York",
    experience: "3+ years",
    level: "Mid",
    salary: "$140k - $180k",
    posted: "1 day ago",
    status: "Open"
  },
  {
    title: "Product Manager",
    company: "WorkForce Pro",
    location: "Austin",
    experience: "1+ years",
    level: "Entry",
    salary: "$110k - $140k",
    posted: "3 days ago",
    status: "Open"
  }
];

export default function JobsPage() {
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("Any");
  const [experience, setExperience] = useState("Any");

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await getAllJobs();
        setJobs(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Could not fetch jobs", error);
        setJobs([]);
      } finally {
        setHasFetched(true);
      }
    }

    fetchJobs();
  }, []);

  const activeJobs = hasFetched ? jobs : fallbackJobs;

  const filteredJobs = activeJobs.filter((job) => {
    const title = (job.title || "").toLowerCase();
    const level = (job.experienceLevel || job.level || "Any").toLowerCase();
    return (
      title.includes(search.toLowerCase()) &&
      (location === "Any" || (job.location || "").toLowerCase() === location.toLowerCase()) &&
      (experience === "Any" || level === experience.toLowerCase())
    );
  });

  return (
    <Box sx={{ background: "#050d18", minHeight: "100vh", color: "white" }}>
      <Box
        sx={{
          backgroundImage: `url(${bgImages[bgIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          py: 12,
          position: "relative"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(rgba(2,6,23,0.78), rgba(2,6,23,0.88))"
          }}
        />

        <Container sx={{ position: "relative", textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontWeight: 900,
              background: "linear-gradient(45deg,#ffffff,#90caf9,#42a5f5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Find Your Dream Job
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.72)", mt: 2, fontSize: "18px" }}>
            Discover AI matched opportunities
          </Typography>
          <Box
            sx={{
              mt: 6,
              display: "flex",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(18px)",
              borderRadius: 5,
              p: 2,
              gap: 2,
              maxWidth: 900,
              mx: "auto",
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              placeholder="Search jobs..."
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ disableUnderline: true, sx: { color: "white" } }}
              sx={{ input: { color: "#fff" } }}
            />
            <TextField
              select
              variant="standard"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              InputProps={{ disableUnderline: true, sx: { color: "white" } }}
              sx={{ minWidth: 130, "& .MuiSelect-select": { color: "#fff" } }}
            >
              <MenuItem value="Any">All Location</MenuItem>
              <MenuItem value="San Francisco">San Francisco</MenuItem>
              <MenuItem value="New York">New York</MenuItem>
              <MenuItem value="Austin">Austin</MenuItem>
            </TextField>
            <TextField
              select
              variant="standard"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              InputProps={{ disableUnderline: true, sx: { color: "white" } }}
              sx={{ minWidth: 120, "& .MuiSelect-select": { color: "#fff" } }}
            >
              <MenuItem value="Any">Any Level</MenuItem>
              <MenuItem value="Entry">Entry</MenuItem>
              <MenuItem value="Mid">Mid</MenuItem>
              <MenuItem value="Senior">Senior</MenuItem>
            </TextField>
            <Button variant="contained" sx={{ borderRadius: "12px", px: 4, background: "linear-gradient(135deg,#1976d2,#42a5f5)" }}>
              Search
            </Button>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 8 }}>
        <Typography variant="h5" textAlign="center" fontWeight="700" mb={6} sx={{ color: "#fff", letterSpacing: "0.5px" }}>
          {search ? `${search.charAt(0).toUpperCase() + search.slice(1)} Jobs Found` : `${filteredJobs.length} Jobs Found`}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Grid container spacing={3} sx={{ maxWidth: "1100px", justifyContent: "center" }}>
            {filteredJobs.length === 0 ? (
              <Box sx={{ width: "100%", textAlign: "center", py: 8 }}>
                {hasFetched ? (
                  <Typography sx={{ color: "#cbd5e1" }}>No jobs found.</Typography>
                ) : (
                  <CircularProgress color="primary" />
                )}
              </Box>
            ) : (
              filteredJobs.slice(0, 6).map((job, index) => {
                const companyLabel = job.company?.name || job.company || "RecruitAI";
                const experienceLabel = job.experienceLevel || job.level || "Any";
                const initials = companyLabel.slice(0, 2).toUpperCase();
                const postedAt = job.createdAt ? new Date(job.createdAt).toLocaleDateString() : job.posted || "Today";

                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        height: 330,
                        borderRadius: 5,
                        p: 2.5,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textAlign: "center",
                        background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                        backdropFilter: "blur(18px)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "white",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
                        transition: "all 0.35s ease",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "3px",
                          background: "linear-gradient(90deg,#1976d2,#42a5f5)",
                          opacity: 0,
                          transition: "0.3s"
                        },
                        "&:hover": {
                          transform: "translateY(-10px) scale(1.02)",
                          boxShadow: "0 25px 50px rgba(0,0,0,0.45)"
                        },
                        "&:hover::before": {
                          opacity: 1
                        }
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.9, width: "100%" }}>
                        <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, fontWeight: "bold", boxShadow: "0 6px 15px rgba(17, 133, 228, 0.3)" }}>
                          {initials}
                        </Avatar>
                        <Typography fontWeight="700" sx={{ fontSize: "15px", lineHeight: 1.2, maxWidth: "90%" }}>
                          {job.title}
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontSize: "13px", fontWeight: 500 }}>
                          {companyLabel}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
                          <Chip label={job.location || "Remote"} size="small" sx={{ fontSize: "10px", background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }} />
                          <Chip label={experienceLabel} size="small" sx={{ fontSize: "10px", background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }} />
                        </Box>
                        <Typography sx={{ fontSize: "12px", opacity: 0.7 }}>
                          {job.status || "Open"}
                        </Typography>
                        <Typography fontWeight="700" sx={{ fontSize: "14px", color: "#1976d2" }}>
                          {job.salary || "$0"}
                        </Typography>
                        <Chip label={job.level || "Hiring"} size="small" sx={{ mt: 0.5, fontSize: "11px", background: "rgba(211, 220, 230, 0.88)", color: "#1976d2", fontWeight: "600" }} />
                      </Box>
                      <Box sx={{ width: "100%", mt: 1 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{
                            borderRadius: 3,
                            py: 1,
                            fontWeight: "600",
                            background: "linear-gradient(135deg,#1976d2,#42a5f5)",
                            transition: "0.3s",
                            "&:hover": {
                              transform: "scale(1.05)",
                              boxShadow: "0 12px 25px rgba(25,118,210,0.35)"
                            }
                          }}
                          onClick={() => navigate(`/Candidate/jobs/${job._id}`)}
                        >
                          Apply Now
                        </Button>
                        <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 0.6, opacity: 0.6 }}>
                          Posted {postedAt}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                );
              })
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
