import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  LinearProgress
} from "@mui/material";

const drawerWidth = 240;

const userGrowth = [
  { month: "Jan", users: 40 },
  { month: "Feb", users: 80 },
  { month: "Mar", users: 120 },
  { month: "Apr", users: 200 },
  { month: "May", users: 300 }
];

const companyGrowth = [
  { month: "Jan", companies: 10 },
  { month: "Feb", companies: 30 },
  { month: "Mar", companies: 60 },
  { month: "Apr", companies: 90 },
  { month: "May", companies: 120 }
];

const demoData = [
  { name: "Approved", value: 60 },
  { name: "Pending", value: 25 },
  { name: "Rejected", value: 15 }
];

const COLORS = ["#4caf50", "#ff9800", "#f44336"];

export default function Analytics() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: "64px",
        left: `${drawerWidth}px`,
        right: 0,
        bottom: 0,

        px: 5,
        py: 4,

        // 🔥 RECRUITAI PREMIUM THEME
        background: `
          linear-gradient(
            135deg,
            #020617 0%,
            #0f172a 30%,
            #111827 60%,
            #1e3a8a 100%
          )
        `,

        overflowY: "auto",

        // 🔥 GLOW EFFECTS
        "&::before": {
          content: '""',
          position: "absolute",
          width: "350px",
          height: "350px",
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
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "rgba(25,118,210,0.16)",
          filter: "blur(120px)",
          bottom: "-100px",
          right: "-100px",
          zIndex: 0
        }
      }}
    >
      {/* HEADER */}
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
        sx={{
          color: "#fff",
          position: "relative",
          zIndex: 2
        }}
      >
        Analytics Overview
      </Typography>

      {/* STATS */}
      <Grid
        container
        spacing={5}
        alignItems="stretch"
        mb={5}
        sx={{
          position: "relative",
          maxWidth: "1100px",
          mx: "auto",
          zIndex: 2
        }}
      >
        {[
          { title: "Total Users", value: "450" },
          { title: "Total Companies", value: "120" },
          { title: "Demo Requests", value: "30" },
          { title: "Conversion Rate", value: "60%" }
        ].map((item, i) => (
          <Grid item xs={6} md={3} key={i} sx={{ display: "flex" }}>
            <Card
              sx={{
                width: "100%",
                height: 100,
                borderRadius: "22px",

                background: "rgba(15,23,42,0.72)",
                backdropFilter: "blur(18px)",

                border: "1px solid rgba(255,255,255,0.08)",

                color: "#fff",

                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",

                px: 2,

                transition: "0.35s ease",

                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow:
                    "0 20px 45px rgba(66,165,245,0.22)"
                }
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  mb: 0.5
                }}
              >
                {item.title}
              </Typography>

              <Typography
                fontWeight="bold"
                sx={{
                  fontSize: "22px",
                  color: "#42a5f5"
                }}
              >
                {item.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ height: 20 }} />

      {/* CHARTS */}
      <Grid
        container
        spacing={4}
        alignItems="stretch"
        sx={{ position: "relative", zIndex: 2 }}
      >

        {/* USER GROWTH */}
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <Card
            sx={{
              width: "100%",
              borderRadius: "24px",

              background: "rgba(15,23,42,0.72)",
              backdropFilter: "blur(18px)",

              border: "1px solid rgba(255,255,255,0.08)",

              color: "#fff",

              transition: "0.3s",

              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow:
                  "0 20px 45px rgba(66,165,245,0.18)"
              }
            }}
          >
            <CardContent sx={{ flex: 1 }}>
              <Typography
                fontWeight="bold"
                mb={2}
                sx={{ color: "#42a5f5" }}
              >
                User Growth
              </Typography>

              {[
                { label: "Monthly signups", value: 82, color: "#42a5f5" },
                { label: "Active admins", value: 72, color: "#22c55e" },
                { label: "Team adoption", value: 90, color: "#f97316" }
              ].map((item) => (
                <Box key={item.label} sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography sx={{ color: "#fff", fontWeight: 700 }}>{item.label}</Typography>
                    <Typography sx={{ color: "#94a3b8" }}>{item.value}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.value}
                    sx={{
                      height: 10,
                      borderRadius: 6,
                      background: "rgba(255,255,255,0.08)",
                      '& .MuiLinearProgress-bar': { background: item.color }
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* COMPANY GROWTH */}
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <Card
            sx={{
              width: "100%",
              borderRadius: "24px",

              background: "rgba(15,23,42,0.72)",
              backdropFilter: "blur(18px)",

              border: "1px solid rgba(255,255,255,0.08)",

              color: "#fff",

              transition: "0.3s",

              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow:
                  "0 20px 45px rgba(66,165,245,0.18)"
              }
            }}
          >
            <CardContent sx={{ flex: 1 }}>
              <Typography
                fontWeight="bold"
                mb={2}
                sx={{ color: "#42a5f5" }}
              >
                Company Growth
              </Typography>

              {[
                { label: "New companies", value: 75, color: "#22c55e" },
                { label: "Onboarding completion", value: 64, color: "#38bdf8" },
                { label: "Recruiter adoption", value: 88, color: "#f97316" }
              ].map((item) => (
                <Box key={item.label} sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography sx={{ color: "#fff", fontWeight: 700 }}>{item.label}</Typography>
                    <Typography sx={{ color: "#94a3b8" }}>{item.value}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.value}
                    sx={{
                      height: 10,
                      borderRadius: 6,
                      background: "rgba(255,255,255,0.08)",
                      '& .MuiLinearProgress-bar': { background: item.color }
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* PIE CHART */}
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <Card
            sx={{
              width: "100%",
              borderRadius: "24px",

              background: "rgba(15,23,42,0.72)",
              backdropFilter: "blur(18px)",

              border: "1px solid rgba(255,255,255,0.08)",

              color: "#fff",

              transition: "0.3s",

              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow:
                  "0 20px 45px rgba(66,165,245,0.18)"
              }
            }}
          >
            <CardContent sx={{ flex: 1 }}>
              <Typography
                fontWeight="bold"
                mb={2}
                sx={{ color: "#42a5f5" }}
              >
                Demo Requests Status
              </Typography>

              {demoData.map((item, index) => (
                <Box key={item.name} sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography sx={{ color: "#fff", fontWeight: 700 }}>{item.name}</Typography>
                    <Typography sx={{ color: "#94a3b8" }}>{item.value}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.value}
                    sx={{
                      height: 10,
                      borderRadius: 6,
                      background: "rgba(255,255,255,0.08)",
                      '& .MuiLinearProgress-bar': { background: COLORS[index] }
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}