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
} from "@mui/material";
import { motion } from "framer-motion";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DescriptionIcon from "@mui/icons-material/Description";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";

import { getCompanyApplications } from "../../services/ApplicationApi.js";
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

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedApp, setSelectedApp] = useState(null);

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

  useEffect(() => {
    fetchApplications();
  }, []);

  const totalPages = Math.ceil(applications.length / PER_PAGE);
  const paginated = applications.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ color: "white", maxWidth: 1200, mx: "auto" }}>
        
        {/* HEADER */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="800" sx={{ mb: 1, letterSpacing: "-0.5px" }}>
            Applications
          </Typography>
          <Typography sx={{ color: "#94a3b8" }}>
            Review candidate profiles, check resumes, and update recruitment status.
          </Typography>
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
                    <TableCell sx={thStyle}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton variant="text" width="60%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} /></TableCell>
                      <TableCell><Skeleton variant="text" width="80%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} /></TableCell>
                      <TableCell><Skeleton variant="text" width="50%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} /></TableCell>
                      <TableCell><Skeleton variant="rounded" width={80} height={24} sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: "8px" }} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : applications.length === 0 ? (
            <Box textAlign="center" py={8}>
              <DescriptionIcon sx={{ fontSize: 48, color: "#1e3a5f", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "#e2e8f0", mb: 1, fontWeight: 700 }}>
                No Applications Yet
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "14px" }}>
                When candidates apply to your openings, they'll show up here.
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
                      <TableCell sx={{ ...thStyle, width: "30%" }}>Candidate</TableCell>
                      <TableCell sx={{ ...thStyle, width: "35%" }}>Email</TableCell>
                      <TableCell sx={{ ...thStyle, width: "20%" }}>Job Position</TableCell>
                      <TableCell sx={{ ...thStyle, width: "15%", textAlign: "right" }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginated.map((app, idx) => {
                      const status = app.status || "Pending";
                      const isShort = ["shortlisted", "selected", "approved"].includes(status.toLowerCase());
                      const isRej = ["rejected", "declined"].includes(status.toLowerCase());
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
                totalItems={applications.length}
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
      >
        {selectedApp && (
          <Box>
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
                <OverlayBadge label={selectedApp.status || "Pending"} bg="rgba(245,158,11,0.1)" color="#fbbf24" border="rgba(245,158,11,0.2)" />
              </Box>
            </Box>

            <OverlaySection label="Candidate Contacts" />
            <OverlayField label="Email Address">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon sx={{ fontSize: 14, color: "#60a5fa" }} />
                <Typography sx={{ color: "#e2e8f0", fontSize: "14px" }}>
                  {selectedApp.candidateEmail || selectedApp.candidate?.email || "—"}
                </Typography>
              </Box>
            </OverlayField>

            <OverlaySection label="Job Position" />
            <OverlayField label="Job Title" value={selectedApp.job?.title || "—"} />

            <OverlaySection label="Resume & Application" />
            <OverlayField label="Date Submitted" value={selectedApp.createdAt ? new Date(selectedApp.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"} />
            
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
          </Box>
        )}
      </DetailOverlay>
    </motion.div>
  );
}
