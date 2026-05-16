import React from 'react';
import { Card, CardContent, Typography, List, ListItemButton, ListItemText } from '@mui/material';

const SimilarJobs = ({ job }) => {
  const similar = job.similarJobs || [];

  if (!similar.length) return null;

  return (
    <Card sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>Similar Jobs</Typography>
        <List dense>
          {similar.map((s, i) => (
            <ListItemButton key={i} component="a" href={`/Candidate/jobs/${s._id}`} sx={{ borderRadius: 1 }}>
              <ListItemText primary={s.title} secondary={s.company?.name} sx={{ '& .MuiListItemText-primary': { color: '#e6eef8' }, '& .MuiListItemText-secondary': { color: '#9fbbe6' } }} />
            </ListItemButton>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default SimilarJobs;
