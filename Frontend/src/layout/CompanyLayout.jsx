import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import CompanySidebar from "./CompanySidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function CompanyLayout() {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", bgcolor: "#020617", minHeight: "100vh" }}>
      <CompanySidebar open={open} onClose={() => setOpen(false)} />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar hasSidebar />
        <Toolbar sx={{ minHeight: 78 }} /> {/* Spacer for Navbar */}

        <Box sx={{ p: 4, flex: 1, overflowY: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
