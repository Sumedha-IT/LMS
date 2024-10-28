import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ComingSoon = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 4,
        backgroundColor: '#f5f5f5', // Match this with your panel's background
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333' }}>
          Coming Soon
        </Typography>
        
      </Box>
    </Paper>
  );
};

export default ComingSoon;
