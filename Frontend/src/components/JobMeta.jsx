import React from 'react';
import { Box, Typography } from '@mui/material';

const JobMeta = ({ label, value }) => {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="caption" sx={{ color: '#9fbbe6', display: 'block' }}>{label}</Typography>
      <Typography variant="body2" sx={{ color: '#ffffff' }}>{value}</Typography>
    </Box>
  );
};

export default JobMeta;
