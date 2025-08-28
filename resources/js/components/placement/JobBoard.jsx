import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Divider,
    Avatar,
    CardActions,
    IconButton,
    Tooltip,
    LinearProgress,
    Snackbar
} from '@mui/material';
import {
    Work as WorkIcon,
    LocationOn as LocationIcon,
    Business as BusinessIcon,
    AttachMoney as MoneyIcon,
    Schedule as ScheduleIcon,
    Send as ApplyIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    AccessTime as TimeIcon,
    TrendingUp as TrendingIcon,
    Star as StarIcon,
    Visibility as ViewIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    KeyboardArrowDown as ArrowIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { useGetJobPostingsQuery } from '../../store/service/user/UserService';
import axios from 'axios';
import ProfileCompletionCheck from './ProfileCompletionCheck';

// JobDescription component for truncating and expanding job descriptions
const JobDescription = ({ description }) => {
    const [expanded, setExpanded] = React.useState(false);
    const limit = 150;
    if (!description) return null;
    const isLong = description.length > limit;
    return (
        <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.6 }}>
            {expanded || !isLong
                ? description
                : `${description.substring(0, limit)}...`}
            {isLong && (
                <Button
                    size="small"
                    onClick={() => setExpanded((prev) => !prev)}
                    sx={{ ml: 1, textTransform: 'none', fontWeight: 500, fontSize: '0.95em', p: 0, minWidth: 0 }}
                >
                    {expanded ? 'Show less' : 'Read more'}
                </Button>
            )}
        </Typography>
    );
};

