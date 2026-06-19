import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Note as NoteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { updateInterview } from "../../services/CompanyApi";

export default function InterviewFeedbackModal({ open, onClose, interview, onSuccess }) {
  const [formData, setFormData] = useState({
    feedback: interview?.feedback || "",
    result: interview?.result || "pending",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!formData.result || formData.result === "pending") {
      setError("Please select Selected or Rejected");
      return;
    }

    if (!interview?._id) {
      setError("Invalid interview");
      return;
    }

    setLoading(true);
    try {
      const response = await updateInterview(
        interview._id,
        formData.feedback,
        formData.result
      );

      if (response.data?.success) {
        onSuccess?.();
        handleClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update interview");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ feedback: interview?.feedback || "", result: interview?.result || "pending" });
    setError("");
    onClose();
  };

  if (!interview) return null;

  const RESULT_OPTIONS = [
    { value: "selected", label: "Selected", color: "#34d399", bg: "rgba(52,211,153,0.1)" },
    { value: "rejected", label: "Rejected", color: "#f87171", bg: "rgba(239,68,68,0.1)" },
  ];

  const selectedResult = RESULT_OPTIONS.find((r) => r.value === formData.result);

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
          <NoteIcon sx={{ color: "#a78bfa", fontSize: 24 }} />
          <Typography variant="h6" fontWeight={700}>
            Interview Feedback
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Interview Info */}
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
                {interview.candidate?.name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", mb: 0.5 }}>
                Position
              </Typography>
              <Typography sx={{ color: "#fff", fontWeight: 600 }}>
                {interview.job?.title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", mb: 0.5 }}>
                Interview Type
              </Typography>
              <Typography sx={{ color: "#cbd5e1", fontWeight: 500 }}>
                {interview.interviewType?.charAt(0).toUpperCase() + interview.interviewType?.slice(1)}
              </Typography>
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

        {/* Result Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ color: "#94a3b8", fontSize: "13px", fontWeight: 600, mb: 1.5 }}>
            Interview Result *
          </Typography>
          <Grid container spacing={1.5}>
            {RESULT_OPTIONS.map((option) => (
              <Grid item xs={6} key={option.value}>
                <Button
                  fullWidth
                  onClick={() => setFormData((prev) => ({ ...prev, result: option.value }))}
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    border: formData.result === option.value ? `2px solid ${option.color}` : "1px solid rgba(255,255,255,0.1)",
                    background: formData.result === option.value ? option.bg : "rgba(255,255,255,0.02)",
                    color: option.color,
                    fontWeight: 700,
                    fontSize: "13px",
                    transition: "all 0.2s",
                    "&:hover": { background: option.bg },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                  startIcon={
                    option.value === "selected" ? (
                      <CheckCircleIcon />
                    ) : (
                      <CancelIcon />
                    )
                  }
                >
                  {option.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Feedback Textarea */}
        <TextField
          fullWidth
          multiline
          rows={5}
          label="Interview Feedback & Notes"
          name="feedback"
          value={formData.feedback}
          onChange={handleChange}
          placeholder="Write your detailed feedback about the candidate's performance, technical skills, communication, etc."
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
          disabled={loading || formData.result === "pending"}
          variant="contained"
          startIcon={loading ? <CircularProgress size={18} /> : <CheckCircleIcon />}
          sx={{
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "10px",
            "&:hover": { background: "linear-gradient(135deg, #1d4ed8, #6d28d9)" },
            "&.Mui-disabled": { background: "rgba(59,130,246,0.3)", color: "rgba(255,255,255,0.5)" },
          }}
        >
          {loading ? "Saving..." : "Save Feedback & Result"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
