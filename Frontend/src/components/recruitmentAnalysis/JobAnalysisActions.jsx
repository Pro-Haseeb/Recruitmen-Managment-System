import { Box, Button, Chip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useNavigate } from "react-router-dom";
import { isJobDeadlinePassed } from "../../utils/recruitmentAnalysis/jobDeadline.js";

export default function JobAnalysisActions({ job, onAnalyze, compact = false }) {
  const navigate = useNavigate();
  const deadlinePassed = isJobDeadlinePassed(job);

  const handleView = (e) => {
    e.stopPropagation();
    navigate(`/company/jobs/${job._id}/applications`, { state: { job } });
  };

  const handleAnalyze = (e) => {
    e.stopPropagation();
    onAnalyze?.(job);
  };

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={{
        display: "flex",
        flexDirection: compact ? "column" : { xs: "column", sm: "row" },
        gap: 1,
        alignItems: compact ? "stretch" : { xs: "stretch", sm: "center" },
        mt: 2,
        pt: 2,
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {!deadlinePassed && (
        <Chip
          icon={<HourglassEmptyIcon sx={{ fontSize: "14px !important" }} />}
          label="Collecting Applications"
          size="small"
          sx={{
            bgcolor: "rgba(251, 191, 36, 0.12)",
            color: "#fbbf24",
            border: "1px solid rgba(251, 191, 36, 0.25)",
            fontWeight: 700,
            mr: compact ? 0 : { sm: "auto" },
          }}
        />
      )}

      <Button
        size="small"
        variant="outlined"
        startIcon={<VisibilityIcon />}
        onClick={handleView}
        sx={{
          color: "#94a3b8",
          borderColor: "rgba(255,255,255,0.12)",
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "10px",
          "&:hover": { borderColor: "#60a5fa", color: "#60a5fa", bgcolor: "rgba(96,165,250,0.08)" },
        }}
      >
        View Applications
      </Button>

      {deadlinePassed && (
        <Button
          size="small"
          variant="contained"
          startIcon={<AutoAwesomeIcon />}
          onClick={handleAnalyze}
          sx={{
            background: "linear-gradient(135deg, #2563eb, #3b82f6)",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)",
            "&:hover": {
              background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
            },
          }}
        >
          Analyze Applications
        </Button>
      )}
    </Box>
  );
}
