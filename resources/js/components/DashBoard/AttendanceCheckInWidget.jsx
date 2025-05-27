import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Card,
  Typography,
  CardContent,
  keyframes,
} from '@mui/material';
import {
  CheckCircle,
  LogOut,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { toast } from 'react-toastify';
import AttendanceCheckInModal from '../Attendance/AttendanceCheckInModal';
import { motion } from 'framer-motion';

// Define blinking animation
const blinkBorder = keyframes`
  0% { border-color: rgba(229, 53, 16, 0.3); }
  50% { border-color: rgba(229, 53, 16, 1); }
  100% { border-color: rgba(229, 53, 16, 0.3); }
`;

// Key for storing login status in localStorage - must match the one in NewDashBoard.jsx
const LOGIN_STATUS_KEY = 'dashboard_login_status';

export default function AttendanceCheckInWidget({ displayMode = 'button' }) {
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // Restore hasAccess state to control page access
  const [hasAccess, setHasAccess] = useState(false);
  // Add state to track if this is the first load after login
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerInterval = useRef(null);

  // First check if this is the first load after login
  useEffect(() => {
    const loginStatus = localStorage.getItem(LOGIN_STATUS_KEY);
    const today = new Date().toISOString().split('T')[0];

    // If we have a login status for today but it was just set (within the last minute),
    // consider this the first load after login
    if (loginStatus === today) {
      // Check if the login status was set recently (within the last minute)
      const lastLoginTime = localStorage.getItem(LOGIN_STATUS_KEY + '_time');
      if (lastLoginTime) {
        const timeSinceLogin = Date.now() - parseInt(lastLoginTime);
        // If login was within the last minute, consider this the first load
        if (timeSinceLogin < 60000) { // 60000 ms = 1 minute
          setIsFirstLoad(true);
          // Update the time to prevent showing the modal again on refresh
          localStorage.setItem(LOGIN_STATUS_KEY + '_time', Date.now().toString());
        } else {
          setIsFirstLoad(false);
        }
      } else {
        // If we don't have a time, set it now and consider this the first load
        localStorage.setItem(LOGIN_STATUS_KEY + '_time', Date.now().toString());
        setIsFirstLoad(true);
      }
    } else {
      // This is a new login day, set the login status and time
      localStorage.setItem(LOGIN_STATUS_KEY, today);
      localStorage.setItem(LOGIN_STATUS_KEY + '_time', Date.now().toString());
      setIsFirstLoad(true);
    }
  }, []);

  // Effect to handle attendance status and modal visibility
  useEffect(() => {
    // Only show the modal if the user is not checked in AND this is the first load after login
    if (attendanceStatus && !attendanceStatus.is_checked_in && isFirstLoad) {
      setShowModal(true);
    } else if (attendanceStatus && attendanceStatus.is_checked_in) {
      // If the user is already checked in, make sure the modal is closed
      setShowModal(false);
    }

    // Always grant access regardless of check-in status
    setHasAccess(true);
  }, [attendanceStatus, isFirstLoad]);

  // Check attendance status on initial load
  useEffect(() => {
    // Only show the modal on first load after login and if not checked in
    const checkAttendanceStatus = async () => {
      try {
        // Fetch the latest attendance status directly
        const response = await apiRequest('/student-attendance/status', {
          skipCache: true
        });

        if (response) {
          // If already checked in, hide the modal
          if (response.is_checked_in) {
            setShowModal(false);
          } else if (isFirstLoad) {
            // Only show modal on first load if not checked in
            setShowModal(true);
          }
        }
      } catch (error) {
        console.error('Error checking attendance status on login:', error);
        // If there's an error and it's the first load, keep the modal visible
        if (isFirstLoad) {
          setShowModal(true);
        }
      }
    };

    // Run the check immediately
    checkAttendanceStatus();
  }, [isFirstLoad]);

  useEffect(() => {
    // Check if there's a stored attendance status in localStorage
    const storedStatus = localStorage.getItem('attendanceStatus');
    const today = new Date().toISOString().split('T')[0];

    if (storedStatus) {
      try {
        const parsedStatus = JSON.parse(storedStatus);
        // If the stored status is from today, use it
        if (parsedStatus.date === today) {
          setAttendanceStatus(parsedStatus);
          if (parsedStatus.is_checked_in) {
            setHasAccess(true);
            setShowModal(false);
          }
          setLoading(false);
        } else {
          // If the stored status is not from today, set default state
          setAttendanceStatus({
            is_checked_in: false,
            is_checked_out: false
          });
        }
      } catch (e) {
        console.error('Error parsing stored attendance status:', e);
        // Set default state if there's an error
        setAttendanceStatus({
          is_checked_in: false,
          is_checked_out: false
        });
      }
    } else {
      // If no stored status, set default state
      setAttendanceStatus({
        is_checked_in: false,
        is_checked_out: false
      });
    }

    // Fetch attendance status with priority but without AbortController
    const fetchWithPriority = async () => {
      try {
        const response = await apiRequest('/student-attendance/status', {
          skipCache: true
          // No signal parameter to avoid AbortController issues
        });

        if (response) {
          // Ensure is_checked_out is properly set in the state and add today's date
          const updatedResponse = {
            ...response,
            is_checked_out: response.is_checked_out || false,
            check_out_time: response.check_out_time || null,
            date: today
          };

          setAttendanceStatus(updatedResponse);

          // Store the attendance status in localStorage
          localStorage.setItem('attendanceStatus', JSON.stringify(updatedResponse));

          // Restore access control logic
          if (updatedResponse.is_checked_in) {
            setHasAccess(true);
            setShowModal(false);
          } else {
            // If not checked in, show the modal to require check-in
            setShowModal(true);
            setHasAccess(false);
          }
        }
      } catch (error) {
        console.error('Error fetching attendance status:', error);
        // Keep the default state that was set at the beginning
      } finally {
        setLoading(false);
      }
    };

    // Execute fetch immediately
    fetchWithPriority();

    // Set up interval to refresh attendance status every 5 minutes
    const intervalId = setInterval(() => {
      fetchAttendanceStatus();
    }, 5 * 60 * 1000);

    // Clean up interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // We've removed the getNetworkInfo function since we're handling verification directly in handleCheckIn

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
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'User denied the request for geolocation';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'The request to get user location timed out';
              break;
            default:
              errorMessage = 'An unknown error occurred';
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: false, // Changed to false for faster response
          timeout: 5000, // Reduced timeout to 5 seconds
          maximumAge: 60000 // Cache location for 1 minute
        }
      );
    });
  };

  const fetchAttendanceStatus = async () => {
    try {
      // Don't set loading to true here to avoid UI flicker during refresh
      // Only use skipCache option without signal to avoid AbortController issues
      const response = await apiRequest('/student-attendance/status', {
        skipCache: true
        // No signal parameter to avoid AbortController issues
      });

      if (response) {
        // Ensure is_checked_out is properly set in the state and add today's date
        const updatedResponse = {
          ...response,
          is_checked_out: response.is_checked_out || false,
          check_out_time: response.check_out_time || null,
          date: new Date().toISOString().split('T')[0]
        };

        setAttendanceStatus(updatedResponse);

        // Store the attendance status in localStorage
        localStorage.setItem('attendanceStatus', JSON.stringify(updatedResponse));

        // Restore access control logic
        if (updatedResponse.is_checked_in) {
          setHasAccess(true);
          // If checked in, make sure the modal is closed
          setShowModal(false);
        } else {
          // If not checked in, show the modal to require check-in
          setShowModal(true);
          setHasAccess(false);
        }
      }
    } catch (error) {
      console.error('Error fetching attendance status:', error);
      // Don't update loading state on error to avoid UI issues
    }
  };

  // We've removed the verifyCampusLocation function since we're handling verification directly in handleCheckIn

  const handleCheckIn = async () => {
    try {
      setCheckInLoading(true);

      // --- DISABLED: Geolocation and WiFi checks for now ---
      // let locationData;
      // try {
      //   locationData = await getGeolocation();
      //   console.log('Location data obtained:', locationData);
      // } catch (error) {
      //   console.error('Error getting geolocation:', error);
      //   toast.error('Location access denied. Please enable location services to verify you are within campus boundaries.', { ... });
      //   setCheckInLoading(false);
      //   return;
      // }

      // --- DISABLED: Verification request ---
      // const verificationResponse = await apiRequest('/verify-campus-location', { ... });
      // if (verificationResponse.status !== 'success') { ... return; }

      // Proceed directly to check-in
      const requestBody = {
        laptop_id: navigator.userAgent,
        location_verified: false // Mark as false since we skip verification
      };

      const response = await apiRequest('/student-attendance/check-in', {
        method: 'POST',
        body: requestBody,
        skipCache: true
      });

      toast.success(response.message || 'Successfully checked in!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }
      });

      const today = new Date().toISOString().split('T')[0];
      const updatedStatus = {
        ...attendanceStatus,
        is_checked_in: true,
        is_checked_out: false,
        check_in_time: new Date().toTimeString().split(' ')[0],
        check_out_time: null,
        date: today
      };
      setAttendanceStatus(updatedStatus);
      localStorage.setItem('attendanceStatus', JSON.stringify(updatedStatus));
      setHasAccess(true);
      setShowModal(false);
      fetchAttendanceStatus();
    } catch (error) {
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

      // Show success animation and message
      toast.success(response.message || 'Successfully checked out!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "#E53510", // App's orange color
          color: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
        }
      });

      // Fetch fresh data from the server
      fetchAttendanceStatus();
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

      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        style: {
          background: "#f44336",
          color: "#fff",
          borderRadius: "10px"
        }
      });
    } finally {
      setCheckOutLoading(false);
    }
  };

  const handleModalSuccess = () => {
    // Refresh attendance status
    fetchAttendanceStatus();
    // Close the modal
    setShowModal(false);
    // Set hasAccess to true to allow access to the page
    setHasAccess(true);
  };

  // Function to handle temporary dismissal of the modal
  const handleModalClose = () => {
    // Temporarily hide the modal
    setShowModal(false);

    // Set a timeout to show the modal again after 10 seconds if not checked in
    setTimeout(() => {
      if (attendanceStatus && !attendanceStatus.is_checked_in) {
        setShowModal(true);
      }
    }, 10000); // Show again after 10 seconds
  };

  // Start timer when checked in and not checked out
  useEffect(() => {
    if (attendanceStatus?.is_checked_in && !attendanceStatus?.is_checked_out) {
      // Calculate seconds since check_in_time
      let start = 0;
      if (attendanceStatus.check_in_time) {
        const now = new Date();
        const [h, m, s] = attendanceStatus.check_in_time.split(":").map(Number);
        const checkInDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s || 0);
        start = Math.floor((now - checkInDate) / 1000);
      }
      setTimer(start);
      if (timerInterval.current) clearInterval(timerInterval.current);
      timerInterval.current = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } else {
      if (timerInterval.current) clearInterval(timerInterval.current);
    }
    return () => { if (timerInterval.current) clearInterval(timerInterval.current); };
  }, [attendanceStatus?.is_checked_in, attendanceStatus?.is_checked_out, attendanceStatus?.check_in_time]);

  // Format timer as hh:mm:ss
  const formatTimer = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Render as a card if displayMode is 'card'
  if (displayMode === 'card') {
    const needsCheckout = attendanceStatus?.is_checked_in && !attendanceStatus?.is_checked_out;
    const today = new Date();
    const dateString = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ');

    return (
      <Card sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '40px',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        boxShadow: '0 4px 24px 0 rgba(30,60,114,0.10)',
        p: 0,
        border: 'none',
        position: 'relative',
        overflow: 'visible',
      }}>
        <CardContent sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          pt: 7,
          pb: 4,
        }}>
          {/* Attendance Label */}
          <Typography variant="h6" sx={{ color: '#eb6707', fontWeight: 900, letterSpacing: 1.5, fontSize: '1.4rem', mb: 2 }}>
            ATTENDANCE
          </Typography>
          {/* Date */}
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.5rem', mb: 3, mt: 2, letterSpacing: 1 }}>
            {today.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
          </Typography>
          {/* Timer - reduced size */}
          <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '2rem', mb: 4, letterSpacing: 2 }}>
            {attendanceStatus?.is_checked_out ? (
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.2rem', mb: 1, letterSpacing: 1 }}>
                  Checkout Time
                </Typography>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.5rem', letterSpacing: 1.5 }}>
                  {attendanceStatus.check_out_time || 'N/A'}
                </Typography>
              </Box>
            ) : (
              formatTimer(timer)
            )}
          </Typography>
          {/* Checkout Done Message */}
          {attendanceStatus?.is_checked_out && (
            <Typography sx={{
              background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              mb: 2,
              letterSpacing: 1,
            }}>
              CHECKOUT DONE
            </Typography>
          )}
          {/* Check In/Out Button */}
          {!attendanceStatus?.is_checked_in && (
            <Button
              variant="contained"
              onClick={handleCheckIn}
              disabled={checkInLoading}
              fullWidth={false}
              sx={{
                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                borderRadius: '12px',
                px: 6,
                py: 1.5,
                boxShadow: '0 4px 16px 0 rgba(30,60,114,0.18)',
                textTransform: 'none',
                letterSpacing: 1,
                mt: 2,
                '&:hover': {
                  background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                  opacity: 0.95,
                },
              }}
            >
              {checkInLoading ? 'Processing...' : 'CHECK IN'}
            </Button>
          )}
          {attendanceStatus?.is_checked_in && !attendanceStatus?.is_checked_out && (
            <Button
              variant="contained"
              onClick={handleCheckOut}
              disabled={checkOutLoading}
              fullWidth={false}
              sx={{
                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                borderRadius: '12px',
                px: 6,
                py: 1.5,
                boxShadow: '0 4px 16px 0 rgba(30,60,114,0.18)',
                textTransform: 'none',
                letterSpacing: 1,
                mt: 2,
                '&:hover': {
                  background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                  opacity: 0.95,
                },
              }}
            >
              {checkOutLoading ? 'Processing...' : 'CHECK OUT'}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default button mode
  // Show a default check-in button even while loading
  if (loading && !attendanceStatus) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="contained"
            disabled={true}
            startIcon={<CircularProgress size={16} color="inherit" />}
            sx={{
              bgcolor: '#E53510', // App's orange color
              textTransform: 'none',
              py: 1,
              px: 3,
              borderRadius: '50px',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            Loading...
          </Button>
        </motion.div>
      </Box>
    );
  }

  return (
    <>
      {/* Only show the check-out button when student is checked in but not checked out */}
      {attendanceStatus?.is_checked_in && !attendanceStatus.is_checked_out && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Button
              variant="contained"
              onClick={handleCheckOut}
              disabled={checkOutLoading}
              startIcon={checkOutLoading ? <CircularProgress size={16} color="inherit" /> : <LogOut size={18} />}
              sx={{
                bgcolor: '#E53510', // App's orange color
                '&:hover': {
                  bgcolor: '#d32f2f', // Slightly darker on hover
                  boxShadow: '0 4px 8px rgba(229, 53, 16, 0.4)'
                },
                textTransform: 'none',
                py: 1,
                px: 3,
                borderRadius: '50px',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              {checkOutLoading ? 'Processing...' : 'Check Out'}
            </Button>
          </motion.div>
        </Box>
      )}

      {/* Show a message when student has already checked in and checked out for the day */}
      {attendanceStatus?.is_checked_in && attendanceStatus.is_checked_out && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Button
              variant="contained"
              disabled={true}
              sx={{
                bgcolor: '#4caf50', // Green color for success
                textTransform: 'none',
                py: 1,
                px: 3,
                borderRadius: '50px',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              }}
            >
              Attendance Marked for Today
            </Button>
          </motion.div>
        </Box>
      )}

      {/* Only show check-in button when not checked in */}
      {!attendanceStatus?.is_checked_in && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Button
              variant="contained"
              onClick={handleCheckIn}
              disabled={checkInLoading}
              startIcon={checkInLoading ? <CircularProgress size={16} color="inherit" /> : <CheckCircle size={18} />}
              fullWidth
              sx={{
                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                color: '#fff',
                '&:hover': {
                  background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                  opacity: 0.95,
                  boxShadow: '0 4px 8px rgba(30,60,114,0.25)'
                },
                textTransform: 'none',
                py: 2,
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(228,43,18,0.10)',
                transition: 'all 0.3s ease',
                mt: 2
              }}
            >
              {checkInLoading ? 'Processing...' : 'Check In'}
            </Button>
          </motion.div>
        </Box>
      )}

      {/* We've removed the location verification dialog since we're handling verification silently */}

      <AttendanceCheckInModal
        open={showModal}
        // Use handleModalClose for temporary dismissal
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}
