import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Grid
} from "@mui/material";

const JobList = ({ jobs = [], onView }) => {
  if (!jobs.length) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "#cbd5e1" }}>
        <Typography variant="h6">No jobs available right now.</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {jobs.map((job) => {
        const companyLabel = job.company?.name || job.company || "RecruitAI";
        const experienceLabel = job.experienceLevel || job.level || "Any";
        const initials = companyLabel.slice(0, 2).toUpperCase();

        return (
          <Grid item xs={12} sm={6} md={4} key={job._id || job.id}>
            <Card sx={{ minHeight: 320, borderRadius: 3, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main", width: 52, height: 52 }}>{initials}</Avatar>
                  <Box>
                    <Typography fontWeight="700">{job.title}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {companyLabel}
                    </Typography>
                  </Box>
                </Box>

                <Typography sx={{ mb: 1, color: "rgba(255,255,255,0.84)" }}>
                  {job.description || "No description provided."}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  <Chip label={job.location || "Remote"} size="small" sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.1)" }} />
                  <Chip label={experienceLabel} size="small" sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.1)" }} />
                </Box>

                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}>
                  Salary: {job.salary || "Not specified"}
                </Typography>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ borderRadius: 3, mt: 1, background: "linear-gradient(135deg,#1976d2,#42a5f5)" }}
                  onClick={() => onView(job)}
                >
                  View Job
                </Button>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default JobList;
