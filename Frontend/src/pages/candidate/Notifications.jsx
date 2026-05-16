import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { Notifications as NotificationsIcon, CheckCircle, Description, Work } from "@mui/icons-material";
import { motion } from "framer-motion";

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

export default function Notifications() {
  const notifications = [
    { 
      id: 1, 
      title: "Application Shortlisted!", 
      desc: "Your application for Frontend Developer at TechCorp has been shortlisted.",
      time: "2 hours ago",
      icon: <CheckCircle />,
      color: "#10b981"
    },
    { 
      id: 2, 
      title: "New Job Match", 
      desc: "We found a new job matching your profile: Senior React Engineer at InnovateAI.",
      time: "1 day ago",
      icon: <Work />,
      color: "#3b82f6"
    },
    { 
      id: 3, 
      title: "Profile Viewed", 
      desc: "Your profile was viewed by a recruiter from FutureNet.",
      time: "3 days ago",
      icon: <Description />,
      color: "#a855f7"
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ color: "white", maxWidth: 800, mx: "auto" }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 1, letterSpacing: "-0.5px" }}>
          Notifications
        </Typography>
        <Typography sx={{ color: "#94a3b8", mb: 4 }}>
          Stay updated on your applications and account activity.
        </Typography>

        <GlassCard sx={{ p: 0, overflow: "hidden" }}>
          <List disablePadding>
            {notifications.map((note, index) => (
              <ListItem 
                key={note.id}
                sx={{ 
                  p: 3, 
                  borderBottom: index < notifications.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
                  transition: "background 0.2s"
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: `${note.color}20`, color: note.color }}>
                    {note.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={<Typography fontWeight="600" sx={{ color: "#f8fafc" }}>{note.title}</Typography>}
                  secondary={
                    <>
                      <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5, mb: 0.5 }}>
                        {note.desc}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        {note.time}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </GlassCard>
      </Box>
    </motion.div>
  );
}
