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
                    const appliedJobIds = applicationsResponse.data.data.map(app => app.job_posting_id);
                    setAppliedJobs(appliedJobIds);
                    setJobApplications(applicationsResponse.data.data);
                }
            } catch (err) {
                console.error('Error fetching student data:', err);
            } finally {
                setLoadingStudentCourse(false);
            }
        };

        getStudentData();
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
        const isEligible = !job.course_id || (studentCourse && job.course_id === studentCourse.id);
        
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
            course_name: job.course?.name || 'Any Course',
            isEligible: isEligible
        };
    }) : [];

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !jobType || job.type === jobType;
        const matchesLocation = !location || job.location === location;
        
        return matchesSearch && matchesType && matchesLocation;
    });

    const handleApply = (job) => {
        if (!job.isEligible) {
            return; // Don't allow applying for ineligible jobs
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
                
                if (err.response?.status === 409) {
                    errorMessage = 'You have already applied for this job.';
                } else if (err.response?.status === 401) {
                    errorMessage = 'Please log in again to apply for jobs.';
                } else if (err.response?.status === 403) {
                    errorMessage = 'You are not eligible to apply for this job.';
                } else if (err.response?.status === 422) {
                    errorMessage = 'Invalid application data. Please check your information.';
                } else if (err.response?.status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
                
                setSnackbar({
                    open: true,
                    message: errorMessage,
                    severity: 'error'
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
                                        {filteredJobs.length}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                        Total Jobs
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card sx={{ borderRadius: 3, background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)', color: 'white', minWidth: 120 }}>
                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        {appliedJobs.length}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                        Applied
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
                
                {/* Course Information Card */}
                {studentCourse && (
                    <Card sx={{ 
                        mb: 3, 
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.05) 0%, rgba(67, 160, 71, 0.05) 100%)',
                        border: '1px solid rgba(76, 175, 80, 0.2)',
                        overflow: 'hidden'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box display="flex" alignItems="center" gap={3}>
                                <Box sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 20px rgba(235, 103, 7, 0.3)'
                                }}>
                                    <CheckCircleIcon sx={{ color: 'white', fontSize: 28 }} />
                                </Box>
                                <Box flex={1}>
                                    <Typography variant="h6" fontWeight={700} sx={{ color: '#0f1f3d', mb: 0.5 }}>
                                        ✨ Enrolled in: {studentCourse.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                        You're eligible for jobs matching your course or open to all students. 
                                        Keep building your skills to unlock more opportunities! 🎯
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                )}
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
                                    borderRadius: 4, 
                                boxShadow: isApplied(job.id) 
                                    ? '0 8px 32px rgba(76, 175, 80, 0.15)' 
                                    : '0 4px 24px rgba(0,0,0,0.05)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                border: isApplied(job.id) 
                                    ? '2px solid #4caf50' 
                                    : '1px solid rgba(0,0,0,0.06)',
                                background: isApplied(job.id)
                                    ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.02) 0%, rgba(129, 199, 132, 0.02) 100%)'
                                    : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,1) 100%)',
                                position: 'relative',
                                overflow: 'hidden',
                                    cursor: 'pointer',
                                '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                    '& .company-avatar': {
                                            transform: 'scale(1.05)',
                                    },
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: job.isEligible 
                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                        : 'linear-gradient(135deg, #ff9a56 0%, #f44336 100%)',
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
                                                    width: 60, 
                                                    height: 60, 
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    fontSize: '1.2rem',
                                                fontWeight: 800,
                                                    boxShadow: '0 4px 16px rgba(103, 126, 234, 0.25)',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    border: '2px solid rgba(255,255,255,0.9)',
                                                color: 'white'
                                            }}
                                        >
                                            {getCompanyInitials(job.company)}
                                        </Avatar>
                                        {/* Status indicator */}
                                        <Box sx={{
                                            position: 'absolute',
                                            bottom: -2,
                                            right: -2,
                                                width: 20,
                                                height: 20,
                                            borderRadius: '50%',
                                            background: job.isEligible ? '#4caf50' : '#f44336',
                                                border: '2px solid white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                                        }}>
                                            {job.isEligible ? 
                                                    <CheckCircleIcon sx={{ fontSize: 10, color: 'white' }} /> :
                                                    <CancelIcon sx={{ fontSize: 10, color: 'white' }} />
                                            }
                                        </Box>
                                    </Box>

                                        {/* Job Title and Company */}
                                    <Box flex={1} minWidth={0}>
                                                    <Typography 
                                                variant="h6" 
                                                        sx={{ 
                                                    fontWeight: 700, 
                                                            color: 'text.primary', 
                                                            lineHeight: 1.2, 
                                                    fontSize: { xs: '1.1rem', sm: '1.3rem' },
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            backgroundClip: 'text',
                                                            WebkitBackgroundClip: 'text',
                                                            WebkitTextFillColor: 'transparent',
                                                    display: 'inline-block',
                                                    mb: 0.5
                                                        }}
                                                    >
                                                        {job.title}
                                                    </Typography>
                                                <Typography 
                                                variant="body1" 
                                                    color="primary" 
                                                    sx={{ 
                                                    fontWeight: 600, 
                                                    fontSize: '1rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1
                                                    }}
                                                >
                                                <BusinessIcon sx={{ fontSize: 18 }} />
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
                                            {isApplied(job.id) && (
                                                <Chip 
                                                    label={getStatusDisplayText(getApplicationStatus(job.id))} 
                                                    size="small"
                                                    icon={<CheckCircleIcon />}
                                                    color={getStatusColor(getApplicationStatus(job.id))}
                                                    sx={{ 
                                                        borderRadius: 2,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        background: getApplicationStatus(job.id) === 'selected' 
                                                            ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
                                                            : getApplicationStatus(job.id) === 'rejected'
                                                            ? 'linear-gradient(135deg, #f44336 0%, #e57373 100%)'
                                                            : getApplicationStatus(job.id) === 'shortlisted'
                                                            ? 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)'
                                                            : getApplicationStatus(job.id) === 'interview_scheduled'
                                                            ? 'linear-gradient(135deg, #00bcd4 0%, #4dd0e1 100%)'
                                                            : getApplicationStatus(job.id) === 'interviewed'
                                                            ? 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)'
                                                            : 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                                                        color: 'white'
                                                    }}
                                                />
                                            )}
                                        </Box>

                                        {/* Expand/Collapse Icon */}
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: 'rgba(103, 126, 234, 0.1)',
                                            transition: 'all 0.3s ease',
                                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                                        }}>
                                            <ArrowIcon sx={{ color: '#667eea', fontSize: 20 }} />
                                                        </Box>
                                        </Box>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                                            {/* Clean Job Overview Section */}
                                            <Grid container spacing={3} mb={4}>
                                                {/* Eligibility Status */}
                                                <Grid item xs={12}>
                                            <Card sx={{ 
                                                borderRadius: 3, 
                                                        background: job.isEligible 
                                                            ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(129, 199, 132, 0.08) 100%)'
                                                            : 'linear-gradient(135deg, rgba(244, 67, 54, 0.08) 0%, rgba(229, 115, 115, 0.08) 100%)',
                                                        border: job.isEligible 
                                                            ? '1px solid rgba(76, 175, 80, 0.2)' 
                                                            : '1px solid rgba(244, 67, 54, 0.2)'
                                                    }}>
                                                        <CardContent sx={{ p: 3 }}>
                                                            <Box display="flex" alignItems="center" gap={2}>
                                                                <Box sx={{
                                                                    width: 40,
                                                                    height: 40,
                                                                    borderRadius: '50%',
                                                                    background: job.isEligible ? '#4caf50' : '#f44336',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}>
                                                                    {job.isEligible ? 
                                                                        <CheckCircleIcon sx={{ fontSize: 20, color: 'white' }} /> :
                                                                        <CancelIcon sx={{ fontSize: 20, color: 'white' }} />
                                                                    }
                                                                </Box>
                                                                <Box>
                                                                    <Typography variant="h6" fontWeight={700} sx={{ 
                                                                        color: job.isEligible ? '#2e7d32' : '#c62828',
                                                                        mb: 0.5
                                                                    }}>
                                                                        {job.isEligible ? '✅ You are eligible for this position!' : '❌ Not eligible for this position'}
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ 
                                                                        color: job.isEligible ? '#388e3c' : '#d32f2f',
                                                                        opacity: 0.8
                                                                    }}>
                                                                        {job.isEligible 
                                                                            ? 'This job matches your course requirements'
                                                                            : 'This job requires a different course background'
                                                                        }
                                                        </Typography>
                                                                </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                                </Grid>
                                            
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
                                                                disabled={!job.isEligible}
                                                                sx={{ 
                                                                    borderRadius: 4, 
                                                                    px: 6, 
                                                                    py: 2,
                                                                    textTransform: 'none',
                                                                    fontWeight: 800,
                                                                    fontSize: '1.2rem',
                                                                    background: job.isEligible 
                                                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                                        : 'rgba(0,0,0,0.12)',
                                                                    boxShadow: job.isEligible 
                                                                        ? '0 8px 24px rgba(103, 126, 234, 0.3)' 
                                                                        : 'none',
                                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                    '&:hover': {
                                                                        transform: job.isEligible ? 'translateY(-3px)' : 'none',
                                                                        boxShadow: job.isEligible 
                                                                            ? '0 12px 32px rgba(103, 126, 234, 0.4)' 
                                                                            : 'none',
                                                                    },
                                                                    '&:disabled': {
                                                                        background: 'rgba(0,0,0,0.12)',
                                                                        color: 'rgba(0,0,0,0.26)'
                                                                    }
                                                                }}
                                                            >
                                                                {job.isEligible ? '🚀 Apply Now' : '❌ Not Eligible'}
                                                            </Button>
                                                        ) : (
                                                            (() => {
                                                                const status = getApplicationStatus(job.id);
                                                                const statusColor = getStatusColor(status);
                                                                const statusText = getStatusDisplayText(status);
                                                                
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