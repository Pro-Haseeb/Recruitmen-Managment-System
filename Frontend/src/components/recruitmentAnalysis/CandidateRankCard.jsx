import { Box, Typography, Chip, Grid } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GlassCard from "./GlassCard.jsx";
import MatchScoreBar from "./MatchScoreBar.jsx";

const TIER_STYLES = {
  recommended: { bg: "rgba(74,222,128,0.12)", color: "#4ade80", border: "rgba(74,222,128,0.3)" },
  average: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "rgba(251,191,36,0.3)" },
  rejected: { bg: "rgba(239,68,68,0.12)", color: "#f87171", border: "rgba(239,68,68,0.3)" },
};

export default function CandidateRankCard({ candidate }) {
  const tierStyle = TIER_STYLES[candidate.tier] || TIER_STYLES.average;
  const scoreColor =
    candidate.tier === "recommended" ? "#4ade80" : candidate.tier === "rejected" ? "#f87171" : "#fbbf24";

  return (
    <GlassCard sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "flex-start", mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "14px",
            background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(124,58,237,0.2))",
            border: "1px solid rgba(96,165,250,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            color: "#60a5fa",
            fontSize: "18px",
          }}
        >
          {candidate.rank <= 3 ? (
            <EmojiEventsIcon sx={{ color: candidate.rank === 1 ? "#fbbf24" : "#94a3b8", fontSize: 28 }} />
          ) : (
            `#${candidate.rank}`
          )}
        </Box>

        <Box sx={{ flex: 1, minWidth: 180 }}>
          <Typography sx={{ fontWeight: 800, color: "#fff", fontSize: "17px" }}>
            {candidate.name}
          </Typography>
          <Typography sx={{ color: "#94a3b8", fontSize: "13px" }}>{candidate.email}</Typography>
          <Typography sx={{ color: "#64748b", fontSize: "12px", mt: 0.3 }}>
            {candidate.appliedRole}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 900,
              background: `linear-gradient(135deg, ${scoreColor}, #60a5fa)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
            }}
          >
            {candidate.aiScore}%
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: "11px", fontWeight: 600, mb: 0.5 }}>
            AI Score
          </Typography>
          <Chip
            label={candidate.statusLabel}
            size="small"
            sx={{
              fontWeight: 800,
              bgcolor: tierStyle.bg,
              color: tierStyle.color,
              border: `1px solid ${tierStyle.border}`,
            }}
          />
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <MatchScoreBar label="Overall Match" value={candidate.matchScore} color={scoreColor} />
          {(candidate.criteriaBreakdown || []).slice(0, 3).map((c) => (
            <MatchScoreBar key={c.id} label={c.label} value={c.score} />
          ))}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography sx={{ color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", mb: 1 }}>
            Top Strengths
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 2 }}>
            {(candidate.strengths || []).map((s) => (
              <Chip
                key={s}
                label={s}
                size="small"
                sx={{
                  bgcolor: "rgba(74,222,128,0.1)",
                  color: "#86efac",
                  border: "1px solid rgba(74,222,128,0.2)",
                  fontSize: "11px",
                  height: 26,
                }}
              />
            ))}
          </Box>
          <Typography sx={{ color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", mb: 1 }}>
            Missing Skills
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {(candidate.missingSkills || []).map((s) => (
              <Chip
                key={s}
                label={s}
                size="small"
                sx={{
                  bgcolor: "rgba(239,68,68,0.08)",
                  color: "#fca5a5",
                  border: "1px solid rgba(239,68,68,0.2)",
                  fontSize: "11px",
                  height: 26,
                }}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </GlassCard>
  );
}
