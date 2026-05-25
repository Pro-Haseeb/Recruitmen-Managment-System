import { Box, Typography, Slider, IconButton, LinearProgress } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { CRITERIA_META } from "../../utils/recruitmentAnalysis/constants.js";
import { analysisTheme } from "../../utils/recruitmentAnalysis/analysisTheme.js";

export default function CriterionWeightCard({
  criterion,
  icon: Icon,
  onWeightChange,
  onRemove,
  removable = false,
}) {
  const meta = CRITERIA_META[criterion.id];
  const title = meta?.label || criterion.label;
  const description = meta?.description || "Custom evaluation factor";

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: analysisTheme.cardRadius,
        background: analysisTheme.glass,
        backdropFilter: "blur(20px)",
        border: `1px solid ${analysisTheme.glassBorder}`,
        transition: "border-color 0.25s, box-shadow 0.25s",
        "&:hover": {
          borderColor: "rgba(96, 165, 250, 0.25)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 1.5 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "14px",
            flexShrink: 0,
            background: analysisTheme.sectionHighlight,
            border: `1px solid ${analysisTheme.sectionHighlightBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: analysisTheme.primaryLight,
          }}
        >
          {Icon ? <Icon sx={{ fontSize: 22 }} /> : (
            <Typography sx={{ fontWeight: 800, fontSize: "14px" }}>{title[0]}</Typography>
          )}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, color: analysisTheme.text, fontSize: "15px", letterSpacing: "-0.2px" }}>
            {title}
          </Typography>
          <Typography sx={{ color: analysisTheme.textBody, fontSize: "13px", lineHeight: 1.45, mt: 0.35 }}>
            {description}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography
            sx={{
              color: "#93c5fd",
              fontWeight: 900,
              fontSize: "20px",
              minWidth: 44,
              textAlign: "right",
            }}
          >
            {criterion.weight}%
          </Typography>
          {removable && onRemove && (
            <IconButton size="small" onClick={onRemove} sx={{ color: analysisTheme.error }}>
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      <LinearProgress
        variant="determinate"
        value={criterion.weight}
        sx={{
          height: 4,
          borderRadius: 2,
          mb: 1.5,
          bgcolor: "rgba(255,255,255,0.06)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 2,
            background: analysisTheme.gradientBtn,
          },
        }}
      />

      <Slider
        value={criterion.weight}
        min={0}
        max={50}
        step={1}
        onChange={(_, v) => onWeightChange(v)}
        sx={{
          color: analysisTheme.primaryLight,
          py: 0.5,
          "& .MuiSlider-thumb": {
            width: 16,
            height: 16,
            boxShadow: `0 0 12px ${analysisTheme.primaryGlow}`,
          },
          "& .MuiSlider-rail": { opacity: 0.4 },
        }}
      />
    </Box>
  );
}
