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
    Divider,
    Avatar,
    CardActions,
    IconButton,
    Tooltip,
    LinearProgress
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
    Visibility as ViewIcon
} from '@mui/icons-material';
import { useGetJobPostingsQuery } from '../../store/service/user/UserService';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [jobType, setJobType] = useState('');
    const [location, setLocation] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [applyDialogOpen, setApplyDialogOpen] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState([]);

    // Real API call for job postings
    const { data: jobPostings, isLoading: loading, error } = useGetJobPostingsQuery();

    // Transform API data to match component expectations
    const jobs = jobPostings ? jobPostings.map(job => ({
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
        deadline: job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : 'N/A',
        domain: 'Computer Science' // Default domain
    })) : [];

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

    if (loading) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                    Loading job opportunities...
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
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Available Jobs
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Discover exciting opportunities that match your skills and career goals
                </Typography>
                <LinearProgress 
                    variant="determinate" 
                    value={filteredJobs.length > 0 ? 100 : 0} 
                    sx={{ height: 4, borderRadius: 2 }}
                />
            </Box>

            {/* Enhanced Filters */}
            <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Search jobs by title or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                                    sx: { borderRadius: 2 }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
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
                                    sx={{ borderRadius: 2 }}
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
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value="">All Locations</MenuItem>
                                    <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                                    <MenuItem value="Bangalore">Bangalore</MenuItem>
                                    <MenuItem value="Mumbai">Mumbai</MenuItem>
                                    <MenuItem value="Remote">Remote</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <Chip 
                                    icon={<FilterIcon />} 
                                    label={`${filteredJobs.length} jobs`} 
                                    color="primary" 
                                    variant="outlined"
                                    sx={{ borderRadius: 2 }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Modern Job Listings */}
            <Grid container spacing={3}>
                {filteredJobs.map((job) => (
                    <Grid item xs={12} key={job.id}>
                        <Card 
                            sx={{ 
                                borderRadius: 4, 
                                boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                                transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
                                border: isApplied(job.id) ? '2px solid #4caf50' : '1px solid #e0e0e0',
                                background: '#fff',
                                '&:hover': {
                                    transform: 'translateY(-6px) scale(1.01)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
                                },
                                p: { xs: 2, sm: 3 },
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                                <Box display="flex" gap={{ xs: 2, sm: 4 }} flexDirection={{ xs: 'column', sm: 'row' }}>
                                    {/* Company Avatar */}
                                    <Avatar 
                                        sx={{ 
                                            width: 64, 
                                            height: 64, 
                                            bgcolor: 'primary.main',
                                            fontSize: '1.4rem',
                                            fontWeight: 700,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                        }}
                                    >
                                        {getCompanyInitials(job.company)}
                                    </Avatar>

                                    {/* Job Details */}
                                    <Box flex={1} minWidth={0}>
                                        <Box display="flex" justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={2} flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
                                            <Box minWidth={0}>
                                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2, fontSize: { xs: '1.1rem', sm: '1.4rem' }, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                    {job.title}
                                                </Typography>
                                                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                                                    {job.company}
                                                </Typography>
                                            </Box>
                                            {isApplied(job.id) && (
                                                <Chip 
                                                    label="Applied" 
                                                    color="success" 
                                                    icon={<StarIcon />}
                                                    sx={{ borderRadius: 2, fontWeight: 600 }}
                                                />
                                            )}
                                        </Box>

                                        {/* Job Tags */}
                                        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                                            <Chip 
                                                icon={<LocationIcon />} 
                                                label={job.location} 
                                                size="small" 
                                                variant="outlined"
                                                sx={{ borderRadius: 2, fontSize: '0.85rem', bgcolor: '#f5f5f5' }}
                                            />
                                            <Chip 
                                                icon={<MoneyIcon />} 
                                                label={job.salary} 
                                                size="small" 
                                                variant="outlined"
                                                sx={{ borderRadius: 2, fontSize: '0.85rem', bgcolor: '#f5f5f5' }}
                                            />
                                            <Chip 
                                                icon={<ScheduleIcon />} 
                                                label={job.type} 
                                                size="small" 
                                                color={getJobTypeColor(job.type)}
                                                sx={{ borderRadius: 2, fontSize: '0.85rem' }}
                                            />
                                            <Chip 
                                                icon={<TrendingIcon />} 
                                                label={job.experience} 
                                                size="small" 
                                                variant="outlined"
                                                sx={{ borderRadius: 2, fontSize: '0.85rem', bgcolor: '#f5f5f5' }}
                                            />
                                        </Box>

                                        {/* Job Description with Read More */}
                                        <JobDescription description={job.description} />

                                        {/* Requirements */}
                                        {job.requirements.length > 0 && (
                                            <Box mb={2}>
                                                <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ color: 'text.primary' }}>
                                                    Skills Required:
                                                </Typography>
                                                <Box display="flex" gap={1} flexWrap="wrap">
                                                    {job.requirements.slice(0, 4).map((req, index) => (
                                                        <Chip 
                                                            key={index} 
                                                            label={req} 
                                                            size="small" 
                                                            variant="outlined"
                                                            sx={{ borderRadius: 2, fontSize: '0.75rem', bgcolor: '#f5f5f5' }}
                                                        />
                                                    ))}
                                                    {job.requirements.length > 4 && (
                                                        <Chip 
                                                            label={`+${job.requirements.length - 4} more`} 
                                                            size="small" 
                                                            variant="outlined"
                                                            sx={{ borderRadius: 2, fontSize: '0.75rem', bgcolor: '#f5f5f5' }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        )}

                                        {/* Footer */}
                                        <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
                                            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        Posted: {job.postedDate}
                                                    </Typography>
                                                </Box>
                                                {job.deadline !== 'N/A' && (
                                                    <Box display="flex" alignItems="center" gap={0.5}>
                                                        <ViewIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            Deadline: {job.deadline}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                            <Box>
                                                {!isApplied(job.id) ? (
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<ApplyIcon />}
                                                        onClick={() => handleApply(job)}
                                                        sx={{ 
                                                            borderRadius: 3, 
                                                            px: 3, 
                                                            py: 1.2,
                                                            textTransform: 'none',
                                                            fontWeight: 700,
                                                            fontSize: { xs: '0.95rem', sm: '1.05rem' },
                                                            boxShadow: '0 2px 8px rgba(76,175,80,0.08)'
                                                        }}
                                                    >
                                                        Apply Now
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outlined"
                                                        color="success"
                                                        disabled
                                                        sx={{ 
                                                            borderRadius: 3, 
                                                            px: 3, 
                                                            py: 1.2,
                                                            textTransform: 'none',
                                                            fontWeight: 700,
                                                            fontSize: { xs: '0.95rem', sm: '1.05rem' }
                                                        }}
                                                    >
                                                        Applied
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {filteredJobs.length === 0 && (
                <Card sx={{ mt: 3, borderRadius: 3, textAlign: 'center', py: 6 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <WorkIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                        <Typography variant="h6" color="text.secondary">
                            No jobs found matching your criteria
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Try adjusting your search filters or check back later for new opportunities
                        </Typography>
                    </Box>
                </Card>
            )}

            {/* Enhanced Apply Dialog */}
            <Dialog 
                open={applyDialogOpen} 
                onClose={() => setApplyDialogOpen(false)} 
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
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={confirmApply} 
                        variant="contained"
                        sx={{ 
                            borderRadius: 2, 
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        Confirm Application
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default JobBoard; 