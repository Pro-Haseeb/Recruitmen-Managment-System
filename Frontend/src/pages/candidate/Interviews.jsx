import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  VideoCall as VideoCallIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getMyInterviews } from "../../services/CandidateApi";
import {
  STATUS_CONFIG,
  getInterviewStatus,
  formatInterviewDate,
  formatInterviewTime,
  copyToClipboard,
} from "../../utils/interviewUtils";

function GlassCard({ children, sx = {} }) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: "20px",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function StatusBadge({ interview }) {
  const status = getInterviewStatus(interview);
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.scheduled;

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        fontWeight: 700,
        fontSize: "11px",
        color: config.color,
        bgcolor: config.bg,
        border: `1px solid ${config.border}`,
      }}
    />
  );
}

export default function CandidateInterviews() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await getMyInterviews();
      if (res.data?.success) {
        setInterviews(res.data.data || []);
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Failed to load interviews",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleCopyLink = async (link) => {
    try {
      await copyToClipboard(link);
      setToast({ open: true, message: "Meeting link copied!", severity: "success" });
    } catch {
      setToast({ open: true, message: "Failed to copy link", severity: "error" });
    }
  };

  const upcoming = interviews.filter((iv) => {
    const status = getInterviewStatus(iv);
    return status === "scheduled" || status === "active";
  });

  const pastPending = interviews.filter((iv) => getInterviewStatus(iv) === "completed");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ color: "white", maxWidth: 900, mx: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: "-0.5px", mb: 0.5 }}>
              My Interviews
            </Typography>
            <Typography sx={{ color: "#94a3b8" }}>
              Your scheduled interviews and meeting links in one place.
            </Typography>
          </Box>
          <IconButton
            onClick={fetchInterviews}
            disabled={loading}
            sx={{ color: "#a855f7", border: "1px solid rgba(168,85,247,0.25)", borderRadius: "10px" }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress sx={{ color: "#a855f7" }} />
          </Box>
        ) : interviews.length === 0 ? (
          <GlassCard sx={{ textAlign: "center", py: 8 }}>
            <ScheduleIcon sx={{ fontSize: 56, color: "#334155", mb: 2 }} />
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              No Interviews Scheduled
            </Typography>
            <Typography sx={{ color: "#64748b", mb: 3 }}>
              When a company schedules an interview for you, it will appear here.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate("/candidate/applied")}
              sx={{ textTransform: "none", color: "#a855f7", borderColor: "rgba(168,85,247,0.4)" }}
            >
              View Applied Jobs
            </Button>
          </GlassCard>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {upcoming.length > 0 && (
              <Box>
                <Typography sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", mb: 2 }}>
                  Upcoming & Active
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {upcoming.map((iv, idx) => (
                    <InterviewCard key={iv._id} interview={iv} index={idx} onCopy={handleCopyLink} primary />
                  ))}
                </Box>
              </Box>
            )}

            {pastPending.length > 0 && (
              <Box>
                <Typography sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", mb: 2 }}>
                  Awaiting Result
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {pastPending.map((iv, idx) => (
                    <InterviewCard key={iv._id} interview={iv} index={idx} onCopy={handleCopyLink} />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}

        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={() => setToast((p) => ({ ...p, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert severity={toast.severity} onClose={() => setToast((p) => ({ ...p, open: false }))}>
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </motion.div>
  );
}

function InterviewCard({ interview, index, onCopy, primary = false }) {
  const status = getInterviewStatus(interview);
  const isOnline = interview.interviewType === "online";
  const showJoin = isOnline && interview.meetingLink && (status === "scheduled" || status === "active");

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
      <GlassCard
        sx={{
          border: primary ? "1px solid rgba(168,85,247,0.25)" : "1px solid rgba(255,255,255,0.06)",
          boxShadow: primary ? "0 0 40px rgba(168,85,247,0.08)" : undefined,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2, flexWrap: "wrap", gap: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: "18px", color: "#fff", mb: 0.5 }}>
              {interview.job?.title || "Interview"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <BusinessIcon sx={{ fontSize: 14, color: "#64748b" }} />
              <Typography sx={{ color: "#94a3b8", fontSize: "14px" }}>
                {interview.company?.name || "Company"}
              </Typography>
            </Box>
          </Box>
          <StatusBadge interview={interview} />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <CalendarIcon sx={{ fontSize: 15, color: "#64748b" }} />
            <Typography sx={{ color: "#cbd5e1", fontSize: "13px" }}>
              {formatInterviewDate(interview.interviewDate)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <TimeIcon sx={{ fontSize: 15, color: "#64748b" }} />
            <Typography sx={{ color: "#cbd5e1", fontSize: "13px" }}>
              {formatInterviewTime(interview.interviewDate)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <LocationIcon sx={{ fontSize: 15, color: "#64748b" }} />
            <Typography sx={{ color: "#cbd5e1", fontSize: "13px", textTransform: "capitalize" }}>
              {interview.interviewType || "online"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          {showJoin && (
            <Button
              variant="contained"
              startIcon={<VideoCallIcon />}
              href={interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "10px",
                px: 3,
                "&:hover": { background: "linear-gradient(135deg, #9333ea, #2563eb)" },
              }}
            >
              Join Meeting
            </Button>
          )}
          {isOnline && interview.meetingLink && (
            <Tooltip title="Copy meeting link">
              <Button
                variant="outlined"
                startIcon={<CopyIcon />}
                onClick={() => onCopy(interview.meetingLink)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "10px",
                  color: "#94a3b8",
                  borderColor: "rgba(255,255,255,0.12)",
                }}
              >
                Copy Link
              </Button>
            </Tooltip>
          )}
        </Box>
      </GlassCard>
    </motion.div>
  );
}
