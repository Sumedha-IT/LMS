import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@mui/system';

// Define animations
const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
`;

const NoDataAnimation = () => {
    return (
        <Box
            sx={{
                width: '200px',
                height: '200px',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            {/* Background circle with pulse animation */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    backgroundColor: '#FEE2E2',
                    animation: `${pulse} 3s ease-in-out infinite`
                }}
            />
            
            {/* Floating document icon */}
            <Box
                sx={{
                    position: 'relative',
                    width: '80px',
                    height: '80px',
                    animation: `${float} 3s ease-in-out infinite`,
                    zIndex: 1,
                    '& svg': {
                        width: '100%',
                        height: '100%',
                        color: '#f4511e'
                    }
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                    <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                </svg>
            </Box>
        </Box>
    );
};

export default NoDataAnimation;
