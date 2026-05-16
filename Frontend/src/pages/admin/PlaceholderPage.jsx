import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function PlaceholderPage({ title, description, actionLabel, actionPath }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "fixed",
        top: "64px",
        left: `${drawerWidth}px`,
        right: 0,
        bottom: 0,
        p: 6,
        background: `
          linear-gradient(
            135deg,
            rgba(2, 6, 23, 0.98) 0%,
            rgba(15, 23, 42, 0.96) 40%,
            rgba(17, 24, 39, 0.98) 100%
          )
        `,
        overflowY: "auto"
      }}
    >
      <Box
        sx={{
          maxWidth: 760,
          mt: 4,
          p: 5,
          borderRadius: "28px",
          background: "rgba(15, 23, 42, 0.75)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)"
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ color: "#fff", mb: 2 }}
        >
          {title}
        </Typography>

        <Typography
          sx={{ color: "#cbd5e1", fontSize: "17px", mb: 4, lineHeight: 1.8 }}
        >
          {description}
        </Typography>

        {actionPath && (
          <Button
            variant="contained"
            onClick={() => navigate(actionPath)}
            sx={{
              textTransform: "none",
              borderRadius: "14px",
              px: 4,
              py: 1.3,
              background: "linear-gradient(135deg,#42a5f5,#0ea5e9)",
              fontWeight: 700,
              boxShadow: "0 14px 35px rgba(66,165,245,0.24)",
              "&:hover": {
                background: "linear-gradient(135deg,#1d4ed8,#0284c7)"
              }
            }}
          >
            {actionLabel || "Explore"}
          </Button>
        )}
      </Box>
    </Box>
  );
}
