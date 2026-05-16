import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

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
        ...sx
      }}
    >
      {children}
    </Box>
  );
}

export default function Applications() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ color: "white", maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 1, letterSpacing: "-0.5px" }}>
          Applications
        </Typography>
        <Typography sx={{ color: "#94a3b8", mb: 4 }}>
          Review and manage candidate applications.
        </Typography>

        <GlassCard sx={{ textAlign: "center", py: 10 }}>
          <Typography variant="h6" sx={{ color: "#e2e8f0", mb: 1 }}>
            No Applications Yet
          </Typography>
          <Typography sx={{ color: "#94a3b8" }}>
            When candidates apply to your jobs, their applications will appear here.
          </Typography>
        </GlassCard>
      </Box>
    </motion.div>
  );
}
