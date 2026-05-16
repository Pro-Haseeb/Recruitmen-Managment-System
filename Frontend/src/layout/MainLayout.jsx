import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      
      {/* SIDEBAR (TEMPORARY NOW) */}
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <Box sx={{ flex: 1 }}>
        <Navbar hasSidebar />
        <Toolbar />

        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>

      </Box>
    </Box>
  );
}