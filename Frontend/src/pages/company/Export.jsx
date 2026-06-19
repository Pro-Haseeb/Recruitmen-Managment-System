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
  Snackbar,
  Alert,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  FileDownload as FileDownloadIcon,
  GetApp as GetAppIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorOutlineIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

import { exportApplications, getExportHistory, downloadExportFile } from "../../services/CompanyApi";
import { getAllJobs } from "../../services/CandidateApi";

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

const thStyle = {
  color: "#64748b",
  fontWeight: 700,
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  py: 2,
};

const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "#10b981";
    case "processing":
      return "#f59e0b";
    case "failed":
      return "#ef4444";
    case "queued":
      return "#6366f1";
    default:
      return "#64748b";
  }
};

const StatusIcon = ({ status }) => {
  switch (status) {
    case "completed":
      return <CheckCircleIcon sx={{ fontSize: "18px", color: "#10b981" }} />;
    case "processing":
      return <CircularProgress size={18} sx={{ color: "#f59e0b" }} />;
    case "failed":
      return <ErrorOutlineIcon sx={{ fontSize: "18px", color: "#ef4444" }} />;
    case "queued":
      return <ScheduleIcon sx={{ fontSize: "18px", color: "#6366f1" }} />;
    default:
      return null;
  }
};

export default function Export() {
  const [filters, setFilters] = useState({
    status: "",
    jobId: "",
    minScore: "",
    dateFrom: "",
    dateTo: "",
  });

  const [jobs, setJobs] = useState([]);
  const [exportHistory, setExportHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [error, setError] = useState(null);

  // Fetch jobs and export history on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        console.log("Fetching jobs...");
        const jobsRes = await getAllJobs();
        console.log("Jobs response:", jobsRes);
        setJobs(Array.isArray(jobsRes?.data) ? jobsRes.data : []);
        
        console.log("Fetching export history...");
        const historyRes = await getExportHistory();
        console.log("Export history response:", historyRes);
        console.log("Export history data:", historyRes?.data);
        setExportHistory(historyRes?.data?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error?.message || "Failed to load data");
        setJobs([]);
        setExportHistory([]);
        setToast({
          open: true,
          message: "Failed to load data",
          severity: "error",
        });
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (field) => (e) => {
    setFilters({
      ...filters,
      [field]: e.target.value,
    });
  };

  const handleExport = async () => {
    try {
      if (!filters.status && !filters.jobId && !filters.minScore && !filters.dateFrom && !filters.dateTo) {
        setToast({
          open: true,
          message: "Please select at least one filter",
          severity: "warning",
        });
        return;
      }

      setLoading(true);

      const exportPayload = {};
      if (filters.status) exportPayload.status = filters.status;
      if (filters.jobId) exportPayload.jobId = filters.jobId;
      if (filters.minScore) exportPayload.minScore = parseFloat(filters.minScore);
      if (filters.dateFrom) exportPayload.dateFrom = filters.dateFrom;
      if (filters.dateTo) exportPayload.dateTo = filters.dateTo;

      const response = await exportApplications(exportPayload);

      setToast({
        open: true,
        message: "Export started successfully! Check history for progress.",
        severity: "success",
      });

      // Refresh export history
      const historyRes = await getExportHistory();
      console.log("History response:", historyRes);
      setExportHistory(Array.isArray(historyRes?.data) ? historyRes.data : []);

      // Reset filters
      setFilters({
        status: "",
        jobId: "",
        minScore: "",
        dateFrom: "",
        dateTo: "",
      });
    } catch (error) {
      console.error("Export error:", error);
      setToast({
        open: true,
        message: error.response?.data?.message || "Export failed",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileName, exportId) => {
    try {
      setDownloading(exportId);
      const response = await downloadExportFile(fileName);

      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }

      // Create blob URL and download
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "export.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setToast({
        open: true,
        message: "File downloaded successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Download error:", error);
      setToast({
        open: true,
        message: "Failed to download file",
        severity: "error",
      });
    } finally {
      setDownloading(null);
    }
  };

  const handleRefresh = async () => {
    try {
      setHistoryLoading(true);
      const historyRes = await getExportHistory();
      console.log("Refresh history response:", historyRes);
      setExportHistory(Array.isArray(historyRes?.data) ? historyRes.data : []);
    } catch (error) {
      console.error("Error refreshing history:", error);
      setToast({
        open: true,
        message: "Failed to refresh history",
        severity: "error",
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  const formatDate = (date) => {
    try {
      if (!date) return "—";
      const d = new Date(date);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return "—";
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Debug Info */}
      <Box sx={{
        p: 2,
        borderRadius: "12px",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        border: "1px solid rgba(99, 102, 241, 0.3)",
      }}>
        <Typography sx={{ color: "#6366f1", fontSize: "12px", fontFamily: "monospace" }}>
          DEBUG: {JSON.stringify({ jobs: jobs.length, exports: exportHistory.length, loading: historyLoading }, null, 2)}
        </Typography>
      </Box>

      {/* Error Display */}
      {error && (
        <Box sx={{
          p: 2,
          borderRadius: "12px",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
        }}>
          <Typography sx={{ color: "#ef4444", fontSize: "14px" }}>
            ⚠️ {error}
          </Typography>
        </Box>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 1,
            }}
          >
            Export Applications
          </Typography>
          <Typography sx={{ color: "#94a3b8", fontSize: "14px" }}>
            Export and download application data with custom filters
          </Typography>
        </Box>
      </motion.div>

      {/* Export Filter Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <GlassCard>
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#e2e8f0",
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <FileDownloadIcon sx={{ fontSize: "20px", color: "#a78bfa" }} />
              Export Filters
            </Typography>
          </Box>

          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {/* Status Filter */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel
                  sx={{
                    color: "#94a3b8 !important",
                    fontSize: "13px",
                    "&.Mui-focused": {
                      color: "#a78bfa !important",
                    },
                  }}
                >
                  Status
                </InputLabel>
                <Select
                  value={filters.status}
                  onChange={handleFilterChange("status")}
                  label="Status"
                  sx={{
                    color: "#e2e8f0",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "transparent",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.12)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#a78bfa",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#a78bfa",
                    },
                  }}
                >
                  <MenuItem value="">No Status</MenuItem>
                  <MenuItem value="pending">Applied</MenuItem>
                  <MenuItem value="shortlisted">Shortlisted</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Job Filter */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel
                  sx={{
                    color: "#94a3b8 !important",
                    fontSize: "13px",
                    "&.Mui-focused": {
                      color: "#a78bfa !important",
                    },
                  }}
                >
                  Job
                </InputLabel>
                <Select
                  value={filters.jobId}
                  onChange={handleFilterChange("jobId")}
                  label="Job"
                  sx={{
                    color: "#e2e8f0",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "transparent",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.12)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#a78bfa",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#a78bfa",
                    },
                  }}
                >
                  <MenuItem value="">All Jobs</MenuItem>
                  {jobs.map((job) => (
                    <MenuItem key={job._id} value={job._id}>
                      {job.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Min Score Filter */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Minimum Score"
                value={filters.minScore}
                onChange={handleFilterChange("minScore")}
                placeholder="0-100"
                inputProps={{ min: 0, max: 100, step: 1 }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#e2e8f0",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.08)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.12)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#a78bfa",
                    },
                  },
                  "& .MuiOutlinedInput-input::placeholder": {
                    color: "#64748b",
                    opacity: 0.7,
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "13px",
                  },
                  "& label": {
                    color: "#94a3b8",
                    fontSize: "13px",
                    "&.Mui-focused": {
                      color: "#a78bfa",
                    },
                  },
                }}
              />
            </Grid>

            {/* Date From */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date From"
                value={filters.dateFrom}
                onChange={handleFilterChange("dateFrom")}
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#e2e8f0",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.08)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.12)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#a78bfa",
                    },
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "13px",
                  },
                  "& label": {
                    color: "#94a3b8",
                    fontSize: "13px",
                    "&.Mui-focused": {
                      color: "#a78bfa",
                    },
                  },
                }}
              />
            </Grid>

            {/* Date To */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date To"
                value={filters.dateTo}
                onChange={handleFilterChange("dateTo")}
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#e2e8f0",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.08)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.12)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#a78bfa",
                    },
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "13px",
                  },
                  "& label": {
                    color: "#94a3b8",
                    fontSize: "13px",
                    "&.Mui-focused": {
                      color: "#a78bfa",
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Export Button */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              disabled={loading}
              style={{
                padding: "10px 24px",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s ease",
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={18} sx={{ color: "#fff" }} />
                  Exporting...
                </>
              ) : (
                <>
                  <FileDownloadIcon sx={{ fontSize: "18px" }} />
                  Export Applications
                </>
              )}
            </motion.button>
          </Box>
        </GlassCard>
      </motion.div>

      {/* Export History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <GlassCard>
          <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <HistoryIcon sx={{ fontSize: "20px", color: "#a78bfa" }} />
              Export History
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                onClick={handleRefresh}
                disabled={historyLoading}
                startIcon={<RefreshIcon />}
                sx={{
                  color: "#a78bfa",
                  fontSize: "12px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(167, 139, 250, 0.1)",
                  },
                }}
              >
                Refresh
              </Button>
            </Box>
          </Box>

          {historyLoading ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rounded" height={60} />
              ))}
            </Box>
          ) : exportHistory.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <HistoryIcon sx={{ fontSize: "48px", color: "#475569", mb: 2 }} />
              <Typography sx={{ color: "#94a3b8" }}>
                No exports yet. Create your first export above.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ backgroundColor: "transparent" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={thStyle}>Type</TableCell>
                    <TableCell sx={thStyle}>Status</TableCell>
                    <TableCell sx={thStyle}>Records</TableCell>
                    <TableCell sx={thStyle}>Exported At</TableCell>
                    <TableCell sx={thStyle}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exportHistory && Array.isArray(exportHistory) ? (
                    exportHistory.map((exp) => (
                      <TableRow
                        key={exp?._id || Math.random()}
                        sx={{
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.02)",
                          },
                        }}
                      >
                        <TableCell sx={{ color: "#cbd5e1", py: 2 }}>
                          <Chip
                            label={exp?.exportType || "Applications"}
                            size="small"
                            sx={{
                              backgroundColor: "rgba(167, 139, 250, 0.15)",
                              color: "#a78bfa",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "#cbd5e1", py: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <StatusIcon status={exp?.status} />
                            <Typography
                              sx={{
                                fontSize: "13px",
                                color: getStatusColor(exp?.status),
                                fontWeight: 600,
                                textTransform: "capitalize",
                              }}
                            >
                              {exp?.status || "unknown"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: "#cbd5e1", py: 2, fontSize: "13px" }}>
                          {exp?.totalRecords || 0}
                        </TableCell>
                        <TableCell sx={{ color: "#cbd5e1", py: 2, fontSize: "13px" }}>
                          {formatDate(exp?.createdAt || exp?.requestedAt)}
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          {exp?.status === "completed" && exp?.fileUrl ? (
                            <Button
                              size="small"
                              startIcon={
                                downloading === exp._id ? (
                                  <CircularProgress size={16} />
                                ) : (
                                  <GetAppIcon />
                                )
                              }
                              onClick={() => handleDownload(exp.fileUrl.split("/").pop(), exp._id)}
                              disabled={downloading === exp._id}
                              sx={{
                                color: "#10b981",
                                fontSize: "12px",
                                textTransform: "none",
                                "&:hover": {
                                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                                },
                              }}
                            >
                              Download
                            </Button>
                          ) : (
                            <Typography sx={{ color: "#64748b", fontSize: "12px" }}>
                              —
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </GlassCard>
      </motion.div>

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
          sx={{
            backgroundColor:
              toast.severity === "success"
                ? "#10b981"
                : toast.severity === "error"
                ? "#ef4444"
                : "#f59e0b",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
