import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  IconButton,
  Button,
  TextField,
  Chip,
  Alert,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import SchoolIcon from "@mui/icons-material/School";
import VerifiedIcon from "@mui/icons-material/Verified";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import CodeIcon from "@mui/icons-material/Code";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";

import CriterionWeightCard from "./CriterionWeightCard.jsx";
import {
  DEFAULT_CRITERIA,
  WEIGHT_TARGET,
  WEIGHT_PRESETS,
  applyPreset,
  getCriteriaLabel,
} from "../../utils/recruitmentAnalysis/constants.js";
import { formatJobDeadline } from "../../utils/recruitmentAnalysis/jobDeadline.js";
import { analysisTheme } from "../../utils/recruitmentAnalysis/analysisTheme.js";

const CRITERIA_ICONS = {
  experience: WorkHistoryIcon,
  education: SchoolIcon,
  certifications: VerifiedIcon,
  projects: FolderSpecialIcon,
  skills: CodeIcon,
  communication: RecordVoiceOverIcon,
};

const chipSx = {
  fontWeight: 700,
  fontSize: "13px",
  bgcolor: analysisTheme.chipBg,
  color: analysisTheme.chipText,
  border: `1px solid ${analysisTheme.glassBorder}`,
  "& .MuiChip-icon": { color: `${analysisTheme.primaryLight} !important` },
};

function SectionTitle({ children, hint }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography
        sx={{
          color: analysisTheme.sectionTitle,
          fontWeight: 800,
          fontSize: "16px",
          letterSpacing: "-0.2px",
        }}
      >
        {children}
      </Typography>
      {hint && (
        <Typography sx={{ color: analysisTheme.textBody, fontSize: "13px", mt: 0.5, lineHeight: 1.5 }}>
          {hint}
        </Typography>
      )}
    </Box>
  );
}

