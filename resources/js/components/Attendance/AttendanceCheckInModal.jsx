import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
  Paper,
  Alert,
  AlertTitle,
  LinearProgress,
  keyframes
} from '@mui/material';
import {
  Calendar,
  Clock,
  CheckCircle,
  Wifi,
  WifiOff,
  MapPin,
  AlertTriangle,
  Navigation,
  Map
} from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { toast } from 'react-toastify';
import axios from 'axios';

// Define blinking animation
const blinkBorder = keyframes`
  0% { border-color: rgba(229, 53, 16, 0.3); }
  50% { border-color: rgba(229, 53, 16, 1); }
  100% { border-color: rgba(229, 53, 16, 0.3); }
`;

// Key for storing login status in localStorage - must match the one in NewDashBoard.jsx
const LOGIN_STATUS_KEY = 'dashboard_login_status';

export default function AttendanceCheckInModal({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const [deviceErrorDialog, setDeviceErrorDialog] = useState({
    open: false,
    title: '',
    message: ''
  });
  const [locationData, setLocationData] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Location verification states
  const [showLocationVerification, setShowLocationVerification] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    network: null,
    location: null,
    distance: null,
    accuracy: null,
    message: '',
    overall: null
  });
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [wifiInfo, setWifiInfo] = useState(null);

  // Check if this is the first load after login
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

  useEffect(() => {
    if (open) {
      // Always fetch fresh attendance status when modal opens
      fetchAttendanceStatus();

      // Check if there's a stored attendance status in localStorage
      const storedStatus = localStorage.getItem('attendanceStatus');
      if (storedStatus) {
        try {
          const parsedStatus = JSON.parse(storedStatus);
          // If the stored status shows the user is already checked in today, call onSuccess
          if (parsedStatus.is_checked_in &&
              parsedStatus.date === new Date().toISOString().split('T')[0]) {
            if (onSuccess) {
              onSuccess();
            }
          }
        } catch (e) {
          console.error('Error parsing stored attendance status:', e);
        }
      }
    }
  }, [open]);

  // Only check attendance status on component mount if this is the first load
  useEffect(() => {
    if (isFirstLoad) {
      fetchAttendanceStatus();
    }
  }, [isFirstLoad]);

  // Function to get network information
  // Web browsers can't directly access WiFi SSID, but we can use IP-based verification on the server
  const getNetworkInfo = async () => {
    try {
      // Check if we're in development mode (localhost)
      const isLocalhost = window.location.hostname === 'localhost' ||
                          window.location.hostname === '127.0.0.1';

      if (isLocalhost) {
        // In development, simulate a successful network connection
        return {
          connected: true,
          type: 'Campus Network (Development Mode)',
          ip: '192.168.1.1' // This is just for display, actual IP will be detected server-side
        };
      }

      // In production, we can't detect the network type from the browser
      // The server will verify if the IP is within the campus range
      return {
        connected: true,
        type: 'Network connection detected',
        ip: null // The server will get the actual IP
      };
    } catch (error) {
      console.error('Error getting network info:', error);
      return {
        connected: false,
        type: 'Unknown',
        error: error.message
      };
    }
  };

  const fetchAttendanceStatus = async () => {
    try {
      const response = await apiRequest('/student-attendance/status', {
        skipCache: true
      });
      if (response) {
        // Add today's date to the response
        const responseWithDate = {
          ...response,
          date: new Date().toISOString().split('T')[0]
        };

        setAttendanceStatus(responseWithDate);

        // Store the attendance status in localStorage
        localStorage.setItem('attendanceStatus', JSON.stringify(responseWithDate));

        // If already checked in, call onSuccess
        if (response.is_checked_in) {
          if (onSuccess) onSuccess();
        }
      }
    } catch (error) {
      console.error('Error fetching attendance status:', error);
      toast.error('Failed to fetch attendance status. Please try again.');
    }
  };

  // Function to generate a unique device fingerprint
  const generateDeviceFingerprint = async () => {
    try {
      // Get screen properties
      const screenProps = {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth,
        pixelDepth: window.screen.pixelDepth
      };

      // Get timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Get language
      const language = navigator.language;

      // Get platform
      const platform = navigator.platform;

      // Get hardware concurrency (number of CPU cores)
      const hardwareConcurrency = navigator.hardwareConcurrency;

      // Get device memory if available
      const deviceMemory = navigator.deviceMemory;

      // Get battery info if available
      let batteryInfo = null;
      if (navigator.getBattery) {
        const battery = await navigator.getBattery();
        batteryInfo = {
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
          level: battery.level
        };
      }

      // Combine all properties into a single object
      const deviceInfo = {
        screen: screenProps,
        timezone,
        language,
        platform,
        hardwareConcurrency,
        deviceMemory,
        battery: batteryInfo
      };

      // Create a hash of the device info
      const deviceString = JSON.stringify(deviceInfo);
      const deviceHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(deviceString));
      const hashArray = Array.from(new Uint8Array(deviceHash));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      return hashHex;
    } catch (error) {
      console.error('Error generating device fingerprint:', error);
      // Fallback to a simpler fingerprint if the advanced one fails
      return `${navigator.platform}-${window.screen.width}-${window.screen.height}`;
    }
  };

  // Function to get user's location
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setLocationData(location);
          resolve(location);
        },
        (error) => {
          let errorMessage = 'Unable to get your location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Please enable location services to check in';
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
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      setLocationError(null);

      // Get user's location first
      const location = await getUserLocation();

      // Generate device fingerprint
      const deviceFingerprint = await generateDeviceFingerprint();
      
      const response = await apiRequest('/student-attendance/check-in', {
        method: 'POST',
        body: {
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
          device_name: `${navigator.platform} - ${navigator.userAgent.split(' ')[0]}`,
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy
        },
        skipCache: true
      });

      if (response.success) {
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
        setShowLocationVerification(false);
        fetchAttendanceStatus();
      }
    } catch (error) {
      if (error.message.includes('location')) {
        setLocationError(error.message);
      } else {
        const errorResponse = error.response?.data;
        if (errorResponse?.show_dialog) {
          setDeviceErrorDialog({
            open: true,
            title: errorResponse.dialog_title || 'Error',
            message: errorResponse.dialog_message || errorResponse.message
          });
        } else {
          toast.error(errorResponse?.message || error.message || 'Check-in failed');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // This function is kept for the dialog version but won't be used in the silent flow
  const handleVerifiedCheckIn = async () => {
    try {
      setLoading(true);

      // Verify location first
      const isVerified = await verifyCampusLocation();

      if (!isVerified) {
        // If verification failed, don't proceed with check-in
        return;
      }

      // If verification succeeded, proceed with check-in
      const requestBody = {
        laptop_id: navigator.userAgent,
        location_verified: true
      };

      const response = await apiRequest('/student-attendance/check-in', {
        method: 'POST',
        body: requestBody,
        skipCache: true
      });

      toast.success(response.message || 'Successfully checked in!');

      // Update local state
      setAttendanceStatus({
        ...attendanceStatus,
        is_checked_in: true,
        check_in_time: new Date().toTimeString().split(' ')[0]
      });

      // Close the verification dialog
      setShowLocationVerification(false);

      // Call the onSuccess callback
      if (onSuccess) onSuccess();
    } catch (error) {
      const errorResponse = error.response?.data;
      if (errorResponse?.show_dialog) {
        setDeviceErrorDialog({
          open: true,
          title: errorResponse.dialog_title || 'Device Mismatch',
          message: errorResponse.dialog_message || errorResponse.message
        });
        // Close the verification dialog when showing the device mismatch dialog
        setShowLocationVerification(false);
        // Do NOT show a toast for this error
        return;
      }
      // Only show toast if not a dialog error
      const errorMessage = errorResponse?.message || error.message || 'Error checking in. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '500px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: '2px solid #E53510',
          animation: `${blinkBorder} 2s infinite`,
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)'
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#E53510',
        borderBottom: '2px solid #E53510',
        padding: '20px'
      }}>
        Attendance Check-In Required
      </DialogTitle>
      <DialogContent sx={{ padding: '24px' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Alert severity="info" sx={{ 
            mb: 2,
            backgroundColor: 'rgba(229, 53, 16, 0.1)',
            border: '1px solid #E53510',
            borderRadius: '8px'
          }}>
            <AlertTitle sx={{ color: '#E53510', fontWeight: 'bold' }}>Please Check In</AlertTitle>
            You need to check in for attendance before accessing the LMS.
          </Alert>
        </Box>
        
        {locationError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Location Error</AlertTitle>
            {locationError}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button
            variant="contained"
            onClick={handleCheckIn}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle size={20} />}
            sx={{
              background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
              color: '#fff',
              borderRadius: '50px',
              textTransform: 'none',
              padding: '12px 32px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 16px rgba(229, 53, 16, 0.3)',
              '&:hover': {
                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                opacity: 0.9,
                boxShadow: '0 6px 20px rgba(229, 53, 16, 0.4)',
              },
            }}
          >
            {loading ? 'Checking In...' : 'Check In Now'}
          </Button>
        </Box>

        {loading && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress sx={{ 
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(229, 53, 16, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#E53510',
              }
            }} />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
