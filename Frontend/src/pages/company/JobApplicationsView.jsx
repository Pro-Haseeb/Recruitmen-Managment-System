import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";

import { getAllJobs } from "../../services/CandidateApi.js";
import { getCompanyApplications } from "../../services/ApplicationApi.js";
import GlassCard from "../../components/recruitmentAnalysis/GlassCard.jsx";
import JobAnalysisActions from "../../components/recruitmentAnalysis/JobAnalysisActions.jsx";
import AiAnalysisSetupModal from "../../components/recruitmentAnalysis/AiAnalysisSetupModal.jsx";
import AiAnalysisProcessing from "../../components/recruitmentAnalysis/AiAnalysisProcessing.jsx";
import DetailOverlay, { OverlayField, OverlaySection } from "../../components/shared/DetailOverlay";
import Pagination from "../../components/shared/Pagination";
import { runAiAnalysis } from "../../services/recruitmentAnalysisService.js";
import { saveAnalysisSession } from "../../utils/recruitmentAnalysis/analysisStorage.js";
import { formatJobDeadline } from "../../utils/recruitmentAnalysis/jobDeadline.js";

const PER_PAGE = 8;

const thStyle = {
  color: "#64748b",
  fontWeight: 700,
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  py: 2,
};

export default function JobApplicationsView() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(location.state?.job || null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedApp, setSelectedApp] = useState(null);
  const [setupOpen, setSetupOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [analysisCriteria, setAnalysisCriteria] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [jobRes, appRes] = await Promise.all([
          getAllJobs(),
          getCompanyApplications().catch(() => ({ data: [] })),
        ]);
        const allJobs = jobRes.data || [];
        const found = allJobs.find((j) => j._id === jobId);
        setJob(found || location.state?.job || null);

        const apps = (appRes.data || []).filter((a) => {
          const jid = a.job?._id || a.job;
          return jid === jobId;
        });
        setApplications(apps);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only refetch when job id changes
  }, [jobId]);

  const jobApps = useMemo(() => applications, [applications]);
  const totalPages = Math.ceil(jobApps.length / PER_PAGE) || 1;
  const paginated = jobApps.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const handleStartAnalysis = async ({ criteria }) => {
    if (!job) return;
    setSetupOpen(false);
    setAnalysisCriteria(criteria);
    setProcessing(true);
    try {
      const results = await runAiAnalysis({
        job,
        applications: jobApps,
        criteria,
      });
      saveAnalysisSession(job._id, { job, criteria, results });
      navigate(`/company/jobs/${job._id}/ai-results`);
    } catch (e) {
      console.error(e);
      alert("Analysis failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Box sx={{ color: "white", maxWidth: 1200, mx: "auto" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/company/jobs")}
          sx={{ color: "#94a3b8", mb: 2, textTransform: "none", fontWeight: 600 }}
        >
          Back to All Jobs
        </Button>

        <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: "-0.5px" }}>
              Applications — {job?.title || "Job"}
            </Typography>
            <Typography sx={{ color: "#94a3b8", mt: 0.5 }}>
              Deadline: {formatJobDeadline(job)} · {jobApps.length} applicant
              {jobApps.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </Box>

        {job && (
          <GlassCard sx={{ mb: 3 }}>
            <JobAnalysisActions job={job} onAnalyze={() => setSetupOpen(true)} />
          </GlassCard>
        )}

        <GlassCard>
          {loading ? (
            <Skeleton height={200} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
          ) : jobApps.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography sx={{ color: "#94a3b8", fontWeight: 600 }}>
                No applications for this position yet.
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "13px", mt: 1 }}>
                AI analysis will use demo candidate data when the deadline passes.
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ background: "transparent", boxShadow: "none" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={thStyle}>Candidate</TableCell>
                      <TableCell sx={thStyle}>Email</TableCell>
                      <TableCell sx={thStyle}>Submitted</TableCell>
                      <TableCell sx={thStyle} align="right">
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginated.map((app, idx) => (
                      <TableRow
                        key={app._id || idx}
                        hover
                        onClick={() => setSelectedApp(app)}
                        sx={{
                          cursor: "pointer",
                          "& td": { color: "#cbd5e1", borderBottom: "1px solid rgba(255,255,255,0.04)", py: 1.8 },
                          "&:hover": { bgcolor: "rgba(255,255,255,0.03)" },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600, color: "#fff !important" }}>
                          {app.candidateName || app.candidate?.name || "—"}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <EmailIcon sx={{ fontSize: 14, color: "#475569" }} />
                            {app.candidateEmail || app.candidate?.email || "—"}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {app.createdAt
                            ? new Date(app.createdAt).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={app.status || "Pending"}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              bgcolor: "rgba(251,191,36,0.1)",
                              color: "#fbbf24",
                              border: "1px solid rgba(251,191,36,0.2)",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={jobApps.length}
                perPage={PER_PAGE}
                onPageChange={setPage}
                label="applications"
              />
            </>
          )}
        </GlassCard>
      </Box>

      <DetailOverlay open={!!selectedApp} onClose={() => setSelectedApp(null)} title="Application Details">
        {selectedApp && (
          <Box>
            <OverlaySection label="Candidate" />
            <OverlayField label="Name" value={selectedApp.candidateName || selectedApp.candidate?.name} />
            <OverlayField label="Email" value={selectedApp.candidateEmail || selectedApp.candidate?.email} />
            <OverlayField label="Status" value={selectedApp.status || "Pending"} />
          </Box>
        )}
      </DetailOverlay>

      <AiAnalysisSetupModal
        open={setupOpen}
        job={job}
        onClose={() => setSetupOpen(false)}
        onStart={handleStartAnalysis}
      />
      <AiAnalysisProcessing
        open={processing}
        jobTitle={job?.title || "Position"}
        criteria={analysisCriteria}
      />
    </motion.div>
  );
}
