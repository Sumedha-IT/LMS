import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Grid,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Alert,
    Button
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Warning as WarningIcon,
    Edit as EditIcon
} from '@mui/icons-material';

const PlacementEligibility = ({ studentData, eligibilityData }) => {
    const criteria = [
        {
            name: 'Profile Completion',
            value: eligibilityData?.profileCompletion || 0,
            required: 90,
            status: (eligibilityData?.profileCompletion || 0) >= 90,
            description: 'Complete your profile with all required information'
        },
        {
            name: 'Course Completion',
            value: eligibilityData?.courseCompletion ? 100 : 0,
            required: 100,
            status: eligibilityData?.courseCompletion,
            description: 'Complete all assigned courses and modules'
        },
        {
            name: 'Exam Standards',
            value: eligibilityData?.examStandards ? 100 : 0,
            required: 100,
            status: eligibilityData?.examStandards,
            description: 'Meet minimum exam performance standards'
        },
        {
            name: 'Attendance',
            value: eligibilityData?.attendance || 0,
            required: 75,
            status: (eligibilityData?.attendance || 0) >= 75,
            description: 'Maintain minimum attendance percentage'
        },
        {
            name: 'Fees Payment',
            value: eligibilityData?.feesPayment ? 100 : 0,
            required: 100,
            status: eligibilityData?.feesPayment,
            description: 'Complete all fee payments'
        },
        {
            name: 'Lab Test Cases',
            value: eligibilityData?.labTests ? 100 : 0,
            required: 100,
            status: eligibilityData?.labTests,
            description: 'Complete all lab test cases and assignments'
        },
        {
            name: 'Assignments',
            value: eligibilityData?.assignments ? 100 : 0,
            required: 100,
            status: eligibilityData?.assignments,
            description: 'Submit all required assignments'
        }
    ];

    const completedCriteria = criteria.filter(c => c.status).length;
    const totalCriteria = criteria.length;

    return (
        <Box>
            {/* Overall Progress */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Eligibility Progress</Typography>
                        <Chip 
                            label={`${completedCriteria}/${totalCriteria} Completed`}
                            color={completedCriteria === totalCriteria ? "success" : "warning"}
                        />
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={(completedCriteria / totalCriteria) * 100}
                        sx={{ height: 10, borderRadius: 5 }}
                    />
                </CardContent>
            </Card>

            {/* Criteria Details */}
            <Grid container spacing={3}>
                {criteria.map((criterion, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6">{criterion.name}</Typography>
                                    {criterion.status ? (
                                        <CheckCircleIcon color="success" />
                                    ) : (
                                        <CancelIcon color="error" />
                                    )}
                                </Box>
                                
                                <Typography variant="body2" color="text.secondary" mb={2}>
                                    {criterion.description}
                                </Typography>

                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="body2">
                                        Progress: {criterion.value}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Required: {criterion.required}%
                                    </Typography>
                                </Box>

                                <LinearProgress 
                                    variant="determinate" 
                                    value={criterion.value}
                                    color={criterion.status ? "success" : "warning"}
                                    sx={{ height: 8, borderRadius: 4 }}
                                />

                                {!criterion.status && (
                                    <Alert severity="warning" sx={{ mt: 2 }}>
                                        <Typography variant="body2">
                                            You need to achieve {criterion.required}% to meet this requirement
                                        </Typography>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button 
                    variant="contained" 
                    startIcon={<EditIcon />}
                    onClick={() => window.location.href = `/administrator/${studentData?.id}/my-profile`}
                >
                    Complete Profile
                </Button>
                <Button 
                    variant="outlined"
                    onClick={() => window.location.href = `/administrator/${studentData?.id}/my-courses`}
                >
                    View Courses
                </Button>
            </Box>

            {/* Eligibility Status */}
            {studentData?.isEligible ? (
                <Alert severity="success" sx={{ mt: 3 }}>
                    <Typography variant="h6">
                        Congratulations! You are eligible for placement.
                    </Typography>
                    <Typography variant="body2">
                        You can now access job postings and apply for positions.
                    </Typography>
                </Alert>
            ) : (
                <Alert severity="warning" sx={{ mt: 3 }}>
                    <Typography variant="h6">
                        You are not yet eligible for placement.
                    </Typography>
                    <Typography variant="body2">
                        Please complete the missing requirements above to become eligible.
                    </Typography>
                </Alert>
            )}
        </Box>
    );
};

export default PlacementEligibility; 