const JobBoard = ({ studentId }) => {
    // Date formatting function for d/m/year format
    const formatDateToDMY = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return format(date, 'dd/MM/yyyy');
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [jobType, setJobType] = useState('');
    const [location, setLocation] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [applyDialogOpen, setApplyDialogOpen] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [jobApplications, setJobApplications] = useState([]);
    const [studentCourse, setStudentCourse] = useState(null);
    const [loadingStudentCourse, setLoadingStudentCourse] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [applyingJob, setApplyingJob] = useState(false);
    const [profileCompletionStatus, setProfileCompletionStatus] = useState(null);
    const [expandedJobs, setExpandedJobs] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Real API call for job postings
    const { data: jobPostings, isLoading: loading, error } = useGetJobPostingsQuery();

    // Function to refresh student data
    const refreshStudentData = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Get student's course information and existing applications
    useEffect(() => {
        const getStudentData = async () => {
            try {
                setLoadingStudentCourse(true);
                const userInfo = getCookie('user_info');
                const userData = JSON.parse(userInfo);
                const userId = getCookie('x_path_id');
                
                // Get student's course
                const courseResponse = await axios.get(`/api/courses/my/${userId}`, {
                    headers: { 'Authorization': userData.token }
                });
                
                if (courseResponse.data.courses && courseResponse.data.courses.length > 0) {
                    setStudentCourse(courseResponse.data.courses[0]);
                }
                
                // Get student's existing job applications
                const applicationsResponse = await axios.get(`/api/job-applications?user_id=${userId}`, {
                    headers: { 'Authorization': userData.token }
                });
                
                if (applicationsResponse.data.data) {
                    // Filter out duplicate applications by job_posting_id (keep only the latest one)
                    const uniqueApplications = applicationsResponse.data.data.filter((app, index, self) => 
                        index === self.findIndex(a => a.job_posting_id === app.job_posting_id)
                    );
                    
                    const appliedJobIds = uniqueApplications.map(app => app.job_posting_id);
                    setAppliedJobs(appliedJobIds);
                    setJobApplications(uniqueApplications);
                }
            } catch (err) {
                console.error('Error fetching student data:', err);
            } finally {
                setLoadingStudentCourse(false);
            }
        };

        getStudentData();
        checkProfileCompletion();
    }, [refreshTrigger]);



    // Helper function to get cookie
    const getCookie = (name) => {
        let cookies = document.cookie.split('; ');
        for (let cookie of cookies) {
            let [key, value] = cookie.split('=');
            if (key === name) {
                return decodeURIComponent(value);
            }
        }
        return null;
    };

    // Transform API data to match component expectations and filter by course eligibility
    const jobs = jobPostings?.data ? jobPostings.data.map(job => {
        // Check if job is eligible for student's course
        let isEligible = true;
        
        // Check eligible_courses field first (new multiple course selection)
        if (job.eligible_courses && Array.isArray(job.eligible_courses) && job.eligible_courses.length > 0) {
            isEligible = job.eligible_courses.includes(studentCourse?.name);
        }
        // Fallback to old course_id field for backward compatibility
        else if (job.course_id) {
            isEligible = studentCourse && job.course_id === studentCourse.id;
        }
        
        return {
            id: job.id,
            title: job.title,
            company: job.company?.name || 'N/A',
            location: job.location,
            type: job.job_type === 'full_time' ? 'Full Time' : 
                  job.job_type === 'part_time' ? 'Part Time' : 
                  job.job_type === 'contract' ? 'Contract' : 'Internship',
            salary: job.salary_min && job.salary_max ? 
                    `₹${job.salary_min}-${job.salary_max} LPA` : 
                    job.salary_min ? `₹${job.salary_min}+ LPA` : 'Not specified',
            experience: job.experience_required || 'Not specified',
            description: job.description,
            requirements: job.requirements ? job.requirements.split(',').map(req => req.trim()) : [],
            postedDate: job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A',
            deadline: job.application_deadline ? formatDateToDMY(job.application_deadline) : 'N/A',
            domain: 'Computer Science', // Default domain
            course_id: job.course_id,
            course_name: job.eligible_courses && Array.isArray(job.eligible_courses) && job.eligible_courses.length > 0 
                        ? job.eligible_courses.join(', ') 
                        : (job.course?.name || 'Any Course'),
            isEligible: isEligible
        };
    }).filter(job => job.isEligible) : [];



    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !jobType || job.type === jobType;
        const matchesLocation = !location || job.location === location;
        
        return matchesSearch && matchesType && matchesLocation;
    });

    const checkProfileCompletion = async () => {
        try {
            const userInfo = getCookie('user_info');
            const userData = JSON.parse(userInfo);
            
            const response = await axios.get('/api/profile-completion/can-apply', {
                headers: { 'Authorization': userData.token }
            });
            
            setProfileCompletionStatus(response.data.data);
        } catch (err) {
            console.error('Error checking profile completion:', err);
        }
    };

    const handleApply = async (job) => {
        // Check profile completion before allowing application
        if (!profileCompletionStatus?.can_apply) {
            setSnackbar({
                open: true,
                message: profileCompletionStatus?.message || 'Profile completion requirement not met',
                severity: 'warning'
            });
            return;
        }
        
        setSelectedJob(job);
        setApplyDialogOpen(true);
    };

    const confirmApply = async () => {
        if (selectedJob) {
            try {
                setApplyingJob(true);
                const userInfo = getCookie('user_info');
                const userData = JSON.parse(userInfo);
                const userId = getCookie('x_path_id');
                
                // Create job application in database
                const response = await axios.post('/api/job-applications', {
                    job_posting_id: selectedJob.id,
                    user_id: userId,
                    status: 'applied',
                    application_date: new Date().toISOString()
                }, {
                    headers: { 'Authorization': userData.token }
                });
                
                if (response.status === 201) {
                    // Update local state to show as applied
                    setAppliedJobs([...appliedJobs, selectedJob.id]);
                    setApplyDialogOpen(false);
                    setSelectedJob(null);
                    
                    // Show success message
                    setSnackbar({
                        open: true,
                        message: '🎉 Job application submitted successfully! You will be notified about the next steps.',
                        severity: 'success'
                    });
                }
            } catch (err) {
                console.error('Error applying for job:', err);
                let errorMessage = 'Error applying for job. Please try again.';
                let severity = 'error';
                
                if (err.response?.status === 409) {
                    errorMessage = 'You have already applied for this job.';
                } else if (err.response?.status === 401) {
                    errorMessage = 'Please log in again to apply for jobs.';
                } else if (err.response?.status === 403) {
                    errorMessage = 'You are not eligible to apply for this job.';
                } else if (err.response?.status === 422) {
                    // Profile completion validation failed
                    const errorData = err.response?.data;
                    errorMessage = errorData?.message || 'Profile completion requirement not met.';
                    
                    // If there are missing sections, provide more detailed information
                    if (errorData?.missing_sections && errorData.missing_sections.length > 0) {
                        errorMessage += ` Please complete: ${errorData.missing_sections.join(', ')}.`;
                    }
                    
                    // Show as warning instead of error for profile completion issues
                    severity = 'warning';
                } else if (err.response?.status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
                
                setSnackbar({
                    open: true,
                    message: errorMessage,
                    severity: severity
                });
            } finally {
                setApplyingJob(false);
            }
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const isApplied = (jobId) => appliedJobs.includes(jobId);
    
    const getApplicationStatus = (jobId) => {
        const application = jobApplications.find(app => app.job_posting_id === jobId);
        return application ? application.status : null;
    };

    const getApplicationData = (jobId) => {
        const application = jobApplications.find(app => app.job_posting_id === jobId);
        return application || null;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'applied': return 'default';
            case 'shortlisted': return 'primary';
            case 'interview_scheduled': return 'info';
            case 'interviewed': return 'warning';
            case 'selected': return 'success';
            case 'selected_not_joined': return 'warning';
            case 'rejected': return 'error';
            case 'withdrawn': return 'secondary';
            default: return 'default';
        }
    };

    const getStatusDisplayText = (status) => {
        switch (status) {
            case 'applied': return 'Application Submitted';
            case 'shortlisted': return 'Shortlisted';
            case 'interview_scheduled': return 'Interview Scheduled';
            case 'interviewed': return 'Interviewed';
            case 'selected': return 'Selected';
            case 'selected_not_joined': return 'Selected Not Joined';
            case 'rejected': return 'Rejected';
            case 'withdrawn': return 'Withdrawn';
            default: return 'Application Submitted';
        }
    };

    const getJobTypeColor = (type) => {
        switch (type) {
            case 'Full Time': return 'primary';
            case 'Part Time': return 'secondary';
            case 'Contract': return 'warning';
            case 'Internship': return 'info';
            default: return 'default';
        }
    };

    const getCompanyInitials = (companyName) => {
        return companyName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading || loadingStudentCourse) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                    {loadingStudentCourse ? 'Loading your course information...' : 'Loading job opportunities...'}
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <Alert severity="error">
                    <Typography>
                        Error loading job postings. Please try again later.
                    </Typography>
                </Alert>
            </Box>
        );
    }

    return (
        <Box>
            {/* Profile Completion Check */}
            <ProfileCompletionCheck onProfileUpdate={refreshStudentData} />
            
            {/* Modern Stats Header */}
            <Box sx={{ mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                    <Box>
                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                💼 Job Opportunities
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={refreshStudentData}
                                disabled={loadingStudentCourse}
                                startIcon={<RefreshIcon />}
                                sx={{ 
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    borderColor: '#e42b12',
                                    color: '#e42b12',
                                    '&:hover': {
                                        borderColor: '#e42b12',
                                        backgroundColor: 'rgba(228,43,18,0.1)'
                                    }
                                }}
                            >
                                {loadingStudentCourse ? 'Refreshing...' : 'Refresh'}
                            </Button>
                        </Box>
                        <Typography variant="body1" color="text.secondary">
                            {filteredJobs.length} {filteredJobs.length === 1 ? 'opportunity' : 'opportunities'} available
                        </Typography>
                    </Box>
                    
                    {/* Quick Stats Cards */}
                    <Grid container spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                        <Grid item>
                            <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)', color: 'white', minWidth: 120 }}>
                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        {jobs.length}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                        Available Jobs
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card sx={{ borderRadius: 3, background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)', color: 'white', minWidth: 120 }}>
                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        {jobs.filter(job => isApplied(job.id)).length}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                        Applied Jobs
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
                

            </Box>

            {/* Modern Search and Filters */}
            <Card sx={{ 
                mb: 4, 
                borderRadius: 4, 
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                border: '1px solid rgba(0,0,0,0.04)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,1) 100%)'
            }}>
                <CardContent sx={{ p: 4 }}>
                    <Box mb={3}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            🔍 Find Your Perfect Job
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Use filters below to discover opportunities tailored to your preferences
                        </Typography>
                    </Box>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <TextField
                                fullWidth
                                placeholder="Search by job title, company, or keywords..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            mr: 1,
                                            p: 1,
                                            borderRadius: 2,
                                            background: 'rgba(15, 31, 61, 0.1)'
                                        }}>
                                            <SearchIcon sx={{ color: '#0f1f3d', fontSize: 20 }} />
                                        </Box>
                                    ),
                                    sx: { 
                                        borderRadius: 3,
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255,255,255,0.8)',
                                        }
                                    }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderWidth: 2,
                                        }
                                    },
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={2.5}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ fontWeight: 500 }}>Job Type</InputLabel>
                                <Select
                                    value={jobType}
                                    onChange={(e) => setJobType(e.target.value)}
                                    label="Job Type"
                                    sx={{ 
                                        borderRadius: 3,
                                        backgroundColor: 'rgba(255,255,255,0.8)'
                                    }}
                                >
                                    <MenuItem value="">All Types</MenuItem>
                                    <MenuItem value="Full Time">💼 Full Time</MenuItem>
                                    <MenuItem value="Part Time">⏰ Part Time</MenuItem>
                                    <MenuItem value="Contract">📋 Contract</MenuItem>
                                    <MenuItem value="Internship">🎓 Internship</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} md={2.5}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ fontWeight: 500 }}>Location</InputLabel>
                                <Select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    label="Location"
                                    sx={{ 
                                        borderRadius: 3,
                                        backgroundColor: 'rgba(255,255,255,0.8)'
                                    }}
                                >
                                    <MenuItem value="">All Locations</MenuItem>
                                    <MenuItem value="Hyderabad">📍 Hyderabad</MenuItem>
                                    <MenuItem value="Bangalore">📍 Bangalore</MenuItem>
                                    <MenuItem value="Mumbai">📍 Mumbai</MenuItem>
                                    <MenuItem value="Remote">🌐 Remote</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} md={2}>
                            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Card sx={{ 
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                                    color: 'white',
                                    borderRadius: 3,
                                    minWidth: '100%'
                                }}>
                                    <CardContent sx={{ p: 2, textAlign: 'center', '&:last-child': { pb: 2 } }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                            {filteredJobs.length}
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                            Results
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Collapsible Job Cards */}
            <Grid container spacing={3}>
                {filteredJobs.map((job) => {
                    const isExpanded = expandedJobs[job.id] || false;
                    
                    return (
                    <Grid item xs={12} key={job.id}>
                        <Card 
                            sx={{ 
                                borderRadius: 3, 
                                boxShadow: isApplied(job.id) 
                                    ? '0 4px 20px rgba(76, 175, 80, 0.15)' 
                                    : !profileCompletionStatus?.can_apply
                                    ? '0 2px 8px rgba(239, 68, 68, 0.2)'
                                    : '0 2px 8px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s ease',
                                border: isApplied(job.id) 
                                    ? '1px solid #4caf50' 
                                    : !profileCompletionStatus?.can_apply
                                    ? '1px solid #ef4444'
                                    : '1px solid #e5e7eb',
                                background: isApplied(job.id)
                                    ? '#f8fdf8'
                                    : !profileCompletionStatus?.can_apply
                                    ? '#fef2f2'
                                    : '#ffffff',
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                animation: !profileCompletionStatus?.can_apply ? 'blinkRed 2s infinite' : 'none',
                                '@keyframes blinkRed': {
                                    '0%, 50%': {
                                        borderColor: '#ef4444',
                                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)'
                                    },
                                    '25%, 75%': {
                                        borderColor: '#dc2626',
                                        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
                                    }
                                },
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: !profileCompletionStatus?.can_apply
                                        ? '0 8px 25px rgba(239, 68, 68, 0.3)'
                                        : '0 8px 25px rgba(0,0,0,0.12)',
                                    '& .company-avatar': {
                                        transform: 'scale(1.02)',
                                    },
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: isApplied(job.id)
                                        ? '#4caf50'
                                        : !profileCompletionStatus?.can_apply
                                        ? '#ef4444'
                                        : '#3b82f6',
                                },
                            }}
                                onClick={() => setExpandedJobs(prev => ({
                                    ...prev,
                                    [job.id]: !prev[job.id]
                                }))}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    {/* Compact Job Header - Always Visible */}
                                    <Box display="flex" alignItems="center" gap={3}>
                                        {/* Company Avatar */}
                                    <Box sx={{ position: 'relative' }}>
                                        <Avatar 
                                            className="company-avatar"
                                            sx={{ 
                                                width: 56, 
                                                height: 56, 
                                                background: '#3b82f6',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
                                                transition: 'all 0.3s ease',
                                                border: '2px solid #ffffff',
                                                color: 'white'
                                            }}
                                        >
                                            {getCompanyInitials(job.company)}
                                        </Avatar>

                                    </Box>

                                        {/* Job Title and Company */}
                                    <Box flex={1} minWidth={0}>
                                                    <Typography 
                                                        variant="h6" 
                                                        sx={{ 
                                                            fontWeight: 600, 
                                                            color: '#1f2937', 
                                                            lineHeight: 1.3, 
                                                            fontSize: { xs: '1rem', sm: '1.2rem' },
                                                            mb: 0.5
                                                        }}
                                                    >
                                                        {job.title}
                                                    </Typography>
                                                <Typography 
                                                    variant="body1" 
                                                    sx={{ 
                                                        fontWeight: 500, 
                                                        fontSize: '0.95rem',
                                                        color: '#6b7280',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1
                                                    }}
                                                >
                                                    <BusinessIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                                                    {job.company}
                                                </Typography>
                                            </Box>

                                        {/* Quick Info Chips */}
                                        <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                                            <Chip 
                                                label={job.location} 
                                                size="small"
                                                icon={<LocationIcon />}
                                                sx={{ 
                                                    borderRadius: 2,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    background: 'rgba(103, 126, 234, 0.1)',
                                                    color: '#667eea',
                                                    border: '1px solid rgba(103, 126, 234, 0.2)'
                                                }}
                                            />
                                            <Chip 
                                                label={job.type} 
                                                size="small"
                                                color={getJobTypeColor(job.type)}
                                                sx={{ 
                                                    borderRadius: 2,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600
                                                }}
                                            />

                                        </Box>

                                        {/* Apply Button */}
                                        {!isApplied(job.id) ? (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<ApplyIcon />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleApply(job);
                                                }}
                                                disabled={!profileCompletionStatus?.can_apply}
                                                sx={{ 
                                                    borderRadius: 2, 
                                                    px: 3, 
                                                    py: 1,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    fontSize: '0.875rem',
                                                    background: profileCompletionStatus?.can_apply
                                                        ? '#3b82f6'
                                                        : '#9ca3af',
                                                    boxShadow: profileCompletionStatus?.can_apply
                                                        ? '0 2px 8px rgba(59, 130, 246, 0.3)' 
                                                        : 'none',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: profileCompletionStatus?.can_apply ? 'translateY(-1px)' : 'none',
                                                        boxShadow: profileCompletionStatus?.can_apply
                                                            ? '0 4px 12px rgba(59, 130, 246, 0.4)' 
                                                            : 'none',
                                                    },
                                                    '&:disabled': {
                                                        background: '#9ca3af',
                                                        color: '#ffffff'
                                                    }
                                                }}
                                            >
                                                {!profileCompletionStatus?.can_apply ? 'Complete Profile' : 'Apply'}
                                            </Button>
                                        ) : (
                                            <Chip 
                                                label={getStatusDisplayText(getApplicationStatus(job.id))} 
                                                size="small"
                                                color={getStatusColor(getApplicationStatus(job.id))}
                                                sx={{ 
                                                    borderRadius: 2,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    background: getApplicationStatus(job.id) === 'selected' 
                                                        ? '#4caf50'
                                                        : getApplicationStatus(job.id) === 'rejected'
                                                        ? '#f44336'
                                                        : getApplicationStatus(job.id) === 'shortlisted'
                                                        ? '#2196f3'
                                                        : getApplicationStatus(job.id) === 'interview_scheduled'
                                                        ? '#00bcd4'
                                                        : getApplicationStatus(job.id) === 'interviewed'
                                                        ? '#ff9800'
                                                        : '#4caf50',
                                                    color: 'white'
                                                }}
                                            />
                                        )}

                                        {/* Expand/Collapse Icon */}
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            background: '#f3f4f6',
                                            transition: 'all 0.3s ease',
                                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                background: '#e5e7eb'
                                            }
                                        }}>
                                            <ArrowIcon sx={{ color: '#6b7280', fontSize: 16 }} />
                                        </Box>
                                        </Box>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                                            {/* Clean Job Overview Section */}
                                            <Grid container spacing={3} mb={4}>
                                                {/* Job Details Grid */}
                                                <Grid item xs={12} md={6}>
                                            <Card sx={{ 
                                                borderRadius: 3, 
                                                        background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                                                        border: '1px solid rgba(103, 126, 234, 0.1)',
                                                        height: '100%'
                                                    }}>
                                                        <CardContent sx={{ p: 3 }}>
                                                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#667eea', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                💰 Compensation & Benefits
                                                            </Typography>
                                                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                                                <MoneyIcon sx={{ fontSize: 20, color: '#667eea' }} />
                                                                <Typography variant="body1" fontWeight={600} sx={{ color: '#667eea' }}>
                                                            {job.salary}
                                                        </Typography>
                                                    </Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Competitive salary package with benefits
                                                            </Typography>
                                                </CardContent>
                                            </Card>
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                            <Card sx={{ 
                                                borderRadius: 3, 
                                                        background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, rgba(255, 193, 7, 0.05) 100%)',
                                                        border: '1px solid rgba(255, 152, 0, 0.1)',
                                                        height: '100%'
                                                    }}>
                                                        <CardContent sx={{ p: 3 }}>
                                                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#ff9800', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                📈 Experience Level
                                                            </Typography>
                                                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                                                <TrendingIcon sx={{ fontSize: 20, color: '#ff9800' }} />
                                                                <Typography variant="body1" fontWeight={600} sx={{ color: '#ff9800' }}>
                                                            {job.experience}
                                                        </Typography>
                                                    </Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Experience required for this role
                                                            </Typography>
                                                </CardContent>
                                            </Card>
                                                </Grid>
                                        
                                                {/* Job Timeline */}
                                                <Grid item xs={12}>
                                        <Card sx={{ 
                                            borderRadius: 3,
                                                        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.05) 100%)',
                                                        border: '1px solid rgba(76, 175, 80, 0.1)'
                                                    }}>
                                                        <CardContent sx={{ p: 3 }}>
                                                            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#4caf50', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                📅 Important Dates
                                                            </Typography>
                                                            <Grid container spacing={3}>
                                                                <Grid item xs={12} md={6}>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Box sx={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '50%',
                                                                            background: 'rgba(103, 126, 234, 0.1)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                                            <TimeIcon sx={{ fontSize: 16, color: '#667eea' }} />
                                                    </Box>
                                                    <Box>
                                                                            <Typography variant="body2" fontWeight={600} sx={{ color: '#667eea' }}>
                                                                                Posted Date
                                                        </Typography>
                                                                            <Typography variant="body1" fontWeight={700}>
                                                                                {job.postedDate}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </Grid>
                                                                {job.deadline !== 'N/A' && (
                                                                    <Grid item xs={12} md={6}>
                                                                        <Box display="flex" alignItems="center" gap={2}>
                                                                            <Box sx={{
                                                                                width: 32,
                                                                                height: 32,
                                                                                borderRadius: '50%',
                                                                                background: 'rgba(255, 152, 0, 0.1)',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center'
                                                                            }}>
                                                                                <ViewIcon sx={{ fontSize: 16, color: '#ff9800' }} />
                                                                            </Box>
                                                                            <Box>
                                                                                <Typography variant="body2" fontWeight={600} sx={{ color: '#ff9800' }}>
                                                                                    Application Deadline
                                                                                </Typography>
                                                                                <Typography variant="body1" fontWeight={700}>
                                                                                    {job.deadline}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                                    </Grid>
                                                                )}
                                                            </Grid>
                                            </CardContent>
                                        </Card>
                                                </Grid>
                                            </Grid>

                                            {/* Job Description Section */}
                                            <Card sx={{ mb: 4, borderRadius: 3 }}>
                                                <CardContent sx={{ p: 4 }}>
                                                    <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: '#667eea', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        📝 Job Description
                                                    </Typography>
                                        <JobDescription description={job.description} />
                                                </CardContent>
                                            </Card>

                                            {/* Skills Required Section */}
                                        {job.requirements.length > 0 && (
                                            <Card sx={{ 
                                                    mb: 4,
                                                borderRadius: 3,
                                                background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                                                border: '1px solid rgba(103, 126, 234, 0.1)'
                                            }}>
                                                    <CardContent sx={{ p: 4 }}>
                                                        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: '#667eea', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Box sx={{
                                                                width: 40,
                                                                height: 40,
                                                            borderRadius: '50%',
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                                <StarIcon sx={{ fontSize: 20, color: 'white' }} />
                                                        </Box>
                                                            🎯 Required Skills & Technologies
                                                        </Typography>
                                                    <Box display="flex" gap={2} flexWrap="wrap">
                                                            {job.requirements.map((req, index) => (
                                                            <Card key={index} sx={{ 
                                                                borderRadius: 2,
                                                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,1) 100%)',
                                                                border: '1px solid rgba(103, 126, 234, 0.2)',
                                                                    transition: 'all 0.2s ease',
                                                                    '&:hover': {
                                                                        transform: 'translateY(-2px)',
                                                                        boxShadow: '0 4px 12px rgba(103, 126, 234, 0.2)'
                                                                    }
                                                                }}>
                                                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                                    <Typography variant="body2" fontWeight={600} sx={{ color: '#667eea' }}>
                                                                        {req}
                                                                    </Typography>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        )}

                                            {/* Action Section */}
                                        <Card sx={{ 
                                            borderRadius: 3,
                                                background: 'linear-gradient(135deg, rgba(248, 249, 250, 0.9) 0%, rgba(255, 255, 255, 1) 100%)',
                                            border: '1px solid rgba(0,0,0,0.05)'
                                        }}>
                                                <CardContent sx={{ p: 4 }}>
                                                    <Box display="flex" justifyContent="center" alignItems="center">
                                                        {!isApplied(job.id) ? (
                                                            <Button
                                                                variant="contained"
                                                                size="large"
                                                                startIcon={<ApplyIcon />}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleApply(job);
                                                                }}
                                                                disabled={!profileCompletionStatus?.can_apply}
                                                                sx={{ 
                                                                    borderRadius: 4, 
                                                                    px: 6, 
                                                                    py: 2,
                                                                    textTransform: 'none',
                                                                    fontWeight: 800,
                                                                    fontSize: '1.2rem',
                                                                    background: profileCompletionStatus?.can_apply
                                                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                                        : 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                                                                    boxShadow: profileCompletionStatus?.can_apply
                                                                        ? '0 8px 24px rgba(103, 126, 234, 0.3)' 
                                                                        : 'none',
                                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                    '&:hover': {
                                                                        transform: profileCompletionStatus?.can_apply ? 'translateY(-3px)' : 'none',
                                                                        boxShadow: profileCompletionStatus?.can_apply
                                                                            ? '0 12px 32px rgba(103, 126, 234, 0.4)' 
                                                                            : 'none',
                                                                    },
                                                                    '&:disabled': {
                                                                        background: 'rgba(0,0,0,0.12)',
                                                                        color: 'rgba(0,0,0,0.26)'
                                                                    }
                                                                }}
                                                            >
                                                                {!profileCompletionStatus?.can_apply ? '📝 Complete Profile' : 
                                                                 '🚀 Apply Now'}
                                                            </Button>
                                                        ) : (
                                                            (() => {
                                                                const status = getApplicationStatus(job.id);
                                                                const statusColor = getStatusColor(status);
                                                                const statusText = getStatusDisplayText(status);
                                                                const applicationData = getApplicationData(job.id);
                                                                
                                                                return (
                                                                    <Card sx={{
                                                                        background: status === 'selected' 
                                                                            ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
                                                                            : status === 'rejected'
                                                                            ? 'linear-gradient(135deg, #f44336 0%, #e57373 100%)'
                                                                            : status === 'shortlisted'
                                                                            ? 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)'
                                                                            : status === 'interview_scheduled'
                                                                            ? 'linear-gradient(135deg, #00bcd4 0%, #4dd0e1 100%)'
                                                                            : status === 'interviewed'
                                                                            ? 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)'
                                                                            : 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                                                                        color: 'white',
                                                                        borderRadius: 4,
                                                                        boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
                                                                        px: 4,
                                                                        py: 2
                                                                    }}>
                                                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                                            <Box display="flex" alignItems="center" gap={3}>
                                                                                <Box sx={{
                                                                                    width: 40,
                                                                                    height: 40,
                                                                                    borderRadius: '50%',
                                                                                    background: 'rgba(255,255,255,0.2)',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center'
                                                                                }}>
                                                                                    {status === 'selected' ? (
                                                                                        <CheckCircleIcon sx={{ fontSize: 24 }} />
                                                                                    ) : status === 'rejected' ? (
                                                                                        <CancelIcon sx={{ fontSize: 24 }} />
                                                                                    ) : (
                                                                                        <CheckCircleIcon sx={{ fontSize: 24 }} />
                                                                                    )}
                                                                                </Box>
                                                                                <Box>
                                                                                    <Typography variant="h6" fontWeight={800}>
                                                                                        {status === 'selected' ? '🎉 ' : status === 'rejected' ? '❌ ' : '✅ '}
                                                                                        {statusText}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                                                        {status === 'selected' 
                                                                                            ? 'Congratulations! You have been selected for this position.'
                                                                                            : status === 'rejected'
                                                                                            ? 'Thank you for your interest. Keep applying for other opportunities!'
                                                                                            : status === 'shortlisted'
                                                                                            ? 'Great news! You have been shortlisted. We will contact you soon.'
                                                                                            : status === 'interview_scheduled'
                                                                                            ? 'Your interview has been scheduled. Check your email for details.'
                                                                                            : status === 'interviewed'
                                                                                            ? 'Thank you for attending the interview. We will get back to you soon.'
                                                                                            : 'You\'ll hear back soon! Check your email for updates.'}
                                                                                    </Typography>
                                                                                    
                                                                                    {/* Show rejection comments if status is rejected and comments exist */}
                                                                                    {status === 'rejected' && applicationData?.rejection_reason && (
                                                                                        <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                                                                                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                                                                                📝 Feedback from Placement Team:
                                                                                            </Typography>
                                                                                            <Typography variant="body2" sx={{ opacity: 0.9, fontStyle: 'italic' }}>
                                                                                                "{applicationData.rejection_reason}"
                                                                                            </Typography>
                                                                                        </Box>
                                                                                    )}
                                                                                </Box>
                                                                            </Box>
                                                                        </CardContent>
                                                                    </Card>
                                                                );
                                                            })()
                                                        )}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                    )}
                            </CardContent>
                        </Card>
                    </Grid>
                    );
                })}
            </Grid>

            {filteredJobs.length === 0 && (
                <Card sx={{ 
                    mt: 4, 
                    borderRadius: 5, 
                    textAlign: 'center', 
                    py: 8,
                    background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                    border: '1px solid rgba(103, 126, 234, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 150,
                        height: 150,
                        background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        borderRadius: '50%'
                    }
                }}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={3} sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 32px rgba(103, 126, 234, 0.3)',
                            mb: 2
                        }}>
                            <WorkIcon sx={{ fontSize: 60, color: 'white' }} />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                                🔍 No Jobs Found
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                                We couldn't find any opportunities matching your search
                            </Typography>
                        </Box>
                        <Box sx={{ maxWidth: 400 }}>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                Try adjusting your search filters, or check back later as we're constantly adding new exciting opportunities that match your skills!
                            </Typography>
                        </Box>
                        <Card sx={{
                            mt: 2,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,1) 100%)',
                            border: '1px solid rgba(103, 126, 234, 0.2)'
                        }}>
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="body2" fontWeight={600} sx={{ color: '#667eea' }}>
                                    💡 Tip: Clear all filters to see all available positions
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Card>
            )}

            {/* Enhanced Apply Dialog */}
            <Dialog 
                open={applyDialogOpen} 
                onClose={() => !applyingJob && setApplyDialogOpen(false)} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <ApplyIcon />
                        </Avatar>
                        <Typography variant="h6">
                            Apply for {selectedJob?.title}
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box mb={3}>
                        <Typography variant="body1" paragraph>
                            Are you sure you want to apply for the <strong>{selectedJob?.title}</strong> position at <strong>{selectedJob?.company}</strong>?
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Your resume and profile information will be shared with the company for this application.
                        </Typography>
                    </Box>
                    
                    <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" gutterBottom color="primary">
                            Application Summary:
                        </Typography>
                        <Box display="flex" gap={2} flexWrap="wrap">
                            <Chip label={selectedJob?.location} size="small" />
                            <Chip label={selectedJob?.type} size="small" />
                            <Chip label={selectedJob?.salary} size="small" />
                        </Box>
                    </Card>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                        onClick={() => setApplyDialogOpen(false)}
                        disabled={applyingJob}
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={confirmApply} 
                        variant="contained"
                        disabled={applyingJob}
                        startIcon={applyingJob ? <CircularProgress size={16} color="inherit" /> : <ApplyIcon />}
                        sx={{ 
                            borderRadius: 2, 
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        {applyingJob ? 'Submitting...' : 'Confirm Application'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success/Error Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default JobBoard; 