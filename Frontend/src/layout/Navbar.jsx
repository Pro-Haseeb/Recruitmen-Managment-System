import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;
const brandGradient = "linear-gradient(135deg,#60a5fa,#93c5fd,#e0f2fe)";

function loadUser() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalizeRole(role) {
  return typeof role === "string" ? role.toLowerCase() : "";
}

function getDisplayName(user) {
  if (!user) return "Guest";
  if (user.name) return user.name;
  if (user.email) return user.email.split("@")[0];
  return "Guest";
}

export default function Navbar({ hasSidebar = false, sidebarWidth = drawerWidth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(loadUser());
  const [mobileAnchor, setMobileAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const isMobile = useMediaQuery("(max-width:960px)");

  useEffect(() => {
    setUser(loadUser());
  }, [location.pathname]);

  const role = normalizeRole(user?.role);
  const isSystemAdmin = role === "system_owner";
  const isCompanyAdmin = role === "company_admin" || role === "hr";
  const isCandidate = !user ? false : !isSystemAdmin && !isCompanyAdmin;
  const isPublic = !user;

  const navLinks = useMemo(() => {
    if (isSystemAdmin) return [];
    if (isCompanyAdmin)
      return [
        { label: "Dashboard", path: "/company" },
        { label: "Jobs", path: "/company/createjob" },
        { label: "Candidates", path: "/company" },
        { label: "HR Team", path: "/company" }
      ];
    if (isCandidate)
      return [
        { label: "Home", path: "/" },
        { label: "Jobs", path: "/jobs" },
        { label: "Dashboard", path: "/Candidate" },
        { label: "About Us", path: "/about" }
      ];
    return [
      { label: "Home", path: "/" },
      { label: "Jobs", path: "/jobs" },
      { label: "About Us", path: "/about" }
    ];
  }, [isPublic, isCandidate, isCompanyAdmin, isSystemAdmin]);

  const displayName = getDisplayName(user);
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleNavigate = (path) => {
    setMobileAnchor(null);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setProfileAnchor(null);
    setUser(null);
    navigate("/auth");
  };

  const navButtonStyles = {
    color: "#cbd5e1",
    px: 2,
    py: 1,
    textTransform: "none",
    fontWeight: 700,
    borderRadius: "12px",
    transition: "all 0.25s ease",
    "&:hover": {
      color: "#7dd3fc",
      background: "rgba(96,165,250,0.08)"
    }
  };

  const actionButtonStyles = {
    px: 3,
    py: 1,
    borderRadius: "14px",
    fontWeight: 700,
    textTransform: "none",
    transition: "all 0.25s ease",
    "&:hover": {
      transform: "translateY(-1px)"
    }
  };

  const primaryActionStyles = {
    ...actionButtonStyles,
    color: "#fff",
    background: "linear-gradient(135deg,#2563eb,#60a5fa)",
    boxShadow: "0 12px 26px rgba(37,99,235,0.28)"
  };

  // Get active dashboard title
  let dashboardTitle = "";
  if (hasSidebar) {
    if (isSystemAdmin) {
      dashboardTitle = "Admin Dashboard";
    } else if (isCompanyAdmin) {
      const compName = user?.company?.name || user?.company || "Company";
      dashboardTitle = `${compName} Dashboard`;
    } else if (isCandidate) {
      dashboardTitle = "Candidate Dashboard";
    } else {
      dashboardTitle = "Dashboard";
    }
  }

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          left: hasSidebar ? `${sidebarWidth}px` : 0,
          width: hasSidebar ? `calc(100% - ${sidebarWidth}px)` : "100%",
          background: "rgba(7, 12, 27, 0.94)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(148,163,184,0.16)",
          boxShadow: "0 16px 45px rgba(0,0,0,0.22)",
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ minHeight: 78, px: { xs: 2, md: 4 }, gap: 2, display: "flex", justifyContent: "space-between" }}>
          {hasSidebar ? (
            <>
              {/* Left spacer to perfectly center the title against the right side content */}
              <Box sx={{ width: { xs: 40, md: 180 } }} />

              {/* CENTERED DASHBOARD TITLE */}
              <Typography
                variant="h6"
                fontWeight={900}
                sx={{
                  background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "1.5px",
                  fontSize: { xs: "1rem", md: "1.3rem" },
                  textAlign: "center",
                  textTransform: "uppercase"
                }}
              >
                {dashboardTitle}
              </Typography>

              {/* RIGHT ACTIONS */}
              <Box sx={{ width: { xs: "auto", md: 180 }, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1 }}>
                {isMobile ? (
                  <IconButton onClick={(event) => setMobileAnchor(event.currentTarget)} sx={{ color: "#cbd5e1" }}>
                    <MenuIcon />
                  </IconButton>
                ) : (
                  <>
                    {isCandidate && (
                      <Button
                        onClick={(event) => setProfileAnchor(event.currentTarget)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "#fff",
                          textTransform: "none",
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(255,255,255,0.04)",
                          px: 2,
                          py: 1,
                          borderRadius: "14px"
                        }}
                      >
                        <Avatar sx={{ width: 34, height: 34, bgcolor: "#1d4ed8", fontWeight: 700 }}>{initials}</Avatar>
                        <Typography sx={{ color: "#fff", fontWeight: 700 }}>{displayName}</Typography>
                        <ExpandMoreIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                      </Button>
                    )}

                    {isCompanyAdmin && (
                      <>
                        <IconButton sx={{ color: "#cbd5e1", py: 1, px: 1.2, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(148,163,184,0.16)" }}>
                          <Badge badgeContent={5} color="error">
                            <NotificationsIcon />
                          </Badge>
                        </IconButton>
                        <Button
                          onClick={(event) => setProfileAnchor(event.currentTarget)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#fff",
                            textTransform: "none",
                            border: "1px solid rgba(255,255,255,0.12)",
                            background: "rgba(255,255,255,0.04)",
                            px: 2,
                            py: 1,
                            borderRadius: "14px"
                          }}
                        >
                          <Avatar sx={{ width: 34, height: 34, bgcolor: "#1d4ed8", fontWeight: 700 }}>{initials}</Avatar>
                          <Typography sx={{ color: "#fff", fontWeight: 700 }}>{displayName}</Typography>
                          <ExpandMoreIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                        </Button>
                      </>
                    )}

                    {isSystemAdmin && (
                      <Button
                        onClick={(event) => setProfileAnchor(event.currentTarget)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "#fff",
                          textTransform: "none",
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(255,255,255,0.04)",
                          px: 2,
                          py: 1,
                          borderRadius: "14px"
                        }}
                      >
                        <Avatar sx={{ width: 34, height: 34, bgcolor: "#1d4ed8", fontWeight: 700 }}>{initials}</Avatar>
                        <Typography sx={{ color: "#fff", fontWeight: 700 }}>{displayName}</Typography>
                        <ExpandMoreIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                      </Button>
                    )}
                  </>
                )}
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, cursor: "pointer", minWidth: 0 }}
                onClick={() => navigate("/")}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "16px",
                    background: "linear-gradient(135deg,#1d4ed8,#60a5fa)",
                    display: "grid",
                    placeItems: "center",
                    boxShadow: "0 16px 35px rgba(37,99,235,0.22)"
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900, lineHeight: 1 }}>
                    AI
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    fontWeight={900}
                    sx={{
                      background: brandGradient,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: "0.6px"
                    }}
                  >
                    RecruitAI RMS
                  </Typography>
                  <Typography sx={{ color: "#94a3b8", fontSize: 12, letterSpacing: "0.3px" }}>
                    Recruitment Management System
                  </Typography>
                </Box>
              </Box>

              {!isSystemAdmin && (
                <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1.5, flex: 1, justifyContent: "center" }}>
                  {navLinks.map((link) => (
                    <Button
                      key={link.label}
                      onClick={() => handleNavigate(link.path)}
                      sx={{
                        ...navButtonStyles,
                        color: location.pathname === link.path ? "#38bdf8" : "#cbd5e1"
                      }}
                    >
                      {link.label}
                    </Button>
                  ))}
                </Box>
              )}

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isMobile ? (
                  <IconButton onClick={(event) => setMobileAnchor(event.currentTarget)} sx={{ color: "#cbd5e1" }}>
                    <MenuIcon />
                  </IconButton>
                ) : (
                  <>
                    {isPublic && (
                      <>
                        <Button sx={{ ...actionButtonStyles, color: "#fff", border: "1px solid rgba(96,165,250,0.24)", background: "rgba(255,255,255,0.04)" }} onClick={() => navigate("/auth")}>Login</Button>
                        <Button sx={{ ...actionButtonStyles, color: "#fff", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)" }} onClick={() => navigate("/auth")}>Signup</Button>
                        <Button sx={primaryActionStyles} onClick={() => navigate("/request-demo")}>
                          Get Demo
                        </Button>
                      </>
                    )}

                    {isCandidate && (
                      <>
                        <Button sx={{ ...actionButtonStyles, color: "#fff", border: "1px solid rgba(96,165,250,0.22)", background: "rgba(255,255,255,0.08)" }} onClick={() => navigate("/request-demo")}>
                          Get Demo
                        </Button>
                        <Button
                          onClick={(event) => setProfileAnchor(event.currentTarget)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#fff",
                            textTransform: "none",
                            border: "1px solid rgba(255,255,255,0.12)",
                            background: "rgba(255,255,255,0.04)",
                            px: 2,
                            py: 1,
                            borderRadius: "14px"
                          }}
                        >
                          <Avatar sx={{ width: 34, height: 34, bgcolor: "#1d4ed8", fontWeight: 700 }}>{initials}</Avatar>
                          <Typography sx={{ color: "#fff", fontWeight: 700 }}>{displayName}</Typography>
                          <ExpandMoreIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                        </Button>
                      </>
                    )}

                    {isCompanyAdmin && (
                      <>
                        <IconButton sx={{ color: "#cbd5e1", py: 1, px: 1.2, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(148,163,184,0.16)" }}>
                          <Badge badgeContent={5} color="error">
                            <NotificationsIcon />
                          </Badge>
                        </IconButton>
                        <Button
                          onClick={(event) => setProfileAnchor(event.currentTarget)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#fff",
                            textTransform: "none",
                            border: "1px solid rgba(255,255,255,0.12)",
                            background: "rgba(255,255,255,0.04)",
                            px: 2,
                            py: 1,
                            borderRadius: "14px"
                          }}
                        >
                          <Avatar sx={{ width: 34, height: 34, bgcolor: "#1d4ed8", fontWeight: 700 }}>{initials}</Avatar>
                          <Typography sx={{ color: "#fff", fontWeight: 700 }}>{displayName}</Typography>
                          <ExpandMoreIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                        </Button>
                      </>
                    )}
                  </>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={mobileAnchor}
        open={Boolean(mobileAnchor)}
        onClose={() => setMobileAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {navLinks.map((link) => (
          <MenuItem key={link.label} onClick={() => handleNavigate(link.path)}>
            {link.label}
          </MenuItem>
        ))}
        <Divider />
        {isPublic && (
          <>
            <MenuItem onClick={() => handleNavigate("/auth")}>Login</MenuItem>
            <MenuItem onClick={() => handleNavigate("/auth")}>Signup</MenuItem>
            <MenuItem onClick={() => handleNavigate("/request-demo")}>Get Demo</MenuItem>
          </>
        )}
        {isCandidate && (
          <>
            <MenuItem onClick={() => handleNavigate("/request-demo")}>Get Demo</MenuItem>
            <MenuItem onClick={() => handleNavigate("/Candidate")}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        )}
        {isCompanyAdmin && (
          <>
            <MenuItem onClick={() => handleNavigate("/company")}>Dashboard</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        )}
      </Menu>

      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {isCandidate && <MenuItem onClick={() => handleNavigate("/Candidate")}>Dashboard</MenuItem>}
        {isCompanyAdmin && <MenuItem onClick={() => handleNavigate("/company")}>Account</MenuItem>}
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
