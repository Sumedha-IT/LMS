import React from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Paper,
    Breadcrumbs,
    Link,
    useTheme,
    alpha
} from '@mui/material';
import { useParams } from 'react-router-dom';
import {
    Home as HomeIcon,
    Work as WorkIcon,
    ArrowForwardIos as ArrowIcon
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
                background: `linear-gradient(135deg, 
                    ${alpha(theme.palette.primary.main, 0.05)} 0%, 
                    ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                py: 4
            }}
        >
            <Container maxWidth="xl">
                {/* Header Section with Breadcrumbs */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 4, 
                        mb: 4, 
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '200px',
                            height: '200px',
                            background: alpha('#fff', 0.1),
                            borderRadius: '50%',
                            transform: 'translate(50px, -50px)'
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '150px',
                            height: '150px',
                            background: alpha('#fff', 0.08),
                            borderRadius: '50%',
                            transform: 'translate(-75px, 75px)'
                        }
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        {/* Modern Breadcrumbs */}
                        <Breadcrumbs 
                            aria-label="breadcrumb" 
                            sx={{ 
                                mb: 3,
                                '& .MuiBreadcrumbs-separator': {
                                    color: alpha('#fff', 0.7)
                                }
                            }}
                            separator={<ArrowIcon sx={{ fontSize: 14, color: alpha('#fff', 0.7) }} />}
                        >
                            <Link 
                                color="inherit" 
                                href="#" 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                    opacity: 0.8,
                                    '&:hover': { opacity: 1 }
                                }}
                            >
                                <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
                                Dashboard
                            </Link>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    color: '#fff',
                                    fontWeight: 500
                                }}
                            >
                                <WorkIcon sx={{ mr: 0.5, fontSize: 16 }} />
                                Placement Center
                            </Box>
                        </Breadcrumbs>

                        {/* Hero Content */}
                        <Box>
                            <Typography 
                                variant="h3" 
                                component="h1" 
                                sx={{ 
                                    fontWeight: 700,
                                    mb: 2,
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                    lineHeight: 1.2
                                }}
                            >
                                🚀 Your Career Journey Starts Here
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
                                Discover amazing job opportunities that match your skills and aspirations. 
                                Connect with top companies and take the next step in your professional journey.
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Main Content Area */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        borderRadius: 4,
                        overflow: 'hidden',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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