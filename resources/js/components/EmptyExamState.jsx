import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { keyframes } from '@mui/system';

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const EmptyExamState = ({ isUpcoming }) => {
    return (
        <Paper 
            elevation={0}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '24px',
                p: 4,
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: isUpcoming ? '#FFF5F3' : '#FFF8F0',
                border: '1px solid',
                borderColor: isUpcoming ? 'rgba(244, 81, 30, 0.1)' : 'rgba(251, 146, 60, 0.1)'
            }}
        >
            {/* Decorative Background Elements */}
            <Box sx={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: isUpcoming ? '#FED7D7' : '#FEEBC8',
                opacity: 0.1,
                animation: `${pulse} 4s ease-in-out infinite`
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: isUpcoming ? '#FED7D7' : '#FEEBC8',
                opacity: 0.1,
                animation: `${pulse} 4s ease-in-out infinite`,
                animationDelay: '2s'
            }} />

            {/* Main Content */}
            <Box sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                zIndex: 1
            }}>
                {/* Animated Icon */}
                <Box sx={{
                    width: '120px',
                    height: '120px',
                    mb: 3,
                    animation: `${float} 3s ease-in-out infinite`,
                    '& svg': {
                        width: '100%',
                        height: '100%',
                        color: isUpcoming ? '#f4511e' : '#FB923C'
                    }
                }}>
                    {isUpcoming ? (
                        // Calendar Icon for Upcoming Exams
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        // Document Icon for Attempted Exams
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                            <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                        </svg>
                    )}
                </Box>

                {/* Shimmer Effect Line */}
                <Box sx={{
                    width: '60px',
                    height: '4px',
                    borderRadius: '2px',
                    mb: 3,
                    background: 'linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.06) 75%)',
                    backgroundSize: '1000px 100%',
                    animation: `${shimmer} 2s infinite linear`
                }} />

                <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: '#1A202C',
                    mb: 2
                }}>
                    {isUpcoming ? "No Upcoming Exams" : "No Attempted Exams"}
                </Typography>

                <Typography variant="body1" sx={{ 
                    color: '#718096',
                    maxWidth: '400px',
                    lineHeight: 1.6
                }}>
                    {isUpcoming 
                        ? "You're all caught up! Check back later for new exam schedules. Take this time to review your study materials."
                        : "You haven't taken any exams yet. Your exam history will appear here once you complete your first exam."}
                </Typography>
            </Box>
        </Paper>
    );
};

export default EmptyExamState;
