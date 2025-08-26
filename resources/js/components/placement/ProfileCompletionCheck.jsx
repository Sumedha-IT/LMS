import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Button,
    Alert,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    Close as CloseIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Work as WorkIcon,
    Star as StarIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import axios from 'axios';

const ProfileCompletionCheck = ({ onProfileUpdate }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        fetchProfileCompletion();
    }, []);

    const fetchProfileCompletion = async () => {
        try {
            setLoading(true);
            const userInfo = getCookie('user_info');
            
            if (!userInfo) {
                setError('User information not found. Please log in again.');
                return;
            }
            
            let userData;
            try {
                userData = JSON.parse(userInfo);
            } catch (parseError) {
                console.error('Error parsing user info:', parseError);
                setError('Invalid user session. Please log in again.');
                return;
            }
            
            const response = await axios.get('/api/profile-completion', {
                headers: { 'Authorization': userData.token }
            });
            
            setProfileData(response.data.data);
        } catch (err) {
            console.error('Error fetching profile completion:', err);
            if (err.response?.status === 500) {
                setError('Profile completion service is temporarily unavailable. Please try again later.');
            } else if (err.response?.status === 401) {
                setError('Authentication failed. Please log in again.');
            } else {
                setError('Failed to load profile completion data. Please refresh the page.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            const cookieValue = parts.pop().split(';').shift();
            // Decode URL-encoded value
            return decodeURIComponent(cookieValue);
        }
        return null;
    };

    const getSectionIcon = (section) => {
        switch (section) {
            case 'Personal Details':
                return <PersonIcon />;
            case 'Education':
                return <SchoolIcon />;
            case 'Projects':
                return <WorkIcon />;
            case 'Certifications':
                return <StarIcon />;
            case 'Resume Upload':
                return <DescriptionIcon />;
            default:
                return <InfoIcon />;
        }
    };

    const getSectionColor = (percentage) => {
        if (percentage >= 100) return 'success';
        if (percentage >= 80) return 'warning';
        return 'error';
    };



    const handleRefresh = () => {
        fetchProfileCompletion();
        if (onProfileUpdate) {
            onProfileUpdate();
        }
    };

    if (loading) {
        return (
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                        <LinearProgress sx={{ flexGrow: 1 }} />
                        <Typography variant="body2">Loading profile status...</Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Alert severity="error" action={
                        <Button color="inherit" size="small" onClick={fetchProfileCompletion}>
                            Retry
                        </Button>
                    }>
                        {error}
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    if (!profileData) {
        return null;
    }

    const { overall_percentage, sections, is_complete, missing_sections } = profileData;

    return (
        <>
            <Card sx={{ mb: 3, border: is_complete ? '2px solid #4caf50' : '2px solid #ff9800' }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="h6" fontWeight="bold">
                                Profile Completion Status
                            </Typography>
                            <Box
                                sx={{
                                    background: is_complete 
                                        ? 'linear-gradient(270deg, #10b981 0%, #059669 100%)'
                                        : 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                    color: 'white',
                                    padding: '6px 12px',
                                    borderRadius: '16px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                {is_complete ? <CheckCircleIcon sx={{ fontSize: '1rem' }} /> : <WarningIcon sx={{ fontSize: '1rem' }} />}
                                {is_complete ? "Complete" : "Incomplete"}
                            </Box>
                        </Box>
                                                 <Box display="flex" gap={1}>
                             <IconButton onClick={() => setShowDetails(true)} size="small">
                                 <InfoIcon />
                             </IconButton>
                         </Box>
                    </Box>

                    <Box mb={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2" color="text.secondary">
                                Overall Progress
                            </Typography>
                            <Typography 
                                variant="h6" 
                                fontWeight="bold"
                                sx={{
                                    background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}
                            >
                                {overall_percentage}%
                            </Typography>
                        </Box>
                        <Box sx={{ position: 'relative' }}>
                            <Box 
                                sx={{ 
                                    width: '100%', 
                                    height: 10, 
                                    backgroundColor: '#e5e7eb', 
                                    borderRadius: 5,
                                    overflow: 'hidden'
                                }}
                            >
                                <Box
                                    sx={{
                                        height: '100%',
                                        width: `${overall_percentage}%`,
                                        background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                        borderRadius: 5,
                                        transition: 'width 0.3s ease-in-out'
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    {!is_complete && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                <strong>Profile completion required:</strong> You need at least 90% profile completion to apply for placements.
                                {missing_sections.length > 0 && (
                                    <span> Missing: {missing_sections.join(', ')}</span>
                                )}
                            </Typography>
                        </Alert>
                    )}

                    {is_complete && (
                        <Alert severity="success">
                            <Typography variant="body2">
                                <strong>Profile Complete!</strong> You can now apply for placements.
                            </Typography>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Detailed Profile Sections Dialog */}
            <Dialog 
                open={showDetails} 
                onClose={() => setShowDetails(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Profile Completion Details</Typography>
                        <IconButton onClick={() => setShowDetails(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {Object.entries(sections).map(([sectionKey, percentage]) => {
                            const sectionName = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1).replace(/([A-Z])/g, ' $1');
                            const isSectionComplete = percentage >= 100;
                            
                            return (
                                <Grid item xs={12} md={6} key={sectionKey}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Box display="flex" alignItems="center" gap={2} mb={1}>
                                                <Box
                                                    sx={{
                                                        color: 'transparent',
                                                        background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                        backgroundClip: 'text'
                                                    }}
                                                >
                                                    {getSectionIcon(sectionName)}
                                                </Box>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {sectionName}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                                        color: 'white',
                                                        padding: '4px 8px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold',
                                                        minWidth: '40px',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {percentage}%
                                                </Box>
                                            </Box>
                                            <Box sx={{ position: 'relative' }}>
                                                <Box 
                                                    sx={{ 
                                                        width: '100%', 
                                                        height: 6, 
                                                        backgroundColor: '#e5e7eb', 
                                                        borderRadius: 3,
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            height: '100%',
                                                            width: `${percentage}%`,
                                                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                                            borderRadius: 3,
                                                            transition: 'width 0.3s ease-in-out'
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={1} mt={1}>
                                                {isSectionComplete ? (
                                                    <CheckCircleIcon color="success" fontSize="small" />
                                                ) : (
                                                    <CancelIcon color="error" fontSize="small" />
                                                )}
                                                <Typography variant="body2" color="text.secondary">
                                                    {isSectionComplete ? 'Complete' : 'Incomplete'}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </DialogContent>
                                 <DialogActions>
                     <Button onClick={() => setShowDetails(false)}>Close</Button>
                 </DialogActions>
            </Dialog>
        </>
    );
};

export default ProfileCompletionCheck;
