import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import {
  VideoCall as VideoCallIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Link as LinkIcon,
  Notes as NotesIcon,
  Close as CloseIcon,
  CalendarMonth as CalendarMonthIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassTop as PendingIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

// ─── Styles ──────────────────────────────────────────────────────────────────

const glassInputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    background: "rgba(255,255,255,0.03)",
    borderRadius: "12px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
    "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#60a5fa" },
  "& .MuiSelect-icon": { color: "#64748b" },
};

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

// ─── Seed mock data ───────────────────────────────────────────────────────────

const MOCK_INTERVIEWS = [
  {
    id: "1",
    candidateName: "Ahmed Hassan",
    candidateEmail: "ahmed@example.com",
    jobTitle: "Frontend Engineer",
    scheduledAt: "2026-06-18T10:00",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    interviewer: "Usman Tariq",
    notes: "Focus on React hooks and state management.",
    result: "pending",
  },
  {
    id: "2",
    candidateName: "Sara Khan",
    candidateEmail: "sara@example.com",
    jobTitle: "Backend Developer",
    scheduledAt: "2026-06-19T14:30",
    meetingLink: "https://zoom.us/j/987654321",
    interviewer: "Nida Aslam",
    notes: "Ask about Node.js, REST APIs, and MongoDB.",
    result: "pass",
  },
  {
    id: "3",
    candidateName: "Ali Raza",
    candidateEmail: "ali@example.com",
    jobTitle: "UI/UX Designer",
    scheduledAt: "2026-06-17T09:00",
    meetingLink: "https://teams.microsoft.com/xyz",
    interviewer: "Haseeb Malik",
    notes: "Review portfolio and design process.",
    result: "fail",
  },
];

