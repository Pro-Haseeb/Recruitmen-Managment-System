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
  Button,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DateRangeIcon from "@mui/icons-material/DateRange";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";

import { companiesData, toggleCompanyStatus } from "../../services/AdminApi";
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

function CompanyDetailContent({ company, onToggle, toggling }) {
  if (!company) return null;
  const blocked = company.isBlocked;
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, p: 2.5, borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <Box sx={{
          width: 52, height: 52, borderRadius: "14px",
          background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)",
          display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center",
          color: "#60a5fa", fontSize: 22, fontWeight: 800, flexShrink: 0,
        }}>
          {(company.name || "C")[0].toUpperCase()}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "16px", color: "#fff", mb: 0.5 }}>
            {company.name}
          </Typography>
          <OverlayBadge
            label={blocked ? "Blocked" : "Active"}
            bg={blocked ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)"}
            color={blocked ? "#f87171" : "#34d399"}
            border={blocked ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)"}
          />
        </Box>
      </Box>

      <OverlaySection label="General Info" />
      <OverlayField label="Company Name" value={company.name} />
      <OverlayField label="Website">
        {company.website ? (
          <a
            href={company.website}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#60a5fa", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}
          >
            <LanguageIcon sx={{ fontSize: 16 }} />
            {company.website}
          </a>
        ) : (
          "—"
        )}
      </OverlayField>
      <OverlayField label="Company Size" value={company.size || "—"} />

      <OverlaySection label="Status & Date" />
      <OverlayField label="Account Status">
        <OverlayBadge
          label={blocked ? "Blocked" : "Active"}
          bg={blocked ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)"}
          color={blocked ? "#f87171" : "#34d399"}
          border={blocked ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)"}
        />
      </OverlayField>
      <OverlayField
        label="Date Joined"
        value={company.createdAt ? new Date(company.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
      />

      <OverlaySection label="Administrative Actions" />
      <Button
        fullWidth
        disabled={toggling}
        onClick={() => onToggle(company._id)}
        startIcon={toggling ? <CircularProgress size={14} color="inherit" /> : blocked ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <BlockIcon sx={{ fontSize: 16 }} />}
        sx={{
          textTransform: "none",
          borderRadius: "12px",
          fontWeight: 700,
          py: 1.2,
          border: `1px solid ${blocked ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.35)"}`,
          color: blocked ? "#34d399" : "#f87171",
          background: blocked ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
          "&:hover": {
            background: blocked ? "rgba(16,185,129,0.16)" : "rgba(239,68,68,0.16)",
          },
        }}
      >
        {blocked ? "Activate Company Access" : "Restrict Company Access"}
      </Button>
    </Box>
  );
}

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const [toggling, setToggling] = useState(false);

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const res = await companiesData();
      setCompanies(res.data || []);
    } catch (err) {
      console.error("Companies fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleToggle = async (id) => {
    setToggling(true);
    try {
      await toggleCompanyStatus(id);
      setCompanies((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isBlocked: !c.isBlocked } : c))
      );
      // Update selected
      if (selected?._id === id) {
        setSelected((prev) => ({ ...prev, isBlocked: !prev.isBlocked }));
      }
    } catch (err) {
      console.error("Toggle error:", err);
    } finally {
      setToggling(false);
    }
  };

  const filtered = companies.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      (c.name || "").toLowerCase().includes(q) ||
      (c.website || "").toLowerCase().includes(q)
    );
  });

  const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const counts = {
    all: companies.length,
    active: companies.filter((c) => !c.isBlocked).length,
    blocked: companies.filter((c) => c.isBlocked).length,
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
          Registered Companies
        </Typography>
        <Typography sx={{ color: "#64748b", fontSize: "15px" }}>
          Monitor onboarded tenants, toggle access restrictions, and track account status.
        </Typography>
      </Box>

      {/* STATS ROW */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        {[
          { label: "Total", val: counts.all, color: "#60a5fa" },
          { label: "Active", val: counts.active, color: "#34d399" },
          { label: "Blocked", val: counts.blocked, color: "#f87171" },
        ].map((s) => (
          <Box
            key={s.label}
            sx={{
              px: 2,
              py: 1,
              borderRadius: "10px",
              background: `${s.color}10`,
              border: `1px solid ${s.color}25`,
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color }} />
            <Typography sx={{ color: "#94a3b8", fontSize: "13px" }}>{s.label}</Typography>
            {loading ? (
              <Skeleton variant="text" width={16} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
            ) : (
              <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "13px" }}>{s.val}</Typography>
            )}
          </Box>
        ))}
      </Box>

      {/* SEARCH */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search by company name or website…"
          fullWidth
          size="small"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
          sx={{
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
          <BusinessIcon sx={{ fontSize: 40, color: "#1e3a5f", mb: 1 }} />
          <Typography sx={{ color: "#475569", fontSize: "15px" }}>
            No companies found.
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
                    <TableCell sx={{ ...thStyle, width: "25%" }}>Company Name</TableCell>
                    <TableCell sx={{ ...thStyle, width: "25%" }}>Website</TableCell>
                    <TableCell sx={{ ...thStyle, width: "15%" }}>Size</TableCell>
                    <TableCell sx={{ ...thStyle, width: "15%" }}>Joined</TableCell>
                    <TableCell sx={{ ...thStyle, width: "10%" }}>Status</TableCell>
                    <TableCell sx={{ ...thStyle, width: "10%", textAlign: "center" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginated.map((company) => {
                    const date = company.createdAt
                      ? new Date(company.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                      : "N/A";
                    const blocked = company.isBlocked;

                    return (
                      <TableRow
                        key={company._id}
                        onClick={() => setSelected(company)}
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
                          {company.name}
                        </TableCell>
                        <TableCell sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LanguageIcon sx={{ fontSize: 14, color: "#475569" }} />
                            {company.website ? (
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{ color: "#60a5fa", textDecoration: "none" }}
                              >
                                {company.website.replace(/^https?:\/\//, "")}
                              </a>
                            ) : (
                              "—"
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <GroupIcon sx={{ fontSize: 14, color: "#475569" }} />
                            <Typography sx={{ fontSize: "13px" }}>{company.size || "—"}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <DateRangeIcon sx={{ fontSize: 14, color: "#475569" }} />
                            {date}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              px: 1.2,
                              py: 0.3,
                              borderRadius: "8px",
                              background: blocked ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                              border: `1px solid ${blocked ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)"}`,
                              color: blocked ? "#f87171" : "#34d399",
                              fontSize: "11px",
                              fontWeight: 700,
                            }}
                          >
                            {blocked ? "Blocked" : "Active"}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="small"
                            disabled={toggling}
                            onClick={() => handleToggle(company._id)}
                            startIcon={blocked ? <CheckCircleIcon sx={{ fontSize: 13 }} /> : <BlockIcon sx={{ fontSize: 13 }} />}
                            sx={{
                              textTransform: "none",
                              borderRadius: "9px",
                              fontSize: "12px",
                              fontWeight: 700,
                              py: 0.5,
                              px: 1.5,
                              border: `1px solid ${blocked ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                              color: blocked ? "#34d399" : "#f87171",
                              background: blocked ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)",
                              "&:hover": {
                                background: blocked ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                              },
                            }}
                          >
                            {blocked ? "Unblock" : "Block"}
                          </Button>
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
            label="companies"
          />
        </>
      )}

      {/* DETAIL OVERLAY */}
      <DetailOverlay
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Company Details"
      >
        <CompanyDetailContent
          company={selected}
          onToggle={handleToggle}
          toggling={toggling}
        />
      </DetailOverlay>
    </Box>
  );
}