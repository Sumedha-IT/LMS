import React from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Paper,
    useTheme
} from '@mui/material';
import { useParams } from 'react-router-dom';
import {
    Work as WorkIcon
} from '@mui/icons-material';

// Import JobBoard component
import JobBoard from '../components/placement/JobBoard';

const StudentPlacement = () => {
    const { id } = useParams();
    const theme = useTheme();

    return (
        <Box 
            sx={{ 
                minHeight: '100vh',
                background: '#f8fafc',
                py: 4
            }}
        >
            <Container maxWidth="xl">
                {/* Professional Header Section */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        borderRadius: 2,
                        mb: 4,
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '300px',
                            height: '100%',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                            clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)'
                        }
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 1, p: 4 }}>
                        {/* Page Title */}
                        <Box sx={{ mb: 3 }}>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    color: '#fff',
                                    fontWeight: 500
                                }}
                            >
                                <WorkIcon sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                    Placement Center
                                </Typography>
                            </Box>
                        </Box>

                        {/* Professional Hero Content */}
                        <Box>
                            <Typography 
                                variant="h3" 
                                component="h1" 
                                sx={{ 
                                    fontWeight: 600,
                                    mb: 2,
                                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                                    lineHeight: 1.2
                                }}
                            >
                                Career Opportunities
                            </Typography>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    opacity: 0.9,
                                    maxWidth: 600,
                                    lineHeight: 1.6,
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    fontWeight: 400
                                }}
                            >
                                Discover job opportunities that align with your skills and career goals. 
                                Connect with leading companies and advance your professional journey.
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Main Content Area */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        background: '#fff'
                    }}
                >
                    <Box sx={{ p: { xs: 2, sm: 4 } }}>
                        <JobBoard studentId={id} />
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default StudentPlacement; 