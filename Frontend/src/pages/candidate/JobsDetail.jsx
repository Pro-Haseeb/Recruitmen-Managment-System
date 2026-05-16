import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Divider,
  Avatar,
  Stack
} from "@mui/material";
import { getSingleJob } from "../../services/CandidateApi";
import JobSidebar from "../../components/JobSidebar";
import SectionCard from "../../components/SectionCard";

const JobsDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  const statusLabel = job?.status || "Open";
  const statusColor = statusLabel.toLowerCase() === "urgent" ? "error" : "success";

  const responsibilities = job?.responsibilities || [
    "Design and execute mission-critical recruitment workflows.",
    "Collaborate closely with product, engineering, and operations.",
    "Monitor hiring metrics and optimize candidate experience.",
  ];

  const qualifications = job?.qualifications || [
    "Bachelor's degree in a relevant field or equivalent experience.",
    "5+ years of experience in recruitment or talent operations.",
    "Proven ability to partner with senior stakeholders.",
  ];

  const benefits = job?.benefits || [
    "Hybrid work flexibility and wellness stipend.",
    "Comprehensive health coverage and paid time off.",
    "Professional development and mentorship programs.",
  ];

  const hiringProcess = job?.hiringProcess || [
    "Resume review",
    "Hiring manager interview",
    "Final leadership interview",
    "Offer discussion",
  ];

  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await getSingleJob(id);
      setJob(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!job) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
        <Typography variant="h6">Loading job details...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ background: "#020617", minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Card sx={{ background: "rgba(15, 23, 42, 0.96)", border: "1px solid rgba(66, 165, 245, 0.12)", borderRadius: 4, boxShadow: "0 24px 80px rgba(0,0,0,0.24)" }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Box sx={{ background: "linear-gradient(180deg, rgba(29,78,216,0.16), rgba(15,23,42,0.9))", borderRadius: 3, p: { xs: 3, md: 4 }, mb: 4, border: "1px solid rgba(66,165,245,0.12)" }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={7}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
                    <Avatar src={job.company?.logo} alt={job.company?.name} sx={{ width: 84, height: 84, bgcolor: "rgba(255,255,255,0.08)" }} />
                    <Box>
                      <Typography variant="overline" sx={{ color: "#90caf9", letterSpacing: 1.2, mb: 1, display: "block" }}>
                        {job.company?.industry || "Talent Intelligence"}
                      </Typography>
                      <Typography variant="h3" sx={{ color: "#ffffff", fontWeight: 800, lineHeight: 1.1, mb: 1 }}>
                        {job.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#e6eef8", mb: 2 }}>
                        {job.company?.name || "RecruitAI"} • {job.location || "Remote"}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip label={job.jobType || "Full Time"} size="small" sx={{ background: "rgba(255,255,255,0.06)", color: "#cfe8ff" }} />
                        <Chip label={job.experienceLevel || "Senior"} size="small" sx={{ background: "rgba(255,255,255,0.06)", color: "#cfe8ff" }} />
                        <Chip label={job.salary || "₹120k - ₹180k"} size="small" sx={{ background: "rgba(255,255,255,0.06)", color: "#cfe8ff" }} />
                        <Chip label={statusLabel} size="small" color={statusColor} sx={{ fontWeight: 700 }} />
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Box sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" }, gap: 1, flexWrap: "wrap" }}>
                    <Button variant="contained" size="large" sx={{ background: "linear-gradient(135deg,#1976d2,#42a5f5)", borderRadius: 3, textTransform: "none", minWidth: 140 }}>
                      Apply Now
                    </Button>
                    <Button variant="outlined" size="large" sx={{ color: "#cbd5e1", borderColor: "rgba(255,255,255,0.16)", borderRadius: 3, textTransform: "none", minWidth: 140 }}>
                      Save
                    </Button>
                    <Button variant="outlined" size="large" sx={{ color: "#cbd5e1", borderColor: "rgba(255,255,255,0.16)", borderRadius: 3, textTransform: "none", minWidth: 140 }}>
                      Share
                    </Button>
                  </Box>
                  <Stack direction="row" spacing={2} sx={{ mt: 4, color: "#cfe8ff", flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="body2">Posted {job.postedDate || "3 days ago"}</Typography>
                    <Typography variant="body2">{job.applicants || 34} applicants</Typography>
                    <Typography variant="body2">Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : "Flexible"}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", my: 3 }} />

            {/* Main Grid */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <SectionCard title="About the Role" subtitle="What success looks like">
                  <Typography sx={{ color: "#e6eef8", lineHeight: 1.9, mb: 2 }}>
                    {job.description || "This role is at the heart of our growth roadmap. You will work closely with product, engineering and leadership to launch high-impact recruitment workflows and deliver measurable impact."}
                  </Typography>
                </SectionCard>

                <SectionCard title="Responsibilities" subtitle="Day-to-day expectations">
                  <Box component="ul" sx={{ pl: 3, color: "#e6eef8", mb: 0 }}>
                    {responsibilities.map((item, index) => (
                      <li key={index} style={{ marginBottom: 12, lineHeight: 1.8 }}>
                        {item}
                      </li>
                    ))}
                  </Box>
                </SectionCard>

                <SectionCard title="Required Skills" subtitle="Core expertise">
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {(job.skills || ["Product hiring", "Talent operations", "Stakeholder alignment", "Data-driven decision making"]).map((skill, index) => (
                      <Chip key={index} label={skill} size="small" sx={{ background: "rgba(255,255,255,0.05)", color: "#cfe8ff", mb: 1 }} />
                    ))}
                  </Stack>
                </SectionCard>

                <SectionCard title="Qualifications" subtitle="Ideal background">
                  <Box component="ul" sx={{ pl: 3, color: "#e6eef8", mb: 0 }}>
                    {qualifications.map((item, index) => (
                      <li key={index} style={{ marginBottom: 12, lineHeight: 1.75 }}>
                        {item}
                      </li>
                    ))}
                  </Box>
                </SectionCard>

                <SectionCard title="Benefits & Perks" subtitle="What you’ll get">
                  <Box component="ul" sx={{ pl: 3, color: "#e6eef8", mb: 0 }}>
                    {benefits.map((item, index) => (
                      <li key={index} style={{ marginBottom: 12, lineHeight: 1.75 }}>
                        {item}
                      </li>
                    ))}
                  </Box>
                </SectionCard>

                <SectionCard title="About the Company" subtitle={job.company?.name || "Company overview"}>
                  <Typography sx={{ color: "#e6eef8", lineHeight: 1.9 }}>
                    {job.company?.about || "RecruitAI is a modern recruitment platform aimed at helping enterprises build efficient hiring pipelines with AI-backed workflows, deep analytics, and smooth candidate experiences."}
                  </Typography>
                </SectionCard>

                <SectionCard title="Hiring Process" subtitle="What to expect">
                  <Box component="ol" sx={{ pl: 3, color: "#e6eef8", mb: 0 }}>
                    {hiringProcess.map((step, index) => (
                      <li key={index} style={{ marginBottom: 12, lineHeight: 1.8 }}>
                        {step}
                      </li>
                    ))}
                  </Box>
                </SectionCard>
              </Grid>

              <Grid item xs={12} md={4}>
                <JobSidebar job={job} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default JobsDetails;