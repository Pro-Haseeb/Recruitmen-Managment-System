import { Box, Typography, TextField, Button, Grid, Avatar } from "@mui/material";
import { motion } from "framer-motion";

const glassInputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    background: "rgba(255,255,255,0.03)",
    borderRadius: "12px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
    "&.Mui-focused fieldset": { borderColor: "#a855f7" } // purple focus
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#a855f7" },
  mb: 3
};

function GlassCard({ children, sx = {} }) {
  return (
    <Box
      sx={{
        p: { xs: 3, md: 4 },
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

export default function Profile() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ color: "white", maxWidth: 1000, mx: "auto" }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 1, letterSpacing: "-0.5px" }}>
          My Profile
        </Typography>
        <Typography sx={{ color: "#94a3b8", mb: 4 }}>
          Update your personal details and resume.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <GlassCard sx={{ textAlign: "center" }}>
              <Avatar sx={{ width: 100, height: 100, mx: "auto", mb: 2, background: "linear-gradient(135deg, #a855f7, #3b82f6)", fontSize: "2rem" }}>
                C
              </Avatar>
              <Typography variant="h6" fontWeight="700">Candidate Name</Typography>
              <Typography sx={{ color: "#94a3b8", mb: 3 }}>Software Engineer</Typography>
              
              <Button 
                variant="outlined" 
                fullWidth
                sx={{ 
                  color: "#e9d5ff",
                  borderColor: "rgba(168, 85, 247, 0.5)",
                  borderRadius: "10px",
                  "&:hover": { borderColor: "#a855f7", background: "rgba(168, 85, 247, 0.1)" }
                }}
              >
                Upload Resume
              </Button>
            </GlassCard>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <GlassCard>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                Personal Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="First Name" defaultValue="John" sx={glassInputStyle} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Last Name" defaultValue="Doe" sx={glassInputStyle} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Email" defaultValue="john@example.com" sx={glassInputStyle} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Professional Summary" multiline rows={4} defaultValue="Experienced software engineer with a passion for building scalable web applications." sx={glassInputStyle} />
                </Grid>
              </Grid>

              <Button 
                variant="contained" 
                sx={{ 
                  mt: 2,
                  background: "linear-gradient(135deg, #9333ea, #a855f7)",
                  color: "white",
                  fontWeight: "600",
                  py: 1.5,
                  px: 4,
                  borderRadius: "12px",
                  textTransform: "none",
                  "&:hover": { background: "linear-gradient(135deg, #7e22ce, #9333ea)" }
                }}
              >
                Save Changes
              </Button>
            </GlassCard>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
}
