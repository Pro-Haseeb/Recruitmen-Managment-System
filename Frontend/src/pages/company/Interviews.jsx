import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import {
  VideoCall as VideoCallIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  ContentCopy as CopyIcon,
  OpenInNew as OpenIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getInterview, updateInterview } from "../../services/CompanyApi";
import InterviewFeedbackModal from "../../components/modals/InterviewFeedbackModal";
import {
  STATUS_CONFIG,
  getInterviewStatus,
  isScheduledOrUpcoming,
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
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.05)",
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

const FILTER_TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "pending", label: "All Pending" },
  { key: "results", label: "Results" },
];

export default function Interviews() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("upcoming");
  const [selected, setSelected] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const response = await getInterview();
      if (response.data?.success) {
        setInterviews(response.data.data || []);
      } else {
        throw new Error(response.data?.message || "Failed to fetch interviews");
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

  const filtered = interviews.filter((iv) => {
    if (filter === "upcoming") return isScheduledOrUpcoming(iv);
    if (filter === "pending") return iv.result === "pending";
    return iv.result === "selected" || iv.result === "rejected";
  });

  const upcomingCount = interviews.filter(isScheduledOrUpcoming).length;

  const handleCopyLink = async (link) => {
    try {
      await copyToClipboard(link);
      setToast({ open: true, message: "Meeting link copied!", severity: "success" });
    } catch {
      setToast({ open: true, message: "Failed to copy link", severity: "error" });
    }
  };

  const handleQuickResult = async (id, result) => {
    try {
      const response = await updateInterview(id, null, result);
      if (response.data?.success) {
        setToast({ open: true, message: `Marked as ${result}`, severity: "success" });
        fetchInterviews();
        setSelected(null);
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Failed to update interview",
        severity: "error",
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ color: "white", maxWidth: 1100, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: "-0.5px", mb: 0.5 }}>
              Scheduled Interviews
            </Typography>
            <Typography sx={{ color: "#94a3b8" }}>
              {upcomingCount} upcoming interview{upcomingCount !== 1 ? "s" : ""} · Manage meeting links and outcomes
            </Typography>
          </Box>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/company/applications")}
            sx={{
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              "&:hover": { background: "linear-gradient(135deg, #1d4ed8, #6d28d9)" },
            }}
          >
            Schedule from Applications
          </Button>
        </Box>

        {/* Filter tabs */}
        <Box sx={{ mb: 3, display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
          {FILTER_TABS.map((tab) => (
            <Chip
              key={tab.key}
              label={tab.label}
              onClick={() => setFilter(tab.key)}
              sx={{
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
                ...(filter === tab.key
                  ? {
                      background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                      color: "#fff",
                      border: "none",
                    }
                  : {
                      background: "rgba(255,255,255,0.03)",
                      color: "#94a3b8",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }),
              }}
            />
          ))}
          <Box sx={{ flex: 1 }} />
          <IconButton
            onClick={fetchInterviews}
            disabled={loading}
            sx={{ color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)", borderRadius: "10px" }}
          >
            <RefreshIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Interview list */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={12}>
            <CircularProgress sx={{ color: "#60a5fa" }} />
          </Box>
        ) : filtered.length === 0 ? (
          <GlassCard sx={{ textAlign: "center", py: 10 }}>
            <ScheduleIcon sx={{ fontSize: 52, color: "#1e3a5f", mb: 2 }} />
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              No Interviews Found
            </Typography>
            <Typography sx={{ color: "#64748b", mb: 3, fontSize: "14px" }}>
              {filter === "upcoming"
                ? "No upcoming interviews. Schedule one from the Applications page."
                : "No interviews match this filter."}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate("/company/applications")}
              sx={{ textTransform: "none", color: "#60a5fa", borderColor: "rgba(96,165,250,0.3)" }}
            >
              Go to Applications
            </Button>
          </GlassCard>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filtered.map((iv, idx) => (
              <motion.div key={iv._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
                <GlassCard sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
                    {/* Left: candidate + job info */}
                    <Box sx={{ flex: 1, minWidth: 220 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "10px",
                            background: "rgba(167,139,250,0.12)",
                            border: "1px solid rgba(167,139,250,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#a78bfa",
                            fontWeight: 800,
                            fontSize: "14px",
                          }}
                        >
                          {(iv.candidate?.name?.[0] || "?").toUpperCase()}
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: "15px", color: "#fff" }}>
                            {iv.candidate?.name || "Unknown Candidate"}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                            <WorkIcon sx={{ fontSize: 12, color: "#475569" }} />
                            <Typography sx={{ color: "#94a3b8", fontSize: "13px" }}>
                              {iv.job?.title || "N/A"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, pl: 0.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                          <PersonIcon sx={{ fontSize: 13, color: "#475569" }} />
                          <Typography sx={{ color: "#64748b", fontSize: "12px" }}>
                            {iv.interviewer?.name || "—"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                          <CalendarIcon sx={{ fontSize: 13, color: "#475569" }} />
                          <Typography sx={{ color: "#64748b", fontSize: "12px" }}>
                            {formatInterviewDate(iv.interviewDate)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                          <TimeIcon sx={{ fontSize: 13, color: "#475569" }} />
                          <Typography sx={{ color: "#64748b", fontSize: "12px" }}>
                            {formatInterviewTime(iv.interviewDate)}
                          </Typography>
                        </Box>
                        <Chip
                          label={iv.interviewType === "onsite" ? "Onsite" : "Online"}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "10px",
                            fontWeight: 700,
                            color: iv.interviewType === "onsite" ? "#34d399" : "#60a5fa",
                            bgcolor: iv.interviewType === "onsite" ? "rgba(52,211,153,0.08)" : "rgba(96,165,250,0.08)",
                            border: `1px solid ${iv.interviewType === "onsite" ? "rgba(52,211,153,0.2)" : "rgba(96,165,250,0.2)"}`,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Right: status + actions */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1.5 }}>
                      <StatusBadge interview={iv} />

                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        {iv.meetingLink && iv.interviewType === "online" && (
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<VideoCallIcon />}
                              href={iv.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: "8px",
                                fontSize: "12px",
                                "&:hover": { background: "linear-gradient(135deg, #1d4ed8, #6d28d9)" },
                              }}
                            >
                              Join Meeting
                            </Button>
                            <Tooltip title="Copy link">
                              <IconButton
                                size="small"
                                onClick={() => handleCopyLink(iv.meetingLink)}
                                sx={{ color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }}
                              >
                                <CopyIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Open link">
                              <IconButton
                                size="small"
                                href={iv.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                component="a"
                                sx={{ color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }}
                              >
                                <OpenIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setSelected(iv)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "12px",
                            borderRadius: "8px",
                            color: "#94a3b8",
                            borderColor: "rgba(255,255,255,0.12)",
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </GlassCard>
              </motion.div>
            ))}
          </Box>
        )}

        {/* Detail dialog */}
        <Dialog
          open={Boolean(selected)}
          onClose={() => setSelected(null)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "16px",
              background: "rgba(15,23,42,0.98)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
            },
          }}
        >
          {selected && (
            <>
              <DialogTitle sx={{ fontWeight: 800 }}>
                Interview Details
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                  {[
                    { label: "Candidate", value: selected.candidate?.name },
                    { label: "Job", value: selected.job?.title },
                    { label: "Interviewer", value: selected.interviewer?.name },
                    { label: "Date", value: formatInterviewDate(selected.interviewDate) },
                    { label: "Time", value: formatInterviewTime(selected.interviewDate) },
                    { label: "Type", value: selected.interviewType },
                  ].map(({ label, value }) => (
                    <Box key={label}>
                      <Typography sx={{ color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", mb: 0.3 }}>
                        {label}
                      </Typography>
                      <Typography sx={{ color: "#e2e8f0", fontSize: "14px", textTransform: label === "Type" ? "capitalize" : "none" }}>
                        {value || "—"}
                      </Typography>
                    </Box>
                  ))}

                  {selected.meetingLink && (
                    <Box sx={{ p: 1.5, borderRadius: "10px", bgcolor: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)" }}>
                      <Typography sx={{ color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", mb: 0.5 }}>
                        Meeting Link
                      </Typography>
                      <Typography sx={{ color: "#34d399", fontSize: "13px", wordBreak: "break-all" }}>
                        {selected.meetingLink}
                      </Typography>
                    </Box>
                  )}

                  {selected.feedback && (
                    <Box>
                      <Typography sx={{ color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", mb: 0.3 }}>
                        Feedback
                      </Typography>
                      <Typography sx={{ color: "#cbd5e1", fontSize: "14px" }}>{selected.feedback}</Typography>
                    </Box>
                  )}

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ color: "#64748b", fontSize: "12px" }}>Status:</Typography>
                    <StatusBadge interview={selected} />
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2, gap: 1, flexWrap: "wrap" }}>
                {selected.result === "pending" && (
                  <>
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => setShowFeedbackModal(true)}
                      sx={{ textTransform: "none", color: "#60a5fa" }}
                    >
                      Add Feedback
                    </Button>
                    <Button
                      onClick={() => handleQuickResult(selected._id, "selected")}
                      sx={{ textTransform: "none", color: "#34d399" }}
                    >
                      Mark Selected
                    </Button>
                    <Button
                      onClick={() => handleQuickResult(selected._id, "rejected")}
                      sx={{ textTransform: "none", color: "#f87171" }}
                    >
                      Mark Rejected
                    </Button>
                  </>
                )}
                <Button onClick={() => setSelected(null)} sx={{ textTransform: "none", color: "#64748b" }}>
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        <InterviewFeedbackModal
          open={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          interview={selected}
          onSuccess={() => {
            setShowFeedbackModal(false);
            setSelected(null);
            fetchInterviews();
            setToast({ open: true, message: "Feedback saved!", severity: "success" });
          }}
        />

        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={() => setToast((p) => ({ ...p, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity={toast.severity}
            onClose={() => setToast((p) => ({ ...p, open: false }))}
            sx={{
              borderRadius: "12px",
              background: "rgba(15,23,42,0.95)",
              color: "#fff",
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </motion.div>
  );
}
