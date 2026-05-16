import { useState, useEffect } from "react";
import { Box, Typography, Grid, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { getAllJobs } from "../../services/CandidateApi.js"; // Assuming this is used for jobs for now

function GlassCard({ children, sx = {} }) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
        },
        ...sx
      }}
    >
      {children}
    </Box>
  );
}

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getAllJobs();
        setJobs(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ color: "white", maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 1, letterSpacing: "-0.5px" }}>
          All Jobs
        </Typography>
        <Typography sx={{ color: "#94a3b8", mb: 4 }}>
          Manage your active job postings.
        </Typography>

        {jobs.length === 0 ? (
          <GlassCard sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ color: "#94a3b8" }}>No jobs posted yet.</Typography>
          </GlassCard>
        ) : (
          <Grid container spacing={3}>
            {jobs.map((job, idx) => (
              <Grid item xs={12} md={6} key={job._id || idx}>
                <GlassCard>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight="700">
                        {job.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                        {job.location || "Remote"}
                      </Typography>
                    </Box>
                    <Chip label="Active" size="small" sx={{ bgcolor: "rgba(74, 222, 128, 0.1)", color: "#4ade80", fontWeight: 600 }} />
                  </Box>

                  <Typography sx={{ color: "#cbd5e1", mb: 3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {job.description || "No description provided."}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip label={`${job.experience || 0} Yrs Exp`} size="small" sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "#94a3b8" }} />
                    <Chip label={`${job.salary || "Negotiable"}`} size="small" sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "#94a3b8" }} />
                  </Box>
                </GlassCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </motion.div>
  );
}
