import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import {
  Close as CloseIcon,
  VideoCall as VideoCallIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { scheduleInterview, getInterviewers } from "../../services/CompanyApi";

export default function ScheduleInterviewModal({ open, onClose, application, onSuccess }) {
  const [formData, setFormData] = useState({
    interviewer: "",
    interviewDate: "",
    interviewType: "online",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [interviewers, setInterviewers] = useState([]);
  const [loadingInterviewers, setLoadingInterviewers] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchInterviewers = async () => {
      setLoadingInterviewers(true);
      try {
        const response = await getInterviewers();
        if (response.data?.success) {
          setInterviewers(response.data.data || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load interviewers");
      } finally {
        setLoadingInterviewers(false);
      }
    };

    fetchInterviewers();
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async () => {
    // Validate
    if (!formData.interviewer || !formData.interviewDate) {
      setError("Please fill in all required fields");
      return;
    }

    if (!application?._id) {
      setError("Invalid application");
      return;
    }

    setLoading(true);
    try {
      const response = await scheduleInterview(
        application._id,
        formData.interviewer,
        formData.interviewDate,
        formData.interviewType
      );

      if (response.data?.success) {
        onSuccess?.();
        handleClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule interview");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ interviewer: "", interviewDate: "", interviewType: "online" });
    setError("");
    onClose();
  };

  if (!application) return null;

  // Get min datetime (today at 8 AM)
  const now = new Date();
  now.setHours(8, 0);
  const minDateTime = now.toISOString().slice(0, 16);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          background: "rgba(15,23,42,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(90deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ScheduleIcon sx={{ color: "#60a5fa", fontSize: 24 }} />
          <Typography variant="h6" fontWeight={700}>
            Schedule Interview
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Candidate Info */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: "12px",
            background: "rgba(59,130,246,0.05)",
            border: "1px solid rgba(59,130,246,0.15)",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", mb: 0.5 }}>
                Candidate
              </Typography>
              <Typography sx={{ color: "#fff", fontWeight: 600 }}>
                {application.candidate?.name || application.candidateName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", mb: 0.5 }}>
                Applied For
              </Typography>
              <Typography sx={{ color: "#fff", fontWeight: 600 }}>
                {application.job?.title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", mb: 0.5 }}>
                Score
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: "100%",
                    height: 8,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${Math.min(application.score || 0, 100)}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #60a5fa, #34d399)",
                      transition: "width 0.3s ease",
                    }}
                  />
                </Box>
                <Typography sx={{ color: "#60a5fa", fontWeight: 700, minWidth: 35 }}>
                  {Math.round(application.score || 0)}%
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: "10px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#fca5a5",
              "& .MuiAlert-icon": { color: "#f87171" },
            }}
          >
            {error}
          </Alert>
        )}

        {/* Form Fields */}
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Interviewer *"
              name="interviewer"
              value={formData.interviewer}
              onChange={handleChange}
              disabled={loadingInterviewers}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                },
                "& .MuiInputLabel-root": { color: "#94a3b8" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#60a5fa" },
                "& .MuiSelect-icon": { color: "#64748b" },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.08)",
                    },
                  },
                },
              }}
            >
              {interviewers.length === 0 ? (
                <MenuItem disabled value="">
                  {loadingInterviewers ? "Loading interviewers..." : "No team members available"}
                </MenuItem>
              ) : (
                interviewers.map((member) => (
                  <MenuItem key={member._id} value={member._id} sx={{ color: "#fff" }}>
                    {member.name} ({member.role === "company_admin" ? "Admin" : "HR"})
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date & Time *"
              name="interviewDate"
              type="datetime-local"
              value={formData.interviewDate}
              onChange={handleChange}
              inputProps={{ min: minDateTime }}
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                },
                "& .MuiInputLabel-root": { color: "#94a3b8" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#60a5fa" },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Interview Type *"
              name="interviewType"
              value={formData.interviewType}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                },
                "& .MuiInputLabel-root": { color: "#94a3b8" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#60a5fa" },
                "& .MuiSelect-icon": { color: "#64748b" },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.08)",
                    },
                  },
                },
              }}
            >
              <MenuItem value="online" sx={{ color: "#60a5fa" }}>
                Online
              </MenuItem>
              <MenuItem value="onsite" sx={{ color: "#34d399" }}>
                Onsite
              </MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Typography sx={{ color: "#64748b", fontSize: "12px", mt: 2 }}>
          A meeting link will be automatically generated and shared with the candidate.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ textTransform: "none", color: "#64748b", fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={18} /> : <VideoCallIcon />}
          sx={{
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "10px",
            "&:hover": { background: "linear-gradient(135deg, #1d4ed8, #6d28d9)" },
            "&.Mui-disabled": { background: "rgba(59,130,246,0.3)", color: "rgba(255,255,255,0.5)" },
          }}
        >
          {loading ? "Scheduling..." : "Schedule Interview"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
