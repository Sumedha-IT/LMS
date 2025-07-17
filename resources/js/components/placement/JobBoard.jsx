import React, { useState, useEffect } from 'react';
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
    Divider
} from '@mui/material';
import {
    Work as WorkIcon,
    LocationOn as LocationIcon,
    Business as BusinessIcon,
    AttachMoney as MoneyIcon,
    Schedule as ScheduleIcon,
    Send as ApplyIcon,
    Search as SearchIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';

const JobBoard = ({ studentId }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [jobType, setJobType] = useState('');
    const [location, setLocation] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [applyDialogOpen, setApplyDialogOpen] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState([]);

    // Mock data - replace with actual API calls
    useEffect(() => {
        setTimeout(() => {
            setJobs([
                {
                    id: 1,
                    title: 'Software Engineer',
                    company: 'Google',
                    location: 'Hyderabad',
                    type: 'Full Time',
                    salary: '₹8-12 LPA',
                    experience: '0-2 years',
                    description: 'We are looking for a talented software engineer to join our team...',
                    requirements: ['Java', 'Python', 'SQL'],
                    postedDate: '2024-01-15',
                    deadline: '2024-02-15',
                    domain: 'Computer Science'
                },
                {
                    id: 2,
                    title: 'Frontend Developer',
                    company: 'Microsoft',
                    location: 'Bangalore',
                    type: 'Full Time',
                    salary: '₹6-10 LPA',
                    experience: '0-1 years',
                    description: 'Join our frontend team to build amazing user experiences...',
                    requirements: ['React', 'JavaScript', 'CSS'],
                    postedDate: '2024-01-10',
                    deadline: '2024-02-10',
                    domain: 'Computer Science'
                },
                {
                    id: 3,
                    title: 'Data Analyst',
                    company: 'Amazon',
                    location: 'Mumbai',
                    type: 'Full Time',
                    salary: '₹5-8 LPA',
                    experience: '0-2 years',
                    description: 'Analyze data and provide insights to drive business decisions...',
                    requirements: ['Python', 'SQL', 'Excel'],
                    postedDate: '2024-01-12',
                    deadline: '2024-02-12',
                    domain: 'Computer Science'
                }
            ]);
            setAppliedJobs([1]); // Mock applied job IDs
            setLoading(false);
        }, 1000);
    }, []);

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !jobType || job.type === jobType;
        const matchesLocation = !location || job.location === location;
        
        return matchesSearch && matchesType && matchesLocation;
    });

    const handleApply = (job) => {
        setSelectedJob(job);
        setApplyDialogOpen(true);
    };

    const confirmApply = () => {
        if (selectedJob) {
            setAppliedJobs([...appliedJobs, selectedJob.id]);
            setApplyDialogOpen(false);
            setSelectedJob(null);
        }
    };

    const isApplied = (jobId) => appliedJobs.includes(jobId);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Available Jobs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Jobs matching your domain and eligibility criteria
                </Typography>
            </Box>

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                placeholder="Search jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Job Type</InputLabel>
                                <Select
                                    value={jobType}
                                    onChange={(e) => setJobType(e.target.value)}
                                    label="Job Type"
                                >
                                    <MenuItem value="">All Types</MenuItem>
                                    <MenuItem value="Full Time">Full Time</MenuItem>
                                    <MenuItem value="Part Time">Part Time</MenuItem>
                                    <MenuItem value="Contract">Contract</MenuItem>
                                    <MenuItem value="Internship">Internship</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Location</InputLabel>
                                <Select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    label="Location"
                                >
                                    <MenuItem value="">All Locations</MenuItem>
                                    <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                                    <MenuItem value="Bangalore">Bangalore</MenuItem>
                                    <MenuItem value="Mumbai">Mumbai</MenuItem>
                                    <MenuItem value="Remote">Remote</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">
                                {filteredJobs.length} jobs found
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Job Listings */}
            <Grid container spacing={3}>
                {filteredJobs.map((job) => (
                    <Grid item xs={12} key={job.id}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box flex={1}>
                                        <Typography variant="h6" gutterBottom>
                                            {job.title}
                                        </Typography>
                                        <Typography variant="body1" color="primary" gutterBottom>
                                            {job.company}
                                        </Typography>
                                        
                                        <Box display="flex" gap={2} mb={2}>
                                            <Chip 
                                                icon={<LocationIcon />} 
                                                label={job.location} 
                                                size="small" 
                                            />
                                            <Chip 
                                                icon={<MoneyIcon />} 
                                                label={job.salary} 
                                                size="small" 
                                            />
                                            <Chip 
                                                icon={<ScheduleIcon />} 
                                                label={job.type} 
                                                size="small" 
                                            />
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {job.description}
                                        </Typography>

                                        <Box mb={2}>
                                            <Typography variant="body2" fontWeight="bold" gutterBottom>
                                                Requirements:
                                            </Typography>
                                            <Box display="flex" gap={1} flexWrap="wrap">
                                                {job.requirements.map((req, index) => (
                                                    <Chip 
                                                        key={index} 
                                                        label={req} 
                                                        size="small" 
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Box>
                                        </Box>

                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="caption" color="text.secondary">
                                                Posted: {job.postedDate} | Deadline: {job.deadline}
                                            </Typography>
                                            {isApplied(job.id) ? (
                                                <Chip label="Applied" color="success" />
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    startIcon={<ApplyIcon />}
                                                    onClick={() => handleApply(job)}
                                                >
                                                    Apply Now
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {filteredJobs.length === 0 && (
                <Alert severity="info">
                    <Typography>
                        No jobs found matching your criteria. Try adjusting your filters.
                    </Typography>
                </Alert>
            )}

            {/* Apply Dialog */}
            <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" paragraph>
                        Are you sure you want to apply for the <strong>{selectedJob?.title}</strong> position at <strong>{selectedJob?.company}</strong>?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Your resume and profile information will be shared with the company.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setApplyDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={confirmApply} variant="contained">
                        Confirm Application
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default JobBoard; 