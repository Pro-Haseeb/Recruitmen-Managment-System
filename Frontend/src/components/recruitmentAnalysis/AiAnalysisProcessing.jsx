import { useEffect, useState } from "react";
import { Box, Typography, LinearProgress, Chip } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TuneIcon from "@mui/icons-material/Tune";
import CalculateIcon from "@mui/icons-material/Calculate";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  PROCESSING_STEPS,
  CRITERIA_META,
  getCriteriaLabel,
} from "../../utils/recruitmentAnalysis/constants.js";
import { analysisTheme } from "../../utils/recruitmentAnalysis/analysisTheme.js";

const STEP_ICONS = {
  reading: DescriptionIcon,
  extracting: PsychologyIcon,
  matching: TuneIcon,
  scoring: CalculateIcon,
  ranking: LeaderboardIcon,
};

export default function AiAnalysisProcessing({ open, jobTitle, criteria = [] }) {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      setProgress(0);
      return undefined;
    }

    const onProgress = (e) => {
      const idx = e.detail?.stepIndex ?? 0;
      setActiveStep(idx);
      setProgress(((idx + 1) / PROCESSING_STEPS.length) * 100);
    };

    window.addEventListener("recruitai-analysis-progress", onProgress);
    return () => window.removeEventListener("recruitai-analysis-progress", onProgress);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setActiveStep(0);
    setProgress(6);
  }, [open]);

  if (!open) return null;

  const activeCriteria =
    criteria.length > 0
      ? criteria
      : Object.keys(CRITERIA_META).map((id) => ({
          id,
          label: CRITERIA_META[id].label,
          weight: 0,
        }));

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: analysisTheme.backdrop,
        backdropFilter: "blur(12px)",
      }}
    >
      <Box
        sx={{
          width: "min(560px, 94vw)",
          p: { xs: 3, md: 4 },
          borderRadius: analysisTheme.modalRadius,
          background: analysisTheme.modalBgGradient,
          border: `1px solid ${analysisTheme.glassBorder}`,
          boxShadow: "0 25px 60px rgba(0,0,0,0.75)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: analysisTheme.gradientBtn }} />

        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
              borderRadius: "18px",
              background: analysisTheme.gradientBtn,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 32, color: "#fff" }} />
          </Box>
          <Typography variant="h5" fontWeight="800" sx={{ color: "#fff" }}>
            Scoring applicants
          </Typography>
          <Typography sx={{ color: analysisTheme.textBody, fontSize: "15px", mt: 0.75, fontWeight: 600 }}>
            {jobTitle}
          </Typography>
          <Typography sx={{ color: analysisTheme.textMuted, fontSize: "14px", mt: 0.5 }}>
            Please wait — this may take a moment.
          </Typography>
        </Box>

        <Box
          sx={{
            mb: 3,
            p: 2.5,
            borderRadius: "16px",
            background: analysisTheme.sectionHighlight,
            border: `1px solid ${analysisTheme.sectionHighlightBorder}`,
          }}
        >
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "15px", mb: 0.5 }}>
            Rating by
          </Typography>
          <Typography sx={{ color: analysisTheme.textBody, fontSize: "13px", mb: 1.5 }}>
            Experience, Education, Skills, Projects, Certifications, Communication
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {activeCriteria.map((c) => (
              <Chip
                key={c.id}
                label={`${getCriteriaLabel(c)}${c.weight ? ` ${c.weight}%` : ""}`}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "12px",
                  bgcolor: analysisTheme.chipBg,
                  color: analysisTheme.chipText,
                  border: `1px solid ${analysisTheme.glassBorder}`,
                }}
              />
            ))}
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            mb: 3,
            bgcolor: "rgba(255,255,255,0.08)",
            "& .MuiLinearProgress-bar": { borderRadius: 4, background: analysisTheme.gradientBtn },
          }}
        />

        <Box>
          {PROCESSING_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[step.id] || AutoAwesomeIcon;
            const done = index < activeStep;
            const active = index === activeStep;
            const pending = !done && !active;

            return (
              <Box
                key={step.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  py: 1.25,
                  px: 1.5,
                  mb: 0.75,
                  borderRadius: "14px",
                  background: active
                    ? analysisTheme.sectionHighlight
                    : done
                      ? "rgba(74,222,128,0.08)"
                      : analysisTheme.glass,
                  border: active
                    ? `1px solid ${analysisTheme.sectionHighlightBorder}`
                    : done
                      ? "1px solid rgba(74,222,128,0.2)"
                      : `1px solid ${analysisTheme.glassBorder}`,
                  opacity: pending && index > activeStep + 1 ? 0.7 : 1,
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: done ? "rgba(74,222,128,0.2)" : active ? analysisTheme.sectionHighlight : analysisTheme.glass,
                    color: done ? "#86efac" : active ? "#93c5fd" : analysisTheme.textBody,
                  }}
                >
                  {done ? <CheckCircleIcon sx={{ fontSize: 22 }} /> : <Icon sx={{ fontSize: 20 }} />}
                </Box>
                <Typography
                  sx={{
                    color: done ? "#86efac" : active ? "#fff" : analysisTheme.textBody,
                    fontWeight: active || done ? 700 : 600,
                    fontSize: "15px",
                  }}
                >
                  {step.label}
                  {active && "…"}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
