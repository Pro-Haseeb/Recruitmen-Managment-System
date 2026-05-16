import { Box } from "@mui/material";

const GlassCard = ({ children }) => (
  <Box
    sx={{
      backdropFilter: "blur(12px)",
      background: "rgba(255,255,255,0.08)",
      borderRadius: "20px",
      p: 3,
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      border: "1px solid rgba(255,255,255,0.1)",
    }}
  >
    {children}
  </Box>
);

export default GlassCard;