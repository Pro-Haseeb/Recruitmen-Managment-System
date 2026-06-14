import { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Chip, 
  Skeleton, 
  Slider, 
  Button, 
  Alert, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from "@mui/material";
import { motion } from "framer-motion";
import WorkIcon from "@mui/icons-material/Work";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LockIcon from "@mui/icons-material/Lock";
import ShieldIcon from "@mui/icons-material/Shield";

import { getAllJobs } from "../../services/CandidateApi.js";
import { getCompanyApplications } from "../../services/ApplicationApi.js";
import { getHRs, updateJobCriteria } from "../../services/CompanyApi.js";
import { getJobRanking } from "../../services/ApplicationApi.js";
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

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);

  // Evaluation States
  const [weights, setWeights] = useState({ skills: 40, experience: 25, education: 20, projects: 15 });
  const [isLocked, setIsLocked] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchJobsAndDetails = async () => {
      try {
        setLoading(true);
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;

        const [jobRes, appRes] = await Promise.all([
          getAllJobs(),
          getCompanyApplications().catch(err => {
            console.warn("Application retrieval not authorized or failed:", err);
            return { data: [] };
          })
        ]);

        const allJobs = Array.isArray(jobRes.data) ? jobRes.data : [];
        const companyApps = Array.isArray(appRes.data) ? appRes.data : [];
        setApplications(companyApps);

        let myCompanyId = user?.company;

        if (!myCompanyId && companyApps.length > 0) {
          myCompanyId = companyApps[0].company?._id || companyApps[0].company;
        }

        if (!myCompanyId && allJobs.length > 0 && user) {
          const matchingJob = allJobs.find(j => {
            const creatorId = j.createdBy?._id || j.createdBy;
            return creatorId === user._id || j.createdBy?.email === user.email;
          });
          if (matchingJob) {
            myCompanyId = matchingJob.company?._id || matchingJob.company;
          }
        }

        if (!myCompanyId && user?.role === 'company_admin') {
          try {
            const hrRes = await getHRs();
            const hrs = hrRes.data || [];
            if (hrs.length > 0) {
              myCompanyId = hrs[0].company;
            }
          } catch (e) {
            console.warn("HR resolution failed:", e);
          }
        }

        if (!myCompanyId && allJobs.length > 0 && user) {
          const matchedJob = allJobs.find(j => {
            const companyName = j.company?.name || '';
            if (!companyName) return false;
            const cleanComp = companyName.toLowerCase().replace(/\s+/g, '');
            const cleanUser = user.name ? user.name.toLowerCase() : '';
            const cleanEmail = user.email ? user.email.toLowerCase() : '';
            return cleanUser.includes(cleanComp) || cleanEmail.includes(cleanComp);
          });
          if (matchedJob) {
            myCompanyId = matchedJob.company?._id || matchedJob.company;
          }
        }

        let filteredJobs = [];
        if (myCompanyId) {
          filteredJobs = allJobs.filter((j) => {
            const cid = j.company?._id || j.company;
            return cid === myCompanyId;
          });
        } else if (user) {
          filteredJobs = allJobs.filter(j => {
            const creatorId = j.createdBy?._id || j.createdBy;
            return creatorId === user._id || j.createdBy?.email === user.email;
          });
        }

        setJobs(filteredJobs);
      } catch (error) {
        console.error("Error loading company jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobsAndDetails();
  }, []);

  const fetchRanking = async (jobId) => {
    try {
      setRankingLoading(true);
      const res = await getJobRanking(jobId);
      setRanking(res.data || []);
    } catch (err) {
      console.error("Error fetching job ranking:", err);
    } finally {
      setRankingLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJob) {
      const isJobLocked = selectedJob.rankingGenerated || selectedJob.screeningStarted;
      setIsLocked(!!isJobLocked);
      if (selectedJob.criteriaWeights) {
        setWeights({
          skills: selectedJob.criteriaWeights.skills ?? 40,
          experience: selectedJob.criteriaWeights.experience ?? 25,
          education: selectedJob.criteriaWeights.education ?? 20,
          projects: selectedJob.criteriaWeights.projects ?? 15,
        });
      } else {
        setWeights({ skills: 40, experience: 25, education: 20, projects: 15 });
      }

      if (isJobLocked) {
        fetchRanking(selectedJob._id);
      } else {
        setRanking([]);
      }
    }
  }, [selectedJob]);

  const handleWeightChange = (field, value) => {
    setWeights(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLockAndEvaluate = async () => {
    const total = Number(weights.skills) + Number(weights.experience) + Number(weights.education) + Number(weights.projects);
    if (total !== 100) {
      alert("Weights must total exactly 100%");
      return;
    }

    try {
      setSubmitLoading(true);
      const res = await updateJobCriteria(selectedJob._id, weights);
      setIsLocked(true);
      
      const updatedJob = { 
        ...selectedJob, 
        criteriaWeights: { ...weights, certifications: 0 },
        rankingGenerated: true,
        screeningStarted: true
      };
      setSelectedJob(updatedJob);
      setJobs(prev => prev.map(j => j._id === selectedJob._id ? updatedJob : j));
      
      await fetchRanking(selectedJob._id);
    } catch (err) {
      console.error("Error updating criteria:", err);
      alert(err.response?.data?.message || "Failed to update criteria");
    } finally {
      setSubmitLoading(false);
    }
  };

  const getApplicantsCount = (jobId) => {
    return applications.filter(app => {
      const jid = app.job?._id || app.job;
      return jid === jobId;
    }).length;
  };

  const totalPages = Math.ceil(jobs.length / PER_PAGE);
  const paginated = jobs.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const totalSum = Number(weights.skills) + Number(weights.experience) + Number(weights.education) + Number(weights.projects);
  const isValid = totalSum === 100;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ color: "white", maxWidth: 1200, mx: "auto" }}>
        
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="800" sx={{ mb: 1, letterSpacing: "-0.5px" }}>
            All Jobs
          </Typography>
          <Typography sx={{ color: "#94a3b8" }}>
            Manage and view active positions posted for your company.
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
        ) : jobs.length === 0 ? (
          <GlassCard sx={{ textAlign: "center", py: 8 }}>
            <WorkIcon sx={{ fontSize: 48, color: "#1e3a5f", mb: 2 }} />
            <Typography sx={{ color: "#94a3b8", fontWeight: 600, mb: 1 }}>No jobs posted yet.</Typography>
            <Typography sx={{ color: "#64748b", fontSize: "14px" }}>Create your first job listing to get started.</Typography>
          </GlassCard>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginated.map((job, idx) => {
                const applicantsCount = getApplicantsCount(job._id);
                const status = job.status || "Active";
                const isActive = status.toLowerCase() === "active" || status.toLowerCase() === "open";
                
                return (
                  <Grid item xs={12} md={6} key={job._id || idx}>
                    <GlassCard onClick={() => setSelectedJob(job)}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box sx={{ minWidth: 0, flex: 1, pr: 2 }}>
                          <Typography variant="h6" fontWeight="700" sx={{ color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {job.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                            <LocationOnIcon sx={{ fontSize: 14 }} /> {job.location || "Remote"}
                          </Typography>
                        </Box>
                        <Chip
                          label={status}
                          size="small"
                          sx={{ 
                            bgcolor: isActive ? "rgba(74, 222, 128, 0.1)" : "rgba(239, 68, 68, 0.1)", 
                            color: isActive ? "#4ade80" : "#f87171", 
                            fontWeight: 700 
                          }}
                        />
                      </Box>

                      <Typography
                        sx={{
                          color: "#cbd5e1",
                          mb: 3,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          fontSize: "14px",
                          lineHeight: 1.5,
                        }}
                      >
                        {job.description || "No description provided."}
                      </Typography>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Chip label={job.experienceLevel || `${job.experience || 0} Yrs Exp`} size="small" sx={{ bgcolor: "rgba(255,255,255,0.04)", color: "#94a3b8", fontWeight: 600 }} />
                          <Chip label={job.salary || "Negotiable"} size="small" sx={{ bgcolor: "rgba(255,255,255,0.04)", color: "#94a3b8", fontWeight: 600 }} />
                        </Box>
                        <Typography variant="body2" sx={{ color: "#60a5fa", fontWeight: 700, display: "flex", alignItems: "center", gap: 0.5 }}>
                          <PeopleIcon sx={{ fontSize: 16 }} /> {applicantsCount} {applicantsCount === 1 ? "applicant" : "applicants"}
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
              totalItems={jobs.length}
              perPage={PER_PAGE}
              onPageChange={setPage}
              label="jobs"
            />
          </>
        )}
      </Box>

      {/* DETAIL OVERLAY */}
      <DetailOverlay
        open={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title="Job Position Details"
        maxWidth="600px"
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
                <OverlayBadge 
                  label={selectedJob.status || "Active"} 
                  bg={(selectedJob.status || "Active").toLowerCase() === "active" ? "rgba(74, 222, 128, 0.1)" : "rgba(239, 68, 68, 0.1)"} 
                  color={(selectedJob.status || "Active").toLowerCase() === "active" ? "#4ade80" : "#f87171"} 
                  border={(selectedJob.status || "Active").toLowerCase() === "active" ? "rgba(74, 222, 128, 0.2)" : "rgba(239, 68, 68, 0.2)"} 
                />
              </Box>
            </Box>

            <OverlaySection label="General Posting Info" />
            <OverlayField label="Job Title" value={selectedJob.title} />
            <OverlayField label="Location" value={selectedJob.location || "Remote"} />
            <OverlayField label="Salary Bracket" value={selectedJob.salary || "Negotiable"} />
            <OverlayField label="Experience Required" value={selectedJob.experienceLevel || "Mid Level"} />
            <OverlayField label="Applicants Funnel">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PeopleIcon sx={{ fontSize: 16, color: "#60a5fa" }} />
                <Typography sx={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 700 }}>
                  {getApplicantsCount(selectedJob._id)} total applications received
                </Typography>
              </Box>
            </OverlayField>
            
            <OverlaySection label="Position Description" />
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

            <OverlaySection label="Timeline" />
            <OverlayField label="Date Posted">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DateRangeIcon sx={{ fontSize: 16, color: "#475569" }} />
                <Typography sx={{ color: "#e2e8f0", fontSize: "14px" }}>
                  {selectedJob.createdAt ? new Date(selectedJob.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                </Typography>
              </Box>
            </OverlayField>

            {/* EVALUATION CRITERIA WEIGHTS SECTION */}
            <OverlaySection label="Evaluation Criteria & Weights" />
            <Box sx={{ mb: 4, p: 2.5, borderRadius: "16px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)" }}>
              {isLocked ? (
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, color: "#34d399" }}>
                    <ShieldIcon sx={{ fontSize: 18 }} />
                    <Typography variant="subtitle2" fontWeight="700">
                      Criteria Locked & Active
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {Object.entries(weights).map(([key, val]) => (
                      <Grid item xs={6} sm={3} key={key}>
                        <Paper sx={{ p: 1.5, textAlign: "center", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px" }}>
                          <Typography variant="caption" sx={{ color: "#64748b", textTransform: "capitalize", fontWeight: 600 }}>
                            {key}
                          </Typography>
                          <Typography variant="h6" fontWeight="800" sx={{ color: "#60a5fa" }}>
                            {val}%
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" sx={{ color: "#94a3b8", mb: 3 }}>
                    Configure the weights (totalling 100%) below to initialize screening. Once weights are locked, candidates will be evaluated and ranked.
                  </Typography>

                  <Grid container spacing={2}>
                    {Object.entries(weights).map(([key, val]) => (
                      <Grid item xs={12} key={key} sx={{ mb: 1.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                          <Typography variant="body2" fontWeight="700" sx={{ textTransform: "capitalize", color: "#e2e8f0" }}>
                            {key}
                          </Typography>
                          <Typography variant="body2" fontWeight="700" sx={{ color: "#60a5fa" }}>
                            {val}%
                          </Typography>
                        </Box>
                        <Slider
                          value={val}
                          onChange={(e, newVal) => handleWeightChange(key, newVal)}
                          min={0}
                          max={100}
                          step={5}
                          valueLabelDisplay="auto"
                          sx={{
                            color: "#60a5fa",
                            height: 6,
                            "& .MuiSlider-thumb": {
                              width: 14,
                              height: 14,
                              background: "#fff",
                            }
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, pt: 2, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <Typography 
                      variant="subtitle2" 
                      fontWeight="700" 
                      sx={{ color: isValid ? "#34d399" : "#fbbf24" }}
                    >
                      Total Allocation: {totalSum}% {isValid ? "(Valid)" : "(Must equal 100%)"}
                    </Typography>

                    <Button
                      variant="contained"
                      onClick={handleLockAndEvaluate}
                      disabled={!isValid || submitLoading}
                      startIcon={submitLoading ? <CircularProgress size={16} color="inherit" /> : <LockIcon />}
                      sx={{
                        textTransform: "none",
                        borderRadius: "10px",
                        fontWeight: 700,
                        background: isValid ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" : "rgba(255,255,255,0.05)",
                        "&:hover": {
                          background: isValid ? "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" : "rgba(255,255,255,0.05)"
                        }
                      }}
                    >
                      Lock & Evaluate
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>

            {/* CANDIDATE LEADERBOARD */}
            <OverlaySection label="Candidate Leaderboard" />
            {!isLocked ? (
              <Box sx={{ p: 4, borderRadius: "16px", background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.1)", textAlign: "center" }}>
                <EmojiEventsIcon sx={{ fontSize: 40, color: "#475569", mb: 1.5 }} />
                <Typography variant="subtitle1" fontWeight="700" sx={{ color: "#e2e8f0", mb: 0.5 }}>
                  Evaluation Pending
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Please set and lock the criteria weights above to process resume scores and view the rankings.
                </Typography>
              </Box>
            ) : rankingLoading ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} variant="rounded" height={60} sx={{ bgcolor: "rgba(255,255,255,0.03)", borderRadius: "12px" }} />
                ))}
              </Box>
            ) : ranking.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography sx={{ color: "#64748b" }}>No applicants have applied yet to score.</Typography>
              </Box>
            ) : (
              <List sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {ranking.map((candidateApp, index) => (
                  <Paper
                    key={candidateApp._id || index}
                    sx={{
                      p: 2,
                      borderRadius: "14px",
                      background: "rgba(255, 255, 255, 0.01)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: index === 0 ? "rgba(251,191,36,0.15)" : index === 1 ? "rgba(226,232,240,0.1)" : "rgba(255,255,255,0.02)",
                            border: `1px solid ${index === 0 ? "#fbbf24" : index === 1 ? "#cbd5e1" : "rgba(255,255,255,0.05)"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            color: index === 0 ? "#fbbf24" : index === 1 ? "#cbd5e1" : "#64748b"
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Box>
                          <Typography fontWeight="700" sx={{ color: "#fff", fontSize: "14px" }}>
                            {candidateApp.candidateName || candidateApp.candidate?.name || "—"}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#64748b" }}>
                            {candidateApp.candidateEmail || candidateApp.candidate?.email || "—"}
                          </Typography>
                        </Box>
                      </Box>

                      <Chip
                        icon={<StarIcon sx={{ "&&": { color: "#fbbf24", fontSize: 14 } }} />}
                        label={`Score: ${candidateApp.score ?? 0}`}
                        sx={{ bgcolor: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24", fontWeight: 700, fontSize: "12px" }}
                      />
                    </Box>

                    {/* Score Breakdown display */}
                    {candidateApp.scoreBreakdown && (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                        {Object.entries(candidateApp.scoreBreakdown).map(([cKey, cVal]) => (
                          <Chip
                            key={cKey}
                            label={`${cKey.charAt(0).toUpperCase() + cKey.slice(1)}: ${cVal}%`}
                            size="small"
                            sx={{ bgcolor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", color: "#cbd5e1", fontSize: "10px" }}
                          />
                        ))}
                      </Box>
                    )}

                    {candidateApp.feedback && (
                      <Box sx={{ p: 1.5, borderRadius: "8px", background: "rgba(255,255,255,0.01)", borderLeft: "3px solid #60a5fa" }}>
                        <Typography variant="caption" sx={{ color: "#94a3b8", fontStyle: "italic", display: "block" }}>
                          "{candidateApp.feedback}"
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                ))}
              </List>
            )}
          </Box>
        )}
      </DetailOverlay>
    </motion.div>
  );
}
