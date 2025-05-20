import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../../utils/api';
import {
    Box, Button, Card, CardContent, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, CircularProgress, Skeleton,
    Alert, Select, MenuItem, FormControl, Grid
} from '@mui/material';
import { format, isSameDay, isWeekend } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { DateCalendar, LocalizationProvider, PickersDay } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function StudentAttendance() {
    const [attendanceStatus, setAttendanceStatus] = useState(null);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkInLoading, setCheckInLoading] = useState(false);
    const [checkOutLoading, setCheckOutLoading] = useState(false);
    const [redirectMessage, setRedirectMessage] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all', 'week', 'month', 'custom'
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [holidays, setHolidays] = useState([]);
    const location = useLocation();

    // Function to check if a date is present in the attendance records
    const isDatePresent = (date) => {
        if (!report || !report.attendance_details) return false;
        return report.attendance_details.some(record => {
            return isSameDay(new Date(record.date), date) && record.status !== 'Absent';
        });
    };

    // Function to check if a date is absent in the attendance records
    const isDateAbsent = (date) => {
        if (!report || !report.attendance_details) return false;
        return report.attendance_details.some(record => {
            return isSameDay(new Date(record.date), date) && record.status === 'Absent';
        });
    };

    // Function to check if a date is a holiday (weekend or from database)
    const isDateHoliday = (date) => {
        // Check if it's a weekend (Saturday or Sunday)
        if (isWeekend(date)) {
            return true;
        }

        // Check against the holidays array from database
        const isHoliday = holidays.some(holiday => {
            try {
                const holidayDate = new Date(holiday.start);
                const isSame = isSameDay(holidayDate, date);
                if (isSame) {
                    console.log('Found holiday match:', holiday, 'for date:', date);
                }
                return isSame;
            } catch (error) {
                console.error('Error checking holiday date:', error, holiday);
                return false;
            }
        });

        return isHoliday;
    };

    // Custom day component for the calendar
    const CustomDay = (props) => {
        const { day, ...other } = props;
        const isPresent = isDatePresent(day);
        const isAbsent = isDateAbsent(day);
        const isHoliday = isDateHoliday(day);

        if (isHoliday) {
            console.log('Rendering holiday for date:', day);
        }

        return (
            <PickersDay
                {...other}
                day={day}
                sx={{
                    position: 'relative',
                    ...(isHoliday && {
                        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(66, 165, 245, 0.2) 100%)',
                        color: '#1976d2',
                        fontWeight: 500,
                        '&:hover': {
                            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(66, 165, 245, 0.25) 100%)',
                        },
                    }),
                    ...(!isHoliday && (isPresent || isAbsent) && {
                        backgroundColor: isPresent ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                        '&:hover': {
                            backgroundColor: isPresent ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                        },
                    }),
                    ...((isPresent || isAbsent || isHoliday) && {
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 2,
                            left: '50%',
                            width: 6,
                            height: 6,
                            backgroundColor: isHoliday
                                ? '#1976d2'
                                : (isPresent ? '#4caf50' : '#f44336'),
                            borderRadius: '50%',
                            transform: 'translateX(-50%)'
                        }
                    }),
                    '&:hover': {
                        backgroundColor: 'rgba(240, 58, 23, 0.1)',
                    },
                    '&.Mui-selected': {
                        backgroundColor: '#F03A17 !important',
                        color: '#fff',
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: '#d32f2f !important',
                        }
                    }
                }}
            />
        );
    };

    // Memoize fetch functions to prevent unnecessary re-renders
    const fetchAttendanceStatus = useCallback(async () => {
        try {
            const response = await apiRequest('/student-attendance/status', {
                skipCache: true, // Disable caching to ensure fresh data
                cacheTime: 0 // No cache
            });
            if (response) {
                console.log('Attendance status response:', response);
                setAttendanceStatus(response);
            }
        } catch (error) {
            console.error('Error fetching attendance status:', error);
            // Set default status to ensure UI elements are displayed
            setAttendanceStatus({
                is_checked_in: false,
                is_checked_out: false,
                check_in_time: null,
                check_out_time: null,
                can_check_in: true,
                check_in_deadline: '-',
                check_in_start: '-'
            });
        }
    }, []);

    const fetchAttendanceReport = useCallback(async (filter = null) => {
        try {
            setLoading(true);

            // Prepare query parameters
            const params = new URLSearchParams();
            const currentFilter = filter || filterType;
            params.append('filter_type', currentFilter);

            // If we have a custom date range or specific date selected
            if (currentFilter === 'custom' && selectedDate) {
                const formattedDate = format(selectedDate, 'yyyy-MM-dd');
                params.append('start_date', formattedDate);
                params.append('end_date', formattedDate);
            }

            const url = `/student-attendance/report?${params.toString()}`;

            const response = await apiRequest(url, {
                skipCache: true, // Disable caching to ensure fresh data
                cacheTime: 0 // No cache
            });

            if (response) {
                console.log('Attendance report response:', response);
                setReport(response);
            } else {
                // Set default report data if response is empty
                setReport({
                    total_days: 0,
                    present_days: 0,
                    absent_days: 0,
                    attendance_details: []
                });
            }
        } catch (error) {
            console.error('Error fetching attendance report:', error);
            // Set default report data on error
            setReport({
                total_days: 0,
                present_days: 0,
                absent_days: 0,
                attendance_details: []
            });
        } finally {
            setLoading(false);
        }
    }, [filterType, selectedDate]);

    // Function to fetch all holidays
    const fetchHolidays = useCallback(async () => {
        try {
            // We still need to provide start and end dates for the API, but the backend will return all holidays
            const startDate = '2000-01-01';
            const endDate = '2100-12-31';

            // Add all_holidays=true parameter to get all holidays without pagination
            const response = await apiRequest(`/calenders/list?start=${startDate}&end=${endDate}&all_holidays=true`);
            console.log('Holidays API Response:', response);

            // Filter only holiday type items and ensure they have the correct format
            const holidayItems = response.data.filter(item => {
                // Check if it's a holiday and has the required properties
                return item.type === 'Holiday' && item.start;
            }).map(holiday => ({
                ...holiday,
                start: holiday.start.split(' ')[0] // Ensure we only use the date part
            }));

            console.log('Filtered Holiday Items:', holidayItems);

            // Sort holidays by date (ascending)
            const sortedHolidays = holidayItems.sort((a, b) => {
                return new Date(a.start) - new Date(b.start);
            });

            console.log('Sorted Holidays:', sortedHolidays);
            setHolidays(sortedHolidays);
        } catch (error) {
            console.error('Error fetching holidays:', error);
            // Set empty array on error to prevent undefined issues
            setHolidays([]);
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('Starting initial data fetch...');

                // Fetch status, report, and holidays in parallel
                await Promise.all([
                    fetchAttendanceStatus(),
                    fetchAttendanceReport(),
                    fetchHolidays()
                ]);

                // Check if there's a message in the URL search params
                const params = new URLSearchParams(location.search);
                const message = params.get('message');
                if (message) {
                    setRedirectMessage(message);
                }

                // Check if there's a message in the session flash data
                if (window.flashMessage) {
                    setRedirectMessage(window.flashMessage);
                    window.flashMessage = null;
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
                // Set default values to ensure UI renders even on error
                if (!attendanceStatus) {
                    setAttendanceStatus({
                        is_checked_in: false,
                        is_checked_out: false,
                        check_in_time: null,
                        check_out_time: null,
                        can_check_in: true,
                        check_in_deadline: '-',
                        check_in_start: '-'
                    });
                }

                if (!report) {
                    setReport({
                        total_days: 0,
                        present_days: 0,
                        absent_days: 0,
                        attendance_details: []
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        // Set up a refresh interval to keep data updated
        const refreshInterval = setInterval(() => {
            fetchAttendanceStatus();
            fetchAttendanceReport();
        }, 60000); // Refresh every minute

        return () => clearInterval(refreshInterval);
    }, [fetchAttendanceStatus, fetchAttendanceReport, fetchHolidays, location]);

    // Function to get geolocation
    const getGeolocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => {
                    let errorMessage = 'Unknown error occurred while getting location.';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access denied. Please enable location services to check in.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information is unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out.';
                            break;
                    }
                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: false, // Changed to false for faster response
                    timeout: 5000, // Reduced timeout to 5 seconds
                    maximumAge: 30000 // Cache location for 30 seconds
                }
            );
        });
    };

    const handleCheckIn = async () => {
        try {
            setCheckInLoading(true);

            // Silently verify location in the background without showing the verification UI
            // Get geolocation with high accuracy
            let locationData;
            try {
                locationData = await getGeolocation();
                console.log('Location data obtained:', locationData);
            } catch (error) {
                console.error('Error getting geolocation:', error);
                // Don't proceed with check-in if location access is denied
                toast.error('Location access denied. Please enable location services to verify you are within campus boundaries.', {
                    position: "top-center",
                    autoClose: 8000, // Show for longer
                    style: {
                        background: "#f44336",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "16px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                    }
                });
                setCheckInLoading(false);
                return;
            }

            // Send verification request to server
            try {
                console.log('Sending verification request with data:', locationData);
                const verificationResponse = await apiRequest('/verify-campus-location', {
                    method: 'POST',
                    body: {
                        latitude: locationData.latitude,
                        longitude: locationData.longitude,
                        accuracy: locationData.accuracy,
                        ip_address: null // Let the server determine this
                    },
                    skipCache: true
                });

                console.log('Verification response:', verificationResponse);

                // Only proceed with check-in if verification was successful
                if (verificationResponse.status !== 'success') {
                    // Show a more prominent error message
                    toast.error(verificationResponse.message || 'Out of the campus. Not able to check in. Please be present within campus boundaries.', {
                        position: "top-center",
                        autoClose: 8000, // Show for longer
                        style: {
                            background: "#f44336",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "16px",
                            borderRadius: "10px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                        }
                    });
                    setCheckInLoading(false);
                    return;
                }

                const requestBody = {
                    laptop_id: navigator.userAgent,
                    location_verified: true
                };

                // Optimistic update - update UI before API call completes
                const optimisticStatus = {
                    is_checked_in: true,
                    is_checked_out: false,
                    check_in_time: new Date().toTimeString().split(' ')[0],
                    check_out_time: null,
                    can_check_in: false,
                    check_in_deadline: '-',
                    check_in_start: '-'
                };
                setAttendanceStatus(optimisticStatus);

                const response = await apiRequest('/student-attendance/check-in', {
                    method: 'POST',
                    body: requestBody,
                    skipCache: true
                });

                toast.success(response.message || 'Successfully checked in!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    style: {
                        background: "#4caf50",
                        color: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
                    }
                });

                // Refresh data in background
                Promise.all([
                    fetchAttendanceStatus(),
                    fetchAttendanceReport()
                ]).catch(error => {
                    console.error('Error refreshing data:', error);
                });
            } catch (error) {
                console.error('Error during verification or check-in:', error);
                // Revert optimistic update on error
                fetchAttendanceStatus();

                // Check if it's a location verification error
                if (error.response?.status === 403 && error.response?.data?.message) {
                    toast.error(error.response.data.message, {
                        position: "top-center",
                        autoClose: 5000
                    });
                } else {
                    const errorMessage = error.response?.data?.message || error.message || 'Error checking in. Please try again.';
                    toast.error(errorMessage);
                }
            }
        } catch (error) {
            console.error('Unexpected error during check-in:', error);
            // Revert optimistic update on error
            fetchAttendanceStatus();

            const errorMessage = error.response?.data?.message || error.message || 'Error checking in. Please try again.';
            toast.error(errorMessage);
        } finally {
            setCheckInLoading(false);
        }
    };

    const handleCheckOut = async () => {
        try {
            setCheckOutLoading(true);

            // Optimistic update - update UI before API call completes
            setAttendanceStatus({
                ...attendanceStatus,
                is_checked_out: true,
                check_out_time: new Date().toTimeString().split(' ')[0] // Current time in HH:MM:SS format
            });

            // Use skipCache option instead of directly calling clearCache
            const response = await apiRequest('/student-attendance/check-out', {
                method: 'POST',
                skipCache: true
            });

            toast.success(response.message || 'Successfully checked out!');

            // Fetch fresh data from the server
            fetchAttendanceStatus();
            fetchAttendanceReport();
        } catch (error) {
            console.error('Error checking out:', error);

            // Revert optimistic update on error
            fetchAttendanceStatus();

            let errorMessage = 'Error checking out. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setCheckOutLoading(false);
        }
    };

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <Box>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[1, 2, 3].map((item) => (
                    <Grid item xs={12} md={4} key={item}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Skeleton variant="text" width="60%" height={24} />
                            <Skeleton variant="text" width="40%" height={40} />
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {[1, 2, 3, 4].map((item) => (
                                <TableCell key={item}>
                                    <Skeleton variant="text" width="80%" height={24} />
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[1, 2, 3].map((row) => (
                            <TableRow key={row}>
                                {[1, 2, 3, 4].map((cell) => (
                                    <TableCell key={cell}>
                                        <Skeleton variant="text" width="60%" height={24} />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    return (
        <Box sx={{ p: 4, maxWidth: '1200px', margin: '0 auto' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#1a237e' }}>
                Student Attendance
            </Typography>

            {redirectMessage && (
                <Alert
                    severity="info"
                    sx={{ mb: 3, borderRadius: 2 }}
                >
                    {redirectMessage}
                </Alert>
            )}

            {/* Check-in/Check-out Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card sx={{
                    mb: 4,
                    borderRadius: 2,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
                }}>
                    <CardContent>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Calendar size={24} color="#1a237e" />
                                    <Typography variant="h6" sx={{ fontWeight: 500, color: '#1a237e' }}>
                                        Today's Attendance
                                    </Typography>
                                </Box>
                                <Box sx={{ pl: 4 }}>
                                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                                        {attendanceStatus?.is_checked_in
                                            ? `Checked in at ${attendanceStatus?.check_in_time ? format(new Date(`1970-01-01T${attendanceStatus.check_in_time}`), 'HH:mm:ss') : ''}`
                                            : 'Not checked in today'}
                                    </Typography>

                                    {/* Show check-in status */}
                                    {attendanceStatus?.is_checked_in && attendanceStatus?.is_checked_out && (
                                        <Typography variant="body2" color="#4caf50" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                                            <CheckCircle size={16} />
                                            Checked out at {attendanceStatus.check_out_time ? format(new Date(`1970-01-01T${attendanceStatus.check_out_time}`), 'HH:mm:ss') : ''}
                                        </Typography>
                                    )}

                                    {attendanceStatus?.is_checked_in && !attendanceStatus?.is_checked_out && (
                                        <Typography variant="body2" color="#ff9800" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                                            <Clock size={16} />
                                            Please remember to check out before leaving
                                        </Typography>
                                    )}

                                    {!attendanceStatus?.is_checked_in && (
                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Clock size={16} />
                                            Check-in window: {attendanceStatus?.check_in_start || '-'} - {attendanceStatus?.check_in_deadline || '-'}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 2 }}>
                                    {/* Always show one of the buttons based on attendance status */}
                                    {(!attendanceStatus || !attendanceStatus.is_checked_in) && (
                                        <Button
                                            variant="contained"
                                            onClick={handleCheckIn}
                                            disabled={checkInLoading}
                                            sx={{
                                                bgcolor: '#F03A17',
                                                '&:hover': { bgcolor: '#d32f2f' },
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                px: 3,
                                                minWidth: '140px',
                                                boxShadow: '0 4px 8px rgba(240, 58, 23, 0.2)',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {checkInLoading ? (
                                                <>
                                                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Check In'
                                            )}
                                        </Button>
                                    )}
                                    {attendanceStatus && attendanceStatus.is_checked_in && !attendanceStatus.is_checked_out && (
                                        <Button
                                            variant="outlined"
                                            onClick={handleCheckOut}
                                            disabled={checkOutLoading}
                                            sx={{
                                                borderColor: '#F03A17',
                                                color: '#F03A17',
                                                '&:hover': { borderColor: '#d32f2f', bgcolor: 'rgba(240, 58, 23, 0.04)' },
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                px: 3,
                                                minWidth: '140px',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {checkOutLoading ? (
                                                <>
                                                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Check Out'
                                            )}
                                        </Button>
                                    )}
                                    {attendanceStatus && attendanceStatus.is_checked_in && attendanceStatus.is_checked_out && (
                                        <Button
                                            variant="outlined"
                                            disabled
                                            sx={{
                                                borderColor: '#4caf50',
                                                color: '#4caf50',
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                px: 3
                                            }}
                                            startIcon={<CheckCircle size={20} />}
                                        >
                                            Attendance Complete
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Attendance Details Section with Calendar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card sx={{
                    borderRadius: 2,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                    mb: 4
                }}>
                    <CardContent>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3
                        }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                                Attendance Details
                            </Typography>
                        </Box>

                        {/* Calendar View */}
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                            <Paper sx={{
                                p: 3,
                                borderRadius: 2,
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)',
                                width: 'fit-content',
                                overflow: 'hidden',
                                border: '1px solid rgba(240, 58, 23, 0.2)'
                            }}>
                                <Box sx={{
                                    mb: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 1,
                                            color: '#1a237e',
                                            fontWeight: 500,
                                            textAlign: 'center'
                                        }}
                                    >
                                        Attendance Calendar
                                    </Typography>

                                    {/* Legend with improved visuals */}
                                    <Box sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 2,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        p: 1.5,
                                        borderRadius: 1,
                                        bgcolor: 'rgba(0, 0, 0, 0.02)'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: '4px',
                                                bgcolor: 'rgba(76, 175, 80, 0.2)',
                                                border: '1px solid #4caf50',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Box sx={{
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: '50%',
                                                    bgcolor: '#4caf50'
                                                }} />
                                            </Box>
                                            <Typography variant="body2" fontWeight={500}>Present</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: '4px',
                                                bgcolor: 'rgba(244, 67, 54, 0.2)',
                                                border: '1px solid #f44336',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Box sx={{
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: '50%',
                                                    bgcolor: '#f44336'
                                                }} />
                                            </Box>
                                            <Typography variant="body2" fontWeight={500}>Absent</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: '4px',
                                                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(66, 165, 245, 0.2) 100%)',
                                                border: '1px solid #1976d2',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Box sx={{
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: '50%',
                                                    bgcolor: '#1976d2'
                                                }} />
                                            </Box>
                                            <Typography variant="body2" fontWeight={500}>Holiday</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateCalendar
                                        value={selectedDate}
                                        onChange={(newDate) => {
                                            setSelectedDate(newDate);
                                            // Fetch attendance for the selected date
                                            fetchAttendanceReport('custom');
                                        }}
                                        slots={{
                                            day: CustomDay
                                        }}
                                        sx={{
                                            '& .MuiPickersDay-root': {
                                                fontWeight: 500,
                                                borderRadius: '8px',
                                                transition: 'all 0.2s ease',
                                            },
                                            '& .MuiDayCalendar-header': {
                                                '& .MuiTypography-root': {
                                                    fontWeight: 600,
                                                    color: '#1a237e'
                                                }
                                            },
                                            '& .MuiPickersCalendarHeader-label': {
                                                fontWeight: 600,
                                                color: '#F03A17'
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </Paper>
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Attendance Report Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card sx={{
                    borderRadius: 2,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
                }}>
                    <CardContent>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            mb: 3,
                            gap: 2
                        }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                                    Attendance Report
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    View and track your attendance records
                                </Typography>
                            </Box>

                            {/* Filter Dropdown with improved styling */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 1,
                                borderRadius: 2,
                                bgcolor: 'rgba(240, 58, 23, 0.05)',
                                border: '1px solid rgba(240, 58, 23, 0.1)'
                            }}>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: '#1a237e' }}>
                                    Filter:
                                </Typography>
                                <FormControl size="small" sx={{ minWidth: 140 }}>
                                    <Select
                                        value={filterType}
                                        onChange={(e) => {
                                            const newFilter = e.target.value;
                                            setFilterType(newFilter);
                                            fetchAttendanceReport(newFilter);
                                        }}
                                        displayEmpty
                                        variant="standard"
                                        sx={{
                                            '&:before, &:after': {
                                                display: 'none'
                                            },
                                            '& .MuiSelect-select': {
                                                p: 0.5,
                                                fontWeight: 500,
                                                color: '#F03A17'
                                            }
                                        }}
                                    >
                                        <MenuItem value="all">All Time</MenuItem>
                                        <MenuItem value="week">This Week</MenuItem>
                                        <MenuItem value="month">This Month</MenuItem>
                                        <MenuItem value="custom">Custom Date</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        {/* Attendance Statistics Cards */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                            <Card sx={{
                                flex: '1 1 calc(33% - 16px)',
                                minWidth: '200px',
                                p: 2,
                                borderRadius: 2,
                                bgcolor: 'rgba(25, 118, 210, 0.05)',
                                border: '1px solid rgba(25, 118, 210, 0.1)'
                            }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Total Days
                                </Typography>
                                <Typography variant="h3" color="#1976d2" sx={{ fontWeight: 600 }}>
                                    {report?.total_days || 0}
                                </Typography>
                            </Card>

                            <Card sx={{
                                flex: '1 1 calc(33% - 16px)',
                                minWidth: '200px',
                                p: 2,
                                borderRadius: 2,
                                bgcolor: 'rgba(76, 175, 80, 0.05)',
                                border: '1px solid rgba(76, 175, 80, 0.1)'
                            }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Present Days
                                </Typography>
                                <Typography variant="h3" color="#4caf50" sx={{ fontWeight: 600 }}>
                                    {report?.present_days || 0}
                                </Typography>
                            </Card>

                            <Card sx={{
                                flex: '1 1 calc(33% - 16px)',
                                minWidth: '200px',
                                p: 2,
                                borderRadius: 2,
                                bgcolor: 'rgba(240, 58, 23, 0.05)',
                                border: '1px solid rgba(240, 58, 23, 0.1)'
                            }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Attendance Rate
                                </Typography>
                                <Typography variant="h3" color="#F03A17" sx={{ fontWeight: 600 }}>
                                    {report && report.total_days > 0
                                        ? `${Math.round((report.present_days / report.total_days) * 100)}%`
                                        : '0%'}
                                </Typography>
                            </Card>
                        </Box>

                        {report && report.attendance_details && report.attendance_details.length > 0 ? (
                            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                                            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Check In</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Check Out</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {report.attendance_details.map((record, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{record.date}</TableCell>
                                                <TableCell>{record.check_in || '-'}</TableCell>
                                                <TableCell>{record.check_out || '-'}</TableCell>
                                                <TableCell>
                                                    {record.status === 'Complete' ? (
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                            color: '#4caf50'
                                                        }}>
                                                            <CheckCircle size={16} />
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                Complete
                                                            </Typography>
                                                        </Box>
                                                    ) : record.status === 'Incomplete' ? (
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                            color: '#ff9800'
                                                        }}>
                                                            <Clock size={16} />
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                Incomplete
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                            color: '#f44336'
                                                        }}>
                                                            <AlertCircle size={16} />
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                Absent
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography color="text.secondary">
                                    No attendance records found for the selected period.
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </Box>
    );
}