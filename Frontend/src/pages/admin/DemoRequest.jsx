import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  InputAdornment,
  TableContainer,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import GroupIcon from "@mui/icons-material/Group";
import DateRangeIcon from "@mui/icons-material/DateRange";

import { getDemoRequests, updateDemoStatus } from "../../services/AdminApi";
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

const statusColor = (s) =>
  s === "approved"
    ? { bg: "rgba(16,185,129,0.12)", color: "#34d399", border: "rgba(16,185,129,0.25)" }
    : s === "rejected"
    ? { bg: "rgba(239,68,68,0.12)", color: "#f87171", border: "rgba(239,68,68,0.25)" }
    : { bg: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "rgba(245,158,11,0.25)" };

function DemoDetailContent({ request, onAction, processing }) {
  if (!request) return null;
  const sc = statusColor(request.status);
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, p: 2.5, borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <Box sx={{
          width: 52, height: 52, borderRadius: "14px",
          background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)",
          display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center",
          color: "#ec4899", fontSize: 22, fontWeight: 800, flexShrink: 0,
        }}>
          {(request.companyName || "D")[0].toUpperCase()}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "16px", color: "#fff", mb: 0.5 }}>
            {request.companyName}
          </Typography>
          <OverlayBadge label={request.status} bg={sc.bg} color={sc.color} border={sc.border} />
        </Box>
      </Box>

      <OverlaySection label="Contact Information" />
      <OverlayField label="Official Email" value={request.officialEmail} />
      <OverlayField label="Contact Number" value={request.contactNumber || "—"} />

      <OverlaySection label="Request Info" />
      <OverlayField label="Estimated Company Size">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <GroupIcon sx={{ fontSize: 16, color: "#475569" }} />
          <Typography sx={{ color: "#e2e8f0", fontSize: "14px" }}>
            {request.companySize || "—"}
          </Typography>
        </Box>
      </OverlayField>
      <OverlayField
        label="Date Submitted"
        value={request.createdAt ? new Date(request.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
      />

      <OverlaySection label="Administrative Operations" />
      {request.status === "pending" ? (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            fullWidth
            disabled={processing}
            onClick={() => onAction(request._id, "approved")}
            startIcon={<CheckIcon sx={{ fontSize: 16 }} />}
            sx={{
              textTransform: "none",
              borderRadius: "12px",
              fontWeight: 700,
              py: 1.2,
              background: "rgba(16,185,129,0.15)",
              color: "#34d399",
              border: "1px solid rgba(16,185,129,0.3)",
              "&:hover": { background: "rgba(16,185,129,0.25)" },
            }}
          >
            Approve Request
          </Button>
          <Button
            fullWidth
            disabled={processing}
            onClick={() => onAction(request._id, "rejected")}
            startIcon={<CloseIcon sx={{ fontSize: 16 }} />}
            sx={{
              textTransform: "none",
              borderRadius: "12px",
              fontWeight: 700,
              py: 1.2,
              borderColor: "rgba(239,68,68,0.3)",
              color: "#f87171",
              "&:hover": { background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.5)" },
            }}
          >
            Reject Request
          </Button>
        </Box>
      ) : (
        <Typography sx={{ color: "#475569", fontSize: "13px", fontWeight: 600, textAlign: "center", py: 1 }}>
          This demo request has already been processed as <span style={{ color: sc.color }}>{request.status}</span>.
        </Typography>
      )}
    </Box>
  );
}

