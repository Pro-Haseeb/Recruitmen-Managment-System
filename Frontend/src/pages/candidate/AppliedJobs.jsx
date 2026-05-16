import { Box, Typography, Grid, Chip } from "@mui/material";
import { motion } from "framer-motion";

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

export default function AppliedJobs() {
  const appliedJobs = [
    { title: "Frontend Developer", company: "TechCorp", status: "Shortlisted", date: "2 days ago", color: "#10b981" },
    { title: "React Native Engineer", company: "InnovateAI", status: "Applied", date: "4 days ago", color: "#3b82f6" },
    { title: "Full Stack Dev", company: "FutureNet", status: "Under Review", date: "1 week ago", color: "#f59e0b" },
    { title: "UI/UX Designer", company: "CreativeStudio", status: "Rejected", date: "2 weeks ago", color: "#ef4444" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ color: "white", maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 1, letterSpacing: "-0.5px" }}>
          Applied Jobs
        </Typography>
        <Typography sx={{ color: "#94a3b8", mb: 4 }}>
          Track the status of all your applications.
        </Typography>

        <Grid container spacing={3}>
          {appliedJobs.map((job, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <GlassCard>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="700">
                      {job.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                      {job.company}
                    </Typography>
                  </Box>
                  <Chip label={job.status} size="small" sx={{ bgcolor: `${job.color}20`, color: job.color, fontWeight: 600 }} />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, pt: 2, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Applied {job.date}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#60a5fa", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                    View Details
                  </Typography>
                </Box>
              </GlassCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </motion.div>
  );
}
