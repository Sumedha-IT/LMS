import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../../utils/api';
import {
    Box, Button, Card, CardContent, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, CircularProgress, Skeleton,
    Alert, Select, MenuItem, FormControl, Grid, Dialog, DialogTitle,
    DialogContent, DialogActions, IconButton, Tooltip
} from '@mui/material';
import { format, isSameDay, isWeekend } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { DateCalendar, LocalizationProvider, PickersDay } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import sha256 from 'js-sha256';

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
    const [deviceErrorDialog, setDeviceErrorDialog] = useState({
        open: false,
        message: '',
        title: ''
    });

    // Function to generate a unique and stable device fingerprint (works on HTTP)
    const generateDeviceFingerprint = () => {
        const deviceString = [
            navigator.userAgent,
            navigator.platform,
            window.screen.width,
            window.screen.height,
            window.screen.colorDepth
        ].join('::');
        // Use js-sha256 for hashing (works on HTTP and HTTPS)
        return sha256(deviceString);
    };

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

    // Returns the holiday object if the date is a holiday from the holidays array,
    // or a special object for weekends (Saturday/Sunday)
    const getHolidayForDate = (date) => {
        const found = holidays.find(holiday => {
            try {
                return isSameDay(new Date(holiday.start), date);
            } catch {
                return false;
            }
        });
        if (found) return found;
        if (isWeekend(date)) {
            // Optionally, you can use 'Saturday Holiday'/'Sunday Holiday' here
            return { title: 'Weekend Holiday' };
        }
        return null;
    };

    // Custom day component for the calendar
    const CustomDay = (props) => {
        const { day, ...other } = props;
        const isPresent = isDatePresent(day);
        const isAbsent = isDateAbsent(day);
        const holidayObj = getHolidayForDate(day);
        const isHoliday = !!holidayObj;

        let holidayReason = '';
        if (holidayObj) {
            holidayReason = holidayObj.title || holidayObj.description || 'Holiday';
        }

        const dayNode = (
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
        if (isHoliday) {
            return (
                <Tooltip
                    title={
                        <span style={{
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: '#fff',
                            display: 'inline-block',
                            padding: 0
                        }}>{holidayReason}</span>
                    }
                    arrow
                    PopperProps={{
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, 8],
                                },
                            },
                        ],
                        sx: {
                            '& .MuiTooltip-tooltip': {
                                background: 'linear-gradient(270deg, #0f1f3d 0%, #1e3c72 100%)',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                borderRadius: '8px',
                                boxShadow: '0 4px 16px 0 rgba(30,60,114,0.18)',
                                padding: '10px 16px',
                            },
                            '& .MuiTooltip-arrow': {
                                color: '#1e3c72',
                            },
                        },
                    }}
                >
                    <span>{dayNode}</span>
                </Tooltip>
            );
        }
        return dayNode;
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

    const fetchAttendanceReport = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiRequest(`/student-attendance/report?filter_type=${filterType}`, {
                skipCache: true
            });

            if (response) {
                // Calculate attendance percentage consistently with the dashboard widget
                const presentDays = response.present_days || 0;
                const totalDays = response.total_days || 0;
                const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

                setReport({
                    ...response,
                    attendance_percentage: attendancePercentage
                });
            }
        } catch (error) {
            console.error('Error fetching attendance report:', error);
            toast.error('Failed to fetch attendance report');
        } finally {
            setLoading(false);
        }
    }, [filterType]);

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

    const handleCheckIn = async () => {
        try {
            setCheckInLoading(true);
            
            // Generate device fingerprint
            const deviceFingerprint = generateDeviceFingerprint();

            // Ensure CSRF cookie is set (for Laravel Sanctum)
            await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
            
            const response = await axios.post('/api/student-attendance/check-in', {
                device_fingerprint: deviceFingerprint,
                device_info: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    screen: {
                        width: window.screen.width,
                        height: window.screen.height
                    }
                },
                device_type: 'browser',
                device_name: `${navigator.platform} - ${navigator.userAgent.split(' ')[0]}`
            }, { withCredentials: true });

            if (response.data.success) {
                toast.success('Check-in successful');
                fetchAttendanceStatus();
            } else {
                if (response.data.show_dialog) {
                    setDeviceErrorDialog({
                        open: true,
                        message: response.data.dialog_message,
                        title: response.data.dialog_title || 'Device Error'
                    });
                }
                // Always show a toast for any error
                const errorMessage = response.data?.message || 'Check-in failed';
                toast.error(errorMessage);
            }
        } catch (error) {
            const errorData = error.response?.data;
            if (errorData?.show_dialog) {
                setDeviceErrorDialog({
                    open: true,
                    message: errorData.dialog_message,
                    title: errorData.dialog_title || 'Device Error'
                });
            }
            // Always show a toast for any error
            const errorMessage = errorData?.message || error.message || 'Check-in failed';
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
            {/* <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#1a237e' }}>
                Student Attendance
            </Typographya> */}

            {redirectMessage && (
                <Alert
                    severity="info"
                    sx={{ mb: 3, borderRadius: 2 }}
                >
                    {redirectMessage}
                </Alert>
            )}

            {/* Device Error Dialog */}
            <Dialog
                open={deviceErrorDialog.open}
                onClose={() => setDeviceErrorDialog({ open: false, message: '', title: '' })}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        minWidth: '400px'
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: '#f44336',
                    color: 'white',
                    py: 2
                }}>
                    {deviceErrorDialog.title || 'Device Error'}
                    <IconButton
                        onClick={() => setDeviceErrorDialog({ open: false, message: '', title: '' })}
                        sx={{ color: 'white' }}
                    >
                        <X size={20} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <Typography variant="body1" sx={{ color: '#333', fontWeight: 500 }}>
                        {deviceErrorDialog.message}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setDeviceErrorDialog({ open: false, message: '', title: '' })}
                        variant="contained"
                        sx={{
                            bgcolor: '#f44336',
                            '&:hover': { bgcolor: '#d32f2f' },
                            textTransform: 'none',
                            px: 3
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Check-in/Check-out Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card sx={{
                    mb: 4,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)',
                    boxShadow: '0 4px 24px 0 rgba(30,60,114,0.10)',
                }}>
                    <CardContent>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Calendar size={24} color="#fff" />
                                    <Typography variant="h6" sx={{ fontWeight: 500, color: '#fff' }}>
                                        Today's Attendance
                                    </Typography>
                                </Box>
                                <Box sx={{ pl: 4 }}>
                                    <Typography color="#fff" sx={{ mb: 1, fontWeight: 500 }}>
                                        {attendanceStatus?.is_checked_in
                                            ? `Checked in at ${attendanceStatus?.check_in_time ? format(new Date(`1970-01-01T${attendanceStatus.check_in_time}`), 'HH:mm:ss') : ''}`
                                            : 'Not checked in today'}
                                    </Typography>

                                    {/* Show check-in status */}
                                    {attendanceStatus?.is_checked_in && attendanceStatus?.is_checked_out && (
                                        <Typography variant="body2" color="#4caf50" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                                            <CheckCircle size={16} />
                                            <span style={{ color: '#fff' }}>Checked out at {attendanceStatus.check_out_time ? format(new Date(`1970-01-01T${attendanceStatus.check_out_time}`), 'HH:mm:ss') : ''}</span>
                                        </Typography>
                                    )}

                                    {attendanceStatus?.is_checked_in && !attendanceStatus?.is_checked_out && (
                                        <Typography variant="body2" color="#ff9800" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                                            <Clock size={16} />
                                            <span style={{ color: '#fff' }}>Please remember to check out before leaving</span>
                                        </Typography>
                                    )}

                                    {!attendanceStatus?.is_checked_in && (
                                        <Typography variant="body2" color="#fff" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                                color: '#fff',
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                px: 3,
                                                minWidth: '140px',
                                                fontWeight: 'bold',
                                                boxShadow: '0 4px 16px 0 rgba(30,60,114,0.18)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                                    opacity: 0.95,
                                                },
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
                                            variant="contained"
                                            onClick={handleCheckOut}
                                            disabled={checkOutLoading}
                                            sx={{
                                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                                color: '#fff',
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                px: 3,
                                                minWidth: '140px',
                                                fontWeight: 'bold',
                                                boxShadow: '0 4px 16px 0 rgba(30,60,114,0.18)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                                    opacity: 0.95,
                                                },
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
                                            variant="contained"
                                            disabled
                                            sx={{
                                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                                color: '#fff',
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                px: 3,
                                                minWidth: '140px',
                                                fontWeight: 'bold',
                                                boxShadow: '0 4px 16px 0 rgba(30,60,114,0.18)',
                                                transition: 'all 0.3s ease',
                                                opacity: 0.7
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
                        <Box sx={{ mb: 4, width: '100%', bgcolor: '#f6f8fa', borderRadius: 3, p: { xs: 1, sm: 2 }, boxShadow: '0 1px 4px rgba(30,60,114,0.04)' }}>
                            <Box sx={{
                                mb: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%'
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
                                    borderRadius: 2,
                                    bgcolor: 'transparent',
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(76,175,80,0.12)', borderRadius: 99, px: 1.5, py: 0.5 }}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#4caf50', mr: 0.5 }} />
                                        <Typography variant="body2" fontWeight={600} color="#388e3c">Present</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(244,67,54,0.12)', borderRadius: 99, px: 1.5, py: 0.5 }}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f44336', mr: 0.5 }} />
                                        <Typography variant="body2" fontWeight={600} color="#d32f2f">Absent</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(25,118,210,0.10)', borderRadius: 99, px: 1.5, py: 0.5 }}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#1976d2', mr: 0.5 }} />
                                        <Typography variant="body2" fontWeight={600} color="#1976d2">Holiday</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateCalendar
                                    value={selectedDate}
                                    onChange={(newDate) => {
                                        setSelectedDate(newDate);
                                        fetchAttendanceReport();
                                    }}
                                    slots={{
                                        day: CustomDay
                                    }}
                                    sx={{
                                        width: '100%',
                                        minWidth: 0,
                                        maxWidth: '100%',
                                        '& .MuiPickersDay-root': {
                                            fontWeight: 800,
                                            fontSize: '1.15rem',
                                            borderRadius: '8px',
                                            transition: 'all 0.2s ease',
                                            border: '2px solid #e0e7ef',
                                            boxSizing: 'border-box',
                                            backgroundClip: 'padding-box',
                                            '&:hover': {
                                                boxShadow: '0 0 0 2px #1976d233',
                                                borderColor: '#1976d2',
                                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                            },
                                            '&.Mui-selected': {
                                                border: '3px solid #F03A17',
                                                backgroundColor: '#F03A17 !important',
                                                color: '#fff',
                                                fontWeight: 900,
                                                boxShadow: '0 0 0 2px #F03A1744',
                                            },
                                        },
                                        '& .MuiDayCalendar-header': {
                                            '& .MuiTypography-root': {
                                                fontWeight: 900,
                                                fontSize: '1.1rem',
                                                color: '#1a237e'
                                            }
                                        },
                                        '& .MuiPickersCalendarHeader-label': {
                                            fontWeight: 900,
                                            fontSize: '1.35rem',
                                            color: '#F03A17'
                                        }
                                    }}
                                />
                            </LocalizationProvider>
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
                                            fetchAttendanceReport();
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