export default function DemoRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fetchDemoRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDemoRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error("Demo requests fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDemoRequests();
  }, [fetchDemoRequests]);

  const handleAction = async (id, status) => {
    setProcessing(true);
    try {
      await updateDemoStatus(id, status);
      setRequests((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item))
      );
      // Update selected
      if (selected?._id === id) {
        setSelected((prev) => ({ ...prev, status }));
      }
    } catch (err) {
      console.error("Action error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const filtered = requests.filter((r) => {
    const q = searchQuery.toLowerCase();
    const match =
      (r.companyName || "").toLowerCase().includes(q) ||
      (r.officialEmail || "").toLowerCase().includes(q);
    if (tabIndex === 1) return match && r.status === "pending";
    if (tabIndex === 2) return match && r.status === "approved";
    if (tabIndex === 3) return match && r.status === "rejected";
    return match;
  });

  const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <Box sx={{ width: "100%", color: "#fff" }}>
      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          fontWeight="800"
          sx={{
            background: "linear-gradient(90deg, #fff 60%, #93c5fd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 0.5,
            letterSpacing: "-0.5px",
          }}
        >
          Demo Requests
        </Typography>
        <Typography sx={{ color: "#64748b", fontSize: "15px" }}>
          Review inbound tenant requests — approve to onboard or reject to decline.
        </Typography>
      </Box>

      {/* SUMMARY CHIPS */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        {[
          { label: "All", val: counts.all, color: "#60a5fa" },
          { label: "Pending", val: counts.pending, color: "#fbbf24" },
          { label: "Approved", val: counts.approved, color: "#34d399" },
          { label: "Rejected", val: counts.rejected, color: "#f87171" },
        ].map((c) => (
          <Box
            key={c.label}
            sx={{
              px: 2,
              py: 1,
              borderRadius: "10px",
              background: `${c.color}10`,
              border: `1px solid ${c.color}25`,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: c.color }} />
            <Typography sx={{ color: "#94a3b8", fontSize: "13px" }}>{c.label}</Typography>
            {loading ? (
              <Skeleton variant="text" width={16} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
            ) : (
              <Typography sx={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>{c.val}</Typography>
            )}
          </Box>
        ))}
      </Box>

      {/* TABS + SEARCH */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          pb: 2,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(_, v) => { setTabIndex(v); setPage(0); }}
          sx={{
            minHeight: "auto",
            "& .MuiTabs-indicator": {
              height: 2,
              borderRadius: 2,
              background: "linear-gradient(90deg,#3b82f6,#60a5fa)",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              color: "#64748b",
              fontWeight: 600,
              fontSize: "14px",
              minHeight: "auto",
              py: 1,
              "&.Mui-selected": { color: "#60a5fa" },
            },
          }}
        >
          <Tab label="All" />
          <Tab label="Pending" />
          <Tab label="Approved" />
          <Tab label="Rejected" />
        </Tabs>

        <TextField
          placeholder="Search company or email…"
          size="small"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
          sx={{
            width: { xs: "100%", sm: 280 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              background: "rgba(15,23,42,0.6)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.08)",
              "& fieldset": { border: "none" },
              "&:hover": { border: "1px solid rgba(59,130,246,0.3)" },
              "&.Mui-focused": { border: "1px solid rgba(59,130,246,0.5)" },
            },
            "& input::placeholder": { color: "#64748b", opacity: 1 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#3b82f6", fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* TABLE */}
      {loading ? (
        <Paper elevation={0} sx={{ borderRadius: "16px", overflow: "hidden", background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {[...Array(5)].map((_, i) => (
            <Box key={i} sx={{ p: 2.5, borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: 2, alignItems: "center" }}>
              <Skeleton variant="rounded" width={24} height={24} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
              <Skeleton variant="text" width="20%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
              <Skeleton variant="text" width="25%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
              <Skeleton variant="rounded" width={60} height={24} sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: "8px" }} />
              <Skeleton variant="text" width="15%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
              <Skeleton variant="rounded" width={70} height={28} sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: "10px", ml: "auto" }} />
            </Box>
          ))}
        </Paper>
      ) : filtered.length === 0 ? (
        <Box sx={{ py: 8, textAlign: "center", borderRadius: "16px", background: "rgba(15,23,42,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <Typography sx={{ color: "#475569", fontSize: "15px" }}>
            No demo requests match your filters.
          </Typography>
        </Box>
      ) : (
        <>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "16px",
              overflow: "hidden",
              background: "rgba(15,23,42,0.5)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(16px)",
            }}
          >
            <TableContainer>
              <Table sx={{ tableLayout: "fixed", minWidth: 0 }}>
                <TableHead>
                  <TableRow sx={{ background: "rgba(255,255,255,0.02)" }}>
                    <TableCell sx={{ ...thStyle, width: "22%" }}>Company</TableCell>
                    <TableCell sx={{ ...thStyle, width: "24%" }}>Email</TableCell>
                    <TableCell sx={{ ...thStyle, width: "15%" }}>Phone</TableCell>
                    <TableCell sx={{ ...thStyle, width: "12%" }}>Size</TableCell>
                    <TableCell sx={{ ...thStyle, width: "12%" }}>Date</TableCell>
                    <TableCell sx={{ ...thStyle, width: "15%" }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginated.map((req) => {
                    const sc = statusColor(req.status);
                    const date = req.createdAt
                      ? new Date(req.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                      : "N/A";

                    return (
                      <TableRow
                        key={req._id}
                        onClick={() => setSelected(req)}
                        sx={{
                          cursor: "pointer",
                          "& td": {
                            color: "#94a3b8",
                            borderBottom: "1px solid rgba(255,255,255,0.04)",
                            fontSize: "14px",
                            py: 1.8,
                          },
                          "&:hover": { background: "rgba(59,130,246,0.05)" },
                          transition: "background 0.2s",
                        }}
                      >
                        <TableCell sx={{ color: "#fff !important", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {req.companyName}
                        </TableCell>
                        <TableCell sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <EmailIcon sx={{ fontSize: 14, color: "#475569" }} />
                            {req.officialEmail}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 14, color: "#475569" }} />
                            {req.contactNumber || "—"}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <GroupIcon sx={{ fontSize: 14, color: "#475569" }} />
                            {req.companySize || "—"}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarTodayIcon sx={{ fontSize: 14, color: "#475569" }} />
                            {date}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              px: 1.5,
                              py: 0.4,
                              borderRadius: "8px",
                              background: sc.bg,
                              border: `1px solid ${sc.border}`,
                              color: sc.color,
                              fontSize: "12px",
                              fontWeight: 700,
                              textTransform: "capitalize",
                            }}
                          >
                            {req.status}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            perPage={PER_PAGE}
            onPageChange={setPage}
            label="demo requests"
          />
        </>
      )}

      {/* DETAIL OVERLAY */}
      <DetailOverlay
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Demo Request Details"
      >
        <DemoDetailContent
          request={selected}
          onAction={handleAction}
          processing={processing}
        />
      </DetailOverlay>
    </Box>
  );
}