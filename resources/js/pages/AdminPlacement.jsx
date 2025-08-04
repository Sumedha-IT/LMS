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
    IconButton
} from '@mui/material';
import { 
    Work as WorkIcon, 
    Assessment as AssessmentIcon,
    Notifications as NotificationsIcon,
    Business as BusinessIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    Group as GroupIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
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
    useTestCompaniesApiQuery
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

    // API Hooks
    const { data: companies, isLoading: companiesLoading, refetch: refetchCompanies } = useGetCompaniesQuery();
    const { data: jobPostings, isLoading: jobPostingsLoading, refetch: refetchJobPostings } = useGetJobPostingsQuery();
    const { data: jobApplications, isLoading: jobApplicationsLoading, refetch: refetchJobApplications } = useGetJobApplicationsQuery();
    const { data: testResult } = useTestCompaniesApiQuery();

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
        domain_id: '',
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
                const activeJobs = jobPostings?.filter(job => job.status === 'open').length || 0;
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
                    activeJobs: jobPostings?.filter(job => job.status === 'open').length || 0,
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
                setJobPostingForm(item);
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
                    domain_id: '',
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

    const navigate = useNavigate();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Placement Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage student placements, job postings, and placement criteria
                </Typography>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={2.4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" color="primary">
                                {stats?.totalStudents || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Students
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={2.4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" color="success.main">
                                {stats?.eligibleStudents || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Eligible Students
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={2.4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" color="info.main">
                                {stats?.placedStudents || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Placed Students
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={2.4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" color="warning.main">
                                {stats?.activeJobs || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Active Jobs
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={2.4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" color="secondary.main">
                                {stats?.totalCompanies || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Companies
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                        value={tabValue} 
                        onChange={handleTabChange} 
                        aria-label="admin placement tabs"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab 
                            icon={<WorkIcon />} 
                            label="Job Postings" 
                            {...a11yProps(0)} 
                        />
                        <Tab 
                            icon={<BusinessIcon />} 
                            label="Companies" 
                            {...a11yProps(1)} 
                        />
                        <Tab 
                            icon={<AssessmentIcon />} 
                            label="Reports" 
                            {...a11yProps(2)} 
                        />
                        <Tab 
                            icon={<NotificationsIcon />} 
                            label="Notifications" 
                            {...a11yProps(3)} 
                        />
                        <Tab icon={<GroupIcon />} label="Students" {...a11yProps(4)} />
                    </Tabs>
                </Box>

                {/* Tab Panels */}
                <TabPanel value={tabValue} index={0}>
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h5">Job Postings</Typography>
                            <Button 
                                variant="contained" 
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog('jobPosting')}
                            >
                                Add Job Posting
                            </Button>
                        </Box>
                        
                        {jobPostingsLoading ? (
                            <Box display="flex" justifyContent="center" p={3}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Company</TableCell>
                                            <TableCell>Location</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {jobPostings?.map((job) => (
                                            <TableRow key={job.id}>
                                                <TableCell>{job.title}</TableCell>
                                                <TableCell>{job.company?.name || 'N/A'}</TableCell>
                                                <TableCell>{job.location}</TableCell>
                                                <TableCell>{job.job_type}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={job.status} 
                                                        color={job.status === 'open' ? 'success' : 'default'} 
                                                        size="small" 
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" gap={1}>
                                                        <Button 
                                                            size="small" 
                                                            startIcon={<EditIcon />}
                                                            onClick={() => handleOpenDialog('jobPosting', job)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button 
                                                            size="small" 
                                                            startIcon={<DeleteIcon />}
                                                            color="error"
                                                            onClick={() => handleDelete('jobPosting', job.id)}
                                                        >
                                                            Delete
                                                        </Button>
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
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h5">Companies</Typography>
                            <Button 
                                variant="contained" 
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog('company')}
                            >
                                Add Company
                            </Button>
                        </Box>
                        
                        {companiesLoading ? (
                            <Box display="flex" justifyContent="center" p={3}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Industry</TableCell>
                                            <TableCell>Contact Person</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {companies?.map((company) => (
                                            <TableRow key={company.id}>
                                                <TableCell>{company.name}</TableCell>
                                                <TableCell>{company.industry}</TableCell>
                                                <TableCell>{company.contact_person}</TableCell>
                                                <TableCell>{company.contact_email}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={company.is_active ? 'Active' : 'Inactive'} 
                                                        color={company.is_active ? 'success' : 'default'} 
                                                        size="small" 
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" gap={1}>
                                                        <Button 
                                                            size="small" 
                                                            startIcon={<EditIcon />}
                                                            onClick={() => handleOpenDialog('company', company)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button 
                                                            size="small" 
                                                            startIcon={<DeleteIcon />}
                                                            color="error"
                                                            onClick={() => handleDelete('company', company.id)}
                                                        >
                                                            Delete
                                                        </Button>
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

                <TabPanel value={tabValue} index={2}>
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

                <TabPanel value={tabValue} index={3}>
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Notification Management
                        </Typography>
                        
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography>
                                Send notifications to students about job postings and placement updates
                            </Typography>
                        </Alert>
                        
                        <Typography variant="body1">
                            Notification management interface will be implemented here.
                        </Typography>
                    </Box>
                </TabPanel>

                {/* Restore the full enhanced students UI in TabPanel index 4 */}
                <TabPanel value={tabValue} index={4}>
                    <PlacementStudents />
                </TabPanel>
            </Paper>

            {/* Company Dialog */}
            <Dialog open={openDialog && dialogType === 'company'} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>{selectedItem ? 'Edit Company' : 'Add New Company'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Company Name"
                                value={companyForm.name}
                                onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Industry"
                                value={companyForm.industry}
                                onChange={(e) => setCompanyForm({...companyForm, industry: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                value={companyForm.description}
                                onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Website"
                                value={companyForm.website}
                                onChange={(e) => setCompanyForm({...companyForm, website: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Company Size"
                                value={companyForm.company_size}
                                onChange={(e) => setCompanyForm({...companyForm, company_size: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Contact Person"
                                value={companyForm.contact_person}
                                onChange={(e) => setCompanyForm({...companyForm, contact_person: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Contact Email"
                                type="email"
                                value={companyForm.contact_email}
                                onChange={(e) => setCompanyForm({...companyForm, contact_email: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Contact Phone"
                                value={companyForm.contact_phone}
                                onChange={(e) => setCompanyForm({...companyForm, contact_phone: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Address"
                                value={companyForm.address}
                                onChange={(e) => setCompanyForm({...companyForm, address: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        disabled={creatingCompany || updatingCompany}
                    >
                        {creatingCompany || updatingCompany ? <CircularProgress size={20} /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Job Posting Dialog */}
            <Dialog open={openDialog && dialogType === 'jobPosting'} onClose={handleCloseDialog} maxWidth="md" fullWidth>
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
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                value={jobPostingForm.description}
                                onChange={(e) => setJobPostingForm({...jobPostingForm, description: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Requirements"
                                value={jobPostingForm.requirements}
                                onChange={(e) => setJobPostingForm({...jobPostingForm, requirements: e.target.value})}
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
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={jobPostingForm.status}
                                    onChange={(e) => setJobPostingForm({...jobPostingForm, status: e.target.value})}
                                >
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="open">Open</MenuItem>
                                    <MenuItem value="closed">Closed</MenuItem>
                                    <MenuItem value="expired">Expired</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Application Deadline"
                                type="datetime-local"
                                value={jobPostingForm.application_deadline}
                                onChange={(e) => setJobPostingForm({...jobPostingForm, application_deadline: e.target.value})}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        {/* Job Eligibility Criteria Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2 }}>Job Eligibility Criteria</Typography>
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
                                <InputLabel>Domain</InputLabel>
                                <Select
                                    value={jobPostingForm.domain_id}
                                    onChange={e => setJobPostingForm({ ...jobPostingForm, domain_id: e.target.value })}
                                >
                                    {/* TODO: Replace with real domains from API */}
                                    <MenuItem value="1">Computer Science</MenuItem>
                                    <MenuItem value="2">Electronics</MenuItem>
                                    <MenuItem value="3">Mechanical</MenuItem>
                                </Select>
                            </FormControl>
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
                                    {/* TODO: Replace with real skills from API */}
                                    <MenuItem value="Java">Java</MenuItem>
                                    <MenuItem value="Python">Python</MenuItem>
                                    <MenuItem value="SQL">SQL</MenuItem>
                                    <MenuItem value="React">React</MenuItem>
                                    <MenuItem value="Node.js">Node.js</MenuItem>
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
                    >
                        {creatingJobPosting || updatingJobPosting ? <CircularProgress size={20} /> : 'Save'}
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