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
  LinearProgress
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

// Key for storing login status in localStorage - must match the one in NewDashBoard.jsx
const LOGIN_STATUS_KEY = 'dashboard_login_status';

export default function AttendanceCheckInModal({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  // Add state to track if this is the first load after login
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const [deviceErrorDialog, setDeviceErrorDialog] = useState({
    open: false,
    title: '',
    message: ''
  });

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
  const [locationError, setLocationError] = useState(null);
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

  // Function to verify campus location using geofencing
  const verifyCampusLocation = async () => {
    try {
      setVerificationLoading(true);
      setLocationError(null);

      // Reset verification status
      setVerificationStatus({
        network: null,
        location: null,
        message: 'Verifying your location...',
        overall: null
      });

      // Get network information
      const networkData = await getNetworkInfo();
      setWifiInfo(networkData);

      // Get geolocation with high accuracy
      let locationData;
      try {
        locationData = await getGeolocation();
      } catch (error) {
        setLocationError(error.message);
        setVerificationStatus(prev => ({
          ...prev,
          location: false,
          message: `Location error: ${error.message}. Please enable location services and try again.`,
          overall: false
        }));
        return false;
      }

      // Send verification request to server
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

      if (verificationResponse.status === 'success') {
        setVerificationStatus({
          network: verificationResponse.verification.network,
          location: verificationResponse.verification.location,
          distance: verificationResponse.verification.distance,
          accuracy: verificationResponse.verification.accuracy,
          message: verificationResponse.message,
          overall: true
        });
        return true;
      } else {
        setVerificationStatus({
          network: verificationResponse.verification?.network || false,
          location: verificationResponse.verification?.location || false,
          distance: verificationResponse.verification?.distance || null,
          accuracy: verificationResponse.verification?.accuracy || null,
          message: verificationResponse.message,
          overall: false
        });
        return false;
      }
    } catch (error) {
      console.error('Error verifying location:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error verifying your location. Please try again.';

      setVerificationStatus({
        network: false,
        location: false,
        message: errorMessage,
        overall: false
      });
      return false;
    } finally {
      setVerificationLoading(false);
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

  const handleCheckIn = async () => {
    try {
      setLoading(true);

      // Silently verify location without showing the verification UI
      // Get geolocation with high accuracy
      let locationData;
      try {
        locationData = await getGeolocation();
        console.log('Modal: Location data obtained:', locationData);
      } catch (error) {
        console.error('Modal: Error getting geolocation:', error);
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
        setLoading(false);
        return;
      }

      // Send verification request to server
      console.log('Modal: Sending verification request with data:', locationData);
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

      console.log('Modal: Verification response:', verificationResponse);

      // Only proceed with check-in if verification was successful
      if (verificationResponse.status !== 'success') {
        // Show error message and don't allow check-in
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
        setLoading(false);
        return;
      }

      const requestBody = {
        laptop_id: navigator.userAgent,
        location_verified: true
      };

      console.log('Modal: Sending check-in request with body:', requestBody);
      const response = await apiRequest('/student-attendance/check-in', {
        method: 'POST',
        body: requestBody,
        skipCache: true
      });

      console.log('Modal: Check-in response:', response);

      // Show success animation and message
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

      // Update local state with today's date
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

      // Store the updated attendance status in localStorage
      localStorage.setItem('attendanceStatus', JSON.stringify(updatedStatus));

      // Call the onSuccess callback
      if (onSuccess) onSuccess();

      // Instead of reloading the page, just call onSuccess to update the parent component
      // This will be much faster and provide a better user experience
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000); // Small delay to ensure the success message is seen
      }
    } catch (error) {
      const errorResponse = error.response?.data;
      if (errorResponse?.show_dialog) {
        setDeviceErrorDialog({
          open: true,
          title: errorResponse.dialog_title || 'Device Mismatch',
          message: errorResponse.dialog_message || errorResponse.message
        });
        // Close the main check-in dialog when showing the device mismatch dialog
        if (onClose) onClose();
        // Do NOT show a toast for this error
        return;
      }
      // Only show toast if not a dialog error
      const errorMessage = errorResponse?.message || error.message || 'Error checking in. Please try again.';
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        style: {
          background: "#f44336",
          color: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
        }
      });
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
    <>
      {/* Main Check-in Dialog */}
      <Dialog
        open={open && !showLocationVerification}
        onClose={() => {
          // Only temporarily close the modal - it will reappear
          if (onClose) onClose();
        }}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            maxWidth: '450px'
          },
          zIndex: 9999
        }}
      >
        <DialogTitle sx={{
          bgcolor: '#E53510', // App's orange color
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          py: 1.5
        }}>
          <Calendar size={20} />
          Attendance Check-In Required
        </DialogTitle>

        <DialogContent sx={{ py: 3, px: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, color: '#E53510', fontSize: '1.1rem' }}>
              Welcome to the LMS
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              You need to check in for attendance before accessing the system.
            </Typography>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mb: 2,
              mt: 3
            }}>
              <Clock size={16} color="#E53510" />
              <Typography variant="body2" color="text.secondary">
                Current Time: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
              </Typography>
            </Box>

            {attendanceStatus?.is_checked_in ? (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                bgcolor: 'rgba(76, 175, 80, 0.1)',
                borderRadius: 2
              }}>
                <CheckCircle size={40} color="#4caf50" sx={{ mb: 1 }} />
                <Typography variant="body1" sx={{ color: '#4caf50', fontWeight: 500 }}>
                  You have successfully checked in!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check-in time: {attendanceStatus.check_in_time}
                </Typography>
              </Box>
            ) : (
              <Button
                variant="contained"
                onClick={handleCheckIn}
                disabled={loading}
                fullWidth
                sx={{
                  bgcolor: '#E53510', // App's orange color
                  '&:hover': {
                    bgcolor: '#d32f2f',
                  },
                  borderRadius: '4px',
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 'medium',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  mt: 1
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Verifying Location...
                  </>
                ) : (
                  'Check In Now'
                )}
              </Button>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium', mt: 3 }}>
              Note: You must check in daily to access the LMS system.
            </Typography>
          </Box>
        </DialogContent>

        {!attendanceStatus?.is_checked_in && (
          <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'center' }}>
            <Button
              onClick={onClose}
              variant="text"
              sx={{
                color: '#666',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)'
                },
                textTransform: 'none',
                fontWeight: 'normal',
                fontSize: '0.9rem'
              }}
            >
              Remind me later
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Location Verification Dialog */}
      <Dialog
        open={showLocationVerification}
        onClose={() => setShowLocationVerification(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{
          bgcolor: '#1a237e',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <MapPin size={24} />
          Campus Location Verification
        </DialogTitle>

        <DialogContent sx={{ py: 3, mt: 2 }}>
          {/* Explanation */}
          <Typography variant="body1" sx={{ mb: 1 }}>
            For attendance check-in, you must be physically present on campus.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Our system uses geofencing technology to verify your location. Please ensure your device's location services are enabled and accurate. For best results, connect to the campus WiFi network.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
            Campus Location: Latitude 17.4384856, Longitude 78.3794686 (100m radius)
          </Typography>


          {/* Verification Status */}
          {verificationLoading ? (
            <Box sx={{ textAlign: 'center', my: 3 }}>
              <CircularProgress size={40} sx={{ mb: 2, color: '#E53510' }} />
              <Typography variant="body1">
                Verifying your location...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Please allow location access when prompted
              </Typography>
            </Box>
          ) : (
            <>
              {/* Show verification results if available */}
              {verificationStatus.overall !== null && (
                <Box sx={{ mb: 3 }}>
                  <Alert
                    severity={verificationStatus.overall ? "success" : "error"}
                    sx={{ mb: 2 }}
                  >
                    <AlertTitle>
                      {verificationStatus.overall ? "Verification Successful" : "Verification Failed"}
                    </AlertTitle>
                    {verificationStatus.message}
                  </Alert>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                    {/* Network Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {verificationStatus.network ? (
                        <Wifi size={24} color="#4caf50" />
                      ) : (
                        <WifiOff size={24} color="#f44336" />
                      )}
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {verificationStatus.network ? "Connected to Campus Network" : "Not Connected to Campus Network"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {wifiInfo?.type ? `Network: ${wifiInfo.type}` : "Network verification is done server-side"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Location Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {verificationStatus.location ? (
                        <MapPin size={24} color="#4caf50" />
                      ) : (
                        <AlertTriangle size={24} color="#f44336" />
                      )}
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {verificationStatus.location ? "Within Campus Boundaries" : "Outside Campus Boundaries"}
                        </Typography>
                        {locationError ? (
                          <Typography variant="body2" color="error">
                            {locationError}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {verificationStatus.location
                              ? verificationStatus.distance_to_center
                                ? `You are ${verificationStatus.distance_to_center}m from campus center`
                                : "Your location has been verified"
                              : verificationStatus.distance
                                ? `You are approximately ${verificationStatus.distance}m away from campus boundary`
                                : "You must be physically present on campus"}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Location Accuracy */}
                    {verificationStatus.accuracy && (
                      <Box sx={{ mt: 1, px: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Location Accuracy: ±{verificationStatus.accuracy} meters
                        </Typography>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mt: 1,
                          gap: 1
                        }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.max(0, 100 - (verificationStatus.accuracy / 2))}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: verificationStatus.accuracy < 50
                                    ? '#4caf50'
                                    : verificationStatus.accuracy < 100
                                      ? '#ff9800'
                                      : '#f44336'
                                }
                              }}
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {verificationStatus.accuracy < 50
                              ? 'Good'
                              : verificationStatus.accuracy < 100
                                ? 'Fair'
                                : 'Poor'}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Simple Location Map Visualization */}
                    {verificationStatus.location !== null && (
                      <Box sx={{
                        mt: 3,
                        p: 2,
                        bgcolor: '#f5f5f5',
                        borderRadius: 2,
                        position: 'relative',
                        height: 150,
                        overflow: 'hidden'
                      }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Map size={16} />
                          Campus Location
                        </Typography>

                        {/* Campus boundary visualization (simplified) */}
                        <Box sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: 80,
                          height: 80,
                          borderRadius: 2,
                          border: '2px solid #1a237e',
                          bgcolor: 'rgba(26, 35, 126, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <MapPin size={20} color="#1a237e" />
                          <Typography variant="caption" sx={{ position: 'absolute', bottom: -20, color: '#1a237e' }}>
                            Campus
                          </Typography>
                        </Box>

                        {/* User location indicator */}
                        {verificationStatus.distance_to_center !== null && (
                          <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: `translate(
                              calc(-50% + ${verificationStatus.location ? 0 : Math.min(100, verificationStatus.distance_to_center / 10)}px),
                              calc(-50% + ${verificationStatus.location ? 0 : Math.min(50, verificationStatus.distance_to_center / 20)}px)
                            )`,
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            bgcolor: verificationStatus.location ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                            border: `2px solid ${verificationStatus.location ? '#4caf50' : '#f44336'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10
                          }}>
                            <Navigation size={16} color={verificationStatus.location ? '#4caf50' : '#f44336'} />
                          </Box>
                        )}

                        <Typography variant="caption" sx={{
                          position: 'absolute',
                          bottom: 5,
                          right: 10,
                          color: 'text.secondary'
                        }}>
                          {verificationStatus.distance_to_center
                            ? `Distance: ~${verificationStatus.distance_to_center}m`
                            : 'Location unknown'}
                        </Typography>
                      </Box>
                    )}


                  </Box>
                </Box>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => {
              setShowLocationVerification(false);
              // Go back to main check-in dialog
              setVerificationStatus({
                network: null,
                location: null,
                distance: null,
                accuracy: null,
                message: '',
                overall: null
              });
            }}
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerifiedCheckIn}
            variant="contained"
            disabled={loading || verificationLoading || (verificationStatus.overall === false)}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{
              bgcolor: '#1a237e',
              '&:hover': { bgcolor: '#0d47a1' },
              borderRadius: '8px'
            }}
          >
            {verificationStatus.overall === null ? 'Verify Location' : 'Check In'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Device Mismatch Dialog */}
      <Dialog
        open={deviceErrorDialog.open}
        onClose={() => setDeviceErrorDialog({ ...deviceErrorDialog, open: false })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{
          bgcolor: '#f44336',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <AlertTriangle size={24} />
          {deviceErrorDialog.title}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {deviceErrorDialog.message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDeviceErrorDialog({ ...deviceErrorDialog, open: false })}
            variant="contained"
            sx={{
              bgcolor: '#f44336',
              '&:hover': { bgcolor: '#d32f2f' },
              borderRadius: '8px'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
