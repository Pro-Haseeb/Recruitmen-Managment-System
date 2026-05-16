import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppShell() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#050d18", color: "white" }}>
      <Navbar />
      <Toolbar />
      <Box component="main" sx={{ px: { xs: 2, md: 4 }, pb: 4 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
