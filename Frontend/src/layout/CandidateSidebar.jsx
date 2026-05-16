import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Typography
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function CandidateSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/candidate" },
    { name: "Applied Jobs", path: "/candidate/applied" },
    { name: "My Profile", path: "/candidate/profile" },
    { name: "Notifications", path: "/candidate/notifications" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",

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
          overflow: "hidden",
          position: "relative",

          "&::before": {
            content: '""',
            position: "absolute",
            top: -120,
            right: -120,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "rgba(168, 85, 247, 0.15)", // Purple hue for candidate
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
            background: "rgba(59, 130, 246, 0.15)", // Blue hue
            filter: "blur(90px)"
          }
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
        <Box
          sx={{
            width: 70,
            height: 70,
            mx: "auto",
            mb: 2,
            borderRadius: "22px",
            background: "linear-gradient(135deg, #a855f7, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "900",
            fontSize: "24px",
            boxShadow: "0 12px 35px rgba(168, 85, 247, 0.35)",
            transition: "0.4s",

            "&:hover": {
              transform: "translateY(-5px) rotate(-3deg)",
              boxShadow: "0 18px 45px rgba(168, 85, 247, 0.45)"
            }
          }}
        >
          C
        </Box>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(90deg, #ffffff, #d8b4fe)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "1px"
          }}
        >
          CANDIDATE
        </Typography>

        <Typography sx={{ color: "#94a3b8", fontSize: "13px", mt: 0.5 }}>
          Your Dashboard
        </Typography>
      </Box>

      {/* MENU */}
      <List sx={{ px: 1.5, py: 3, position: "relative", zIndex: 2 }}>
        {menu.map((item) => {
          const active = location.pathname === item.path || (location.pathname === "/candidate" && item.path === "/candidate");

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
                  ? "linear-gradient(135deg, rgba(168, 85, 247, 0.22), rgba(59, 130, 246, 0.14))"
                  : "rgba(255,255,255,0.03)",

                border: active
                  ? "1px solid rgba(168, 85, 247, 0.25)"
                  : "1px solid transparent",

                backdropFilter: "blur(10px)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, rgba(168, 85, 247, 0.18), rgba(59, 130, 246, 0.10))",
                  transform: "translateX(6px)",
                  boxShadow: "0 10px 25px rgba(168, 85, 247, 0.12)"
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
                      background: "linear-gradient(180deg, #d8b4fe, #a855f7)"
                    }
                  : {},

                "&::after": active
                  ? {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)",
                      pointerEvents: "none"
                    }
                  : {}
              }}
            >
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontSize: "15px",
                  fontWeight: active ? "700" : "500",
                  color: active ? "#e9d5ff" : "#cbd5e1",
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
        <Typography sx={{ color: "#64748b", fontSize: "12px" }}>
          © 2026 RecruitAI
        </Typography>
      </Box>
    </Drawer>
  );
}
