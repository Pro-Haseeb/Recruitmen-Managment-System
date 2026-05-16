import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Grid, IconButton, Avatar } from "@mui/material";
import { Delete, Person, Email, Lock } from "@mui/icons-material";
import { motion } from "framer-motion";

import {
  getHRs,
  createHR,
  deleteHR,
} from "../../services/CompanyApi.js";

const glassInputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    background: "rgba(255,255,255,0.03)",
    borderRadius: "12px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
    "&.Mui-focused fieldset": { borderColor: "#60a5fa" }
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#60a5fa" },
};

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

export default function TeamManagement() {
  const [hrs, setHrs] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const fetchHRs = async () => {
    try {
      const res = await getHRs();
      setHrs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHRs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateHR = async (e) => {
    e.preventDefault();
    try {
      await createHR(formData);
      alert("HR Created Successfully");
      setFormData({ name: "", email: "", password: "" });
      fetchHRs();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create HR");
    }
  };

  const handleDeleteHR = async (id) => {
    if (!window.confirm("Are you sure you want to delete this HR member?")) return;
    try {
      await deleteHR(id);
      fetchHRs();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ color: "white", maxWidth: 1200, mx: "auto" }}>
        
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ mb: 1, letterSpacing: "-0.5px" }}>
              Team Management
            </Typography>
            <Typography sx={{ color: "#94a3b8" }}>
              Manage your HR team members and their access.
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ color: "#90caf9", fontWeight: 600, background: "rgba(144, 202, 249, 0.1)", px: 2, py: 1, borderRadius: 2 }}>
              Total HRs: {hrs.length} / 3
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          
          {/* Create HR Form */}
          <Grid item xs={12} md={4}>
            <GlassCard>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                Add New HR
              </Typography>
              <form onSubmit={handleCreateHR}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    sx={glassInputStyle}
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={glassInputStyle}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    sx={glassInputStyle}
                  />
                  
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={hrs.length >= 3}
                    sx={{
                      background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                      color: "white",
                      fontWeight: "600",
                      py: 1.5,
                      borderRadius: "12px",
                      textTransform: "none",
                      "&.Mui-disabled": {
                        background: "rgba(255,255,255,0.05)",
                        color: "rgba(255,255,255,0.3)"
                      }
                    }}
                  >
                    Add Team Member
                  </Button>
                </Box>
              </form>
            </GlassCard>
          </Grid>

          {/* HR List */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {hrs.length === 0 ? (
                <GlassCard sx={{ textAlign: "center", py: 8 }}>
                  <Typography sx={{ color: "#94a3b8" }}>No HR members found.</Typography>
                </GlassCard>
              ) : (
                hrs.map((hr, idx) => (
                  <motion.div key={hr._id || idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                    <GlassCard sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "rgba(59, 130, 246, 0.2)", color: "#60a5fa" }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography fontWeight="600" sx={{ color: "#f8fafc" }}>
                            {hr.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Email sx={{ fontSize: 14 }} /> {hr.email}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Typography sx={{ color: "#4ade80", background: "rgba(74, 222, 128, 0.1)", px: 1.5, py: 0.5, borderRadius: 2, fontSize: "0.85rem", fontWeight: 600 }}>
                          {hr.role || "HR"}
                        </Typography>
                        
                        <IconButton 
                          onClick={() => handleDeleteHR(hr._id)}
                          sx={{ 
                            color: "#ef4444", 
                            background: "rgba(239, 68, 68, 0.1)",
                            "&:hover": { background: "rgba(239, 68, 68, 0.2)" }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </GlassCard>
                  </motion.div>
                ))
              )}
            </Box>
          </Grid>
          
        </Grid>
      </Box>
    </motion.div>
  );
}
