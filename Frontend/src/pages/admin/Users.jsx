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
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PeopleIcon from "@mui/icons-material/People";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";

import { getAllUsers, blockUser, unblockUser } from "../../services/AdminApi";
import DetailOverlay, { OverlayField, OverlayBadge, OverlaySection } from "../../components/shared/DetailOverlay";
import Pagination from "../../components/shared/Pagination";

const PER_PAGE = 5;
const TABS = ["All", "Company Admin", "HR", "Candidate"];
const ROLE_KEYS = ["all", "company_admin", "hr", "candidate"];

const thStyle = {
  color: "#64748b",
  fontWeight: 700,
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  py: 2,
  whiteSpace: "nowrap",
};

const roleStyle = (role) => {
  if (role === "company_admin")
    return { bg: "rgba(139,92,246,0.1)", color: "#a78bfa", border: "rgba(139,92,246,0.25)", label: "Company Admin" };
  if (role === "hr")
    return { bg: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "rgba(59,130,246,0.25)", label: "HR" };
  if (role === "system_owner")
    return { bg: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "rgba(245,158,11,0.25)", label: "System Owner" };
  return { bg: "rgba(16,185,129,0.1)", color: "#34d399", border: "rgba(16,185,129,0.25)", label: "Candidate" };
};

function UserDetailContent({ user, onToggle, toggling }) {
  if (!user) return null;
  const rs = roleStyle(user.role);
  const isBlocked = user.isBlocked;
  return (
    <Box>
      {/* Avatar header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, p: 2.5, borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <Box sx={{
          width: 52, height: 52, borderRadius: "14px",
          background: rs.bg, border: `1px solid ${rs.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: rs.color, fontSize: 22, fontWeight: 800, flexShrink: 0,
        }}>
          {(user.name || "?")[0].toUpperCase()}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "16px", color: "#fff", mb: 0.5 }}>
            {user.name || "—"}
          </Typography>
          <OverlayBadge label={rs.label} bg={rs.bg} color={rs.color} border={rs.border} />
        </Box>
      </Box>

      <OverlaySection label="Contact" />
      <OverlayField label="Email Address" value={user.email} />

      <OverlaySection label="Account" />
      <OverlayField label="Role">
        <OverlayBadge label={rs.label} bg={rs.bg} color={rs.color} border={rs.border} />
      </OverlayField>
      <OverlayField label="Status">
        <OverlayBadge
          label={isBlocked ? "Blocked" : "Active"}
          bg={isBlocked ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)"}
          color={isBlocked ? "#f87171" : "#34d399"}
          border={isBlocked ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)"}
        />
      </OverlayField>
      {user.company && (
        <OverlayField label="Company">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BadgeIcon sx={{ fontSize: 14, color: "#475569" }} />
            <Typography sx={{ color: "#e2e8f0", fontSize: "14px" }}>
              {user.company?.name || user.company}
            </Typography>
          </Box>
        </OverlayField>
      )}
      <OverlayField label="Member Since" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"} />
      {isBlocked && user.blockedAt && (
        <OverlayField label="Blocked At" value={new Date(user.blockedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} valueColor="#f87171" />
      )}

      <OverlaySection label="Actions" />
      <Button
        fullWidth
        disabled={toggling}
        onClick={() => onToggle(user)}
        startIcon={toggling ? <CircularProgress size={14} color="inherit" /> : isBlocked ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <BlockIcon sx={{ fontSize: 16 }} />}
        sx={{
          textTransform: "none",
          borderRadius: "12px",
          fontWeight: 700,
          py: 1.2,
          border: `1px solid ${isBlocked ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.35)"}`,
          color: isBlocked ? "#34d399" : "#f87171",
          background: isBlocked ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
          "&:hover": {
            background: isBlocked ? "rgba(16,185,129,0.16)" : "rgba(239,68,68,0.16)",
          },
          "&.Mui-disabled": { opacity: 0.4 },
        }}
      >
        {isBlocked ? "Unblock This User" : "Block This User"}
      </Button>
    </Box>
  );
}

export default function Users() {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [tabIndex, setTabIndex]   = useState(0);
  const [page, setPage]           = useState(0);
  const [selected, setSelected]   = useState(null);
  const [toggling, setToggling]   = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error("Users fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // Filter
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q);
    const roleKey = ROLE_KEYS[tabIndex];
    const matchRole = roleKey === "all" || u.role === roleKey;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const counts = {
    all:          users.length,
    company_admin: users.filter((u) => u.role === "company_admin").length,
    hr:           users.filter((u) => u.role === "hr").length,
    candidate:    users.filter((u) => u.role === "candidate").length,
  };

  const handleToggle = async (user) => {
    setToggling(true);
    try {
      if (user.isBlocked) {
        await unblockUser(user._id);
      } else {
        await blockUser(user._id);
      }
      // Update local state immediately
      setUsers((prev) =>
        prev.map((u) => u._id === user._id ? { ...u, isBlocked: !u.isBlocked, blockedAt: !u.isBlocked ? new Date().toISOString() : null } : u)
      );
      // Update selected user in overlay too
      if (selected?._id === user._id) {
        setSelected((prev) => ({ ...prev, isBlocked: !prev.isBlocked, blockedAt: !prev.isBlocked ? new Date().toISOString() : null }));
      }
    } catch (err) {
      console.error("Toggle error:", err);
    } finally {
      setToggling(false);
    }
  };

  const handleTabChange = (_, v) => { setTabIndex(v); setPage(0); };
  const handleSearch    = (e)    => { setSearch(e.target.value); setPage(0); };

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
          Platform Users
        </Typography>
        <Typography sx={{ color: "#64748b", fontSize: "15px" }}>
          Browse all registered accounts across company admins, HR recruiters, and candidates.
        </Typography>
      </Box>

      {/* SUMMARY CHIPS */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        {[
          { label: "Total",          val: counts.all,           color: "#60a5fa" },
          { label: "Company Admins", val: counts.company_admin, color: "#a78bfa" },
          { label: "HR",             val: counts.hr,            color: "#60a5fa" },
          { label: "Candidates",     val: counts.candidate,     color: "#34d399" },
        ].map((c) => (
          <Box
            key={c.label}
            sx={{
              px: 2, py: 1, borderRadius: "10px",
              background: `${c.color}10`,
              border: `1px solid ${c.color}25`,
              display: "flex", alignItems: "center", gap: 1,
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: c.color }} />
            <Typography sx={{ color: "#94a3b8", fontSize: "13px" }}>{c.label}</Typography>
            {loading
              ? <Skeleton variant="text" width={20} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
              : <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "13px" }}>{c.val}</Typography>
            }
          </Box>
        ))}
      </Box>

      {/* TABS + SEARCH */}
      <Box
        sx={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 2, mb: 3, pb: 2,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          sx={{
            minHeight: "auto",
            "& .MuiTabs-indicator": {
              height: 2, borderRadius: 2,
              background: "linear-gradient(90deg,#3b82f6,#60a5fa)",
            },
            "& .MuiTab-root": {
              textTransform: "none", color: "#64748b", fontWeight: 600,
              fontSize: "14px", minHeight: "auto", py: 1,
              "&.Mui-selected": { color: "#60a5fa" },
            },
          }}
        >
          {TABS.map((t) => <Tab key={t} label={t} />)}
        </Tabs>

        <TextField
          placeholder="Search name or email…"
          size="small"
          value={search}
          onChange={handleSearch}
          sx={{
            width: { xs: "100%", sm: 260 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px", background: "rgba(15,23,42,0.6)",
              color: "#fff", border: "1px solid rgba(255,255,255,0.08)",
              "& fieldset": { border: "none" },
              "&:hover":     { border: "1px solid rgba(59,130,246,0.3)" },
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
              <Skeleton variant="rounded" width={32} height={32} sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: "10px", flexShrink: 0 }} />
              <Skeleton variant="text" width="20%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
              <Skeleton variant="text" width="25%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
              <Skeleton variant="rounded" width={80} height={24} sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: "8px" }} />
              <Skeleton variant="text" width="10%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
              <Skeleton variant="rounded" width={60} height={24} sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: "8px" }} />
              <Skeleton variant="rounded" width={70} height={28} sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: "10px", ml: "auto" }} />
            </Box>
          ))}
        </Paper>
      ) : filtered.length === 0 ? (
        <Box sx={{ py: 8, textAlign: "center", borderRadius: "16px", background: "rgba(15,23,42,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <PeopleIcon sx={{ fontSize: 40, color: "#1e3a5f", mb: 1 }} />
          <Typography sx={{ color: "#475569", fontSize: "15px" }}>
            {users.length === 0 ? "No users found in the database." : "No users match your search or filter."}
          </Typography>
        </Box>
      ) : (
        <>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "16px", overflow: "hidden",
              background: "rgba(15,23,42,0.5)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(16px)",
            }}
          >
            <TableContainer>
              <Table sx={{ tableLayout: "fixed", minWidth: 0 }}>
                <TableHead>
                  <TableRow sx={{ background: "rgba(255,255,255,0.02)" }}>
                    <TableCell sx={{ ...thStyle, width: "22%" }}>Name</TableCell>
                    <TableCell sx={{ ...thStyle, width: "26%" }}>Email</TableCell>
                    <TableCell sx={{ ...thStyle, width: "15%" }}>Role</TableCell>
                    <TableCell sx={{ ...thStyle, width: "12%" }}>Joined</TableCell>
                    <TableCell sx={{ ...thStyle, width: "10%" }}>Status</TableCell>
                    <TableCell sx={{ ...thStyle, width: "15%", textAlign: "center" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginated.map((user) => {
                    const rs = roleStyle(user.role);
                    const blocked = user.isBlocked;
                    return (
                      <TableRow
                        key={user._id}
                        onClick={() => setSelected(user)}
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
                        {/* Name */}
                        <TableCell sx={{ color: "#fff !important", fontWeight: 600 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, overflow: "hidden" }}>
                            <Box sx={{
                              width: 32, height: 32, borderRadius: "10px", flexShrink: 0,
                              background: rs.bg, border: `1px solid ${rs.border}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: rs.color, fontSize: 14, fontWeight: 800,
                            }}>
                              {(user.name || "?")[0].toUpperCase()}
                            </Box>
                            <Box sx={{ overflow: "hidden" }}>
                              <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {user.name || "—"}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* Email */}
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, overflow: "hidden" }}>
                            <EmailIcon sx={{ fontSize: 13, color: "#475569", flexShrink: 0 }} />
                            <Typography sx={{ fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {user.email}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Role */}
                        <TableCell>
                          <Box sx={{
                            display: "inline-flex", px: 1.2, py: 0.3, borderRadius: "8px",
                            background: rs.bg, border: `1px solid ${rs.border}`,
                            color: rs.color, fontSize: "11px", fontWeight: 700,
                          }}>
                            {rs.label}
                          </Box>
                        </TableCell>

                        {/* Joined */}
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                            <DateRangeIcon sx={{ fontSize: 13, color: "#475569", flexShrink: 0 }} />
                            <Typography sx={{ fontSize: "13px", whiteSpace: "nowrap" }}>
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Box sx={{
                            display: "inline-flex", px: 1.2, py: 0.3, borderRadius: "8px",
                            background: blocked ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                            border: `1px solid ${blocked ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)"}`,
                            color: blocked ? "#f87171" : "#34d399",
                            fontSize: "11px", fontWeight: 700,
                          }}>
                            {blocked ? "Blocked" : "Active"}
                          </Box>
                        </TableCell>

                        {/* Block / Unblock */}
                        <TableCell
                          sx={{ textAlign: "center" }}
                          onClick={(e) => { e.stopPropagation(); handleToggle(user); }}
                        >
                          <Button
                            size="small"
                            disabled={toggling}
                            startIcon={
                              blocked
                                ? <CheckCircleIcon sx={{ fontSize: 13 }} />
                                : <BlockIcon sx={{ fontSize: 13 }} />
                            }
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
                              "&.Mui-disabled": { opacity: 0.4 },
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
            label="users"
          />
        </>
      )}

      {/* DETAIL OVERLAY */}
      <DetailOverlay
        open={!!selected}
        onClose={() => setSelected(null)}
        title="User Details"
      >
        <UserDetailContent
          user={selected}
          onToggle={handleToggle}
          toggling={toggling}
        />
      </DetailOverlay>
    </Box>
  );
}