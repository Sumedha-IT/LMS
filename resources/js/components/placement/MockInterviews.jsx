import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Chip,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider
} from '@mui/material';
import {
    Assessment as AssessmentIcon,
    PlayArrow as PlayIcon,
    Stop as StopIcon,
    Mic as MicIcon,
    Videocam as VideoIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Star as StarIcon
} from '@mui/icons-material';

const MockInterviews = ({ studentId }) => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentInterview, setCurrentInterview] = useState(null);
    const [isInterviewActive, setIsInterviewActive] = useState(false);
    const [interviewDialogOpen, setInterviewDialogOpen] = useState(false);
    const [selectedInterviewType, setSelectedInterviewType] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [recording, setRecording] = useState(false);

    const interviewTypes = [
        { id: 'technical', name: 'Technical Interview', description: 'Programming, algorithms, system design' },
        { id: 'non_technical', name: 'Non-Technical Interview', description: 'Communication, problem-solving, behavioral' },
        { id: 'mixed', name: 'Mixed Interview', description: 'Combination of technical and non-technical questions' }
    ];

    // Mock data - replace with actual API calls
    useEffect(() => {
        setTimeout(() => {
            setInterviews([
                {
                    id: 1,
                    type: 'technical',
                    status: 'completed',
                    score: 85,
                    duration: 30,
                    date: '2024-01-10',
                    feedback: 'Good technical knowledge, needs improvement in system design',
                    questions: [
                        { question: 'What is object-oriented programming?', answer: 'OOP is a programming paradigm...', score: 90 },
                        { question: 'Explain the difference between stack and heap', answer: 'Stack is used for static memory...', score: 80 }
                    ]
                },
                {
                    id: 2,
                    type: 'non_technical',
                    status: 'scheduled',
                    score: null,
                    duration: 30,
                    date: '2024-01-15',
                    feedback: null,
                    questions: []
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const startInterview = (type) => {
        setSelectedInterviewType(type);
        setInterviewDialogOpen(true);
    };

    const beginInterview = () => {
        setCurrentInterview({
            id: Date.now(),
            type: selectedInterviewType,
            status: 'in_progress',
            startTime: new Date(),
            questions: []
        });
        setInterviewDialogOpen(false);
        setIsInterviewActive(true);
        setCurrentQuestion({
            id: 1,
            question: 'Tell me about yourself and your background.',
            category: 'behavioral'
        });
    };

    const stopInterview = () => {
        setIsInterviewActive(false);
        setCurrentInterview(null);
        setCurrentQuestion(null);
        setRecording(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'in_progress': return 'warning';
            case 'scheduled': return 'info';
            default: return 'default';
        }
    };

    const getTypeName = (type) => {
        const found = interviewTypes.find(t => t.id === type);
        return found ? found.name : type;
    };

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
                    Mock Interviews
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Practice interviews with AI analysis and feedback
                </Typography>
            </Box>

            {/* Active Interview */}
            {isInterviewActive && currentInterview && (
                <Card sx={{ mb: 3, backgroundColor: '#fff3e0' }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">
                                Interview in Progress - {getTypeName(currentInterview.type)}
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<StopIcon />}
                                onClick={stopInterview}
                            >
                                End Interview
                            </Button>
                        </Box>

                        {currentQuestion && (
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Current Question:
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {currentQuestion.question}
                                </Typography>

                                <Box display="flex" gap={2} mb={2}>
                                    <Button
                                        variant={recording ? "contained" : "outlined"}
                                        color={recording ? "error" : "primary"}
                                        startIcon={recording ? <StopIcon /> : <MicIcon />}
                                        onClick={() => setRecording(!recording)}
                                    >
                                        {recording ? "Stop Recording" : "Start Recording"}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<VideoIcon />}
                                    >
                                        Enable Camera
                                    </Button>
                                </Box>

                                <LinearProgress variant="indeterminate" />
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Interview Types */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {interviewTypes.map((type) => (
                    <Grid item xs={12} md={4} key={type.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {type.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {type.description}
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<PlayIcon />}
                                    onClick={() => startInterview(type.id)}
                                    fullWidth
                                >
                                    Start {type.name}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Interview History */}
            <Typography variant="h6" gutterBottom>
                Interview History
            </Typography>

            <Grid container spacing={3}>
                {interviews.map((interview) => (
                    <Grid item xs={12} key={interview.id}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box flex={1}>
                                        <Typography variant="h6" gutterBottom>
                                            {getTypeName(interview.type)} Interview
                                        </Typography>
                                        
                                        <Box display="flex" gap={2} mb={2}>
                                            <Chip 
                                                label={interview.status} 
                                                color={getStatusColor(interview.status)}
                                                size="small"
                                            />
                                            <Chip 
                                                icon={<ScheduleIcon />} 
                                                label={`${interview.duration} min`} 
                                                size="small"
                                            />
                                            {interview.score && (
                                                <Chip 
                                                    icon={<StarIcon />} 
                                                    label={`${interview.score}%`} 
                                                    color="success"
                                                    size="small"
                                                />
                                            )}
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            Date: {interview.date}
                                        </Typography>

                                        {interview.feedback && (
                                            <Alert severity="info" sx={{ mb: 2 }}>
                                                <Typography variant="body2">
                                                    <strong>Feedback:</strong> {interview.feedback}
                                                </Typography>
                                            </Alert>
                                        )}

                                        {interview.questions.length > 0 && (
                                            <Box>
                                                <Typography variant="body2" fontWeight="bold" gutterBottom>
                                                    Questions Asked:
                                                </Typography>
                                                <List dense>
                                                    {interview.questions.map((q, index) => (
                                                        <ListItem key={index}>
                                                            <ListItemIcon>
                                                                <CheckCircleIcon color="success" />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={q.question}
                                                                secondary={`Score: ${q.score}%`}
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Box>
                                        )}
                                    </Box>

                                    <Box>
                                        {interview.status === 'scheduled' && (
                                            <Button
                                                variant="contained"
                                                startIcon={<PlayIcon />}
                                                onClick={() => startInterview(interview.type)}
                                            >
                                                Start Now
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {interviews.length === 0 && (
                <Alert severity="info">
                    <Typography>
                        No interview history found. Start your first mock interview above.
                    </Typography>
                </Alert>
            )}

            {/* Interview Setup Dialog */}
            <Dialog open={interviewDialogOpen} onClose={() => setInterviewDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Start Mock Interview</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" paragraph>
                        You're about to start a <strong>{getTypeName(selectedInterviewType)}</strong> interview.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        • The interview will last approximately 30 minutes<br/>
                        • You'll be asked questions based on your selected type<br/>
                        • Your responses will be recorded and analyzed<br/>
                        • Make sure your microphone and camera are working
                    </Typography>
                    <Alert severity="warning">
                        <Typography variant="body2">
                            Please ensure you're in a quiet environment and have stable internet connection.
                        </Typography>
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setInterviewDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={beginInterview} variant="contained">
                        Start Interview
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MockInterviews; 