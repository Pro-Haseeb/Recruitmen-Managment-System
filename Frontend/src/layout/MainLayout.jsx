import { Box, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const SIDEBAR_WIDTH = 240;

export default function MainLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020617 0%, #0a0f1e 50%, #020617 100%)",
      }}
    >
      {/* FIXED SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <Box
        sx={{
          flexGrow: 1,
          ml: `${SIDEBAR_WIDTH}px`,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: 0, // prevent flex overflow
        }}
      >
        {/* NAVBAR */}
        <Navbar hasSidebar />
        <Toolbar sx={{ flexShrink: 0 }} />

        {/* PAGE CONTENT */}
        <Box
          sx={{
            flexGrow: 1,
            px: { xs: 2, sm: 3, md: 4 },
            py: 3,
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}