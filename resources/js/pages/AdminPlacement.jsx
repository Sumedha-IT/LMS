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
    TableRow
} from '@mui/material';
import { 
    Work as WorkIcon, 
    People as PeopleIcon, 
    Assessment as AssessmentIcon,
    Notifications as NotificationsIcon,
    Business as BusinessIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';

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

    useEffect(() => {
        // Simulate loading admin data
        setTimeout(() => {
            setStats({
                totalStudents: 150,
                eligibleStudents: 120,
                placedStudents: 85,
                activeJobs: 25,
                totalCompanies: 15
            });
            setLoading(false);
        }, 1000);
    }, [id]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

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
                                {stats.totalStudents}
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
                                {stats.eligibleStudents}
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
                                {stats.placedStudents}
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
                                {stats.activeJobs}
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
                                {stats.totalCompanies}
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
                            icon={<PeopleIcon />} 
                            label="Student Management" 
                            {...a11yProps(0)} 
                        />
                        <Tab 
                            icon={<WorkIcon />} 
                            label="Job Postings" 
                            {...a11yProps(1)} 
                        />
                        <Tab 
                            icon={<BusinessIcon />} 
                            label="Companies" 
                            {...a11yProps(2)} 
                        />
                        <Tab 
                            icon={<AssessmentIcon />} 
                            label="Reports" 
                            {...a11yProps(3)} 
                        />
                        <Tab 
                            icon={<NotificationsIcon />} 
                            label="Notifications" 
                            {...a11yProps(4)} 
                        />
                    </Tabs>
                </Box>

                {/* Tab Panels */}
                <TabPanel value={tabValue} index={0}>
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h5">Student Management</Typography>
                            <Button variant="contained" startIcon={<AddIcon />}>
                                Add Student
                            </Button>
                        </Box>
                        
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Domain</TableCell>
                                        <TableCell>Eligibility</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>John Doe</TableCell>
                                        <TableCell>Computer Science</TableCell>
                                        <TableCell>
                                            <Chip label="Eligible" color="success" size="small" />
                                        </TableCell>
                                        <TableCell>
                                            <Chip label="Not Placed" color="warning" size="small" />
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" gap={1}>
                                                <Button size="small" startIcon={<ViewIcon />}>
                                                    View
                                                </Button>
                                                <Button size="small" startIcon={<EditIcon />}>
                                                    Edit
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Jane Smith</TableCell>
                                        <TableCell>Data Science</TableCell>
                                        <TableCell>
                                            <Chip label="Not Eligible" color="error" size="small" />
                                        </TableCell>
                                        <TableCell>
                                            <Chip label="Not Placed" color="warning" size="small" />
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" gap={1}>
                                                <Button size="small" startIcon={<ViewIcon />}>
                                                    View
                                                </Button>
                                                <Button size="small" startIcon={<EditIcon />}>
                                                    Edit
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h5">Job Postings</Typography>
                            <Button variant="contained" startIcon={<AddIcon />}>
                                Add Job Posting
                            </Button>
                        </Box>
                        
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography>
                                Manage job postings, eligibility criteria, and application status
                            </Typography>
                        </Alert>
                        
                        <Typography variant="body1">
                            Job posting management interface will be implemented here.
                        </Typography>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h5">Companies</Typography>
                            <Button variant="contained" startIcon={<AddIcon />}>
                                Add Company
                            </Button>
                        </Box>
                        
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography>
                                Manage company information, contact details, and partnership status
                            </Typography>
                        </Alert>
                        
                        <Typography variant="body1">
                            Company management interface will be implemented here.
                        </Typography>
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

                <TabPanel value={tabValue} index={4}>
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
            </Paper>
        </Box>
    );
};

export default AdminPlacement; 