const RESULT_CONFIG = {
  pending: { label: "Pending", color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", Icon: PendingIcon },
  pass:    { label: "Passed",  color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)", Icon: CheckCircleIcon },
  fail:    { label: "Failed",  color: "#f87171", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)",  Icon: CancelIcon },
};

const EMPTY_FORM = {
  candidateName: "",
  candidateEmail: "",
  jobTitle: "",
  scheduledAt: "",
  meetingLink: "",
  interviewer: "",
  notes: "",
  result: "pending",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Interviews() {
  const [interviews, setInterviews] = useState(MOCK_INTERVIEWS);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  // ── Derived ────────────────────────────────────────────────────────────────

  const filtered = interviews.filter((iv) =>
    filter === "all" ? true : iv.result === filter
  );

  const stats = {
    total:   interviews.length,
    pending: interviews.filter((iv) => iv.result === "pending").length,
    pass:    interviews.filter((iv) => iv.result === "pass").length,
    fail:    interviews.filter((iv) => iv.result === "fail").length,
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSchedule = () => {
    if (!form.candidateName || !form.jobTitle || !form.scheduledAt || !form.meetingLink) {
      setToast({ open: true, message: "Please fill in all required fields.", severity: "warning" });
      return;
    }
    const newInterview = { ...form, id: Date.now().toString() };
    setInterviews((prev) => [newInterview, ...prev]);
    setForm(EMPTY_FORM);
    setShowForm(false);
    setToast({ open: true, message: "Interview scheduled successfully!", severity: "success" });
  };

  const handleResultUpdate = (id, result) => {
    setInterviews((prev) =>
      prev.map((iv) => (iv.id === id ? { ...iv, result } : iv))
    );
    if (selected?.id === id) setSelected((s) => ({ ...s, result }));
    setToast({
      open: true,
      message: `Interview marked as ${RESULT_CONFIG[result].label}`,
      severity: result === "pass" ? "success" : result === "fail" ? "error" : "info",
    });
  };

  const handleDelete = (id) => {
    setInterviews((prev) => prev.filter((iv) => iv.id !== id));
    if (selected?.id === id) setSelected(null);
    setToast({ open: true, message: "Interview removed.", severity: "info" });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ color: "white", maxWidth: 1300, mx: "auto" }}>

        {/* ── HEADER ── */}
        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: "-0.5px", mb: 0.5 }}>
              Interviews
            </Typography>
            <Typography sx={{ color: "#94a3b8" }}>
              Schedule, track, and manage all candidate interviews in one place.
            </Typography>
          </Box>

          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => setShowForm(true)}
            sx={{
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              py: 1.2,
              boxShadow: "0 4px 20px rgba(59,130,246,0.3)",
              "&:hover": { background: "linear-gradient(135deg, #1d4ed8, #6d28d9)" },
            }}
          >
            Schedule Interview
          </Button>
        </Box>

        {/* ── STAT CARDS ── */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {[
            { label: "Total Scheduled", value: stats.total,   color: "#60a5fa", glow: "rgba(96,165,250,0.15)"   },
            { label: "Pending",          value: stats.pending, color: "#fbbf24", glow: "rgba(251,191,36,0.15)"  },
            { label: "Passed",           value: stats.pass,    color: "#34d399", glow: "rgba(52,211,153,0.15)"  },
            { label: "Failed",           value: stats.fail,    color: "#f87171", glow: "rgba(239,68,68,0.15)"   },
          ].map((s, i) => (
            <Grid item xs={6} sm={3} key={i}>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <GlassCard sx={{ textAlign: "center", py: 2.5, boxShadow: `0 0 30px ${s.glow}` }}>
                  <Typography sx={{ fontWeight: 800, fontSize: "28px", color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "12px", fontWeight: 600, mt: 0.5, textTransform: "uppercase", letterSpacing: "0.6px" }}>{s.label}</Typography>
                </GlassCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* ── FILTERS ── */}
        <Box sx={{ mb: 2.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {["all", "pending", "pass", "fail"].map((f) => (
            <Chip
              key={f}
              label={f === "all" ? "All" : RESULT_CONFIG[f].label}
              onClick={() => setFilter(f)}
              sx={{
                fontWeight: 700,
                fontSize: "12px",
                textTransform: "capitalize",
                cursor: "pointer",
                transition: "all 0.2s",
                ...(filter === f
                  ? {
                      background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                      color: "#fff",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
                    }
                  : {
                      background: "rgba(255,255,255,0.03)",
                      color: "#94a3b8",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }),
              }}
            />
          ))}
        </Box>

        {/* ── MAIN GRID: table + side panel ── */}
        <Grid container spacing={3}>

          {/* ─ TABLE ─ */}
          <Grid item xs={12} md={selected ? 7 : 12}>
            <GlassCard sx={{ p: 0, overflow: "hidden" }}>
              {filtered.length === 0 ? (
                <Box textAlign="center" py={10}>
                  <ScheduleIcon sx={{ fontSize: 52, color: "#1e3a5f", mb: 2 }} />
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#e2e8f0", mb: 1 }}>
                    No Interviews Found
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "14px" }}>
                    No interviews match the selected filter.
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} sx={{ background: "transparent", boxShadow: "none" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {["Candidate", "Job Position", "Scheduled At", "Interviewer", "Result", "Actions"].map((h) => (
                          <TableCell key={h} sx={{ color: "#64748b", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid rgba(255,255,255,0.06)", py: 2 }}>
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filtered.map((iv, idx) => {
                        const rc = RESULT_CONFIG[iv.result] || RESULT_CONFIG.pending;
                        const isActive = selected?.id === iv.id;
                        return (
                          <motion.tr
                            key={iv.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            style={{ display: "table-row" }}
                          >
                            <TableCell
                              onClick={() => setSelected(isActive ? null : iv)}
                              sx={{
                                cursor: "pointer",
                                fontWeight: 700,
                                color: isActive ? "#60a5fa" : "#fff",
                                borderBottom: "1px solid rgba(255,255,255,0.04)",
                                py: 2,
                                background: isActive ? "rgba(59,130,246,0.05)" : "transparent",
                                transition: "all 0.2s",
                                "&:hover": { color: "#60a5fa" },
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Box sx={{ width: 34, height: 34, borderRadius: "10px", background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa", fontWeight: 800, flexShrink: 0 }}>
                                  {(iv.candidateName?.[0] || "?").toUpperCase()}
                                </Box>
                                <Box>
                                  <Typography sx={{ fontWeight: 700, fontSize: "14px", color: "inherit" }}>{iv.candidateName}</Typography>
                                  <Typography sx={{ fontSize: "11px", color: "#475569" }}>{iv.candidateEmail}</Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: "#cbd5e1", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "13px", py: 2, background: isActive ? "rgba(59,130,246,0.05)" : "transparent" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                                <WorkIcon sx={{ fontSize: 13, color: "#475569" }} />
                                {iv.jobTitle}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "13px", py: 2, background: isActive ? "rgba(59,130,246,0.05)" : "transparent" }}>
                              <Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.2 }}>
                                  <CalendarMonthIcon sx={{ fontSize: 12, color: "#475569" }} />
                                  <Typography sx={{ fontSize: "12px", color: "#cbd5e1" }}>
                                    {new Date(iv.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                                  <AccessTimeIcon sx={{ fontSize: 12, color: "#475569" }} />
                                  <Typography sx={{ fontSize: "12px", color: "#475569" }}>
                                    {new Date(iv.scheduledAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: "#cbd5e1", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "13px", py: 2, background: isActive ? "rgba(59,130,246,0.05)" : "transparent" }}>
                              {iv.interviewer || "—"}
                            </TableCell>
                            <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.04)", py: 2, background: isActive ? "rgba(59,130,246,0.05)" : "transparent" }}>
                              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6, px: 1.2, py: 0.35, borderRadius: "8px", background: rc.bg, border: `1px solid ${rc.border}`, color: rc.color, fontSize: "11px", fontWeight: 700 }}>
                                <rc.Icon sx={{ fontSize: 12 }} />
                                {rc.label}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.04)", py: 2, background: isActive ? "rgba(59,130,246,0.05)" : "transparent" }}>
                              <Box sx={{ display: "flex", gap: 0.5 }}>
                                <IconButton size="small" onClick={() => handleDelete(iv.id)} sx={{ color: "#f87171", borderRadius: "8px", p: 0.7, "&:hover": { background: "rgba(239,68,68,0.1)" } }}>
                                  <CloseIcon sx={{ fontSize: 15 }} />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </GlassCard>
          </Grid>

          {/* ─ DETAIL PANEL ─ */}
          <AnimatePresence>
            {selected && (
              <Grid item xs={12} md={5}>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.28 }}
                >
                  <GlassCard sx={{ position: "sticky", top: 24 }}>
                    {/* Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: "14px", background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa", fontSize: 20, fontWeight: 800 }}>
                          {(selected.candidateName?.[0] || "?").toUpperCase()}
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: "15px", color: "#fff" }}>{selected.candidateName}</Typography>
                          <Typography sx={{ fontSize: "12px", color: "#64748b" }}>{selected.candidateEmail}</Typography>
                        </Box>
                      </Box>
                      <IconButton onClick={() => setSelected(null)} size="small" sx={{ color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", "&:hover": { color: "#fff", background: "rgba(239,68,68,0.12)" } }}>
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>

                    {/* Info rows */}
                    {[
                      { Icon: WorkIcon,          label: "Job Position",  value: selected.jobTitle },
                      { Icon: PersonIcon,         label: "Interviewer",   value: selected.interviewer || "—" },
                      { Icon: CalendarMonthIcon,  label: "Date",          value: new Date(selected.scheduledAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
                      { Icon: AccessTimeIcon,     label: "Time",          value: new Date(selected.scheduledAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) },
                    ].map(({ Icon, label, value }) => (
                      <Box key={label} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2, p: 1.5, borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                        <Icon sx={{ fontSize: 16, color: "#475569", mt: 0.2, flexShrink: 0 }} />
                        <Box>
                          <Typography sx={{ color: "#475569", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</Typography>
                          <Typography sx={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 500 }}>{value}</Typography>
                        </Box>
                      </Box>
                    ))}

                    {/* Meeting link */}
                    <Box sx={{ mb: 2, p: 1.5, borderRadius: "10px", background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.12)" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <LinkIcon sx={{ fontSize: 14, color: "#34d399" }} />
                        <Typography sx={{ color: "#475569", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>Meeting Link</Typography>
                      </Box>
                      <a href={selected.meetingLink} target="_blank" rel="noreferrer" style={{ color: "#34d399", fontSize: "13px", wordBreak: "break-all", textDecoration: "none" }}>
                        {selected.meetingLink}
                      </a>
                    </Box>

                    {/* Notes */}
                    {selected.notes && (
                      <Box sx={{ mb: 3, p: 1.5, borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                          <NotesIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                          <Typography sx={{ color: "#475569", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>Notes</Typography>
                        </Box>
                        <Typography sx={{ color: "#cbd5e1", fontSize: "13px", lineHeight: 1.6 }}>{selected.notes}</Typography>
                      </Box>
                    )}

                    {/* Result update */}
                    <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.06)", pt: 2.5 }}>
                      <Typography sx={{ color: "#475569", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", mb: 1.5 }}>Update Interview Result</Typography>
                      <Box sx={{ display: "flex", gap: 1.5 }}>
                        <Button
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleResultUpdate(selected.id, "pass")}
                          disabled={selected.result === "pass"}
                          sx={{ flex: 1, borderRadius: "10px", textTransform: "none", fontWeight: 700, background: selected.result === "pass" ? "rgba(52,211,153,0.15)" : "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399", "&:hover": { background: "rgba(52,211,153,0.15)" }, "&.Mui-disabled": { color: "#34d399", opacity: 0.6 } }}
                        >
                          Pass
                        </Button>
                        <Button
                          size="small"
                          startIcon={<CancelIcon />}
                          onClick={() => handleResultUpdate(selected.id, "fail")}
                          disabled={selected.result === "fail"}
                          sx={{ flex: 1, borderRadius: "10px", textTransform: "none", fontWeight: 700, background: selected.result === "fail" ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", "&:hover": { background: "rgba(239,68,68,0.15)" }, "&.Mui-disabled": { color: "#f87171", opacity: 0.6 } }}
                        >
                          Fail
                        </Button>
                        <Button
                          size="small"
                          startIcon={<PendingIcon />}
                          onClick={() => handleResultUpdate(selected.id, "pending")}
                          disabled={selected.result === "pending"}
                          sx={{ flex: 1, borderRadius: "10px", textTransform: "none", fontWeight: 700, background: selected.result === "pending" ? "rgba(251,191,36,0.15)" : "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24", "&:hover": { background: "rgba(251,191,36,0.15)" }, "&.Mui-disabled": { color: "#fbbf24", opacity: 0.6 } }}
                        >
                          Reset
                        </Button>
                      </Box>
                    </Box>
                  </GlassCard>
                </motion.div>
              </Grid>
            )}
          </AnimatePresence>
        </Grid>

        {/* ── SCHEDULE FORM MODAL ── */}
        <AnimatePresence>
          {showForm && (
            <Box
              onClick={() => setShowForm(false)}
              sx={{ position: "fixed", inset: 0, zIndex: 1400, background: "rgba(2,6,23,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.22 }}
                onClick={(e) => e.stopPropagation()}
                style={{ width: "100%", maxWidth: 600 }}
              >
                <GlassCard sx={{ border: "1px solid rgba(59,130,246,0.2)", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
                  {/* Form header */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ width: 4, height: 22, borderRadius: 2, background: "linear-gradient(180deg, #3b82f6, #8b5cf6)" }} />
                      <Typography sx={{ fontWeight: 800, fontSize: "17px", color: "#fff" }}>Schedule New Interview</Typography>
                    </Box>
                    <IconButton onClick={() => setShowForm(false)} size="small" sx={{ color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", "&:hover": { color: "#fff", background: "rgba(239,68,68,0.12)" } }}>
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>

                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Candidate Name *" name="candidateName" value={form.candidateName} onChange={handleFormChange} sx={glassInputStyle} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Candidate Email" name="candidateEmail" value={form.candidateEmail} onChange={handleFormChange} sx={glassInputStyle} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Job Position *" name="jobTitle" value={form.jobTitle} onChange={handleFormChange} sx={glassInputStyle} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Interviewer Name" name="interviewer" value={form.interviewer} onChange={handleFormChange} sx={glassInputStyle} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date & Time *"
                        name="scheduledAt"
                        type="datetime-local"
                        value={form.scheduledAt}
                        onChange={handleFormChange}
                        InputLabelProps={{ shrink: true }}
                        sx={glassInputStyle}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Result"
                        name="result"
                        value={form.result}
                        onChange={handleFormChange}
                        sx={glassInputStyle}
                        SelectProps={{ MenuProps: { PaperProps: { sx: { background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)" } } } }}
                      >
                        <MenuItem value="pending" sx={{ color: "#fbbf24" }}>Pending</MenuItem>
                        <MenuItem value="pass"    sx={{ color: "#34d399" }}>Pass</MenuItem>
                        <MenuItem value="fail"    sx={{ color: "#f87171" }}>Fail</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Meeting Link (Zoom / Google Meet) *" name="meetingLink" value={form.meetingLink} onChange={handleFormChange} sx={glassInputStyle} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth multiline rows={3} label="Notes / Instructions" name="notes" value={form.notes} onChange={handleFormChange} sx={glassInputStyle} />
                    </Grid>
                  </Grid>

                  <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}>
                    <Button onClick={() => setShowForm(false)} sx={{ textTransform: "none", color: "#64748b", fontWeight: 600, borderRadius: "10px" }}>
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<VideoCallIcon />}
                      onClick={handleSchedule}
                      sx={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", textTransform: "none", fontWeight: 700, borderRadius: "10px", px: 3, "&:hover": { background: "linear-gradient(135deg, #1d4ed8, #6d28d9)" } }}
                    >
                      Confirm Schedule
                    </Button>
                  </Box>
                </GlassCard>
              </motion.div>
            </Box>
          )}
        </AnimatePresence>

        {/* ── TOAST ── */}
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
              backdropFilter: "blur(12px)",
              color: "#fff",
              border: `1px solid ${toast.severity === "success" ? "rgba(52,211,153,0.2)" : toast.severity === "error" ? "rgba(239,68,68,0.2)" : "rgba(251,191,36,0.2)"}`,
              "& .MuiAlert-icon": { color: toast.severity === "success" ? "#34d399" : toast.severity === "error" ? "#ef4444" : "#fbbf24" },
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>

      </Box>
    </motion.div>
  );
}
