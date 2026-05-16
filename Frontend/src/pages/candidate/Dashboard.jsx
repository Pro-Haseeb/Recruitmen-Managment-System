import { Box, Typography, Grid, LinearProgress, Chip, Avatar } from "@mui/material";
import { Work, CheckCircle, Description, AccessTime } from "@mui/icons-material";
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

export default function CandidateDashboard() {
  const stats = [
    { title: "Applied Jobs", value: "12", icon: <Work />, color: "#3b82f6" },
    { title: "Shortlisted", value: "3", icon: <CheckCircle />, color: "#10b981" },
    { title: "Interviews", value: "1", icon: <AccessTime />, color: "#f59e0b" },
    { title: "Profile Score", value: "85%", icon: <Description />, color: "#8b5cf6" }
  ];

  const recentActivity = [
    { title: "Frontend Developer at TechCorp", status: "Shortlisted", date: "2 days ago", color: "#10b981" },
    { title: "React Native Engineer at InnovateAI", status: "Applied", date: "4 days ago", color: "#3b82f6" },
    { title: "Full Stack Dev at FutureNet", status: "Under Review", date: "1 week ago", color: "#f59e0b" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ color: "white", maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 1, letterSpacing: "-0.5px" }}>
          Welcome back!
        </Typography>
        <Typography sx={{ color: "#94a3b8", mb: 4 }}>
          Here is what's happening with your job applications today.
        </Typography>

        <Grid container spacing={3}>
          {stats.map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <GlassCard>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${stat.color}20`, color: stat.color }}>
                    {stat.icon}
                  </Avatar>
                  <Typography sx={{ color: "#94a3b8", fontWeight: 500 }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h3" fontWeight="800" sx={{ color: stat.color }}>
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
                Recent Applications
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {recentActivity.map((app, i) => (
                  <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <Box>
                      <Typography fontWeight="600">{app.title}</Typography>
                      <Typography variant="body2" sx={{ color: "#94a3b8" }}>{app.date}</Typography>
                    </Box>
                    <Chip label={app.status} size="small" sx={{ bgcolor: `${app.color}20`, color: app.color, fontWeight: 600 }} />
                  </Box>
                ))}
              </Box>
            </GlassCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <GlassCard sx={{ height: "100%" }}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
                Profile Completion
              </Typography>
              <Typography sx={{ color: "#94a3b8", mb: 3 }}>
                Complete your profile to increase your chances of getting hired.
              </Typography>
              
              <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight="600">85%</Typography>
                <Typography variant="body2" sx={{ color: "#8b5cf6" }}>Almost there!</Typography>
              </Box>
              <LinearProgress
                value={85}
                variant="determinate"
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: "rgba(255,255,255,0.05)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 5,
                    background: "linear-gradient(90deg, #c084fc, #a855f7)"
                  }
                }}
              />
            </GlassCard>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
}