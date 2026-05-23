import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  Typography,
  IconButton
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const menu = [
  { name: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
  { name: "Companies", path: "/admin/companies", icon: <BusinessIcon /> },
  { name: "Demo Requests", path: "/admin/demo", icon: <RequestQuoteIcon /> },
  { name: "Users", path: "/admin/users", icon: <PeopleIcon /> },
  { name: "Analytics", path: "/admin/analytics", icon: <BarChartIcon /> },
  { name: "Settings", path: "/admin/settings", icon: <SettingsIcon /> },
  { name: "Back to Home", path: "/", icon: <ArrowBackIcon /> }
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",

          // 🔥 MATCHING PREMIUM THEME
          background: `
            linear-gradient(
              180deg,
              rgba(2,6,23,0.98),
              rgba(15,23,42,0.97),
              rgba(17,24,39,0.98)
            )
          `,

          color: "#fff",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          overflowX: "hidden",
          overflowY: "auto",
          position: "fixed",
          height: "100vh",
          zIndex: 1200,

          // 🔥 GLOW EFFECT
          "&::before": {
            content: '""',
            position: "absolute",
            top: -120,
            right: -120,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "rgba(66,165,245,0.18)",
            filter: "blur(90px)"
          },

          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -120,
            left: -120,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "rgba(25,118,210,0.16)",
            filter: "blur(90px)"
          },

          // ✨ CUSTOM SCROLLBAR
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
            margin: "8px 0",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(59,130,246,0.0)",
            borderRadius: "20px",
            transition: "background 0.4s ease",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            background: "linear-gradient(180deg, rgba(59,130,246,0.5), rgba(96,165,250,0.3))",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "linear-gradient(180deg, rgba(59,130,246,0.8), rgba(96,165,250,0.6))",
            boxShadow: "0 0 8px rgba(59,130,246,0.4)",
          },
          "&::-webkit-scrollbar-thumb:active": {
            background: "linear-gradient(180deg, #3b82f6, #60a5fa)",
            boxShadow: "0 0 12px rgba(59,130,246,0.6)",
          },
          // Firefox
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(59,130,246,0.3) transparent",
        }
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          borderBottom: "1px solid rgba(255,255,255,0.06)"
        }}
      >
        {/* BACK TO HOME BUTTON */}
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            color: "rgba(255,255,255,0.4)",
            transition: "all 0.3s ease",
            "&:hover": {
              color: "#60a5fa",
              background: "rgba(96,165,250,0.08)",
              transform: "translateX(-2px)"
            }
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
        </IconButton>
        {/* LOGO */}
        <Box
          sx={{
            width: 70,
            height: 70,
            mx: "auto",
            mb: 2,
            borderRadius: "22px",
            background:
              "linear-gradient(135deg,#1976d2,#42a5f5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "900",
            fontSize: "24px",
            boxShadow:
              "0 12px 35px rgba(25,118,210,0.35)",
            transition: "0.4s",

            "&:hover": {
              transform: "translateY(-5px) rotate(-3deg)",
              boxShadow:
                "0 18px 45px rgba(25,118,210,0.45)"
            }
          }}
        >
          AI
        </Box>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            background:
              "linear-gradient(90deg,#ffffff,#90caf9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "1px"
          }}
        >
          ADMIN PANEL
        </Typography>

        <Typography
          sx={{
            color: "#94a3b8",
            fontSize: "13px",
            mt: 0.5
          }}
        >
          RecruitAI Dashboard
        </Typography>
      </Box>

      {/* MENU */}
      <List
        sx={{
          px: 1.5,
          py: 3,
          position: "relative",
          zIndex: 2
        }}
      >
        {menu.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.name}
              onClick={() => navigate(item.path)}
              sx={{
                mb: 1.5,
                borderRadius: "16px",
                position: "relative",
                transition: "0.35s ease",
                overflow: "hidden",

                background: active
                  ? "linear-gradient(135deg, rgba(25,118,210,0.22), rgba(66,165,245,0.14))"
                  : "rgba(255,255,255,0.03)",

                border: active
                  ? "1px solid rgba(66,165,245,0.25)"
                  : "1px solid transparent",

                backdropFilter: "blur(10px)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, rgba(25,118,210,0.18), rgba(66,165,245,0.10))",
                  transform: "translateX(6px)",
                  boxShadow:
                    "0 10px 25px rgba(66,165,245,0.12)"
                },

                "&::before": active
                  ? {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: "15%",
                      height: "70%",
                      width: "4px",
                      borderRadius: "20px",
                      background:
                        "linear-gradient(180deg,#42a5f5,#1976d2)"
                    }
                  : {},

                "&::after": active
                  ? {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)",
                      pointerEvents: "none"
                    }
                  : {}
              }}
            >
              <ListItemIcon
                sx={{
                  color: active ? "#90caf9" : "#cbd5e1",
                  minWidth: "40px",
                  display: "flex",
                  alignItems: "center",
                  "& svg": {
                    fontSize: "20px"
                  }
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontSize: "15px",
                  fontWeight: active ? "700" : "500",
                  color: active ? "#90caf9" : "#cbd5e1",
                  letterSpacing: "0.3px"
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* FOOTER */}
      <Box
        sx={{
          mt: "auto",
          p: 2,
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          zIndex: 2
        }}
      >
        <Typography
          sx={{
            color: "#64748b",
            fontSize: "12px"
          }}
        >
          © 2026 RecruitAI
        </Typography>
      </Box>
    </Drawer>
  );
}