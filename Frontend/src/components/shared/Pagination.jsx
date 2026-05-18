import { Box, Typography, Button } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

/**
 * Pagination — Reusable 5-per-page pagination bar
 * Props:
 *   page         {number}   — current page (0-indexed)
 *   totalPages   {number}   — total number of pages
 *   totalItems   {number}   — total item count
 *   perPage      {number}   — items per page (default 5)
 *   onPageChange {function} — called with new page index
 *   label        {string}   — noun label e.g. "users", "companies"
 */
export default function Pagination({ page, totalPages, totalItems, perPage = 5, onPageChange, label = "records" }) {
  const from = totalItems === 0 ? 0 : page * perPage + 1;
  const to   = Math.min((page + 1) * perPage, totalItems);

  if (totalPages <= 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 2.5,
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      {/* Left — count info */}
      <Typography sx={{ color: "#475569", fontSize: "13px" }}>
        Showing{" "}
        <Box component="span" sx={{ color: "#94a3b8", fontWeight: 600 }}>
          {from}–{to}
        </Box>{" "}
        of{" "}
        <Box component="span" sx={{ color: "#94a3b8", fontWeight: 600 }}>
          {totalItems}
        </Box>{" "}
        {label}
      </Typography>

      {/* Right — nav controls */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          startIcon={<ChevronLeftIcon sx={{ fontSize: 16 }} />}
          size="small"
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#94a3b8",
            fontSize: "13px",
            fontWeight: 600,
            py: 0.7,
            px: 1.5,
            "&:hover": { borderColor: "#60a5fa", color: "#fff", background: "rgba(59,130,246,0.06)" },
            "&.Mui-disabled": { opacity: 0.3, color: "#475569" },
          }}
        >
          Previous
        </Button>

        {/* Page indicators — show up to 5 page numbers */}
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            // For > 7 pages, show sliding window around current page
            let pageNum = i;
            if (totalPages > 7) {
              const start = Math.max(0, Math.min(page - 3, totalPages - 7));
              pageNum = start + i;
            }
            const isActive = pageNum === page;
            return (
              <Box
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#fff" : "#475569",
                  background: isActive
                    ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                    : "transparent",
                  border: isActive ? "none" : "1px solid rgba(255,255,255,0.06)",
                  transition: "all 0.15s ease",
                  "&:hover": !isActive ? {
                    background: "rgba(59,130,246,0.08)",
                    borderColor: "rgba(59,130,246,0.3)",
                    color: "#94a3b8",
                  } : {},
                  userSelect: "none",
                }}
              >
                {pageNum + 1}
              </Box>
            );
          })}
        </Box>

        <Button
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          endIcon={<ChevronRightIcon sx={{ fontSize: 16 }} />}
          size="small"
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#94a3b8",
            fontSize: "13px",
            fontWeight: 600,
            py: 0.7,
            px: 1.5,
            "&:hover": { borderColor: "#60a5fa", color: "#fff", background: "rgba(59,130,246,0.06)" },
            "&.Mui-disabled": { opacity: 0.3, color: "#475569" },
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
