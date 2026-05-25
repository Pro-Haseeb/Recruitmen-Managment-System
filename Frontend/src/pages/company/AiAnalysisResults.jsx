import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupsIcon from "@mui/icons-material/Groups";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import GlassCard from "../../components/recruitmentAnalysis/GlassCard.jsx";
import CandidateRankCard from "../../components/recruitmentAnalysis/CandidateRankCard.jsx";
import { loadAnalysisSession } from "../../utils/recruitmentAnalysis/analysisStorage.js";
import { RESULT_TABS, getCriteriaLabel } from "../../utils/recruitmentAnalysis/constants.js";
import { analysisTheme } from "../../utils/recruitmentAnalysis/analysisTheme.js";

const SORT_OPTIONS = [
  { value: "rank", label: "Rank (default)" },
  { value: "score_desc", label: "AI Score (high → low)" },
  { value: "score_asc", label: "AI Score (low → high)" },
  { value: "name", label: "Name (A → Z)" },
];

function StatTile({ icon: Icon, label, value, color }) {
  return (
    <GlassCard sx={{ textAlign: "center", py: 2.5 }}>
      <Icon sx={{ fontSize: 28, color, mb: 1 }} />
      <Typography sx={{ fontSize: "26px", fontWeight: 900, color: "#fff" }}>{value}</Typography>
      <Typography sx={{ color: "#64748b", fontSize: "12px", fontWeight: 600 }}>{label}</Typography>
    </GlassCard>
  );
}

export default function AiAnalysisResults() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const session = loadAnalysisSession(jobId);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rank");

  const results = session?.results;
  const job = session?.job;
  const usedCriteria = session?.criteria || [];

  const filteredCandidates = useMemo(() => {
    if (!results?.candidates) return [];
    let list = [...results.candidates];

    if (activeTab !== "all") {
      list = list.filter((c) => c.tier === activeTab);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.appliedRole || "").toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "score_desc":
        list.sort((a, b) => b.aiScore - a.aiScore);
        break;
      case "score_asc":
        list.sort((a, b) => a.aiScore - b.aiScore);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => a.rank - b.rank);
    }

    return list;
  }, [results, activeTab, search, sortBy]);

  if (!session || !results) {
    return (
      <Box sx={{ color: "white", maxWidth: 600, mx: "auto", textAlign: "center", py: 8 }}>
        <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
          No analysis results found
        </Typography>
        <Typography sx={{ color: "#94a3b8", mb: 3 }}>
          Run AI analysis from All Jobs after the application deadline has passed.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/company/jobs")} sx={{ textTransform: "none" }}>
          Go to All Jobs
        </Button>
      </Box>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Box sx={{ color: "white", maxWidth: 1100, mx: "auto" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/company/jobs")}
          sx={{ color: "#94a3b8", mb: 2, textTransform: "none", fontWeight: 600 }}
        >
          Back to All Jobs
        </Button>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <AutoAwesomeIcon sx={{ color: analysisTheme.primaryLight }} />
            <Typography variant="overline" sx={{ color: analysisTheme.primaryLight, fontWeight: 800 }}>
              AI Analysis Report
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: "-0.5px" }}>
            {results.jobTitle}
          </Typography>
          <Typography sx={{ color: "#94a3b8", fontSize: "14px", mt: 0.5 }}>
            Generated {new Date(results.analyzedAt).toLocaleString()} · {results.totalCandidates} candidates ranked
          </Typography>
          {usedCriteria.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 2 }}>
              {usedCriteria.map((c) => (
                <Chip
                  key={c.id}
                  label={`${getCriteriaLabel(c)} · ${c.weight}%`}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    bgcolor: "rgba(59,130,246,0.12)",
                    color: "#93c5fd",
                    border: "1px solid rgba(59,130,246,0.25)",
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatTile icon={GroupsIcon} label="Total Analyzed" value={results.totalCandidates} color="#60a5fa" />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatTile icon={ThumbUpIcon} label="Recommended" value={results.recommended} color="#4ade80" />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatTile icon={TrendingUpIcon} label="Average" value={results.average} color="#fbbf24" />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatTile icon={ThumbDownIcon} label="Rejected" value={results.rejected} color="#f87171" />
          </Grid>
        </Grid>

        <GlassCard sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", mb: 2 }}>
            {RESULT_TABS.map((tab) => (
              <Chip
                key={tab.id}
                label={tab.label}
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  fontWeight: 700,
                  cursor: "pointer",
                  bgcolor: activeTab === tab.id ? "rgba(37,99,235,0.22)" : "rgba(255,255,255,0.04)",
                  color: activeTab === tab.id ? "#60a5fa" : "#94a3b8",
                  border: activeTab === tab.id ? "1px solid rgba(96,165,250,0.35)" : "1px solid transparent",
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search candidate…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#64748b", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                minWidth: 200,
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  borderRadius: "12px",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                },
              }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel sx={{ color: "#94a3b8" }}>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{
                  color: "#fff",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.1)" },
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </GlassCard>

        {filteredCandidates.length === 0 ? (
          <GlassCard sx={{ textAlign: "center", py: 6 }}>
            <Typography sx={{ color: "#94a3b8" }}>No candidates match your filters.</Typography>
          </GlassCard>
        ) : (
          filteredCandidates.map((candidate) => (
            <CandidateRankCard key={candidate.id} candidate={candidate} />
          ))
        )}

        <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/company/jobs/${jobId}/applications`, { state: { job } })}
            sx={{ color: "#94a3b8", borderColor: "rgba(255,255,255,0.12)", textTransform: "none" }}
          >
            View Applications
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/company/jobs")}
            sx={{
              background: analysisTheme.gradientBtn,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.45)",
              "&:hover": { background: analysisTheme.gradientBtnHover },
            }}
          >
            Done
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
}
