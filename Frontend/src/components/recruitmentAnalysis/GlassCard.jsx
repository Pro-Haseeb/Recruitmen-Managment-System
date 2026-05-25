import { Box } from "@mui/material";
import { analysisTheme } from "../../utils/recruitmentAnalysis/analysisTheme.js";

export default function GlassCard({ children, onClick, sx = {} }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 3,
        borderRadius: analysisTheme.cardRadius,
        background: analysisTheme.glass,
        backdropFilter: "blur(20px)",
        border: `1px solid ${analysisTheme.glassBorder}`,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        transition: "all 0.3s ease",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick
          ? {
              transform: "translateY(-4px)",
              boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
              borderColor: "rgba(255, 255, 255, 0.12)",
            }
          : {},
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
