import React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";

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
  mb: 3
};

export default function CreateJob() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ maxWidth: 800, mx: "auto", color: "white" }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 1, letterSpacing: "-0.5px" }}>
          Post a New Job
        </Typography>
        <Typography sx={{ color: "#94a3b8", mb: 5 }}>
          Create a new job listing to attract top talent.
        </Typography>

        <Box
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: "24px",
            background: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
          }}
        >
          <TextField fullWidth label="Job Title" sx={glassInputStyle} placeholder="e.g. Senior Software Engineer" />
          
          <TextField 
            fullWidth 
            label="Job Description" 
            sx={glassInputStyle} 
            multiline 
            rows={5} 
            placeholder="Describe the responsibilities and requirements..."
          />
          
          <TextField fullWidth label="Required Skills (Comma separated)" sx={glassInputStyle} placeholder="e.g. React, Node.js, MongoDB" />
          
          <TextField fullWidth label="Experience Required (Years)" sx={glassInputStyle} type="number" placeholder="e.g. 3" />

          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              mt: 2,
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              color: "white",
              fontWeight: "600",
              fontSize: "1rem",
              py: 1.5,
              px: 4,
              borderRadius: "12px",
              textTransform: "none",
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
              "&:hover": {
                background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                boxShadow: "0 15px 30px -5px rgba(59, 130, 246, 0.6)"
              }
            }}
          >
            Post Job Now
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
}
