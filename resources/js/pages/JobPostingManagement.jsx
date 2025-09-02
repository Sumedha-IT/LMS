import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    CircularProgress,
    Snackbar,
    Alert,
    Card,
    CardContent,
    Tabs,
    Tab,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Work as WorkIcon,
    Business as BusinessIcon,
    School as SchoolIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import {
    useGetJobPostingsQuery,
    useCreateJobPostingMutation,
    useUpdateJobPostingMutation,
    useDeleteJobPostingMutation,
    useGetCompaniesQuery,
    useGetCoursesQuery
} from '../store/service/user/UserService';
import { useNavigate, useParams } from 'react-router-dom';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const JobPostingManagement = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({ open: false, jobId: null });

    // Brand palette (aligned with exam page)
    const brand = useMemo(() => ({
        green: '#22c55e',
        orange: '#f97316',
        red: '#c11e1b',
        purple: '#ab00ab',
        gray: '#878787'
    }), []);

    // Local filters for a smoother UX
    const [filters, setFilters] = useState({
        search: '',
        job_type: '',
        status: '',
        company_id: '',
        course_id: '',
        location: ''
    });

    // API Hooks
    const { data: jobPostings, isLoading: jobPostingsLoading, refetch: refetchJobPostings } = useGetJobPostingsQuery();
    const { data: companies, isLoading: companiesLoading, refetch: refetchCompanies } = useGetCompaniesQuery();
    const { data: coursesData, isLoading: coursesLoading, error: coursesError } = useGetCoursesQuery();

    // Debug logging
    console.log('Courses Data:', coursesData);
    console.log('Courses Loading:', coursesLoading);
    console.log('Courses Error:', coursesError);

    // Mutations
    const [createJobPosting, { isLoading: creatingJobPosting }] = useCreateJobPostingMutation();
    const [updateJobPosting, { isLoading: updatingJobPosting }] = useUpdateJobPostingMutation();
    const [deleteJobPosting, { isLoading: deletingJobPosting }] = useDeleteJobPostingMutation();

    // Form state
    const [jobPostingForm, setJobPostingForm] = useState({
        company_id: '',
        title: '',
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
        additional_criteria: '',
        // New fields for multiple course selection
        eligible_courses: []
    });

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = (item = null) => {
        setSelectedItem(item);
        if (item) {
            // Handle course conversion for editing
            let formData = { ...item };
            
            // Convert eligible_courses from names to IDs if needed
            if (item.eligible_courses && Array.isArray(item.eligible_courses) && item.eligible_courses.length > 0) {
                const courseIds = item.eligible_courses.map(courseName => {
                    const course = coursesData?.courses?.find(c => c.name === courseName);
                    return course ? course.id : null;
                }).filter(id => id !== null);
                formData.eligible_courses = courseIds;
            }
            
            setJobPostingForm(formData);
        } else {
            // Reset form for new job posting
            setJobPostingForm({
                company_id: '',
                title: '',
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
                additional_criteria: '',
                // New fields for multiple course selection
                eligible_courses: []
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedItem(null);
    };

    const handleSubmit = async () => {
        try {
            if (selectedItem) {
                await updateJobPosting({ id: selectedItem.id, payload: jobPostingForm }).unwrap();
                setSnackbar({ open: true, message: 'Job posting updated successfully!', severity: 'success' });
            } else {
                await createJobPosting(jobPostingForm).unwrap();
                setSnackbar({ open: true, message: 'Job posting created successfully!', severity: 'success' });
            }
            refetchJobPostings();
            handleCloseDialog();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error saving job posting', severity: 'error' });
        }
    };

    const handleDelete = async (id) => {
        setDeleteConfirmDialog({ open: true, jobId: id });
    };

    const confirmDelete = async () => {
        const jobId = deleteConfirmDialog.jobId;
        setDeleteConfirmDialog({ open: false, jobId: null });
        
        try {
            await deleteJobPosting(jobId).unwrap();
            setSnackbar({ open: true, message: 'Job posting deleted successfully!', severity: 'success' });
            refetchJobPostings();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error deleting job posting', severity: 'error' });
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmDialog({ open: false, jobId: null });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'success';
            case 'draft': return 'warning';
            case 'closed': return 'error';
            case 'on_hold': return 'info';
            case 'expired': return 'default';
            default: return 'default';
        }
    };

    const getJobTypeColor = (jobType) => {
        switch (jobType) {
            case 'full_time': return 'primary';
            case 'part_time': return 'secondary';
            case 'contract': return 'info';
            case 'internship': return 'warning';
            default: return 'default';
        }
    };

    const filteredJobs = useMemo(() => {
        const list = jobPostings?.data || [];
        const matches = (value, needle) => String(value || '')
            .toLowerCase()
            .includes(String(needle || '').toLowerCase());

        return list.filter(job => {
            const bySearch = !filters.search ||
                matches(job.title, filters.search) ||
                matches(job.requirements, filters.search);
            const byType = !filters.job_type || job.job_type === filters.job_type;
            const byStatus = !filters.status || job.status === filters.status;
            const byCompany = !filters.company_id || String(job.company_id) === String(filters.company_id);
            const byCourse = !filters.course_id || String(job.course_id) === String(filters.course_id);
            const byLocation = !filters.location || matches(job.location, filters.location);
            return bySearch && byType && byStatus && byCompany && byCourse && byLocation;
        });
    }, [jobPostings, filters]);

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* Hero Header */}
            <Box sx={{
                mb: 3,
                p: 3,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${brand.green} 0%, ${brand.orange} 100%)`,
                color: '#fff',
                boxShadow: 6,
            }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>Job Posting Management</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Create, edit and monitor placement job postings</Typography>
                    </Box>
                    <Tooltip title="Back to Placement">
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(`/administrator/${id}/admin-placement`)}
                            sx={{
                                color: '#fff',
                                borderColor: 'rgba(255,255,255,0.6)',
                                '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            Back
                        </Button>
                    </Tooltip>
                </Box>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" textColor="primary" indicatorColor="primary">
                    <Tab label="Job Postings" {...a11yProps(0)} />
                    <Tab label="Statistics" {...a11yProps(1)} />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight={700}>Job Postings</Typography>
                        <Button 
                            variant="contained" 
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                            sx={{ backgroundColor: brand.green, '&:hover': { backgroundColor: '#1ea152' } }}
                        >
                            Add Job Posting
                        </Button>
                    </Box>

                    {/* Filters */}
                    <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Search"
                                    placeholder=""
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Job Type</InputLabel>
                                    <Select
                                        label="Job Type"
                                        value={filters.job_type}
                                        onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="full_time">Full Time</MenuItem>
                                        <MenuItem value="part_time">Part Time</MenuItem>
                                        <MenuItem value="contract">Contract</MenuItem>
                                        <MenuItem value="internship">Internship</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        label="Status"
                                        value={filters.status}
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="draft">Draft</MenuItem>
                                        <MenuItem value="open">Open</MenuItem>
                                        <MenuItem value="closed">Closed</MenuItem>
                                        <MenuItem value="on_hold">On Hold</MenuItem>
                                        <MenuItem value="expired">Expired</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Company</InputLabel>
                                    <Select
                                        label="Company"
                                        value={filters.company_id}
                                        onChange={(e) => setFilters({ ...filters, company_id: e.target.value })}
                                        disabled={companiesLoading}
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        {(companies || []).map((c) => (
                                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Course</InputLabel>
                                    <Select
                                        label="Course"
                                        value={filters.course_id}
                                        onChange={(e) => setFilters({ ...filters, course_id: e.target.value })}
                                        disabled={coursesLoading}
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        {(coursesData?.courses || []).map((course) => (
                                            <MenuItem key={course.id} value={course.id}>{course.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={1}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Location"
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                    
                    {jobPostingsLoading ? (
                        <Box display="flex" justifyContent="center" p={3}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Company</TableCell>
                                        <TableCell>Course</TableCell>
                                        <TableCell>Location</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredJobs.map((job) => (
                                        <TableRow key={job.id} hover>
                                            <TableCell>{job.title}</TableCell>
                                            <TableCell>{job.company?.name || 'N/A'}</TableCell>
                                            <TableCell>
                                                {(() => {
                                                    // Parse eligible_courses if it's a JSON string, otherwise use as is
                                                    let courses = [];
                                                    if (job.eligible_courses) {
                                                        if (typeof job.eligible_courses === 'string') {
                                                            try {
                                                                courses = JSON.parse(job.eligible_courses);
                                                            } catch (e) {
                                                                console.error('Error parsing eligible_courses:', e);
                                                                courses = [];
                                                            }
                                                        } else if (Array.isArray(job.eligible_courses)) {
                                                            courses = job.eligible_courses;
                                                        }
                                                    }
                                                    
                                                    // Display eligible_courses if available, otherwise fallback to course.name
                                                    if (courses && courses.length > 0) {
                                                        return courses.join(', ');
                                                    } else if (job.course?.name) {
                                                        return job.course.name;
                                                    } else {
                                                        return 'N/A';
                                                    }
                                                })()}
                                            </TableCell>
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
                                            <TableCell align="right">
                                                <Box display="flex" gap={1} justifyContent="flex-end">
                                                    <Button size="small" startIcon={<EditIcon />} onClick={() => handleOpenDialog(job)}>Edit</Button>
                                                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(job.id)}>Delete</Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Box>
                    <Typography variant="h5" gutterBottom>Job Posting Statistics</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center">
                                        <WorkIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                                        <Box>
                                            <Typography variant="h4">
                                                {jobPostings?.data?.length || 0}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Total Job Postings
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center">
                                        <BusinessIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                                        <Box>
                                            <Typography variant="h4">
                                                {jobPostings?.data?.filter(job => job.status === 'open').length || 0}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Active Job Postings
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center">
                                        <SchoolIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                                        <Box>
                                                                                         <Typography variant="h4">
                                                 {companies?.length || 0}
                                             </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Total Companies
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </TabPanel>

            {/* Job Posting Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>{selectedItem ? 'Edit Job Posting' : 'Add New Job Posting'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Job Title"
                                value={jobPostingForm.title}
                                onChange={(e) => setJobPostingForm({...jobPostingForm, title: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Company</InputLabel>
                                <Select
                                    value={jobPostingForm.company_id}
                                    onChange={(e) => setJobPostingForm({...jobPostingForm, company_id: e.target.value})}
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
                                <InputLabel>Courses</InputLabel>
                                <Select
                                    multiple
                                    value={jobPostingForm.eligible_courses || []}
                                    onChange={(e) => setJobPostingForm({...jobPostingForm, eligible_courses: e.target.value})}
                                    disabled={coursesLoading}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const course = coursesData?.courses?.find(c => c.id === value);
                                                return (
                                                    <Chip 
                                                        key={value} 
                                                        label={course ? course.name : value} 
                                                        size="small" 
                                                        sx={{
                                                            backgroundColor: '#1976d2',
                                                            color: 'white',
                                                            '&:hover': {
                                                                backgroundColor: '#1565c0'
                                                            }
                                                        }}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    )}
                                >
                                    {coursesLoading ? (
                                        <MenuItem disabled>Loading courses...</MenuItem>
                                    ) : (
                                        coursesData?.courses?.map((course) => (
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
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Job Type</InputLabel>
                                <Select
                                    value={jobPostingForm.job_type}
                                    onChange={(e) => setJobPostingForm({...jobPostingForm, job_type: e.target.value})}
                                >
                                    <MenuItem value="full_time">Full Time</MenuItem>
                                    <MenuItem value="part_time">Part Time</MenuItem>
                                    <MenuItem value="contract">Contract</MenuItem>
                                    <MenuItem value="internship">Internship</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={jobPostingForm.status}
                                    onChange={(e) => setJobPostingForm({...jobPostingForm, status: e.target.value})}
                                >
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="open">Open</MenuItem>
                                    <MenuItem value="closed">Closed</MenuItem>
                                    <MenuItem value="on_hold">On Hold</MenuItem>
                                    <MenuItem value="expired">Expired</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Job Description"
                                value={jobPostingForm.description}
                                onChange={(e) => setJobPostingForm({...jobPostingForm, description: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Job Requirements"
                                value={jobPostingForm.requirements}
                                onChange={(e) => setJobPostingForm({...jobPostingForm, requirements: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Job Responsibilities"
                                value={jobPostingForm.responsibilities}
                                onChange={(e) => setJobPostingForm({...jobPostingForm, responsibilities: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Minimum Salary"
                                type="number"
                                value={jobPostingForm.salary_min}
                                onChange={(e) => setJobPostingForm({...jobPostingForm, salary_min: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Maximum Salary"
                                type="number"
                                value={jobPostingForm.salary_max}
                                onChange={(e) => setJobPostingForm({...jobPostingForm, salary_max: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Experience Required"
                                value={jobPostingForm.experience_required}
                                onChange={(e) => setJobPostingForm({...jobPostingForm, experience_required: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Vacancies"
                                type="number"
                                value={jobPostingForm.vacancies}
                                onChange={(e) => setJobPostingForm({...jobPostingForm, vacancies: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Application Deadline"
                                type="date"
                                value={jobPostingForm.application_deadline}
                                onChange={(e) => setJobPostingForm({...jobPostingForm, application_deadline: e.target.value})}
                                InputLabelProps={{ shrink: true }}
                                placeholder=""
                            />
                        </Grid>
                        
                        {/* Job Eligibility Criteria Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>Job Eligibility Criteria</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="BTech Year of Passout (Min)"
                                type="number"
                                value={jobPostingForm.btech_year_of_passout_min}
                                onChange={e => setJobPostingForm({ ...jobPostingForm, btech_year_of_passout_min: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="BTech Year of Passout (Max)"
                                type="number"
                                value={jobPostingForm.btech_year_of_passout_max}
                                onChange={e => setJobPostingForm({ ...jobPostingForm, btech_year_of_passout_max: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="MTech Year of Passout (Min)"
                                type="number"
                                value={jobPostingForm.mtech_year_of_passout_min}
                                onChange={e => setJobPostingForm({ ...jobPostingForm, mtech_year_of_passout_min: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="MTech Year of Passout (Max)"
                                type="number"
                                value={jobPostingForm.mtech_year_of_passout_max}
                                onChange={e => setJobPostingForm({ ...jobPostingForm, mtech_year_of_passout_max: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="BTech Percentage (Min)"
                                type="number"
                                value={jobPostingForm.btech_percentage_min}
                                onChange={e => setJobPostingForm({ ...jobPostingForm, btech_percentage_min: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="MTech Percentage (Min)"
                                type="number"
                                value={jobPostingForm.mtech_percentage_min}
                                onChange={e => setJobPostingForm({ ...jobPostingForm, mtech_percentage_min: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Skills Required</InputLabel>
                                <Select
                                    multiple
                                    value={jobPostingForm.skills_required}
                                    onChange={e => setJobPostingForm({ ...jobPostingForm, skills_required: e.target.value })}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    <MenuItem value="Java">Java</MenuItem>
                                    <MenuItem value="Python">Python</MenuItem>
                                    <MenuItem value="JavaScript">JavaScript</MenuItem>
                                    <MenuItem value="React">React</MenuItem>
                                    <MenuItem value="Node.js">Node.js</MenuItem>
                                    <MenuItem value="SQL">SQL</MenuItem>
                                    <MenuItem value="MongoDB">MongoDB</MenuItem>
                                    <MenuItem value="AWS">AWS</MenuItem>
                                    <MenuItem value="Docker">Docker</MenuItem>
                                    <MenuItem value="Kubernetes">Kubernetes</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Additional Criteria"
                                value={jobPostingForm.additional_criteria}
                                onChange={e => setJobPostingForm({ ...jobPostingForm, additional_criteria: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        disabled={creatingJobPosting || updatingJobPosting}
                        sx={{ backgroundColor: brand.green, '&:hover': { backgroundColor: '#1ea152' } }}
                    >
                        {creatingJobPosting || updatingJobPosting ? <CircularProgress size={20} /> : 'Save'}
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
                        Are you sure you want to delete this job posting? This action cannot be undone.
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

export default JobPostingManagement; 