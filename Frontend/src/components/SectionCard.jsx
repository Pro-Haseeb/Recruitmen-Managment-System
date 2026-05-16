import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const SectionCard = ({ title, subtitle, children }) => {
  return (
    <Card sx={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 16px 40px rgba(0,0,0,0.14)',
      borderRadius: 3,
      mb: 3
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: '#9fbbe6', mt: { xs: 1, sm: 0 } }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};

export default SectionCard;
