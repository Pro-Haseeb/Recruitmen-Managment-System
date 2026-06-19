import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  Skeleton,
  Button,
} from "@mui/material";
import {
  Work,
  CheckCircle,
  Description,
  AccessTime,
  VideoCall as VideoCallIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAllJobs, getMyInterviews } from "../../services/CandidateApi.js";
import {
  getInterviewStatus,
  formatInterviewDate,
  formatInterviewTime,
} from "../../utils/interviewUtils";

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
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const candidateId = user._id || user.email || "guest";
  const storageKey = `appliedJobs_${candidateId}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, interviewsRes] = await Promise.all([
          getAllJobs().catch(() => ({ data: [] })),
          getMyInterviews().catch(() => ({ data: { data: [] } })),
        ]);

        const allJobs = Array.isArray(jobsRes.data) ? jobsRes.data : [];
        const appliedList = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const userAppliedJobs = allJobs.filter((job) => appliedList.includes(job._id));

        const mapped = userAppliedJobs.map((job, index) => {
          const statuses = ["Applied", "Shortlisted", "Under Review", "Rejected"];
          const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
          const statusIdx = index % statuses.length;
          return {
            ...job,
            appStatus: statuses[statusIdx],
            appColor: colors[statusIdx],
            appDate: `${(index * 2) + 1} day${index * 2 === 0 ? "" : "s"} ago`,
          };
        });

        setJobs(mapped);
        setInterviews(interviewsRes.data?.data || []);
      } catch (error) {
        console.error("Error loading candidate dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [storageKey]);

  const appliedCount = jobs.length;
  const shortlistedCount = jobs.filter((j) => j.appStatus === "Shortlisted").length;
  const interviewCount = interviews.length;

  let profileCompletion = 40;
  if (user.name) profileCompletion += 15;
  if (user.email) profileCompletion += 15;
  if (user.role) profileCompletion += 15;
  profileCompletion = Math.min(profileCompletion, 100);

  const stats = [
    { title: "Applied Jobs", value: appliedCount.toString(), icon: <Work />, color: "#3b82f6" },
    { title: "Shortlisted", value: shortlistedCount.toString(), icon: <CheckCircle />, color: "#10b981" },
    { title: "Interviews Scheduled", value: interviewCount.toString(), icon: <AccessTime />, color: "#f59e0b" },
    { title: "Profile Score", value: `${profileCompletion}%`, icon: <Description />, color: "#8b5cf6" },
  ];

  const recentActivity = jobs.slice(0, 3).map((j) => ({
    title: `${j.title} at ${j.company?.name || j.company || "Enterprise Partner"}`,
    status: j.appStatus,
    date: j.appDate,
    color: j.appColor,
  }));

  const upcomingInterviews = interviews
    .filter((iv) => {
      const status = getInterviewStatus(iv);
      return status === "scheduled" || status === "active";
    })
    .slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ color: "white", maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 1, letterSpacing: "-0.5px" }}>
          Welcome back, {user.name || "Candidate"}!
        </Typography>
        <Typography sx={{ color: "#94a3b8", mb: 4 }}>
          Here is what's happening with your job applications today.
        </Typography>

        {loading ? (
          <Grid container spacing={3}>
            {[...Array(4)].map((_, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <GlassCard>
                  <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                  <Skeleton variant="text" width="60%" sx={{ bgcolor: "rgba(255,255,255,0.05)", mt: 2 }} />
                  <Skeleton variant="text" width="40%" height={32} sx={{ bgcolor: "rgba(255,255,255,0.05)", mt: 1 }} />
                </GlassCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {stats.map((stat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <GlassCard
                  sx={{ cursor: stat.title === "Interviews Scheduled" ? "pointer" : "default" }}
                  onClick={stat.title === "Interviews Scheduled" ? () => navigate("/candidate/interviews") : undefined}
                >
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
        )}

        <Grid container spacing={4} sx={{ mt: 1 }}>
          <Grid item xs={12} md={8}>
            {upcomingInterviews.length > 0 && (
              <GlassCard sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h6" fontWeight="700">
                    Upcoming Interviews
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/candidate/interviews")}
                    sx={{ textTransform: "none", color: "#a855f7" }}
                  >
                    View All
                  </Button>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {upcomingInterviews.map((iv) => (
                    <Box
                      key={iv._id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(168,85,247,0.06)",
                        border: "1px solid rgba(168,85,247,0.15)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography fontWeight="700">{iv.job?.title}</Typography>
                        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                          {iv.company?.name} · {formatInterviewDate(iv.interviewDate)} at {formatInterviewTime(iv.interviewDate)}
                        </Typography>
                      </Box>
                      {iv.meetingLink && iv.interviewType === "online" && (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<VideoCallIcon />}
                          href={iv.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: "8px",
                          }}
                        >
                          Join Meeting
                        </Button>
                      )}
                    </Box>
                  ))}
                </Box>
              </GlassCard>
            )}

            <GlassCard sx={{ height: upcomingInterviews.length > 0 ? "auto" : "100%" }}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                Recent Applications
              </Typography>

              {loading ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={60} sx={{ borderRadius: 2, bgcolor: "rgba(255,255,255,0.05)" }} />
                  ))}
                </Box>
              ) : recentActivity.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center", color: "#64748b" }}>
                  <Typography>No applications recorded yet. Start viewing positions and apply!</Typography>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {recentActivity.map((app, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <Box>
                        <Typography fontWeight="600">{app.title}</Typography>
                        <Typography variant="body2" sx={{ color: "#94a3b8" }}>{app.date}</Typography>
                      </Box>
                      <Chip label={app.status} size="small" sx={{ bgcolor: `${app.color}20`, color: app.color, fontWeight: 600 }} />
                    </Box>
                  ))}
                </Box>
              )}
            </GlassCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <GlassCard sx={{ height: "100%" }}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
                Profile Completion
              </Typography>
              <Typography sx={{ color: "#94a3b8", mb: 3 }}>
                Complete your profile details to increase your visibility to premium partner recruiters.
              </Typography>

              <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight="600">{profileCompletion}%</Typography>
                <Typography variant="body2" sx={{ color: "#8b5cf6" }}>
                  {profileCompletion === 100 ? "Fully Complete!" : "Almost there!"}
                </Typography>
              </Box>
              <LinearProgress
                value={profileCompletion}
                variant="determinate"
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: "rgba(255,255,255,0.05)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 5,
                    background: "linear-gradient(90deg, #c084fc, #a855f7)",
                  },
                }}
              />
            </GlassCard>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
}