function makeId() {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function AiAnalysisSetupModal({ open, job, onClose, onStart }) {
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA);
  const [customLabel, setCustomLabel] = useState("");
  const [error, setError] = useState("");
  const [activePreset, setActivePreset] = useState("balanced");

  useEffect(() => {
    if (open) {
      setCriteria(DEFAULT_CRITERIA.map((c) => ({ ...c })));
      setCustomLabel("");
      setError("");
      setActivePreset("balanced");
    }
  }, [open]);

  const totalWeight = useMemo(
    () => criteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0),
    [criteria]
  );

  const isValid = totalWeight === WEIGHT_TARGET && criteria.every((c) => c.label.trim());

  const standardCriteria = criteria.filter((c) => DEFAULT_CRITERIA.some((d) => d.id === c.id));
  const customCriteria = criteria.filter((c) => !DEFAULT_CRITERIA.some((d) => d.id === c.id));

  const updateWeight = (id, value) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, weight: value } : c)));
    setActivePreset("");
    setError("");
  };

  const applyPresetWeights = (key) => {
    setCriteria(applyPreset(key));
    setActivePreset(key);
    setError("");
  };

  const addCustom = () => {
    const label = customLabel.trim();
    if (!label) return;
    setCriteria((prev) => [...prev, { id: makeId(), label, weight: 0 }]);
    setCustomLabel("");
    setActivePreset("");
  };

  const removeCriterion = (id) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
    setActivePreset("");
  };

  const handleStart = () => {
    if (totalWeight !== WEIGHT_TARGET) {
      setError(`All categories must add up to ${WEIGHT_TARGET}% (you have ${totalWeight}%).`);
      return;
    }
    onStart?.({ criteria, totalWeight });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: analysisTheme.backdrop,
            backdropFilter: "blur(10px)",
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: analysisTheme.modalRadius,
          background: analysisTheme.modalBgGradient,
          border: `1px solid ${analysisTheme.glassBorder}`,
          boxShadow: "0 40px 80px rgba(0,0,0,0.75)",
          color: analysisTheme.text,
          overflow: "hidden",
          maxHeight: "92vh",
        },
      }}
    >
      <Box sx={{ height: 4, background: analysisTheme.gradientBtn }} />

      <Box sx={{ p: { xs: 2.5, md: 3.5 }, overflowY: "auto", maxHeight: "calc(92vh - 4px)" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="800" sx={{ color: "#fff", letterSpacing: "-0.5px" }}>
              AI applicant scoring
            </Typography>
            <Typography sx={{ color: analysisTheme.textBody, mt: 0.75, fontSize: "15px" }}>
              <strong style={{ color: "#fff" }}>{job?.title || "Job"}</strong>
              {" · "}Deadline: {formatJobDeadline(job)}
            </Typography>
            <Typography sx={{ color: analysisTheme.textMuted, mt: 1, fontSize: "14px", maxWidth: 480, lineHeight: 1.55 }}>
              Choose how important each area is. All percentages must total 100%.
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ color: analysisTheme.textBody, "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.08)" } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: "16px",
            background: analysisTheme.sectionHighlight,
            border: `1px solid ${analysisTheme.sectionHighlightBorder}`,
          }}
        >
          <SectionTitle hint="Each applicant will be rated on these six areas.">
            What we check
          </SectionTitle>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {DEFAULT_CRITERIA.map((c) => {
              const Icon = CRITERIA_ICONS[c.id];
              const w = criteria.find((x) => x.id === c.id)?.weight ?? c.weight;
              return (
                <Chip
                  key={c.id}
                  icon={Icon ? <Icon sx={{ fontSize: "18px !important" }} /> : undefined}
                  label={`${getCriteriaLabel(c)} — ${w}%`}
                  size="medium"
                  sx={chipSx}
                />
              );
            })}
            {customCriteria.map((c) => (
              <Chip key={c.id} label={`${c.label} — ${c.weight}%`} size="medium" sx={{ ...chipSx, color: "#e9d5ff" }} />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <SectionTitle hint="Pick a starting mix, then fine-tune below.">
            Quick setup
          </SectionTitle>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {Object.entries(WEIGHT_PRESETS).map(([key, preset]) => (
              <Chip
                key={key}
                label={preset.label}
                onClick={() => applyPresetWeights(key)}
                sx={{
                  ...chipSx,
                  cursor: "pointer",
                  bgcolor: activePreset === key ? "rgba(37, 99, 235, 0.35)" : analysisTheme.chipBg,
                  color: activePreset === key ? "#fff" : analysisTheme.chipText,
                  border: activePreset === key ? "1px solid #60a5fa" : chipSx.border,
                  "&:hover": { bgcolor: "rgba(59,130,246,0.25)", color: "#fff" },
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <SectionTitle hint="Slide to set how much each area counts toward the final score.">
            How important is each?
          </SectionTitle>
          <Chip
            label={`Total: ${totalWeight}% / ${WEIGHT_TARGET}%`}
            sx={{
              fontWeight: 800,
              fontSize: "13px",
              color: totalWeight === WEIGHT_TARGET ? "#86efac" : "#fca5a5",
              bgcolor: totalWeight === WEIGHT_TARGET ? "rgba(74,222,128,0.2)" : "rgba(239,68,68,0.2)",
              border: `1px solid ${totalWeight === WEIGHT_TARGET ? "rgba(74,222,128,0.4)" : "rgba(239,68,68,0.4)"}`,
            }}
          />
        </Box>

        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          {standardCriteria.map((c) => (
            <Grid key={c.id} size={{ xs: 12, sm: 6 }}>
              <CriterionWeightCard
                criterion={c}
                icon={CRITERIA_ICONS[c.id]}
                onWeightChange={(v) => updateWeight(c.id, v)}
              />
            </Grid>
          ))}
          {customCriteria.map((c) => (
            <Grid key={c.id} size={{ xs: 12, sm: 6 }}>
              <CriterionWeightCard
                criterion={c}
                onWeightChange={(v) => updateWeight(c.id, v)}
                onRemove={() => removeCriterion(c.id)}
                removable
              />
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            mb: 2,
            p: 2,
            borderRadius: "16px",
            border: `1px dashed ${analysisTheme.glassBorder}`,
            background: analysisTheme.glass,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Add another area (e.g. Leadership)"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            InputLabelProps={{ style: { color: analysisTheme.textBody } }}
            inputProps={{ style: { color: "#fff" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                background: analysisTheme.glass,
                "& fieldset": { borderColor: analysisTheme.glassBorder },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                "&.Mui-focused fieldset": { borderColor: analysisTheme.primaryLight },
              },
              "& .MuiInputBase-input::placeholder": { color: analysisTheme.textDim, opacity: 1 },
            }}
          />
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addCustom}
            sx={{
              borderColor: "rgba(255,255,255,0.25)",
              color: analysisTheme.textBody,
              textTransform: "none",
              borderRadius: "12px",
              fontWeight: 600,
              "&:hover": { borderColor: "#60a5fa", color: "#fff", bgcolor: "rgba(59,130,246,0.12)" },
            }}
          >
            Add
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, color: "#fecaca", bgcolor: "rgba(239,68,68,0.15)", fontWeight: 600 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", pt: 1 }}>
          <Button onClick={onClose} sx={{ color: analysisTheme.textBody, textTransform: "none", fontWeight: 600, fontSize: "15px" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!isValid}
            startIcon={<AutoAwesomeIcon />}
            onClick={handleStart}
            sx={{
              px: 3,
              py: 1.25,
              background: analysisTheme.gradientBtn,
              color: "#fff",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "15px",
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
              "&:hover": { background: analysisTheme.gradientBtnHover },
              "&:disabled": { color: "rgba(255,255,255,0.5)" },
            }}
          >
            Start analysis
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
