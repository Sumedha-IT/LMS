import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Tabs, 
    Tab, 
    Typography, 
    Paper, 
    Card, 
    CardContent,
    Grid,
    Chip,
    Button,
    Alert,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Drawer,
    Avatar,
    Divider,
    IconButton,
    Checkbox,
    FormControlLabel,
    Tooltip,
    InputAdornment
} from '@mui/material';
import { 
    Work as WorkIcon, 
    Assessment as AssessmentIcon,
    Business as BusinessIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    Group as GroupIcon,
    FilterList as FilterListIcon
} from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    useGetCompaniesQuery,
    useCreateCompanyMutation,
    useUpdateCompanyMutation,
    useDeleteCompanyMutation,
    useGetJobPostingsQuery,
    useCreateJobPostingMutation,
    useUpdateJobPostingMutation,
    useDeleteJobPostingMutation,
    useGetJobApplicationsQuery,
    useCreateJobApplicationMutation,
    useUpdateJobApplicationMutation,
    useDeleteJobApplicationMutation,
    useGetCoursesQuery
} from '../store/service/user/UserService';
import StudentDashboard from './StudentDashboard';
import axios from 'axios';
import PlacementStudents from './PlacementStudents';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`admin-placement-tabpanel-${index}`}
            aria-labelledby={`admin-placement-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `admin-placement-tab-${index}`,
        'aria-controls': `admin-placement-tabpanel-${index}`,
    };
}

const AdminPlacement = () => {
    
    const { id } = useParams();
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({ open: false, type: '', id: null });
    const [companiesSearch, setCompaniesSearch] = useState('');
    const [applicationsDialog, setApplicationsDialog] = useState({ open: false, jobId: null, jobTitle: '' });

    // Job Filters State
    const [jobFilters, setJobFilters] = useState({
        search: '',
        job_type: '',
        status: '',
        location: '',
        company_id: '',
        course_id: '',
        salary_min: '',
        salary_max: '',
        experience_required: '',
        has_vacancies: false,
        posted_date_from: '',
        posted_date_to: '',
        deadline_from: '',
        deadline_to: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    // API Hooks
    const { data: companies, isLoading: companiesLoading, refetch: refetchCompanies } = useGetCompaniesQuery();
    const { data: jobPostings, isLoading: jobPostingsLoading, refetch: refetchJobPostings } = useGetJobPostingsQuery(jobFilters);
    const { data: jobApplications, isLoading: jobApplicationsLoading, refetch: refetchJobApplications } = useGetJobApplicationsQuery();
    const { data: courses, isLoading: coursesLoading, refetch: refetchCourses } = useGetCoursesQuery();

    // Enhanced job applications with user details
    const [enhancedJobApplications, setEnhancedJobApplications] = useState([]);
    const [loadingEnhancedApplications, setLoadingEnhancedApplications] = useState(false);

    // Mutations
    const [createCompany, { isLoading: creatingCompany }] = useCreateCompanyMutation();
    const [updateCompany, { isLoading: updatingCompany }] = useUpdateCompanyMutation();
    const [deleteCompany, { isLoading: deletingCompany }] = useDeleteCompanyMutation();
    const [createJobPosting, { isLoading: creatingJobPosting }] = useCreateJobPostingMutation();
    const [updateJobPosting, { isLoading: updatingJobPosting }] = useUpdateJobPostingMutation();
    const [deleteJobPosting, { isLoading: deletingJobPosting }] = useDeleteJobPostingMutation();

    // Form states
    const [companyForm, setCompanyForm] = useState({
        name: '',
        description: '',
        website: '',
        industry: '',
        company_size: '',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        address: '',
        is_active: true
    });

    // Form validation states
    const [companyFormErrors, setCompanyFormErrors] = useState({});
    const [companyFormTouched, setCompanyFormTouched] = useState({});

    // Form validation function
    const validateCompanyForm = (form) => {
        const errors = {};
        
        // Required fields
        if (!form.name?.trim()) {
            errors.name = 'Company name is required';
        } else if (form.name.length < 2) {
            errors.name = 'Company name must be at least 2 characters';
        }

        // Email validation
        if (form.contact_email?.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.contact_email)) {
                errors.contact_email = 'Please enter a valid email address';
            }
        }

        // Website validation
        if (form.website?.trim()) {
            const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!urlRegex.test(form.website)) {
                errors.website = 'Please enter a valid website URL';
            }
        }

        // Phone validation (basic)
        if (form.contact_phone?.trim()) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(form.contact_phone.replace(/[\s\-\(\)]/g, ''))) {
                errors.contact_phone = 'Please enter a valid phone number';
            }
        }

        return errors;
    };

    // Handle form field changes with validation
    const handleCompanyFormChange = (field, value) => {
        const newForm = { ...companyForm, [field]: value };
        setCompanyForm(newForm);
        
        // Mark field as touched
        setCompanyFormTouched({ ...companyFormTouched, [field]: true });
        
        // Validate and update errors
        const errors = validateCompanyForm(newForm);
        setCompanyFormErrors(errors);
    };

    const [jobPostingForm, setJobPostingForm] = useState({
        company_id: '',
        title: '',
        course_id: '',
        description: '',
        requirements: '',
        responsibilities: '',
        job_type: 'full_time',
        location: '',
        salary_min: '',
        salary_max: '',
        experience_required: '',
        vacancies: 1,
        status: 'draft',
        application_deadline: '',
        // Eligibility Criteria fields
        btech_year_of_passout_min: '',
        btech_year_of_passout_max: '',
        mtech_year_of_passout_min: '',
        mtech_year_of_passout_max: '',
        btech_percentage_min: '',
        mtech_percentage_min: '',
        skills_required: [],
        additional_criteria: ''
    });

    useEffect(() => {
        // Calculate stats from real data
        const fetchStudentStats = async () => {
            try {
                const userInfo = localStorage.getItem('user_info') || document.cookie.split('; ').find(row => row.startsWith('user_info='))?.split('=')[1];
                const userData = JSON.parse(userInfo);
                const response = await axios.get('/api/students', {
                    headers: { 'Authorization': userData.token }
                });
                const students = response.data.data || [];
                const totalStudents = students.length;
                const eligibleStudents = students.filter(s => s.placement_status === 'Eligible').length;
                const placedStudents = students.filter(s => s.placement_status === 'Placed').length;

                const totalCompanies = companies?.length || 0;
                const activeJobs = jobPostings?.data?.filter(job => job.status === 'open').length || 0;
                setStats({
                    totalStudents,
                    eligibleStudents,
                    placedStudents,
                    activeJobs,
                    totalCompanies
                });
            } catch (err) {
                setStats({
                    totalStudents: 0,
                    eligibleStudents: 0,
                    placedStudents: 0,
                    activeJobs: jobPostings?.data?.filter(job => job.status === 'open').length || 0,
                    totalCompanies: companies?.length || 0
                });
            } finally {
                setLoading(false);
            }
        };
        if (companies && jobPostings && jobApplications) {
            fetchStudentStats();
        }
    }, [companies, jobPostings, jobApplications]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = (type, item = null) => {
        setDialogType(type);
        setSelectedItem(item);
        if (item) {
            if (type === 'company') {
                setCompanyForm(item);
            } else if (type === 'jobPosting') {
                // Merge job posting data with default eligibility criteria fields
                const defaultEligibilityFields = {
                    btech_year_of_passout_min: '',
                    btech_year_of_passout_max: '',
                    mtech_year_of_passout_min: '',
                    mtech_year_of_passout_max: '',
                    btech_percentage_min: '',
                    mtech_percentage_min: '',
                    skills_required: [],
                    additional_criteria: ''
                };
                
                // Merge the job posting data with default eligibility fields
                
                // Extract eligibility criteria data if it exists
                const eligibilityData = item.eligibilityCriteria || {};
                
                setJobPostingForm({
                    ...defaultEligibilityFields,
                    ...item,
                    // Merge eligibility criteria data
                    btech_year_of_passout_min: eligibilityData.btech_year_of_passout_min || '',
                    btech_year_of_passout_max: eligibilityData.btech_year_of_passout_max || '',
                    mtech_year_of_passout_min: eligibilityData.mtech_year_of_passout_min || '',
                    mtech_year_of_passout_max: eligibilityData.mtech_year_of_passout_max || '',
                    btech_percentage_min: eligibilityData.btech_percentage_min || '',
                    mtech_percentage_min: eligibilityData.mtech_percentage_min || '',
                    skills_required: eligibilityData.skills_required || [],
                    additional_criteria: eligibilityData.additional_criteria || ''
                });
            }
        } else {
            // Reset forms for new items
            if (type === 'company') {
                setCompanyForm({
                    name: '',
                    description: '',
                    website: '',
                    industry: '',
                    company_size: '',
                    contact_person: '',
                    contact_email: '',
                    contact_phone: '',
                    address: '',
                    is_active: true
                });
            } else if (type === 'jobPosting') {
                setJobPostingForm({
                    company_id: '',
                    title: '',
                    course_id: '',
                    description: '',
                    requirements: '',
                    responsibilities: '',
                    job_type: 'full_time',
                    location: '',
                    salary_min: '',
                    salary_max: '',
                    experience_required: '',
                    vacancies: 1,
                    status: 'draft',
                    application_deadline: '',
                    // Eligibility Criteria fields
                    btech_year_of_passout_min: '',
                    btech_year_of_passout_max: '',
                    mtech_year_of_passout_min: '',
                    mtech_year_of_passout_max: '',
                    btech_percentage_min: '',
                    mtech_percentage_min: '',
                    skills_required: [],
                    additional_criteria: ''
                });
            }
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedItem(null);
    };

    const handleSubmit = async () => {
        try {
            if (dialogType === 'company') {
                if (selectedItem) {
                    await updateCompany({ id: selectedItem.id, payload: companyForm }).unwrap();
                    setSnackbar({ open: true, message: 'Company updated successfully!', severity: 'success' });
                } else {
                    await createCompany(companyForm).unwrap();
                    setSnackbar({ open: true, message: 'Company created successfully!', severity: 'success' });
                }
                refetchCompanies();
            } else if (dialogType === 'jobPosting') {
                if (selectedItem) {
                    await updateJobPosting({ id: selectedItem.id, payload: jobPostingForm }).unwrap();
                    setSnackbar({ open: true, message: 'Job posting updated successfully!', severity: 'success' });
                } else {
                    await createJobPosting(jobPostingForm).unwrap();
                    setSnackbar({ open: true, message: 'Job posting created successfully!', severity: 'success' });
                }
                refetchJobPostings();
            }
            handleCloseDialog();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error: ' + (error.data?.message || error.message), severity: 'error' });
        }
    };

    const handleDelete = async (type, id) => {
        setDeleteConfirmDialog({ open: true, type, id });
    };

    const confirmDelete = async () => {
        const { type, id } = deleteConfirmDialog;
        setDeleteConfirmDialog({ open: false, type: '', id: null });
        
        try {
            if (type === 'company') {
                await deleteCompany(id).unwrap();
                setSnackbar({ open: true, message: 'Company deleted successfully!', severity: 'success' });
                refetchCompanies();
            } else if (type === 'jobPosting') {
                await deleteJobPosting(id).unwrap();
                setSnackbar({ open: true, message: 'Job posting deleted successfully!', severity: 'success' });
                refetchJobPostings();
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Error: ' + (error.data?.message || error.message), severity: 'error' });
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmDialog({ open: false, type: '', id: null });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'draft': return 'warning';
            case 'closed': return 'error';
            default: return 'default';
        }
    };

    const getJobTypeColor = (jobType) => {
        switch (jobType) {
            case 'full_time': return 'primary';
            case 'part_time': return 'secondary';
            case 'internship': return 'info';
            case 'contract': return 'warning';
            default: return 'default';
        }
    };

    // Job Filter Handlers
    const handleApplyJobFilters = () => {
        // The query will automatically refetch when jobFilters state changes
        // No need to manually call refetchJobPostings
    };

    const handleClearJobFilters = () => {
        setJobFilters({
            search: '',
            job_type: '',
            status: '',
            location: '',
            company_id: '',
            course_id: '',
            salary_min: '',
            salary_max: '',
            experience_required: '',
            has_vacancies: false,
            posted_date_from: '',
            posted_date_to: '',
            deadline_from: '',
            deadline_to: ''
        });
        // The query will automatically refetch when jobFilters state changes
    };

    // Function to get applications count for a specific job
    const getApplicationsCount = (jobId) => {
        if (!jobApplications?.data) return 0;
        return jobApplications.data.filter(app => app.job_posting_id === jobId).length;
    };

    // Function to get applications by status for a specific job
    const getApplicationsByStatus = (jobId) => {
        if (!jobApplications?.data) return {};
        const jobApps = jobApplications.data.filter(app => app.job_posting_id === jobId);
        const statusCounts = {};
        jobApps.forEach(app => {
            statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
        });
        return statusCounts;
    };

    // Function to get applications for a specific job with student details
    const getJobApplications = (jobId) => {
        if (!jobApplications?.data) return [];
        return jobApplications.data.filter(app => app.job_posting_id === jobId);
    };

    // Function to handle applications dialog
    const handleApplicationsClick = async (jobId, jobTitle) => {
        setApplicationsDialog({ open: true, jobId, jobTitle });
        await fetchEnhancedJobApplications(jobId);
    };

    // Function to close applications dialog
    const handleCloseApplicationsDialog = () => {
        setApplicationsDialog({ open: false, jobId: null, jobTitle: '' });
    };

    // Function to fetch enhanced job applications with user details
    const fetchEnhancedJobApplications = async (jobId) => {
        try {
            setLoadingEnhancedApplications(true);
            const userInfo = getCookie('user_info');
            const userData = JSON.parse(userInfo);
            
            // Fetch job applications for specific job with user details
            const response = await axios.get(`/api/job-applications?job_posting_id=${jobId}`, {
                headers: { 'Authorization': userData.token }
            });
            
            if (response.data.data) {
                // For each application, fetch user details with batches and course
                const enhancedApplications = await Promise.all(
                    response.data.data.map(async (application) => {
                        try {
                            const userResponse = await axios.get(`/api/students/${application.user_id}`, {
                                headers: { 'Authorization': userData.token }
                            });
                            return {
                                ...application,
                                user: userResponse.data.data || application.user
                            };
                        } catch (err) {
                            console.error('Error fetching user details:', err);
                            return application;
                        }
                    })
                );
                setEnhancedJobApplications(enhancedApplications);
            }
        } catch (err) {
            console.error('Error fetching enhanced job applications:', err);
            setEnhancedJobApplications([]);
        } finally {
            setLoadingEnhancedApplications(false);
        }
    };

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

    const navigate = useNavigate();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    // Derived filtered companies list for search
    const filteredCompanies = (companies || []).filter((c) => {
        if (!companiesSearch?.trim()) return true;
        const q = companiesSearch.toLowerCase();
        return (
            c.name?.toLowerCase().includes(q) ||
            c.industry?.toLowerCase().includes(q) ||
            c.contact_person?.toLowerCase().includes(q) ||
            c.contact_email?.toLowerCase().includes(q)
        );
    });

    return (
        <Box sx={{ width: '100%', p: { xs: 2, md: 3 }, backgroundColor: '#f8f9fa' }}>
            

            {/* Modern Tiles */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[{
                    key: 'totalStudents',
                    label: 'Total Students',
                    value: stats?.totalStudents || 0,
                    icon: <GroupIcon sx={{ color: '#fff' }} />,
                }, {
                    key: 'eligibleStudents',
                    label: 'Eligible Students',
                    value: stats?.eligibleStudents || 0,
                    icon: <GroupIcon sx={{ color: '#fff' }} />,
                }, {
                    key: 'placedStudents',
                    label: 'Placed Students',
                    value: stats?.placedStudents || 0,
                    icon: <AssessmentIcon sx={{ color: '#fff' }} />,
                }, {
                    key: 'activeJobs',
                    label: 'Active Jobs',
                    value: stats?.activeJobs || 0,
                    icon: <WorkIcon sx={{ color: '#fff' }} />,
                }, {
                    key: 'totalCompanies',
                    label: 'Total Companies',
                    value: stats?.totalCompanies || 0,
                    icon: <BusinessIcon sx={{ color: '#fff' }} />,
                }].map((tile, idx) => {
                    const gradient = idx % 2 === 0
                        ? 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)' // Blue gradient (dashboard)
                        : 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'; // Orange gradient (dashboard)
                    return (
                    <Grid key={tile.key} item xs={12} md={2.4}>
                        <Box
                            sx={{
                                position: 'relative',
                                borderRadius: 3,
                                p: 2.5,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                                background: gradient,
                                color: '#fff',
                                overflow: 'hidden',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 36, height: 36 }}>
                                    {tile.icon}
                                </Avatar>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {tile.label}
                                </Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                                {tile.value}
                            </Typography>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    right: -20,
                                    bottom: -20,
                                    width: 120,
                                    height: 120,
                                    bgcolor: 'rgba(255,255,255,0.08)',
                                    borderRadius: '50%'
                                }}
                            />
                        </Box>
                    </Grid>
                )})}
            </Grid>

            {/* Tabs */}
            <Paper sx={{ width: '100%', borderRadius: 3, boxShadow: 4 }}>
                <Box sx={{ px: 2, pt: 2 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="admin placement tabs"
                        variant="scrollable"
                        scrollButtons="auto"
                        TabIndicatorProps={{ style: { display: 'none' } }}
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                mr: 1,
                                borderRadius: 2,
                                minHeight: 40,
                                color: 'text.secondary',
                                backgroundColor: 'rgba(0,0,0,0.04)'
                            },
                            '& .Mui-selected': {
                                color: '#fff !important',
                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                            }
                        }}
                    >
                        <Tab
                            icon={<BusinessIcon />}
                            label={`Companies (${stats?.totalCompanies || 0})`}
                            {...a11yProps(0)}
                        />
                        <Tab
                            icon={<WorkIcon />}
                            label={`Job Postings (${stats?.activeJobs || 0})`}
                            {...a11yProps(1)}
                        />
                        <Tab icon={<GroupIcon />} label={`Eligible Students`} {...a11yProps(2)} />
                        <Tab
                            icon={<AssessmentIcon />}
                            label="Reports"
                            {...a11yProps(3)}
                        />
                    </Tabs>
                </Box>

                {/* Tab Panels */}


                <TabPanel value={tabValue} index={1}>
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h5">Job Postings</Typography>
                            <Box display="flex" gap={1.5} alignItems="center">
                                <TextField
                                    size="small"
                                    placeholder="Search jobs..."
                                    value={jobFilters.search || ''}
                                    onChange={(e) => setJobFilters({ ...jobFilters, search: e.target.value })}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    startIcon={<FilterListIcon />}
                                    onClick={() => setShowFilters(!showFilters)}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)'
                                    }}
                                >
                                    {showFilters ? 'Hide Filters' : 'Filters'}
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenDialog('jobPosting')}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                                    }}
                                >
                                    Add Job
                                </Button>
                            </Box>
                        </Box>

                        {/* Filters Section */}
                        {showFilters && (
                            <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Filters
                            </Typography>
                            <Grid container spacing={2}>
                                {/* Search Filter */}
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Search"
                                        placeholder="Search by title, description, requirements..."
                                        value={jobFilters.search || ''}
                                        onChange={(e) => setJobFilters({...jobFilters, search: e.target.value})}
                                        size="small"
                                    />
                                </Grid>

                                {/* Job Type Filter */}
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Job Type</InputLabel>
                                        <Select
                                            value={jobFilters.job_type || ''}
                                            onChange={(e) => setJobFilters({...jobFilters, job_type: e.target.value})}
                                            label="Job Type"
                                        >
                                            <MenuItem value="">All Types</MenuItem>
                                            <MenuItem value="full_time">Full Time</MenuItem>
                                            <MenuItem value="part_time">Part Time</MenuItem>
                                            <MenuItem value="internship">Internship</MenuItem>
                                            <MenuItem value="contract">Contract</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Status Filter */}
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={jobFilters.status || ''}
                                            onChange={(e) => setJobFilters({...jobFilters, status: e.target.value})}
                                            label="Status"
                                        >
                                            <MenuItem value="">All Status</MenuItem>
                                            <MenuItem value="draft">Draft</MenuItem>
                                            <MenuItem value="open">Open</MenuItem>
                                            <MenuItem value="closed">Closed</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Location Filter */}
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Location"
                                        placeholder="Enter location..."
                                        value={jobFilters.location || ''}
                                        onChange={(e) => setJobFilters({...jobFilters, location: e.target.value})}
                                        size="small"
                                    />
                                </Grid>

                                {/* Company Filter */}
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Company</InputLabel>
                                        <Select
                                            value={jobFilters.company_id || ''}
                                            onChange={(e) => setJobFilters({...jobFilters, company_id: e.target.value})}
                                            label="Company"
                                            disabled={companiesLoading}
                                        >
                                            <MenuItem value="">All Companies</MenuItem>
                                            {companiesLoading ? (
                                                <MenuItem disabled>Loading companies...</MenuItem>
                                            ) : (
                                                companies?.map((company) => (
                                                    <MenuItem key={company.id} value={company.id}>
                                                        {company.name}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Course Filter */}
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Course</InputLabel>
                                        <Select
                                            value={jobFilters.course_id || ''}
                                            onChange={(e) => setJobFilters({...jobFilters, course_id: e.target.value})}
                                            label="Course"
                                            disabled={coursesLoading}
                                        >
                                            <MenuItem value="">All Courses</MenuItem>
                                            {coursesLoading ? (
                                                <MenuItem disabled>Loading courses...</MenuItem>
                                            ) : (
                                                courses?.courses?.map((course) => (
                                                    <MenuItem key={course.id} value={course.id}>
                                                        {course.name}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Salary Range Filters */}
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        fullWidth
                                        label="Min Salary"
                                        type="number"
                                        placeholder="Min"
                                        value={jobFilters.salary_min || ''}
                                        onChange={(e) => setJobFilters({...jobFilters, salary_min: e.target.value})}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        fullWidth
                                        label="Max Salary"
                                        type="number"
                                        placeholder="Max"
                                        value={jobFilters.salary_max || ''}
                                        onChange={(e) => setJobFilters({...jobFilters, salary_max: e.target.value})}
                                        size="small"
                                    />
                                </Grid>

                                {/* Experience Filter */}
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        fullWidth
                                        label="Experience"
                                        placeholder="e.g., 2 years"
                                        value={jobFilters.experience_required || ''}
                                        onChange={(e) => setJobFilters({...jobFilters, experience_required: e.target.value})}
                                        size="small"
                                    />
                                </Grid>

                                {/* Vacancies Filter */}
                                <Grid item xs={12} md={2}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={jobFilters.has_vacancies || false}
                                                onChange={(e) => setJobFilters({...jobFilters, has_vacancies: e.target.checked})}
                                            />
                                        }
                                        label="Has Vacancies"
                                    />
                                </Grid>

                                {/* Date Range Filters */}
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Posted From"
                                        type="date"
                                        value={jobFilters.posted_date_from || ''}
                                        onChange={(e) => setJobFilters({...jobFilters, posted_date_from: e.target.value})}
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Posted To"
                                        type="date"
                                        value={jobFilters.posted_date_to || ''}
                                        onChange={(e) => setJobFilters({...jobFilters, posted_date_to: e.target.value})}
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                {/* Action Buttons */}
                                <Grid item xs={12} md={6}>
                                    <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                            onClick={handleApplyJobFilters}
                                            startIcon={<SearchIcon />}
                                        >
                                            Apply Filters
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={handleClearJobFilters}
                                        >
                                            Clear Filters
                            </Button>
                        </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                        )}
                        
                        {jobPostingsLoading ? (
                            <Box display="flex" justifyContent="center" p={3}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            (!jobPostings?.data || jobPostings?.data?.length === 0) ? (
                                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, boxShadow: 3 }}>
                                    <Typography variant="h6" gutterBottom>No job postings found</Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Create your first job posting to start receiving applications.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpenDialog('jobPosting')}
                                        sx={{ mt: 2, textTransform: 'none', borderRadius: 2, background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)' }}
                                    >
                                        Create Job Posting
                                    </Button>
                                </Paper>
                            ) : (
                            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4 }}>
                                <Table size="small" sx={{
                                    '& tbody tr:hover': { backgroundColor: 'action.hover' },
                                    '& tbody tr:nth-of-type(odd)': { backgroundColor: 'rgba(0,0,0,0.02)' },
                                    '& thead th': { 
                                        background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                        color: '#fff',
                                        fontWeight: 700,
                                        fontSize: '0.875rem'
                                    }
                                }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Company</TableCell>
                                            <TableCell>Course</TableCell>
                                            <TableCell>Location</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="center">Applications</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                                                        <TableBody>
                                        {jobPostings?.data?.map((job) => {
                                            const applicationsCount = getApplicationsCount(job.id);
                                            const applicationsByStatus = getApplicationsByStatus(job.id);
                                            
                                            return (
                                                <TableRow 
                                                    key={job.id}
                                                    onClick={applicationsCount > 0 ? () => handleApplicationsClick(job.id, job.title) : undefined}
                                                    sx={{ 
                                                        cursor: applicationsCount > 0 ? 'pointer' : 'default',
                                                        '&:hover': applicationsCount > 0 ? {
                                                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                                        } : {},
                                                        transition: 'all 0.2s ease',
                                                        '&:hover .MuiTableCell-root': {
                                                            backgroundColor: 'transparent'
                                                        }
                                                    }}
                                                >
                                                    <TableCell>{job.title}</TableCell>
                                                    <TableCell>{job.company?.name || 'N/A'}</TableCell>
                                                    <TableCell>{job.course?.name || 'N/A'}</TableCell>
                                                    <TableCell>{job.location}</TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={job.job_type} 
                                                            color={getJobTypeColor(job.job_type)} 
                                                            size="small" 
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={job.status} 
                                                            color={getStatusColor(job.status)} 
                                                            size="small" 
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title={
                                                            <Box>
                                                                <Typography variant="body2" fontWeight="bold">Applications by Status:</Typography>
                                                                {Object.keys(applicationsByStatus).length > 0 ? (
                                                                    Object.entries(applicationsByStatus).map(([status, count]) => (
                                                                        <Typography key={status} variant="body2">
                                                                            {status.charAt(0).toUpperCase() + status.slice(1)}: {count}
                                                                        </Typography>
                                                                    ))
                                                                ) : (
                                                                    <Typography variant="body2">No applications yet</Typography>
                                                                )}
                                                                {applicationsCount > 0 && (
                                                                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                                                                        Click anywhere on row to view details
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        }>
                                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                                <Chip 
                                                                    label={applicationsCount}
                                                                    color={applicationsCount > 0 ? 'primary' : 'default'}
                                                                    variant={applicationsCount > 0 ? 'filled' : 'outlined'}
                                                                    size="small"
                                                                    sx={{ 
                                                                        fontWeight: 600,
                                                                        minWidth: 40
                                                                    }}
                                                                />
                                                            </Box>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                                                        <Box display="flex" justifyContent="flex-end" gap={0.5}>
                                                            <Tooltip title="Edit">
                                                                <IconButton size="small" onClick={() => handleOpenDialog('jobPosting', job)}>
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete">
                                                                <IconButton size="small" color="error" onClick={() => handleDelete('jobPosting', job.id)}>
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            )
                        )}
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={0}>
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h5">Companies</Typography>
                            <Box display="flex" gap={1.5} alignItems="center">
                                <TextField
                                    size="small"
                                    placeholder="Search companies..."
                                    value={companiesSearch || ''}
                                    onChange={(e) => setCompaniesSearch(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button 
                                    variant="contained" 
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenDialog('company')}
                                    sx={{ textTransform: 'none', borderRadius: 2, background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)' }}
                                >
                                    Add Company
                                </Button>
                            </Box>
                        </Box>
                        
                        {companiesLoading ? (
                            <Box display="flex" justifyContent="center" p={3}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            (!filteredCompanies || filteredCompanies.length === 0) ? (
                                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, boxShadow: 3 }}>
                                    <Typography variant="h6" gutterBottom>No companies found</Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Add a company to begin managing placements.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpenDialog('company')}
                                        sx={{ mt: 2, textTransform: 'none', borderRadius: 2, background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)' }}
                                    >
                                        Add Company
                                    </Button>
                                </Paper>
                            ) : (
                            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4 }}>
                                <Table size="small" sx={{
                                    '& tbody tr:hover': { backgroundColor: 'action.hover' },
                                    '& tbody tr:nth-of-type(odd)': { backgroundColor: 'rgba(0,0,0,0.02)' },
                                    '& thead th': { 
                                        background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                        color: '#fff',
                                        fontWeight: 700,
                                        fontSize: '0.875rem'
                                    }
                                }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Industry</TableCell>
                                            <TableCell>Contact Person</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Phone</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredCompanies.map((company) => (
                                            <TableRow key={company.id}>
                                                <TableCell>{company.name}</TableCell>
                                                <TableCell>{company.industry || 'N/A'}</TableCell>
                                                <TableCell>{company.contact_person || 'N/A'}</TableCell>
                                                <TableCell>{company.contact_email || 'N/A'}</TableCell>
                                                <TableCell>{company.contact_phone || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={company.is_active ? 'Active' : 'Inactive'} 
                                                        color={company.is_active ? 'success' : 'default'} 
                                                        size="small" 
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Box display="flex" justifyContent="flex-end" gap={0.5}>
                                                        <Tooltip title="Edit">
                                                            <IconButton size="small" onClick={() => handleOpenDialog('company', company)}>
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <IconButton size="small" color="error" onClick={() => handleDelete('company', company.id)}>
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            )
                        )}
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Placement Reports
                        </Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Placement Statistics
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            View detailed placement statistics and analytics
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Domain-wise Analysis
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Placement success rate by domain
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                </TabPanel>

                {/* Eligible Students */}
                <TabPanel value={tabValue} index={2}>
                    <PlacementStudents eligibleOnlyMode={true} />
                </TabPanel>
            </Paper>

            {/* Applications Dialog */}
            <Dialog 
                open={applicationsDialog.open} 
                onClose={handleCloseApplicationsDialog} 
                maxWidth="md" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)',
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)',
                        color: 'white',
                        py: 3,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                        }
                    }}
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                            <GroupIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="600">
                                Job Applications
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                                {applicationsDialog.jobTitle}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                
                <DialogContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3 }}>
                        {loadingEnhancedApplications ? (
                            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                                <CircularProgress />
                                <Typography variant="body2" sx={{ ml: 2 }}>
                                    Loading student details...
                                </Typography>
                            </Box>
                        ) : applicationsDialog.jobId && (
                            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ 
                                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                            '& th': { color: '#fff', fontWeight: 700 }
                                        }}>
                                            <TableCell>Student Name</TableCell>
                                            <TableCell>Batch</TableCell>
                                            <TableCell>Course</TableCell>
                                            <TableCell>Application Date</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {enhancedJobApplications.map((application) => (
                                            <TableRow key={application.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                                                            {application.user?.name?.charAt(0)?.toUpperCase() || 'S'}
                                                        </Avatar>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {application.user?.name || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {application.user?.batches?.[0]?.batch_name || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.user?.course?.name || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.application_date ? 
                                                        new Date(application.application_date).toLocaleDateString() : 
                                                        'N/A'
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={application.status} 
                                                        color={getStatusColor(application.status)} 
                                                        size="small" 
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                        
                        {enhancedJobApplications.length === 0 && !loadingEnhancedApplications && (
                            <Box textAlign="center" py={4}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No applications found
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    No students have applied for this job yet.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        onClick={handleCloseApplicationsDialog}
                        sx={{ 
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Company Dialog */}
            <Dialog 
                open={openDialog && dialogType === 'company'} 
                onClose={handleCloseDialog} 
                maxWidth="lg" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)',
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)',
                        color: 'white',
                        py: 3,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                        }
                    }}
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                            <BusinessIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="600">
                                {selectedItem ? 'Edit Company' : 'Add New Company'}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                                {selectedItem ? 'Update company information' : 'Create a new company profile'}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                
                <DialogContent sx={{ p: 0 }}>
                    <Box sx={{ p: 4 }}>
                        {/* Company Basic Information Section */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                mb: 3, 
                                border: '1px solid #e2e8f0',
                                borderRadius: 2,
                                background: '#ffffff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} mb={3}>
                                <Avatar sx={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)', width: 32, height: 32 }}>
                                    <BusinessIcon fontSize="small" />
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#0f1f3d">
                                    Company Information
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Company Name"
                                        value={companyForm.name}
                                        onChange={(e) => handleCompanyFormChange('name', e.target.value)}
                                        onBlur={() => setCompanyFormTouched({ ...companyFormTouched, name: true })}
                                        error={companyFormTouched.name && !!companyFormErrors.name}
                                        helperText={companyFormTouched.name && companyFormErrors.name}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <BusinessIcon color="action" fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Industry</InputLabel>
                                        <Select
                                            value={companyForm.industry || ''}
                                            label="Industry"
                                            onChange={(e) => handleCompanyFormChange('industry', e.target.value)}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="Technology">💻 Technology</MenuItem>
                                            <MenuItem value="Healthcare">🏥 Healthcare</MenuItem>
                                            <MenuItem value="Finance">💰 Finance</MenuItem>
                                            <MenuItem value="Education">🎓 Education</MenuItem>
                                            <MenuItem value="Manufacturing">🏭 Manufacturing</MenuItem>
                                            <MenuItem value="Retail">🛒 Retail</MenuItem>
                                            <MenuItem value="Consulting">💼 Consulting</MenuItem>
                                            <MenuItem value="Government">🏛️ Government</MenuItem>
                                            <MenuItem value="Non-profit">❤️ Non-profit</MenuItem>
                                            <MenuItem value="Other">📋 Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Website"
                                        value={companyForm.website}
                                        onChange={(e) => setCompanyForm({...companyForm, website: e.target.value})}
                                        variant="outlined"
                                        placeholder="https://www.company.com"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    🌐
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Company Size</InputLabel>
                                        <Select
                                            value={companyForm.company_size || ''}
                                            label="Company Size"
                                            onChange={(e) => setCompanyForm({...companyForm, company_size: e.target.value})}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="1-10">1-10 employees</MenuItem>
                                            <MenuItem value="11-50">11-50 employees</MenuItem>
                                            <MenuItem value="51-200">51-200 employees</MenuItem>
                                            <MenuItem value="201-500">201-500 employees</MenuItem>
                                            <MenuItem value="501-1000">501-1000 employees</MenuItem>
                                            <MenuItem value="1000+">1000+ employees</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        label="Company Description"
                                        value={companyForm.description}
                                        onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})}
                                        variant="outlined"
                                        placeholder="Describe your company's mission, values, and what makes it unique..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                    📝
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Contact Information Section */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                mb: 3,
                                border: '1px solid #e2e8f0',
                                borderRadius: 2,
                                background: '#ffffff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} mb={3}>
                                <Avatar sx={{ background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)', width: 32, height: 32 }}>
                                    👤
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#eb6707">
                                    Contact Information
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Contact Person"
                                        value={companyForm.contact_person}
                                        onChange={(e) => setCompanyForm({...companyForm, contact_person: e.target.value})}
                                        variant="outlined"
                                        placeholder="Full name of contact person"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(235, 103, 7, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(228, 43, 18, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    👨‍💼
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Contact Email"
                                        type="email"
                                        value={companyForm.contact_email}
                                        onChange={(e) => setCompanyForm({...companyForm, contact_email: e.target.value})}
                                        variant="outlined"
                                        placeholder="contact@company.com"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(235, 103, 7, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(228, 43, 18, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    ✉️
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Contact Phone"
                                        value={companyForm.contact_phone}
                                        onChange={(e) => setCompanyForm({...companyForm, contact_phone: e.target.value})}
                                        variant="outlined"
                                        placeholder="+1 (555) 123-4567"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(235, 103, 7, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(228, 43, 18, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    📞
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box /> {/* Empty space for alignment */}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Company Address"
                                        value={companyForm.address}
                                        onChange={(e) => setCompanyForm({...companyForm, address: e.target.value})}
                                        variant="outlined"
                                        placeholder="Street address, city, state, zip code, country"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(235, 103, 7, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(228, 43, 18, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                    📍
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </DialogContent>
                
                <DialogActions 
                    sx={{ 
                        p: 3, 
                        pt: 0,
                        gap: 2,
                        justifyContent: 'space-between'
                    }}
                >
                    <Button 
                        onClick={handleCloseDialog}
                        variant="outlined"
                        size="large"
                        sx={{
                            borderRadius: 2,
                            px: 4,
                            py: 1.5,
                            borderColor: '#e5e7eb',
                            color: '#6b7280',
                            '&:hover': {
                                borderColor: '#d1d5db',
                                backgroundColor: '#f9fafb'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        size="large"
                        disabled={creatingCompany || updatingCompany}
                        sx={{
                            background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)',
                            borderRadius: 2,
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            boxShadow: '0 4px 15px rgba(15, 31, 61, 0.4)',
                            '&:hover': {
                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                boxShadow: '0 6px 20px rgba(235, 103, 7, 0.6)',
                                transform: 'translateY(-1px)'
                            },
                            '&:disabled': {
                                background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                                boxShadow: 'none'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {creatingCompany || updatingCompany ? (
                            <Box display="flex" alignItems="center" gap={1}>
                                <CircularProgress size={20} color="inherit" />
                                <span>{selectedItem ? 'Updating...' : 'Creating...'}</span>
                            </Box>
                        ) : (
                            <Box display="flex" alignItems="center" gap={1}>
                                <span>{selectedItem ? 'Update Company' : 'Create Company'}</span>
                                {selectedItem ? '✏️' : '✨'}
                            </Box>
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Job Posting Dialog */}
            <Dialog 
                open={openDialog && dialogType === 'jobPosting'} 
                onClose={handleCloseDialog} 
                maxWidth="lg" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)',
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)',
                        color: 'white',
                        py: 3,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                        }
                    }}
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                            <WorkIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="600">
                                {selectedItem ? 'Edit Job Posting' : 'Add New Job Posting'}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                                {selectedItem ? 'Update job posting details' : 'Create a new job posting'}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                
                <DialogContent sx={{ p: 0 }}>
                    <Box sx={{ p: 4, maxHeight: '70vh', overflowY: 'auto' }}>
                        {/* Job Basic Information Section */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 4, 
                                mb: 4, 
                                border: '1px solid #e2e8f0',
                                borderRadius: 3,
                                background: '#ffffff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} mb={4}>
                                <Avatar sx={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)', width: 36, height: 36 }}>
                                    <WorkIcon fontSize="small" />
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#0f1f3d">
                                    Job Information
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Job Title"
                                        value={jobPostingForm.title}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, title: e.target.value})}
                                        variant="outlined"
                                        placeholder="e.g., Senior Software Engineer"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    💼
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Company</InputLabel>
                                        <Select
                                            value={jobPostingForm.company_id}
                                            onChange={(e) => setJobPostingForm({...jobPostingForm, company_id: e.target.value})}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            }}
                                        >
                                            {companies?.map((company) => (
                                                <MenuItem key={company.id} value={company.id}>
                                                    {company.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Course</InputLabel>
                                        <Select
                                            value={jobPostingForm.course_id}
                                            onChange={(e) => setJobPostingForm({...jobPostingForm, course_id: e.target.value})}
                                            disabled={coursesLoading}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            }}
                                        >
                                            {coursesLoading ? (
                                                <MenuItem disabled>Loading courses...</MenuItem>
                                            ) : (
                                                courses?.courses?.map((course) => (
                                                    <MenuItem key={course.id} value={course.id}>
                                                        {course.name}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Location"
                                        value={jobPostingForm.location}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, location: e.target.value})}
                                        variant="outlined"
                                        placeholder="e.g., New York, NY"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    📍
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Job Type</InputLabel>
                                        <Select
                                            value={jobPostingForm.job_type}
                                            onChange={(e) => setJobPostingForm({...jobPostingForm, job_type: e.target.value})}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="full_time">🕐 Full Time</MenuItem>
                                            <MenuItem value="part_time">⏰ Part Time</MenuItem>
                                            <MenuItem value="contract">📋 Contract</MenuItem>
                                            <MenuItem value="internship">🎓 Internship</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Status</InputLabel>
                                        <Select
                                            value={jobPostingForm.status}
                                            onChange={(e) => setJobPostingForm({...jobPostingForm, status: e.target.value})}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="draft">📝 Draft</MenuItem>
                                            <MenuItem value="open">✅ Open</MenuItem>
                                            <MenuItem value="closed">❌ Closed</MenuItem>
                                            <MenuItem value="expired">⏰ Expired</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        label="Job Description"
                                        value={jobPostingForm.description}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, description: e.target.value})}
                                        variant="outlined"
                                        placeholder="Provide a detailed description of the role, responsibilities, and what makes this position exciting..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                    📝
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Job Requirements Section */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 4, 
                                mb: 4,
                                border: '1px solid #e2e8f0',
                                borderRadius: 3,
                                background: '#ffffff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} mb={4}>
                                <Avatar sx={{ background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)', width: 36, height: 36 }}>
                                    📋
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#eb6707">
                                    Job Requirements & Responsibilities
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        label="Requirements"
                                        value={jobPostingForm.requirements}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, requirements: e.target.value})}
                                        variant="outlined"
                                        placeholder="List the key requirements, qualifications, and skills needed for this position..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(235, 103, 7, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(228, 43, 18, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                    ✅
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        label="Responsibilities"
                                        value={jobPostingForm.responsibilities}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, responsibilities: e.target.value})}
                                        variant="outlined"
                                        placeholder="Describe the key responsibilities and duties for this role..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(235, 103, 7, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(228, 43, 18, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                    🎯
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Compensation & Details Section */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 4, 
                                mb: 4,
                                border: '1px solid #e2e8f0',
                                borderRadius: 3,
                                background: '#ffffff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} mb={4}>
                                <Avatar sx={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', width: 36, height: 36 }}>
                                    💰
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#059669">
                                    Compensation & Details
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Minimum Salary"
                                        type="number"
                                        value={jobPostingForm.salary_min}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, salary_min: e.target.value})}
                                        variant="outlined"
                                        placeholder="e.g., 50000"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    💵
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Maximum Salary"
                                        type="number"
                                        value={jobPostingForm.salary_max}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, salary_max: e.target.value})}
                                        variant="outlined"
                                        placeholder="e.g., 80000"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    💵
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Experience Required"
                                        value={jobPostingForm.experience_required}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, experience_required: e.target.value})}
                                        variant="outlined"
                                        placeholder="e.g., 2-5 years"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    ⏳
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Number of Vacancies"
                                        type="number"
                                        value={jobPostingForm.vacancies}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, vacancies: e.target.value})}
                                        variant="outlined"
                                        placeholder="e.g., 3"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    👥
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Application Deadline"
                                        type="datetime-local"
                                        value={jobPostingForm.application_deadline}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, application_deadline: e.target.value})}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    ⏰
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Skills Required"
                                        placeholder="Enter skills separated by commas (e.g., Java, Python, React)"
                                        value={jobPostingForm.skills_required.join(', ')}
                                        onChange={e => setJobPostingForm({ 
                                            ...jobPostingForm, 
                                            skills_required: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill)
                                        })}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    🛠️
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Eligibility Criteria Section */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                mb: 3,
                                border: '1px solid #e2e8f0',
                                borderRadius: 2,
                                background: '#ffffff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} mb={3}>
                                <Avatar sx={{ background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)', width: 32, height: 32 }}>
                                    🎓
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#7c3aed">
                                    Eligibility Criteria
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="BTech Year of Passout (Min)"
                                        type="number"
                                        value={jobPostingForm.btech_year_of_passout_min}
                                        onChange={e => setJobPostingForm({ ...jobPostingForm, btech_year_of_passout_min: e.target.value })}
                                        variant="outlined"
                                        placeholder="e.g., 2020"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    📅
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="BTech Year of Passout (Max)"
                                        type="number"
                                        value={jobPostingForm.btech_year_of_passout_max}
                                        onChange={e => setJobPostingForm({ ...jobPostingForm, btech_year_of_passout_max: e.target.value })}
                                        variant="outlined"
                                        placeholder="e.g., 2024"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    📅
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="MTech Year of Passout (Min)"
                                        type="number"
                                        value={jobPostingForm.mtech_year_of_passout_min}
                                        onChange={e => setJobPostingForm({ ...jobPostingForm, mtech_year_of_passout_min: e.target.value })}
                                        variant="outlined"
                                        placeholder="e.g., 2022"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    📅
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="MTech Year of Passout (Max)"
                                        type="number"
                                        value={jobPostingForm.mtech_year_of_passout_max}
                                        onChange={e => setJobPostingForm({ ...jobPostingForm, mtech_year_of_passout_max: e.target.value })}
                                        variant="outlined"
                                        placeholder="e.g., 2024"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    📅
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="BTech Percentage (Min)"
                                        type="number"
                                        value={jobPostingForm.btech_percentage_min}
                                        onChange={e => setJobPostingForm({ ...jobPostingForm, btech_percentage_min: e.target.value })}
                                        variant="outlined"
                                        placeholder="e.g., 70"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    📊
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="MTech Percentage (Min)"
                                        type="number"
                                        value={jobPostingForm.mtech_percentage_min}
                                        onChange={e => setJobPostingForm({ ...jobPostingForm, mtech_percentage_min: e.target.value })}
                                        variant="outlined"
                                        placeholder="e.g., 75"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    📊
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Additional Criteria"
                                        value={jobPostingForm.additional_criteria}
                                        onChange={e => setJobPostingForm({ ...jobPostingForm, additional_criteria: e.target.value })}
                                        variant="outlined"
                                        placeholder="Any additional eligibility criteria or special requirements..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                    📝
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </DialogContent>
                
                <DialogActions 
                    sx={{ 
                        p: 3, 
                        pt: 0,
                        gap: 2,
                        justifyContent: 'space-between'
                    }}
                >
                    <Button 
                        onClick={handleCloseDialog}
                        variant="outlined"
                        size="large"
                        sx={{
                            borderRadius: 2,
                            px: 4,
                            py: 1.5,
                            borderColor: '#e5e7eb',
                            color: '#6b7280',
                            '&:hover': {
                                borderColor: '#d1d5db',
                                backgroundColor: '#f9fafb'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        size="large"
                        disabled={creatingJobPosting || updatingJobPosting}
                        sx={{
                            background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)',
                            borderRadius: 2,
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            boxShadow: '0 4px 15px rgba(15, 31, 61, 0.4)',
                            '&:hover': {
                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                boxShadow: '0 6px 20px rgba(235, 103, 7, 0.6)',
                                transform: 'translateY(-1px)'
                            },
                            '&:disabled': {
                                background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                                boxShadow: 'none'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {creatingJobPosting || updatingJobPosting ? (
                            <Box display="flex" alignItems="center" gap={1}>
                                <CircularProgress size={20} color="inherit" />
                                <span>{selectedItem ? 'Updating...' : 'Creating...'}</span>
                            </Box>
                        ) : (
                            <Box display="flex" alignItems="center" gap={1}>
                                <span>{selectedItem ? 'Update Job Posting' : 'Create Job Posting'}</span>
                                {selectedItem ? '✏️' : '✨'}
                            </Box>
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmDialog.open}
                onClose={cancelDelete}
                aria-labelledby="delete-confirmation-dialog-title"
                aria-describedby="delete-confirmation-dialog-description"
            >
                <DialogTitle id="delete-confirmation-dialog-title">
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <Typography id="delete-confirmation-dialog-description">
                        {deleteConfirmDialog.type === 'company' 
                            ? 'Are you sure you want to delete this company? This action cannot be undone.'
                            : 'Are you sure you want to delete this job posting? This action cannot be undone.'
                        }
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminPlacement; 