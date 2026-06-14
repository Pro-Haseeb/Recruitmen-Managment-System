import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Skeleton,
  ButtonGroup,
  Snackbar,
  Alert,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  OpenInNew as OpenInNewIcon,
  Description as DescriptionIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Star as StarIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocalPhone as LocalPhoneIcon
} from "@mui/icons-material";

import { getCompanyApplications, getJobRanking, updateApplicationStatus } from "../../services/ApplicationApi.js";
import DetailOverlay, { OverlayField, OverlayBadge, OverlaySection } from "../../components/shared/DetailOverlay";
import Pagination from "../../components/shared/Pagination";

const PER_PAGE = 5;

const thStyle = {
  color: "#64748b",
  fontWeight: 700,
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  py: 2,
};

function GlassCard({ children, sx = {} }) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

const renderParsedField = (data) => {
  if (!data) return <Typography sx={{ color: "#64748b", fontSize: "14px" }}>—</Typography>;

  if (Array.isArray(data)) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {data.map((item, idx) => {
          if (typeof item === "object" && item !== null) {
            return (
              <Box key={idx} sx={{ p: 1.5, borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                {Object.entries(item).map(([key, val]) => (
                  <Box key={key} sx={{ display: "flex", gap: 1, mb: 0.5 }}>
                    <Typography sx={{ color: "#a78bfa", fontWeight: 700, fontSize: "12px", textTransform: "capitalize", minWidth: "110px" }}>
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </Typography>
                    <Typography sx={{ color: "#cbd5e1", fontSize: "13px" }}>
                      {typeof val === "object" ? JSON.stringify(val) : String(val)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            );
          }
          return (
            <Typography key={idx} sx={{ color: "#cbd5e1", fontSize: "14px" }}>
              • {String(item)}
            </Typography>
          );
        })}
      </Box>
    );
  }

  if (typeof data === "object" && data !== null) {
    return (
      <Box sx={{ p: 1.5, borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
        {Object.entries(data).map(([key, val]) => (
          <Box key={key} sx={{ display: "flex", gap: 1, mb: 0.5 }}>
            <Typography sx={{ color: "#a78bfa", fontWeight: 700, fontSize: "12px", textTransform: "capitalize", minWidth: "110px" }}>
              {key.replace(/([A-Z])/g, ' $1')}:
            </Typography>
            <Typography sx={{ color: "#cbd5e1", fontSize: "13px" }}>
              {typeof val === "object" ? JSON.stringify(val) : String(val)}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Typography sx={{ color: "#cbd5e1", fontSize: "14px", whiteSpace: "pre-line" }}>
      {String(data)}
    </Typography>
  );
};

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filter, setFilter] = useState("all");
  const [rankings, setRankings] = useState([]);
  const [loadingRankings, setLoadingRankings] = useState(false);
  
  // Toast notifications state
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await getCompanyApplications();
      setApplications(res.data || []);
    } catch (error) {
      console.error("Error fetching company applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRankings = async (jobId) => {
    if (!jobId) return;
    try {
      setLoadingRankings(true);
      const res = await getJobRanking(jobId);
      setRankings(res.data || []);
    } catch (error) {
      console.error("Error fetching job rankings:", error);
    } finally {
      setLoadingRankings(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (selectedApp?.job?._id) {
      fetchRankings(selectedApp.job._id);
    } else {
      setRankings([]);
    }
  }, [selectedApp]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);
      
      // Update local applications state immediately
      const updatedApps = applications.map((app) => {
        if (app._id === id) {
          return { ...app, status: newStatus };
        }
        return app;
      });
      setApplications(updatedApps);
      
      // Update selected application in drawer
      if (selectedApp && selectedApp._id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }

      setToast({
        open: true,
        message: `Application ${newStatus === "shortlisted" ? "shortlisted" : "rejected"} successfully!`,
        severity: newStatus === "shortlisted" ? "success" : "error",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      setToast({
        open: true,
        message: error.response?.data?.message || "Failed to update application status.",
        severity: "error",
      });
    }
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // Filter logic
  const filteredApplications = applications.filter((app) => {
    const status = (app.status || "pending").toLowerCase();
    if (filter === "all") return true;
    return status === filter;
  });

  const totalPages = Math.ceil(filteredApplications.length / PER_PAGE);
  const paginated = filteredApplications.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  // Find candidate's current rank
  const candidateIndex = rankings.findIndex(
    (rank) => rank._id === selectedApp?._id
  );
  const currentRank = candidateIndex !== -1 ? candidateIndex + 1 : "—";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ color: "white", maxWidth: 1200, mx: "auto" }}>
        
        {/* HEADER */}
        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ mb: 1, letterSpacing: "-0.5px" }}>
              Applications
            </Typography>
            <Typography sx={{ color: "#94a3b8" }}>
              Review candidate profiles, check AI scores, rankings, and update recruitment status.
            </Typography>
          </Box>
          
          {/* Status Filters */}
          <ButtonGroup variant="outlined" sx={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.01)",
            backdropFilter: "blur(10px)",
            p: 0.5,
            "& .MuiButton-root": {
              border: "none !important",
              color: "#64748b",
              px: 3,
              py: 1,
              borderRadius: "8px !important",
              textTransform: "capitalize",
              fontWeight: 600,
              fontSize: "13px",
              transition: "all 0.25s ease",
              "&:hover": {
                background: "rgba(255,255,255,0.03)",
                color: "#e2e8f0",
              },
              "&.active": {
                background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                color: "#fff",
                boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
              }
            }
          }}>
            <Button className={filter === "all" ? "active" : ""} onClick={() => { setFilter("all"); setPage(0); }}>All</Button>
            <Button className={filter === "pending" ? "active" : ""} onClick={() => { setFilter("pending"); setPage(0); }}>Pending</Button>
            <Button className={filter === "shortlisted" ? "active" : ""} onClick={() => { setFilter("shortlisted"); setPage(0); }}>Shortlisted</Button>
            <Button className={filter === "rejected" ? "active" : ""} onClick={() => { setFilter("rejected"); setPage(0); }}>Rejected</Button>
          </ButtonGroup>
        </Box>

        <GlassCard>
          {loading ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={thStyle}>Candidate</TableCell>
                    <TableCell sx={thStyle}>Email</TableCell>
                    <TableCell sx={thStyle}>Applied For</TableCell>
                    <TableCell sx={thStyle}>AI Score</TableCell>
                    <TableCell sx={thStyle}>Applied Date</TableCell>
                    <TableCell sx={{ ...thStyle, textAlign: "right" }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton variant="text" width="60%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} /></TableCell>
                      <TableCell><Skeleton variant="text" width="80%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} /></TableCell>
                      <TableCell><Skeleton variant="text" width="50%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} /></TableCell>
                      <TableCell><Skeleton variant="text" width="40%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} /></TableCell>
                      <TableCell><Skeleton variant="text" width="50%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} /></TableCell>
                      <TableCell align="right"><Skeleton variant="rounded" width={80} height={24} sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: "8px" }} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : filteredApplications.length === 0 ? (
            <Box textAlign="center" py={8}>
              <DescriptionIcon sx={{ fontSize: 48, color: "#1e3a5f", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "#e2e8f0", mb: 1, fontWeight: 700 }}>
                No Applications Found
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "14px" }}>
                There are no applications matching the selected status filter.
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer
                component={Paper}
                sx={{
                  background: "transparent",
                  boxShadow: "none",
                }}
              >
                <Table sx={{ tableLayout: "fixed", minWidth: 0 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ ...thStyle, width: "22%" }}>Candidate</TableCell>
                      <TableCell sx={{ ...thStyle, width: "23%" }}>Email</TableCell>
                      <TableCell sx={{ ...thStyle, width: "20%" }}>Job Position</TableCell>
                      <TableCell sx={{ ...thStyle, width: "12%" }}>AI Score</TableCell>
                      <TableCell sx={{ ...thStyle, width: "13%" }}>Applied Date</TableCell>
                      <TableCell sx={{ ...thStyle, width: "10%", textAlign: "right" }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginated.map((app, idx) => {
                      const status = app.status || "pending";
                      const isShort = status === "shortlisted";
                      const isRej = status === "rejected";
                      const color = isShort ? "#34d399" : isRej ? "#f87171" : "#fbbf24";
                      const bg = isShort ? "rgba(52,211,153,0.08)" : isRej ? "rgba(239,68,68,0.08)" : "rgba(251,191,36,0.08)";
                      const border = isShort ? "rgba(52,211,153,0.2)" : isRej ? "rgba(239,68,68,0.2)" : "rgba(251,191,36,0.2)";

                      return (
                        <TableRow
                          key={app._id || idx}
                          onClick={() => setSelectedApp(app)}
                          sx={{
                            cursor: "pointer",
                            "& td": {
                              color: "#cbd5e1",
                              borderBottom: "1px solid rgba(255,255,255,0.04)",
                              fontSize: "14px",
                              py: 1.8,
                            },
                            "&:hover": { background: "rgba(255,255,255,0.03)" },
                            transition: "background 0.2s",
                          }}
                        >
                          <TableCell sx={{ fontWeight: 600, color: "#fff !important", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {app.candidateName || app.candidate?.name || "—"}
                          </TableCell>
                          <TableCell sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#94a3b8 !important" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <EmailIcon sx={{ fontSize: 13, color: "#475569" }} />
                              {app.candidateEmail || app.candidate?.email || "—"}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <BadgeIcon sx={{ fontSize: 13, color: "#475569" }} />
                              {app.job?.title || "—"}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#a78bfa !important" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <StarIcon sx={{ fontSize: 14, color: "#a78bfa" }} />
                              {app.score !== undefined ? `${app.score}/100` : "—"}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: "#94a3b8 !important" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CalendarTodayIcon sx={{ fontSize: 13, color: "#475569" }} />
                              {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "—"}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ textAlign: "right" }}>
                            <Box
                              sx={{
                                display: "inline-flex",
                                px: 1.2,
                                py: 0.3,
                                borderRadius: "8px",
                                background: bg,
                                border: `1px solid ${border}`,
                                color,
                                fontSize: "11px",
                                fontWeight: 700,
                                textTransform: "capitalize",
                              }}
                            >
                              {status}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={filteredApplications.length}
                perPage={PER_PAGE}
                onPageChange={setPage}
                label="applications"
              />
            </>
          )}
        </GlassCard>
      </Box>

      {/* DETAIL OVERLAY */}
      <DetailOverlay
        open={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Application Details"
        maxWidth="680px"
      >
        {selectedApp && (
          <Box sx={{ pb: 8 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, p: 2.5, borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <Box sx={{
                width: 52, height: 52, borderRadius: "14px",
                background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)",
                display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center",
                color: "#a78bfa", fontSize: 22, fontWeight: 800, flexShrink: 0,
              }}>
                {(selectedApp.candidateName || selectedApp.candidate?.name || "?")[0].toUpperCase()}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "16px", color: "#fff", mb: 0.5 }}>
                  {selectedApp.candidateName || selectedApp.candidate?.name || "—"}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <OverlayBadge 
                    label={selectedApp.status || "pending"} 
                    bg={selectedApp.status === "shortlisted" ? "rgba(52,211,153,0.08)" : selectedApp.status === "rejected" ? "rgba(239,68,68,0.08)" : "rgba(251,191,36,0.08)"} 
                    color={selectedApp.status === "shortlisted" ? "#34d399" : selectedApp.status === "rejected" ? "#f87171" : "#fbbf24"} 
                    border={selectedApp.status === "shortlisted" ? "rgba(52,211,153,0.2)" : selectedApp.status === "rejected" ? "rgba(239,68,68,0.2)" : "rgba(251,191,36,0.2)"} 
                  />
                  <Typography sx={{ fontSize: "12px", color: "#64748b" }}>
                    Rank #{currentRank} of {rankings.length}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <OverlaySection label="Candidate Information" />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <OverlayField label="Full Name" value={selectedApp.candidateName || selectedApp.candidate?.name || "—"} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <OverlayField label="Email Address">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 14, color: "#60a5fa" }} />
                    <Typography sx={{ color: "#e2e8f0", fontSize: "14px" }}>
                      {selectedApp.candidateEmail || selectedApp.candidate?.email || "—"}
                    </Typography>
                  </Box>
                </OverlayField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <OverlayField label="Phone Number">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocalPhoneIcon sx={{ fontSize: 14, color: "#60a5fa" }} />
                    <Typography sx={{ color: "#e2e8f0", fontSize: "14px" }}>
                      {selectedApp.parsedResume?.phone || "—"}
                    </Typography>
                  </Box>
                </OverlayField>
              </Grid>
              <Grid item xs={12} sm={6}>
                {selectedApp.resume && (
                  <OverlayField label="Resume Attachment">
                    <a
                      href={`http://localhost:5000/${selectedApp.resume.replace(/\\/g, "/")}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#34d399",
                        textDecoration: "none",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: "14px",
                        background: "rgba(52,211,153,0.08)",
                        border: "1px solid rgba(52,211,153,0.2)",
                        padding: "6px 12px",
                        borderRadius: "8px",
                      }}
                    >
                      <OpenInNewIcon sx={{ fontSize: 16 }} />
                      View Resume File
                    </a>
                  </OverlayField>
                )}
              </Grid>
            </Grid>

            {/* Resume Details */}
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              <OverlayField label="Skills">
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {Array.isArray(selectedApp.parsedResume?.skills) ? (
                    selectedApp.parsedResume.skills.map((skill, idx) => (
                      <Chip key={idx} label={skill} size="small" sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.08)" }} />
                    ))
                  ) : typeof selectedApp.parsedResume?.skills === "string" ? (
                    selectedApp.parsedResume.skills.split(",").map((skill, idx) => (
                      <Chip key={idx} label={skill.trim()} size="small" sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.08)" }} />
                    ))
                  ) : (
                    <Typography sx={{ color: "#94a3b8", fontSize: "14px" }}>—</Typography>
                  )}
                </Box>
              </OverlayField>

              <OverlayField label="Education">
                {renderParsedField(selectedApp.parsedResume?.education)}
              </OverlayField>

              <OverlayField label="Experience">
                {renderParsedField(selectedApp.parsedResume?.experience)}
              </OverlayField>

              <OverlayField label="Projects">
                {renderParsedField(selectedApp.parsedResume?.projects)}
              </OverlayField>

              <OverlayField label="Certifications">
                {renderParsedField(selectedApp.parsedResume?.certifications)}
              </OverlayField>
            </Box>

            <OverlaySection label="AI Evaluation Summary" />

            <Box sx={{ p: 2.5, borderRadius: "16px", background: "rgba(167,139,250,0.03)", border: "1px solid rgba(167,139,250,0.1)", mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: "15px", color: "#a78bfa" }}>Overall AI Match Score</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: "20px", color: "#a78bfa" }}>{selectedApp.score}/100</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={4}>
                  <Box sx={{ textTransform: "capitalize" }}>
                    <Typography sx={{ color: "#475569", fontSize: "10px", fontWeight: 800 }}>SKILLS</Typography>
                    <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: "14px" }}>
                      {selectedApp.scoreBreakdown?.skills ?? 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Box sx={{ textTransform: "capitalize" }}>
                    <Typography sx={{ color: "#475569", fontSize: "10px", fontWeight: 800 }}>EXPERIENCE</Typography>
                    <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: "14px" }}>
                      {selectedApp.scoreBreakdown?.experience ?? 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Box sx={{ textTransform: "capitalize" }}>
                    <Typography sx={{ color: "#475569", fontSize: "10px", fontWeight: 800 }}>EDUCATION</Typography>
                    <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: "14px" }}>
                      {selectedApp.scoreBreakdown?.education ?? 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Box sx={{ textTransform: "capitalize" }}>
                    <Typography sx={{ color: "#475569", fontSize: "10px", fontWeight: 800 }}>CERTIFICATIONS</Typography>
                    <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: "14px" }}>
                      {selectedApp.scoreBreakdown?.certifications ?? 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Box sx={{ textTransform: "capitalize" }}>
                    <Typography sx={{ color: "#475569", fontSize: "10px", fontWeight: 800 }}>PROJECTS</Typography>
                    <Typography sx={{ color: "#e2e8f0", fontWeight: 700, fontSize: "14px" }}>
                      {selectedApp.scoreBreakdown?.projects ?? 0}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <OverlaySection label="Candidate Ranking Leaderboard" />

            <Box sx={{ mb: 3 }}>
              {loadingRankings ? (
                <Skeleton variant="rectangular" height={150} sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: "12px" }} />
              ) : (
                <>
                  <TableContainer component={Paper} sx={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "none", borderRadius: "12px", mb: 1.5 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#475569", fontWeight: 700 }}>Rank</TableCell>
                          <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#475569", fontWeight: 700 }}>Candidate</TableCell>
                          <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#475569", fontWeight: 700, textAlign: "right" }}>Score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rankings.map((rank, index) => {
                          const isCurrent = rank._id === selectedApp._id;
                          return (
                            <TableRow key={rank._id} sx={{
                              bgcolor: isCurrent ? "rgba(139,92,246,0.12)" : "transparent",
                              borderLeft: isCurrent ? "4px solid #8b5cf6" : "none",
                              "& td": {
                                color: isCurrent ? "#fff" : "#cbd5e1",
                                fontWeight: isCurrent ? 700 : 500,
                                borderBottom: "1px solid rgba(255,255,255,0.03)",
                                py: 1,
                              }
                            }}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{rank.candidateName || rank.candidate?.name || "—"} {isCurrent && "← (Selected)"}</TableCell>
                              <TableCell sx={{ textAlign: "right", color: isCurrent ? "#a78bfa" : "#cbd5e1" }}>{rank.score}/100</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Typography sx={{ color: "#94a3b8", fontSize: "13px", fontWeight: 500, px: 1 }}>
                    Current Ranking: #{currentRank} out of {rankings.length} applicants
                  </Typography>
                </>
              )}
            </Box>

            <OverlaySection label="Candidate Summary Section" />
            <Box sx={{ p: 2.5, borderRadius: "16px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)", color: "#cbd5e1", fontSize: "14px", lineHeight: 1.6, mb: 4 }}>
              {selectedApp.feedback || "AI summary evaluation has not been processed for this applicant."}
            </Box>

            {/* ACTION BUTTONS (FLOATING FOOTER STICKY) */}
            <Box sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: "rgba(10,15,30,0.95)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              p: 2,
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
              backdropFilter: "blur(10px)",
              zIndex: 100,
            }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => handleStatusUpdate(selectedApp._id, "rejected")}
                disabled={selectedApp.status === "rejected"}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "rgba(239,68,68,0.2)",
                  color: "#f87171",
                  "&:hover": {
                    bgcolor: "rgba(239,68,68,0.08)",
                    borderColor: "#ef4444",
                  }
                }}
              >
                Reject Applicant
              </Button>
              <Button
                variant="contained"
                startIcon={<CheckCircleIcon />}
                onClick={() => handleStatusUpdate(selectedApp._id, "shortlisted")}
                disabled={selectedApp.status === "shortlisted"}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(90deg, #10b981, #059669)",
                  boxShadow: "0 4px 12px rgba(16,185,129,0.2)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #059669, #047857)",
                  }
                }}
              >
                Shortlist Applicant
              </Button>
            </Box>

          </Box>
        )}
      </DetailOverlay>

      {/* SNACKBAR / TOAST NOTIFICATION */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{
            width: "100%",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            background: "rgba(15,23,42,0.95)",
            backdropFilter: "blur(12px)",
            color: "#fff",
            border: `1px solid ${toast.severity === "success" ? "rgba(16,185,129,0.2)" : toast.severity === "error" ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.2)"}`,
            "& .MuiAlert-icon": {
              color: toast.severity === "success" ? "#10b981" : toast.severity === "error" ? "#ef4444" : "#3b82f6",
            }
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

    </motion.div>
  );
}
