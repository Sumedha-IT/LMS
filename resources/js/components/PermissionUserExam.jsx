import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    Avatar,
    Divider,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetAttemptedIdQuery } from '../store/service/user/UserService';

const PermissionUserExam = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(true); // Start with true
    const [locationError, setLocationError] = useState(null);
    const [location, setLocation] = useState(null);
    const navigate = useNavigate();
    const { userId, examId } = useParams();
    const [showErrorDialog, setShowErrorDialog] = useState(false);

    // Get user's location on component mount
    useEffect(() => {
        const getLocation = async () => {
            try {
                setIsGettingLocation(true);
                setLocationError(null);
                
                if (!navigator.geolocation) {
                    throw new Error('Geolocation is not supported by your browser');
                }

                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        resolve,
                        reject,
                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0
                        }
                    );
                });

                const locationData = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                
                setLocation(locationData);
                localStorage.setItem('examLocation', JSON.stringify(locationData));
            } catch (error) {
                let errorMessage;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Please enable location services to start the exam';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                    default:
                        errorMessage = 'An unknown error occurred';
                }
                setLocationError(errorMessage);
            } finally {
                setIsGettingLocation(false);
            }
        };

        getLocation();
    }, []); // Run only on mount

    // Fetch the exam attempt details with location data
    const { data, isLoading, isError, error } = useGetAttemptedIdQuery({ 
        userId, 
        examId,
        location: location
    }, {
        skip: isGettingLocation // Skip the query while getting location
    });

    // States for storing fetched data
    const [examDetails, setExamDetails] = useState({});
    const [userDetails, setUsermDetails] = useState({});
    let examAttemptId;

    useEffect(() => {
        if (data) {
            setExamDetails(data.data.examDetails);
            setUsermDetails(data.data.userDetails);
            localStorage.setItem('userdetails', JSON.stringify(data?.data?.userDetails));
            localStorage.setItem('examDetails', JSON.stringify(data?.data?.examDetails));
            examAttemptId = data.data.examAttemptId;
        }
    }, [data]);

    // Show dialog if error
    useEffect(() => {
        if (locationError || isError) {
            setShowErrorDialog(true);
        }
    }, [locationError, isError]);

    const getInitials = (name) => {
        return name
            ? name.split(' ').map((word) => word[0]).join('').toUpperCase()
            : '';
    };

    // Handle checkbox toggle
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    // Handle exam start
    const handleStartExam = async () => {
        if (!isChecked || !data.data) return;

        try {
            setIsGettingLocation(true);
            setLocationError(null);
            
            // Get fresh location
            if (!navigator.geolocation) {
                throw new Error('Geolocation is not supported by your browser');
            }

            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            });

            const locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            
            setLocation(locationData);
            localStorage.setItem('examLocation', JSON.stringify(locationData));
            
            // Navigate to exam with location data
            navigate(`${window.location.pathname}/assessment/${data.data.examAttemptId}`, {
                state: {
                    location: locationData
                }
            });
        } catch (error) {
            let errorMessage;
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Please enable location services to start the exam';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out';
                    break;
                default:
                    errorMessage = 'An unknown error occurred';
            }
            setLocationError(errorMessage);
        } finally {
            setIsGettingLocation(false);
        }
    };

    // Handle going back to "/user"
    const handleGoBack = () => {
        navigate('/user');
    };

    if (isLoading || isGettingLocation) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {/* Error Dialog */}
            <Dialog
                open={showErrorDialog}
                onClose={() => { window.close(); }}
                aria-labelledby="error-dialog-title"
                aria-describedby="error-dialog-description"
            >
                <DialogTitle id="error-dialog-title" sx={{ color: '#b91c1c', fontWeight: 'bold' }}>
                    Error
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="error-dialog-description" sx={{ color: '#b91c1c' }}>
                        {locationError || error?.data?.message || 'You must be either connected to the campus WiFi network or physically present on campus to take the exam.'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => window.close()} variant="contained" sx={{ bgcolor: '#f97316' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Main Content */}
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Exam Instructions
                    </Typography>
                    <Button
                        onClick={handleGoBack}
                        startIcon={<CloseIcon />}
                        sx={{ color: 'gray' }}
                    >
                        Close
                    </Button>
                </Box>

                {/* User Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#f97316', mr: 2 }}>
                        {getInitials(userDetails?.name)}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {userDetails?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {userDetails?.email}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Exam Details */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {examDetails?.title}
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {examDetails?.instructions}
                    </Typography>
                </Box>

                {/* Declaration */}
                <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                                sx={{
                                    color: '#f97316',
                                    '&.Mui-checked': {
                                        color: '#f97316',
                                    },
                                }}
                            />
                        }
                        label="I have read all the instructions carefully and have understood them. I agree not to cheat or use unfair means in this examination. I understand that using unfair means of any sort for my own or someone else's advantage will lead to my immediate disqualification. The decision of the administrator will be final in these matters and cannot be appealed."
                    />
                </Box>

                {/* Footer buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="contained"
                        disabled={!isChecked || isGettingLocation}
                        sx={{
                            bgcolor: isChecked ? '#f97316' : '#fbbf24',
                            color: 'white',
                            textTransform: 'none',
                            borderRadius: '20px',
                            px: 3,
                            py: 1.5,
                            fontWeight: 'bold',
                            '&:hover': {
                                bgcolor: isChecked ? '#f97316' : '#fbbf24',
                            },
                        }}
                        onClick={handleStartExam}
                    >
                        {isGettingLocation ? 'Getting Location...' : 'I am ready to begin'}
                    </Button>

                    {locationError && (
                        <Typography color="error" sx={{ mt: 1 }}>
                            {locationError}
                        </Typography>
                    )}

                    {/* Go Back button */}
                    <Button
                        variant="outlined"
                        onClick={handleGoBack}
                        sx={{
                            borderColor: '#f97316',
                            color: '#f97316',
                            textTransform: 'none',
                            borderRadius: '20px',
                            px: 3,
                            py: 1.5,
                            '&:hover': {
                                borderColor: '#f97316',
                                bgcolor: 'rgba(249, 115, 22, 0.04)',
                            },
                        }}
                    >
                        Go Back
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default PermissionUserExam;
