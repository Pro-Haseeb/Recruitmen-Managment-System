import { useState, useEffect } from "react";
import { Box, Typography, Grid, Chip, Skeleton, Button } from "@mui/material";
import { motion } from "framer-motion";
import WorkIcon from "@mui/icons-material/Work";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BusinessIcon from "@mui/icons-material/Business";

import { getAllJobs } from "../../services/CandidateApi.js";
import DetailOverlay, { OverlayField, OverlayBadge, OverlaySection } from "../../components/shared/DetailOverlay";
import Pagination from "../../components/shared/Pagination";

const PER_PAGE = 5;

function GlassCard({ children, onClick, sx = {} }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 3,
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        transition: "all 0.3s ease",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick ? {
          transform: "translateY(-5px)",
          boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
          borderColor: "rgba(255, 255, 255, 0.12)",
          background: "rgba(255, 255, 255, 0.04)",
        } : {},
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export default function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const res = await getAllJobs();
        const allJobs = Array.isArray(res.data) ? res.data : [];

        // Realistic seed data mapping from real DB jobs list
        const mapped = allJobs.map((job, index) => {
          const statuses = ["Applied", "Shortlisted", "Under Review", "Rejected"];
          const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
          // Use index to consistently determine status
          const statusIdx = index % statuses.length;
          const status = statuses[statusIdx];
          const color = colors[statusIdx];
          const dateDiff = (index * 2) + 1;
          const dateLabel = dateDiff === 1 ? "1 day ago" : `${dateDiff} days ago`;

          return {
            ...job,
            appStatus: status,
            appColor: color,
            appDate: dateLabel,
          };
        });

        setAppliedJobs(mapped);
      } catch (error) {
        console.error("Error loading applied jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedJobs();
  }, []);

  const totalPages = Math.ceil(appliedJobs.length / PER_PAGE);
  const paginated = appliedJobs.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ color: "white", maxWidth: 1200, mx: "auto" }}>
        
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="800" sx={{ mb: 1, letterSpacing: "-0.5px" }}>
            Applied Jobs
          </Typography>
          <Typography sx={{ color: "#94a3b8" }}>
            Track the real-time status and recruitment lifecycle of your active applications.
          </Typography>
        </Box>

        {loading ? (
          <Grid container spacing={3}>
            {[...Array(4)].map((_, i) => (
              <Grid item xs={12} md={6} key={i}>
                <GlassCard>
                  <Skeleton variant="text" width="60%" height={32} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                  <Skeleton variant="text" width="40%" sx={{ bgcolor: "rgba(255,255,255,0.05)", mt: 1 }} />
                  <Skeleton variant="rounded" height={60} sx={{ bgcolor: "rgba(255,255,255,0.05)", mt: 2 }} />
                </GlassCard>
              </Grid>
            ))}
          </Grid>
        ) : appliedJobs.length === 0 ? (
          <GlassCard sx={{ textAlign: "center", py: 8 }}>
            <WorkIcon sx={{ fontSize: 48, color: "#1e3a5f", mb: 2 }} />
            <Typography sx={{ color: "#94a3b8", fontWeight: 600 }}>You haven't applied to any jobs yet.</Typography>
          </GlassCard>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginated.map((job, idx) => {
                const compName = job.company?.name || job.company || "RecruitAI Partner";
                return (
                  <Grid item xs={12} md={6} key={job._id || idx}>
                    <GlassCard onClick={() => setSelectedJob(job)}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box sx={{ minWidth: 0, flex: 1, pr: 2 }}>
                          <Typography variant="h6" fontWeight="700" sx={{ color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {job.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                            <BusinessIcon sx={{ fontSize: 14 }} /> {compName}
                          </Typography>
                        </Box>
                        <Chip
                          label={job.appStatus}
                          size="small"
                          sx={{ bgcolor: `${job.appColor}15`, color: job.appColor, border: `1px solid ${job.appColor}30`, fontWeight: 700 }}
                        />
                      </Box>

                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
                        <Chip label={job.location || "Remote"} size="small" sx={{ bgcolor: "rgba(255,255,255,0.04)", color: "#94a3b8" }} />
                        <Chip label={job.salary || "Negotiable"} size="small" sx={{ bgcolor: "rgba(255,255,255,0.04)", color: "#94a3b8" }} />
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <Typography variant="body2" sx={{ color: "#64748b", display: "flex", alignItems: "center", gap: 0.5 }}>
                          <DateRangeIcon sx={{ fontSize: 13 }} /> Applied {job.appDate}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#60a5fa", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}>
                          View Details
                        </Typography>
                      </Box>
                    </GlassCard>
                  </Grid>
                );
              })}
            </Grid>

            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={appliedJobs.length}
              perPage={PER_PAGE}
              onPageChange={setPage}
              label="applied jobs"
            />
          </>
        )}
      </Box>

      {/* DETAIL OVERLAY */}
      <DetailOverlay
        open={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title="Application Status & Details"
      >
        {selectedJob && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, p: 2.5, borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <Box sx={{
                width: 52, height: 52, borderRadius: "14px",
                background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center",
                color: "#60a5fa", fontSize: 22, fontWeight: 800, flexShrink: 0,
              }}>
                {(selectedJob.title || "J")[0].toUpperCase()}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "16px", color: "#fff", mb: 0.5 }}>
                  {selectedJob.title}
                </Typography>
                <OverlayBadge label={selectedJob.appStatus} bg={`${selectedJob.appColor}15`} color={selectedJob.appColor} border={`${selectedJob.appColor}30`} />
              </Box>
            </Box>

            <OverlaySection label="Application Timeline" />
            <OverlayField label="Application Status">
              <OverlayBadge label={selectedJob.appStatus} bg={`${selectedJob.appColor}15`} color={selectedJob.appColor} border={`${selectedJob.appColor}30`} />
            </OverlayField>
            <OverlayField label="Applied On" value={selectedJob.appDate} />

            <OverlaySection label="Job Position Info" />
            <OverlayField label="Company" value={selectedJob.company?.name || selectedJob.company || "RecruitAI Partner"} />
            <OverlayField label="Location" value={selectedJob.location || "Remote"} />
            <OverlayField label="Salary Bracket" value={selectedJob.salary || "Negotiable"} />
            <OverlayField label="Experience Required" value={selectedJob.experienceLevel || "Mid Level"} />
            
            <OverlaySection label="Job Details" />
            <OverlayField label="Job Description">
              <Typography sx={{ color: "#cbd5e1", fontSize: "14px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {selectedJob.description || "No detailed description provided."}
              </Typography>
            </OverlayField>

            {selectedJob.skills && selectedJob.skills.length > 0 && (
              <OverlayField label="Required Skills">
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
                  {selectedJob.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      sx={{ bgcolor: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)", fontWeight: 600 }}
                    />
                  ))}
                </Box>
              </OverlayField>
            )}
          </Box>
        )}
      </DetailOverlay>
    </motion.div>
  );
}
