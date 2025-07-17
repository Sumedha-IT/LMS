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
    CircularProgress
} from '@mui/material';
import { 
    Work as WorkIcon, 
    School as SchoolIcon, 
    Assessment as AssessmentIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';

// Import sub-components
import PlacementEligibility from '../components/placement/PlacementEligibility';
import JobBoard from '../components/placement/JobBoard';
import MockInterviews from '../components/placement/MockInterviews';
import PlacementNotifications from '../components/placement/PlacementNotifications';
import StudentProfile from '../components/placement/StudentProfile';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`student-placement-tabpanel-${index}`}
            aria-labelledby={`student-placement-tab-${index}`}
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
        id: `student-placement-tab-${index}`,
        'aria-controls': `student-placement-tabpanel-${index}`,
    };
}

const StudentPlacement = () => {
    const { id } = useParams();
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState(null);
    const [eligibilityData, setEligibilityData] = useState(null);

    useEffect(() => {
        // Simulate loading student data
        setTimeout(() => {
            setStudentData({
                id: id,
                name: "John Doe",
                email: "john.doe@example.com",
                domain: "Computer Science",
                profileCompletion: 85,
                isEligible: false,
                eligibilityReasons: ["Profile completion below 90%", "Course not completed"]
            });
            setEligibilityData({
                profileCompletion: 85,
                courseCompletion: false,
                examStandards: true,
                attendance: 78,
                feesPayment: true,
                labTests: true,
                assignments: true
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
                    Student Placement Center
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your placement journey and job applications
                </Typography>
            </Box>

            {/* Eligibility Status Card */}
            <Card sx={{ mb: 3, backgroundColor: studentData?.isEligible ? '#e8f5e8' : '#fff3e0' }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                        {studentData?.isEligible ? (
                            <CheckCircleIcon color="success" />
                        ) : (
                            <CancelIcon color="warning" />
                        )}
                        <Box>
                            <Typography variant="h6">
                                {studentData?.isEligible ? 'Eligible for Placement' : 'Not Eligible for Placement'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {studentData?.eligibilityReasons?.join(', ')}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Paper sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                        value={tabValue} 
                        onChange={handleTabChange} 
                        aria-label="student placement tabs"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab 
                            icon={<PersonIcon />} 
                            label="Profile & Eligibility" 
                            {...a11yProps(0)} 
                        />
                        <Tab 
                            icon={<WorkIcon />} 
                            label="Job Board" 
                            {...a11yProps(1)} 
                        />
                        <Tab 
                            icon={<AssessmentIcon />} 
                            label="Mock Interviews" 
                            {...a11yProps(2)} 
                        />
                        <Tab 
                            icon={<NotificationsIcon />} 
                            label="Notifications" 
                            {...a11yProps(3)} 
                        />
                        <Tab 
                            icon={<SchoolIcon />} 
                            label="My Profile" 
                            {...a11yProps(4)} 
                        />
                    </Tabs>
                </Box>

                {/* Tab Panels */}
                <TabPanel value={tabValue} index={0}>
                    <PlacementEligibility 
                        studentData={studentData}
                        eligibilityData={eligibilityData}
                    />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <JobBoard studentId={id} />
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <MockInterviews studentId={id} />
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                    <PlacementNotifications studentId={id} />
                </TabPanel>

                <TabPanel value={tabValue} index={4}>
                    <StudentProfile studentId={id} />
                </TabPanel>
            </Paper>
        </Box>
    );
};

export default StudentPlacement; 