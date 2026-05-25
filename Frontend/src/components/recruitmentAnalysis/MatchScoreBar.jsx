import { Box, Typography, LinearProgress } from "@mui/material";

export default function MatchScoreBar({ label, value, color = "#60a5fa" }) {
  const pct = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography sx={{ color: "#94a3b8", fontSize: "12px", fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography sx={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 700 }}>
          {pct}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: "rgba(255,255,255,0.06)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 4,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
          },
        }}
      />
    </Box>
  );
}
