import { useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * DetailOverlay — Universal glassmorphism overlay modal
 * Props:
 *   open       {boolean}   — whether overlay is visible
 *   onClose    {function}  — called when user closes
 *   title      {string}    — overlay header title
 *   children   {node}      — content to render inside
 *   maxWidth   {string}    — max width of panel (default 540px)
 */
export default function DetailOverlay({ open, onClose, title = "Details", children, maxWidth = "540px" }) {
  // Close on ESC key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    // Backdrop
    <Box
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        background: "rgba(2, 6, 23, 0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        animation: "fadeIn 0.2s ease",
        "@keyframes fadeIn": { from: { opacity: 0 }, to: { opacity: 1 } },
      }}
    >
      {/* Panel — stop click propagation so panel clicks don't close overlay */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: { xs: "100%", sm: maxWidth },
          maxWidth: { xs: "100%", sm: maxWidth },
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(145deg, rgba(15,23,42,0.98) 0%, rgba(10,15,30,0.98) 100%)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
          animation: "slideIn 0.25s cubic-bezier(0.16,1,0.3,1)",
          "@keyframes slideIn": {
            from: { transform: "translateX(100%)", opacity: 0 },
            to:   { transform: "translateX(0)",    opacity: 1 },
          },
          overflowX: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2.5,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            flexShrink: 0,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 4,
                height: 24,
                borderRadius: 2,
                background: "linear-gradient(180deg, #3b82f6, #8b5cf6)",
              }}
            />
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "16px",
                color: "#fff",
                letterSpacing: "-0.2px",
              }}
            >
              {title}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "#64748b",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              width: 32,
              height: 32,
              "&:hover": {
                color: "#fff",
                background: "rgba(239,68,68,0.12)",
                borderColor: "rgba(239,68,68,0.3)",
              },
              transition: "all 0.2s",
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Scrollable Body */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            px: 3,
            py: 3,
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255,255,255,0.1)",
              borderRadius: 2,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

/** ── Helpers you can import and use inside overlay body ── */

/** A labelled field row: <OverlayField label="Email" value="..." /> */
export function OverlayField({ label, value, valueColor, children }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        sx={{
          color: "#475569",
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          mb: 0.6,
        }}
      >
        {label}
      </Typography>
      {children ? (
        children
      ) : (
        <Typography
          sx={{
            color: valueColor || "#e2e8f0",
            fontSize: "14px",
            fontWeight: 500,
            wordBreak: "break-word",
          }}
        >
          {value ?? "—"}
        </Typography>
      )}
    </Box>
  );
}

/** A coloured badge chip */
export function OverlayBadge({ label, bg, color, border }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        px: 1.5,
        py: 0.4,
        borderRadius: "8px",
        background: bg || "rgba(255,255,255,0.05)",
        border: `1px solid ${border || "rgba(255,255,255,0.1)"}`,
        color: color || "#94a3b8",
        fontSize: "12px",
        fontWeight: 700,
      }}
    >
      {label}
    </Box>
  );
}

/** Section divider with label */
export function OverlaySection({ label }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        my: 2.5,
      }}
    >
      <Typography
        sx={{
          color: "#334155",
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "1px",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
    </Box>
  );
}
