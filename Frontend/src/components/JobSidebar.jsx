import React from 'react';
import { Box, Card, CardContent, Typography, Divider, Button, Stack, Avatar } from '@mui/material';
import SimilarJobs from './SimilarJobs';
import JobMeta from './JobMeta';

const JobSidebar = ({ job }) => {
  const quickStats = [
    { label: 'Location', value: job.location || 'Remote' },
    { label: 'Type', value: job.jobType || 'Full Time' },
    { label: 'Experience', value: job.experienceLevel || 'Senior' },
    { label: 'Salary', value: job.salary || '₹120k - ₹180k' },
    { label: 'Deadline', value: job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Flexible' },
  ];

  return (
    <Box sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
      <Card sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', mb: 2, boxShadow: '0 16px 45px rgba(0,0,0,0.18)' }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>Quick Apply</Typography>
          <Typography variant="body2" sx={{ color: '#cfe8ff', mb: 2 }}>{job.company?.name || 'RecruitAI'} — {job.location || 'Remote'}</Typography>
          <Button fullWidth variant="contained" sx={{ background: 'linear-gradient(135deg,#1976d2,#42a5f5)', borderRadius: 2, textTransform: 'none', mb: 1 }}>Apply Now</Button>
          <Button fullWidth variant="outlined" sx={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.16)', textTransform: 'none' }}>Save Job</Button>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', mb: 2, boxShadow: '0 16px 45px rgba(0,0,0,0.18)' }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 700, mb: 2 }}>Job Summary</Typography>
          <Stack spacing={1}>
            {quickStats.map((item) => (
              <JobMeta key={item.label} label={item.label} value={item.value} />
            ))}
          </Stack>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 2 }} />
          <Typography variant="body2" sx={{ color: '#cfe8ff' }}>
            Applicants: <strong style={{ color: '#ffffff' }}>{job.applicants || 34}</strong>
          </Typography>
          <Typography variant="body2" sx={{ color: '#cfe8ff' }}>
            Posted: <strong style={{ color: '#ffffff' }}>{job.postedDate || '3 days ago'}</strong>
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', mb: 2, boxShadow: '0 16px 45px rgba(0,0,0,0.18)' }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 700, mb: 2 }}>Recruiter</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={job.recruiter?.avatar} alt={job.recruiter?.name} sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}>
              {job.recruiter?.name?.[0] || 'R'}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 700 }}>{job.recruiter?.name || 'Recruiter Team'}</Typography>
              <Typography variant="caption" sx={{ color: '#cfe8ff' }}>{job.recruiter?.email || 'recruiter@company.com'}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <SimilarJobs job={job} />
    </Box>
  );
};

export default JobSidebar;
