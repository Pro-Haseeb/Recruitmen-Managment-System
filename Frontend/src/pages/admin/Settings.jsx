import {
  Box,
  Typography,
  TextField,
  Button,
  Paper
} from "@mui/material";

const drawerWidth = 240;

export default function Settings() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: "64px",
        left: `${drawerWidth}px`,
        right: 0,
        bottom: 0,

        p: 4,

        // 🔥 RECRUITAI PREMIUM THEME
        background: `
          linear-gradient(
            135deg,
            #020617 0%,
            #0f172a 30%,
            #111827 65%,
            #1e3a8a 100%
          )
        `,

        overflowY: "auto",

        // 🔥 GLOW EFFECTS
        "&::before": {
          content: '""',
          position: "absolute",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "rgba(66,165,245,0.18)",
          filter: "blur(120px)",
          top: "-100px",
          left: "-100px",
          zIndex: 0
        },

        "&::after": {
          content: '""',
          position: "absolute",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "rgba(25,118,210,0.15)",
          filter: "blur(120px)",
          bottom: "-100px",
          right: "-100px",
          zIndex: 0
        }
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        sx={{
          color: "#fff",
          position: "relative",
          zIndex: 2
        }}
      >
        Settings
      </Typography>

      {/* GENERAL SETTINGS */}
      <Paper
        elevation={5}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: "24px",

          background: "rgba(15,23,42,0.75)",
          backdropFilter: "blur(18px)",

          border: "1px solid rgba(255,255,255,0.08)",

          position: "relative",
          zIndex: 2,

          transition: "0.3s ease",

          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow:
              "0 20px 45px rgba(66,165,245,0.18)"
          }
        }}
      >
        <Typography
          fontWeight="bold"
          mb={3}
          sx={{
            color: "#42a5f5",
            fontSize: "20px"
          }}
        >
          General Settings
        </Typography>

        <TextField
          label="Platform Name"
          fullWidth
          sx={{
            mb: 3,

            "& .MuiOutlinedInput-root": {
              color: "#fff",
              borderRadius: "14px",

              "& fieldset": {
                borderColor: "rgba(255,255,255,0.15)"
              },

              "&:hover fieldset": {
                borderColor: "#42a5f5"
              },

              "&.Mui-focused fieldset": {
                borderColor: "#42a5f5"
              }
            },

            "& .MuiInputLabel-root": {
              color: "#94a3b8"
            }
          }}
        />

        <TextField
          label="Support Email"
          fullWidth
          sx={{
            mb: 3,

            "& .MuiOutlinedInput-root": {
              color: "#fff",
              borderRadius: "14px",

              "& fieldset": {
                borderColor: "rgba(255,255,255,0.15)"
              },

              "&:hover fieldset": {
                borderColor: "#42a5f5"
              },

              "&.Mui-focused fieldset": {
                borderColor: "#42a5f5"
              }
            },

            "& .MuiInputLabel-root": {
              color: "#94a3b8"
            }
          }}
        />

        <Button
          variant="contained"
          sx={{
            borderRadius: "14px",
            px: 4,
            py: 1.2,
            textTransform: "none",
            fontWeight: "bold",

            background:
              "linear-gradient(135deg,#1976d2,#42a5f5)",

            transition: "0.3s ease",

            "&:hover": {
              background:
                "linear-gradient(135deg,#1565c0,#1e88e5)",
              transform: "translateY(-3px)",
              boxShadow:
                "0 12px 30px rgba(66,165,245,0.35)"
            }
          }}
        >
          Save Changes
        </Button>
      </Paper>

      {/* ADMIN MANAGEMENT */}
      <Paper
        elevation={5}
        sx={{
          p: 4,
          borderRadius: "24px",

          background: "rgba(15,23,42,0.75)",
          backdropFilter: "blur(18px)",

          border: "1px solid rgba(255,255,255,0.08)",

          position: "relative",
          zIndex: 2,

          transition: "0.3s ease",

          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow:
              "0 20px 45px rgba(66,165,245,0.18)"
          }
        }}
      >
        <Typography
          fontWeight="bold"
          mb={3}
          sx={{
            color: "#42a5f5",
            fontSize: "20px"
          }}
        >
          Admin Management
        </Typography>

        <TextField
          label="New Admin Email"
          fullWidth
          sx={{
            mb: 3,

            "& .MuiOutlinedInput-root": {
              color: "#fff",
              borderRadius: "14px",

              "& fieldset": {
                borderColor: "rgba(255,255,255,0.15)"
              },

              "&:hover fieldset": {
                borderColor: "#42a5f5"
              },

              "&.Mui-focused fieldset": {
                borderColor: "#42a5f5"
              }
            },

            "& .MuiInputLabel-root": {
              color: "#94a3b8"
            }
          }}
        />

        <Button
          variant="contained"
          sx={{
            borderRadius: "14px",
            px: 4,
            py: 1.2,
            textTransform: "none",
            fontWeight: "bold",

            background:
              "linear-gradient(135deg,#1976d2,#42a5f5)",

            transition: "0.3s ease",

            "&:hover": {
              background:
                "linear-gradient(135deg,#1565c0,#1e88e5)",
              transform: "translateY(-3px)",
              boxShadow:
                "0 12px 30px rgba(66,165,245,0.35)"
            }
          }}
        >
          Add Admin
        </Button>
      </Paper>
    </Box>
  );
} 