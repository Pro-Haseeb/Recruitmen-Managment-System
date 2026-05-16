import { Box, Typography, Grid, LinearProgress } from "@mui/material";
import { motion } from "framer-motion";

function GlassCard({ children, sx = {} }) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.03)",
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

export default function Dashboard() {
  const stats = [
    { title: "Active Jobs", value: "12" },
    { title: "Total Candidates", value: "154" },
    { title: "Shortlisted", value: "48" }
  ];

  const rankings = [
    { name: "Sarah Mitchell", score: 96, role: "Senior Frontend Engineer" },
    { name: "Ali Khan", score: 88, role: "Backend Developer" },
    { name: "Emma Watson", score: 82, role: "UX Designer" },
    { name: "James Chen", score: 76, role: "Product Manager" }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ color: "white" }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 4, letterSpacing: "-0.5px" }}>
          Dashboard Overview
        </Typography>

        <Grid container spacing={4}>
          {stats.map((stat, i) => (
            <Grid item xs={12} md={4} key={i}>
              <GlassCard>
                <Typography sx={{ color: "#94a3b8", mb: 1, fontWeight: 500 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h3" fontWeight="800" sx={{ color: "#60a5fa" }}>
                  {stat.value}
                </Typography>
              </GlassCard>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4} sx={{ mt: 1 }}>
          <Grid item xs={12} md={8}>
            <GlassCard sx={{ height: "100%" }}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                Top Ranked Candidates
              </Typography>

              {rankings.map((c, i) => (
                <Box key={i} sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Box>
                      <Typography fontWeight="600">{c.name}</Typography>
                      <Typography variant="body2" sx={{ color: "#94a3b8" }}>{c.role}</Typography>
                    </Box>
                    <Typography fontWeight="700" sx={{ color: c.score > 90 ? "#4ade80" : "#60a5fa" }}>
                      {c.score}% Match
                    </Typography>
                  </Box>
                  <LinearProgress
                    value={c.score}
                    variant="determinate"
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "rgba(255,255,255,0.05)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                        background: c.score > 90 ? "linear-gradient(90deg, #22c55e, #4ade80)" : "linear-gradient(90deg, #2563eb, #60a5fa)"
                      }
                    }}
                  />
                </Box>
              ))}
            </GlassCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <GlassCard sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Typography sx={{ color: "#94a3b8", mb: 4 }}>
                Need to hire fast? Post a new job or review applications.
              </Typography>
              {/* Buttons can go here later */}
            </GlassCard>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
}
