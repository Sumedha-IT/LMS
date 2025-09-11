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
import RichTextDisplay from '../common/RichTextDisplay';

// JobDescription component for displaying full job descriptions
const JobDescription = ({ description }) => {
    if (!description) return null;
    return (
        <RichTextDisplay 
            content={description} 
            sx={{ 
                color: 'text.secondary',
                fontSize: '0.875rem',
                lineHeight: 1.6 
            }} 
        />
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

    // Real API call for job postings - only fetch when student course is loaded
    const { data: jobPostings, isLoading: loading, error } = useGetJobPostingsQuery(
        studentCourse ? { student_course: studentCourse.name } : null,
        { skip: !studentCourse }
    );

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
        let isEligible = false; // Default to false, must explicitly match
        let eligibleCourses = null; // Initialize eligibleCourses variable
        
        // Only show jobs if student course is loaded
        if (studentCourse) {
            // Handle eligible_courses field - could be array, JSON string, or null
            eligibleCourses = job.eligible_courses;
            if (typeof eligibleCourses === 'string') {
                try {
                    eligibleCourses = JSON.parse(eligibleCourses);
                } catch (e) {
                    eligibleCourses = null;
                }
            }
            
            // Check eligible_courses field first (new multiple course selection)
            if (eligibleCourses && Array.isArray(eligibleCourses) && eligibleCourses.length > 0) {
                isEligible = eligibleCourses.includes(studentCourse.name);
            }
            // Fallback to old course_id field for backward compatibility
            else if (job.course_id) {
                isEligible = job.course_id === studentCourse.id;
            }
            // If no course restrictions specified, don't show the job (safer approach)
            else {
                isEligible = false;
            }
        } else {
            // Student course not loaded yet, no jobs will be shown
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
            requirements: job.requirements || '',
            postedDate: job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A',
            deadline: job.application_deadline ? formatDateToDMY(job.application_deadline) : 'N/A',
            domain: 'Computer Science', // Default domain
            course_id: job.course_id,
            course_name: eligibleCourses && Array.isArray(eligibleCourses) && eligibleCourses.length > 0 
                        ? eligibleCourses.join(', ') 
                        : (job.course?.name || 'Any Course'),
            // Additional fields for comprehensive job details
            vacancies: job.vacancies || 'N/A',
            salary_min: job.salary_min || 'N/A',
            salary_max: job.salary_max || 'N/A',
            btech_percentage_min: job.btech_percentage_min || 'N/A',
            mtech_percentage_min: job.mtech_percentage_min || 'N/A',
            btech_year_min: job.btech_year_min || 'N/A',
            btech_year_max: job.btech_year_max || 'N/A',
            mtech_year_min: job.mtech_year_min || 'N/A',
            mtech_year_max: job.mtech_year_max || 'N/A',
            backlogs_allowed: job.backlogs_allowed ? 'Yes' : 'No',
            mandatory_documents: job.mandatory_original_documents ? 'Yes' : 'No',
            specializations: job.specializations || 'N/A',
            additional_criteria: job.additional_criteria || 'N/A',
            recruitment_mode: job.mode_of_recruitment || 'N/A',
            interview_mode: job.interview_mode || 'N/A',
            interview_date: job.interview_date ? formatDateToDMY(job.interview_date) : 'N/A',
            recruitment_steps: job.recruitment_process_steps || 'N/A',
            venue_link: job.venue_link || 'N/A',
            bond_details: job.bond_service_agreement || 'N/A',
            training_period_stipend: job.training_period_stipend || 'N/A',
            status: job.status || 'Open',
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
                            {loadingStudentCourse ? 'Loading course information...' : 
                             loading ? 'Loading job opportunities...' :
                             filteredJobs.length === 0 ? 'No opportunities available for your course' :
                             `${filteredJobs.length} ${filteredJobs.length === 1 ? 'opportunity' : 'opportunities'} available`}
                        </Typography>
                        

                    </Box>
                    
                    {/* Quick Stats Cards */}
                    <Grid container spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                        <Grid item>
                            <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)', color: 'white', minWidth: 120 }}>
                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        {loadingStudentCourse ? '...' : (loading ? '...' : jobs.length)}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                        {loadingStudentCourse ? 'Loading Course...' : (loading ? 'Loading Jobs...' : 'Available Jobs')}
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
            {loadingStudentCourse ? (
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    py: 8,
                    textAlign: 'center'
                }}>
                    <CircularProgress size={60} sx={{ mb: 2, color: '#667eea' }} />
                    <Typography variant="h6" color="text.secondary">
                        Loading your course information...
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        This helps us show only relevant job opportunities
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredJobs.map((job) => {
                    const isExpanded = expandedJobs[job.id] || false;
                    
                    return (
                    <Grid item xs={12} key={job.id}>
                        <Card 
                            sx={{ 
                                borderRadius: 4, 
                                boxShadow: isApplied(job.id) 
                                    ? '0 8px 32px rgba(76, 175, 80, 0.12)' 
                                    : !profileCompletionStatus?.can_apply
                                    ? '0 4px 16px rgba(239, 68, 68, 0.15)'
                                    : '0 4px 16px rgba(0,0,0,0.06)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                border: isApplied(job.id) 
                                    ? '2px solid #4caf50' 
                                    : !profileCompletionStatus?.can_apply
                                    ? '2px solid #ef4444'
                                    : '1px solid #f1f5f9',
                                background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                mb: 3,
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: isApplied(job.id)
                                        ? '0 12px 40px rgba(76, 175, 80, 0.2)'
                                        : !profileCompletionStatus?.can_apply
                                        ? '0 8px 32px rgba(239, 68, 68, 0.25)'
                                        : '0 12px 40px rgba(0,0,0,0.1)',
                                    '& .company-avatar': {
                                        transform: 'scale(1.05)',
                                    },
                                    '& .job-title': {
                                        color: '#3b82f6',
                                    }
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: isApplied(job.id)
                                        ? 'linear-gradient(90deg, #4caf50, #66bb6a)'
                                        : !profileCompletionStatus?.can_apply
                                        ? 'linear-gradient(90deg, #ef4444, #f87171)'
                                        : 'linear-gradient(90deg, #3b82f6, #60a5fa)',
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
                                                        className="job-title"
                                                        sx={{ 
                                                            fontWeight: 600, 
                                                            color: '#1f2937', 
                                                            lineHeight: 1.3, 
                                                            fontSize: { xs: '1rem', sm: '1.2rem' },
                                                            mb: 0.5,
                                                            transition: 'color 0.3s ease'
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
                                            {/* Job Overview Section */}
                                            <Box sx={{ 
                                                backgroundColor: 'white', 
                                                borderRadius: 3, 
                                                p: 4, 
                                                mb: 4,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                border: '1px solid #e0e0e0'
                                            }}>
                                                <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: '#333', borderBottom: '2px solid #1976d2', pb: 1 }}>
                                                    Job Overview
                                                </Typography>
                                                
                                                <Grid container spacing={3}>
                                                    {/* Company & Job Type */}
                                                    <Grid item xs={12} md={6}>
                                                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Typography variant="h6" fontWeight={600} sx={{ color: '#1976d2', minWidth: '120px' }}>
                                                                Company:
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ color: '#555' }}>
                                                                {job.company}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Typography variant="h6" fontWeight={600} sx={{ color: '#1976d2', minWidth: '120px' }}>
                                                                Job Type:
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ color: '#555' }}>
                                                                {job.type}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>

                                                    {/* Location & Experience */}
                                                    <Grid item xs={12} md={6}>
                                                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Typography variant="h6" fontWeight={600} sx={{ color: '#1976d2', minWidth: '160px' }}>
                                                                Location:
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ color: '#555' }}>
                                                                {job.location}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Typography variant="h6" fontWeight={600} sx={{ color: '#1976d2', minWidth: '160px' }}>
                                                                Experience Required:
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ color: '#555' }}>
                                                                {job.experience}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>

                                                    {/* Salary & Compensation */}
                                                    <Grid item xs={12} sm={6}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                            <Typography variant="h6" fontWeight={600} sx={{ color: '#1976d2', minWidth: '120px' }}>
                                                                Salary:
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ color: '#555' }}>
                                                                {job.salary}
                                                            </Typography>
                                                        </Box>
                                                        {(job.salary_min !== 'N/A' || job.salary_max !== 'N/A') && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                <Typography variant="body2" fontWeight={500} sx={{ color: '#666', minWidth: '120px' }}>
                                                                    Range:
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ color: '#555' }}>
                                                                    ₹{job.salary_min}L - ₹{job.salary_max}L
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                        {job.vacancies !== 'N/A' && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                <Typography variant="body2" fontWeight={500} sx={{ color: '#666', minWidth: '120px' }}>
                                                                    Vacancies:
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ color: '#555' }}>
                                                                    {job.vacancies}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Grid>

                                                    {/* Important Dates */}
                                                    <Grid item xs={12}>
                                                        <Box sx={{ mb: 2 }}>
                                                            <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#1976d2' }}>
                                                                Important Dates:
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ pl: 2, color: '#555' }}>
                                                                Posted: {job.postedDate}
                                                            </Typography>
                                                            {job.deadline !== 'N/A' && (
                                                                <Typography variant="body1" sx={{ pl: 2, color: '#d32f2f', mt: 1, fontWeight: 600 }}>
                                                                    Application Deadline: {job.deadline}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>

                                            {/* Job Description & Requirements Section */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: '#333', borderBottom: '2px solid #667eea', pb: 1 }}>
                                    Job Description & Requirements
                                </Typography>
                                <Box sx={{ pl: 2 }}>
                                    <JobDescription description={job.description} />
                                    {job.requirements && (
                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#667eea' }}>
                                                Required Skills & Technologies:
                                            </Typography>
                                            <RichTextDisplay 
                                                content={job.requirements} 
                                                sx={{ 
                                                    pl: 2, 
                                                    lineHeight: 1.6, 
                                                    color: '#555',
                                                    fontSize: '1rem'
                                                }} 
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                            {/* Eligibility Criteria Section */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: '#333', borderBottom: '2px solid #4caf50', pb: 1 }}>
                                    Eligibility Criteria
                                </Typography>
                                <Box sx={{ pl: 2 }}>
                                    {/* B.Tech Requirements */}
                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#4caf50' }}>
                                        B.Tech Requirements:
                                    </Typography>
                                    <Box sx={{ pl: 2, mb: 2 }}>
                                        {job.btech_percentage_min !== 'N/A' && (
                                            <Typography variant="body1" sx={{ mb: 0.5, color: '#555' }}>
                                                • Minimum Percentage: {job.btech_percentage_min}%
                                            </Typography>
                                        )}
                                        {(job.btech_year_min !== 'N/A' || job.btech_year_max !== 'N/A') && (
                                            <Typography variant="body1" sx={{ mb: 0.5, color: '#555' }}>
                                                • Year of Passout: {job.btech_year_min} - {job.btech_year_max}
                                            </Typography>
                                        )}
                                    </Box>
                                    
                                    {/* M.Tech Requirements */}
                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#4caf50' }}>
                                        M.Tech Requirements:
                                    </Typography>
                                    <Box sx={{ pl: 2, mb: 2 }}>
                                        {job.mtech_percentage_min !== 'N/A' && (
                                            <Typography variant="body1" sx={{ mb: 0.5, color: '#555' }}>
                                                • Minimum Percentage: {job.mtech_percentage_min}%
                                            </Typography>
                                        )}
                                        {(job.mtech_year_min !== 'N/A' || job.mtech_year_max !== 'N/A') && (
                                            <Typography variant="body1" sx={{ mb: 0.5, color: '#555' }}>
                                                • Year of Passout: {job.mtech_year_min} - {job.mtech_year_max}
                                            </Typography>
                                        )}
                                    </Box>
                                    
                                    {/* Additional Requirements */}
                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#4caf50' }}>
                                        Additional Requirements:
                                    </Typography>
                                    <Box sx={{ pl: 2 }}>
                                        <Typography variant="body1" sx={{ mb: 0.5, color: '#555' }}>
                                            • Backlogs Allowed: {job.backlogs_allowed}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 0.5, color: '#555' }}>
                                            • Mandatory Original Documents: {job.mandatory_documents}
                                        </Typography>
                                        {job.specializations && job.specializations !== 'N/A' && (
                                            <Typography variant="body1" sx={{ mb: 0.5, color: '#555' }}>
                                                • Specializations: {job.specializations}
                                            </Typography>
                                        )}
                                        {job.additional_criteria && job.additional_criteria !== 'N/A' && (
                                            <Typography variant="body1" sx={{ mb: 0.5, color: '#555' }}>
                                                • Additional Criteria: {job.additional_criteria}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Box>

                            {/* Eligible Courses Section */}
                            {job.course_name && job.course_name !== 'N/A' && job.course_name !== 'Any Course' && (
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: '#333', borderBottom: '2px solid #2196f3', pb: 1 }}>
                                        Eligible Courses
                                    </Typography>
                                    <Typography variant="body1" sx={{ pl: 2, lineHeight: 1.6, color: '#555' }}>
                                        {job.course_name}
                                    </Typography>
                                </Box>
                            )}

                            {/* Recruitment Process Section */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: '#333', borderBottom: '2px solid #ff9800', pb: 1 }}>
                                    Recruitment Process
                                </Typography>
                                <Box sx={{ pl: 2 }}>
                                    {job.recruitment_mode && job.recruitment_mode !== 'N/A' && (
                                        <Typography variant="body1" sx={{ mb: 0.5, color: '#555' }}>
                                            • Mode of Recruitment: {job.recruitment_mode}
                                        </Typography>
                                    )}
                                    {job.interview_mode && job.interview_mode !== 'N/A' && (
                                        <Typography variant="body1" sx={{ mb: 0.5, color: '#555' }}>
                                            • Interview Mode: {job.interview_mode}
                                        </Typography>
                                    )}
                                    {job.interview_date && job.interview_date !== 'N/A' && (
                                        <Typography variant="body1" sx={{ mb: 0.5, color: '#555' }}>
                                            • Interview Date: {job.interview_date}
                                        </Typography>
                                    )}
                                    {job.recruitment_steps && job.recruitment_steps !== 'N/A' && (
                                        <Typography variant="body1" sx={{ mb: 0.5, color: '#555' }}>
                                            • Process Steps: {job.recruitment_steps}
                                        </Typography>
                                    )}
                                    {job.venue_link && job.venue_link !== 'N/A' && (
                                        <Typography variant="body1" sx={{ mb: 0.5, color: '#555' }}>
                                            • Venue / Link: {job.venue_link}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>

                            {/* Additional Information Section */}
                            {(job.bond_details && job.bond_details !== 'N/A') || 
                             (job.training_period_stipend && job.training_period_stipend !== 'N/A') || 
                             (job.additional_criteria && job.additional_criteria !== 'N/A') ? (
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: '#333', borderBottom: '2px solid #9c27b0', pb: 1 }}>
                                        Additional Information
                                    </Typography>
                                    <Box sx={{ pl: 2 }}>
                                        {job.bond_details && job.bond_details !== 'N/A' && (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#9c27b0' }}>
                                                    Bond / Service Agreement Details:
                                                </Typography>
                                                <Typography variant="body1" sx={{ pl: 2, lineHeight: 1.6, color: '#555' }}>
                                                    {job.bond_details}
                                                </Typography>
                                            </Box>
                                        )}
                                        {job.training_period_stipend && job.training_period_stipend !== 'N/A' && (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#9c27b0' }}>
                                                    Training Period Stipend:
                                                </Typography>
                                                <Typography variant="body1" sx={{ pl: 2, lineHeight: 1.6, color: '#555' }}>
                                                    ₹{job.training_period_stipend}
                                                </Typography>
                                            </Box>
                                        )}
                                        {job.additional_criteria && job.additional_criteria !== 'N/A' && (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#9c27b0' }}>
                                                    Additional Criteria:
                                                </Typography>
                                                <Typography variant="body1" sx={{ pl: 2, lineHeight: 1.6, color: '#555' }}>
                                                    {job.additional_criteria}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            ) : null}



                                            {/* Action Section */}
                                            <Box sx={{ 
                                                backgroundColor: 'white', 
                                                borderRadius: 3, 
                                                p: 4, 
                                                mb: 4,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                border: '1px solid #e0e0e0'
                                            }}>
                                                <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: '#333', borderBottom: '2px solid #4caf50', pb: 1 }}>
                                                    Apply for this Position
                                                </Typography>
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
                                            </Box>
                                    </Box>
                                    )}
                            </CardContent>
                        </Card>
                    </Grid>
                    );
                })}
                </Grid>
            )}

            {filteredJobs.length === 0 && !loading && (
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
                                {jobs.length === 0 ? '🎯 No Jobs for Your Course' : '🔍 No Jobs Found'}
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                                {jobs.length === 0 ? 
                                    'No job opportunities are currently available for your course' :
                                    'We couldn\'t find any opportunities matching your search'
                                }
                            </Typography>
                        </Box>
                        <Box sx={{ maxWidth: 400 }}>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                {jobs.length === 0 ? 
                                    'Jobs are filtered based on your enrolled course. Check back later for new opportunities that match your qualifications!' :
                                    'Try adjusting your search filters, or check back later as we\'re constantly adding new exciting opportunities that match your skills!'
                                }
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
                                    {jobs.length === 0 ? 
                                        '💡 Tip: Jobs are automatically filtered by your course eligibility' :
                                        '💡 Tip: Clear all filters to see all available positions'
                                    }
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