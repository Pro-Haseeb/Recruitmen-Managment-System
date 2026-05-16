import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import CandidateSidebar from "./CandidateSidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function CandidateLayout() {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", bgcolor: "#020617", minHeight: "100vh" }}>
      <CandidateSidebar open={open} onClose={() => setOpen(false)} />

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
