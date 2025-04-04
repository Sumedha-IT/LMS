import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography, Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TablePagination } from '@mui/material';
import { useGetUserExamDataQuery } from '../store/service/user/UserService';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { keyframes } from '@mui/system';
import ExamScoreDialog from './ExamScoreDialog';
import EmptyExamState from './EmptyExamState';

const blinkAnimation = keyframes`
  0% {
    box-shadow: 0 4px 20px rgba(238, 74, 14, 0.2);
    border: 2px solid rgba(238, 74, 14, 0.3);
    background-color: #FFF5F5;
  }
  50% {
    box-shadow: 0 4px 30px rgba(238, 74, 14, 0.4);
    border: 2px solid rgba(238, 74, 14, 0.6);
    background-color: #FED7D7;
  }
  100% {
    box-shadow: 0 4px 20px rgba(238, 74, 14, 0.2);
    border: 2px solid rgba(238, 74, 14, 0.3);
    box-shadow: 0 4px 20px rgba(238, 74, 14, 0.1);
    border: 1px solid rgba(238, 74, 14, 0.1);
  }
`;

const Timer = ({ startTime, onTimeUpdate }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0
    });
    const [shouldShowTimer, setShouldShowTimer] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            try {
                const now = new Date();
                // Convert the time string (e.g. "14:00") and date (e.g. "2025-04-03") to a full datetime
                const [hours, minutes] = startTime.split(':').map(Number);
                const examDate = new Date();
                examDate.setHours(hours, minutes, 0, 0);
                
                const difference = examDate - now;
                const totalSeconds = Math.floor(difference / 1000);

                if (difference > 0) {
                    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                    const minutes = Math.floor((difference / 1000 / 60) % 60);
                    const seconds = Math.floor((difference / 1000) % 60);

                    const newTimeLeft = { days, hours, minutes, seconds, totalSeconds };
                    setTimeLeft(newTimeLeft);
                    setShouldShowTimer(true);
                    onTimeUpdate && onTimeUpdate(totalSeconds);
                } else {
                    setShouldShowTimer(false);
                    onTimeUpdate && onTimeUpdate(0);
                }
            } catch (error) {
                console.error('Error calculating time:', error);
                setShouldShowTimer(false);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [startTime, onTimeUpdate]);

    if (!shouldShowTimer) return null;

    return (
        <Box sx={{ 
            display: 'flex', 
            gap: 1,
            mt: 2
        }}>
            {timeLeft.days > 0 && (
                <Box sx={{ 
                    bgcolor: '#FFFFFF',
                    borderRadius: '8px',
                    p: 1,
                    minWidth: '50px',
                    textAlign: 'center'
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D3748' }}>
                        {timeLeft.days.toString().padStart(2, '0')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#718096' }}>Days</Typography>
                </Box>
            )}
            <Box sx={{ 
                bgcolor: '#FFFFFF',
                borderRadius: '8px',
                p: 1,
                minWidth: '50px',
                textAlign: 'center'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: timeLeft.totalSeconds <= 60 ? '#EE4A0E' : '#2D3748' }}>
                    {timeLeft.hours.toString().padStart(2, '0')}
                </Typography>
                <Typography variant="caption" sx={{ color: '#718096' }}>Hours</Typography>
            </Box>
            <Box sx={{ 
                bgcolor: '#FFFFFF',
                borderRadius: '8px',
                p: 1,
                minWidth: '50px',
                textAlign: 'center'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: timeLeft.totalSeconds <= 60 ? '#EE4A0E' : '#2D3748' }}>
                    {timeLeft.minutes.toString().padStart(2, '0')}
                </Typography>
                <Typography variant="caption" sx={{ color: '#718096' }}>Mins</Typography>
            </Box>
            <Box sx={{ 
                bgcolor: '#FFFFFF',
                borderRadius: '8px',
                p: 1,
                minWidth: '50px',
                textAlign: 'center'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: timeLeft.totalSeconds <= 60 ? '#EE4A0E' : '#2D3748' }}>
                    {timeLeft.seconds.toString().padStart(2, '0')}
                </Typography>
                <Typography variant="caption" sx={{ color: '#718096' }}>Secs</Typography>
            </Box>
        </Box>
    );
};

const UserExamTable = ({ Value, userId }) => {
    const [userExamData, setUserExamData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedExam, setSelectedExam] = useState(null);
    const [scoreDialogOpen, setScoreDialogOpen] = useState(false);

    const { data, isLoading } = useGetUserExamDataQuery({
        page: page + 1,
        rowsPerPage: rowsPerPage,
        ExamType: (Value === 0 ? "upcoming" : "past"),
        userId: userId,
    });

    useEffect(() => {
        if (data?.data) {
            setUserExamData(data.data);
            setTotalCount(data.total || data.data.length);
        }
    }, [data]);

    const handleViewScore = (exam) => {
        setSelectedExam(exam);
        setScoreDialogOpen(true);
    };

    const handleCloseScoreDialog = () => {
        setScoreDialogOpen(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (isLoading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '400px' 
            }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (!userExamData || userExamData.length === 0) {
        return <EmptyExamState isUpcoming={Value === 0} />;
    }

    if (Value === 1) { // Attempted Exams Table View
        return (
            <Box>
                <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Exam Name</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Duration</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Questions</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Marks</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userExamData.map((exam) => (
                                <TableRow key={exam.id} hover>
                                    <TableCell>{exam.title}</TableCell>
                                    <TableCell>{exam.examDate}</TableCell>
                                    <TableCell>{exam.duration}</TableCell>
                                    <TableCell>{exam.totalQuestions}</TableCell>
                                    <TableCell>{exam.obtainedMarks}/{exam.totalMarks}</TableCell>
                                    <TableCell>
                                        <IconButton 
                                            onClick={() => handleViewScore(exam)}
                                            sx={{ 
                                                color: '#f4511e',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(244, 81, 30, 0.04)'
                                                }
                                            }}
                                        >
                                            <VisibilityOutlinedIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    sx={{
                        '.MuiTablePagination-select': {
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            mr: 1
                        },
                        '.MuiTablePagination-selectIcon': {
                            color: '#4A5568'
                        }
                    }}
                />

                <ExamScoreDialog 
                    exam={selectedExam}
                    open={scoreDialogOpen}
                    onClose={handleCloseScoreDialog}
                />
            </Box>
        );
    }

    const ExamCard = ({ exam }) => {
        const isUpcoming = Value === 0;
        const [isAboutToStart, setIsAboutToStart] = useState(false);
        const [examStarted, setExamStarted] = useState(false);

        const handleTimeUpdate = (totalSeconds) => {
            setIsAboutToStart(totalSeconds <= 60 && totalSeconds > 0);
            setExamStarted(totalSeconds <= 0);
        };

        return (
            <Card 
                sx={{ 
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: isAboutToStart ? 'none' : '0 4px 20px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    border: isAboutToStart ? '1px solid rgba(238, 74, 14, 0.1)' : 'none',
                    width: '100%',
                    maxWidth: '600px',
                    margin: '0 auto',
                    animation: isAboutToStart ? `${blinkAnimation} 1s ease-in-out infinite` : 'none',
                    transition: 'all 0.3s ease-in-out'
                }}
            >
                {/* Colored Header Section */}
                <Box
                    sx={{
                        backgroundColor: isUpcoming ? '#FFF5F3' : '#FFF8F0',
                        p: 3,
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out',
                        ...(isAboutToStart && {
                            backgroundColor: '#FFF1EE',
                        })
                    }}
                >
                    <Box sx={{ 
                        position: 'relative', 
                        zIndex: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                    }}>
                        <Box>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    fontWeight: 700, 
                                    fontSize: '24px',
                                    color: isAboutToStart ? '#EE4A0E' : '#1A202C',
                                    mb: 1,
                                    lineHeight: 1.2
                                }}
                            >
                                {exam.title}
                            </Typography>
                            <Typography 
                                variant="body1" 
                                sx={{
                                    color: '#718096',
                                    fontSize: '14px'
                                }}
                            >
                                {exam.subjectName || "Mid term Chapter 1 | MCQ"}
                            </Typography>
                            {isUpcoming && exam.starts_at && (
                                <Timer startTime={exam.starts_at} onTimeUpdate={handleTimeUpdate} />
                            )}
                        </Box>
                        <Box 
                            component="img" 
                            src={isUpcoming ? '/images/physics-icon.png' : '/images/chemistry-icon.png'} 
                            alt={isUpcoming ? "Physics Icon" : "Chemistry Icon"}
                            sx={{ 
                                width: '100px',
                                height: '100px',
                                objectFit: 'contain',
                                ml: 2
                            }}
                        />
                    </Box>
                </Box>

                {/* White Content Section */}
                <Box sx={{ 
                    bgcolor: '#FFFFFF', 
                    p: 3,
                    transition: 'all 0.3s ease-in-out',
                    ...(isAboutToStart && {
                        bgcolor: '#FFFFFF',
                    })
                }}>
                    {/* Info Cards Grid */}
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <Paper elevation={0} sx={{ 
                                p: 2,
                                border: '1px solid #E2E8F0',
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <CalendarTodayOutlinedIcon sx={{ fontSize: 20, color: '#4A5568' }} />
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ color: '#718096', display: 'block', mb: 0.5 }}>Date</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D3748' }}>{exam.examDate}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={3}>
                            <Paper elevation={0} sx={{ 
                                p: 2,
                                border: '1px solid #E2E8F0',
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <AccessTimeOutlinedIcon sx={{ fontSize: 20, color: '#4A5568' }} />
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ color: '#718096', display: 'block', mb: 0.5 }}>Duration</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D3748' }}>{exam.duration}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={3}>
                            <Paper elevation={0} sx={{ 
                                p: 2,
                                border: '1px solid #E2E8F0',
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <AssignmentOutlinedIcon sx={{ fontSize: 20, color: '#4A5568' }} />
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ color: '#718096', display: 'block', mb: 0.5 }}>Marks</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D3748' }}>{exam.totalMarks}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={3}>
                            <Paper elevation={0} sx={{ 
                                p: 2,
                                border: '1px solid #E2E8F0',
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <HelpOutlineOutlinedIcon sx={{ fontSize: 20, color: '#4A5568' }} />
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ color: '#718096', display: 'block', mb: 0.5 }}>Questions</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D3748' }}>{exam.totalQuestions}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Footer Section */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mt: 3
                    }}>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#718096', display: 'block', mb: 0.5 }}>Check-in Time</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D3748' }}>{exam.starts_at}</Typography>
                        </Box>
                        {(examStarted || !isUpcoming) && (
                            <Button
                                variant="contained"
                                href={isUpcoming ? `/user/${userId}/exam/${exam.id}` : '#'}
                                target={isUpcoming ? "_blank" : undefined}
                                sx={{
                                    backgroundColor: '#EE4A0E',
                                    color: '#fff',
                                    borderRadius: '30px',
                                    px: 4,
                                    py: 1,
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 6px rgba(238, 74, 14, 0.2)',
                                    '&:hover': {
                                        backgroundColor: '#D43D0A',
                                        boxShadow: '0 6px 8px rgba(238, 74, 14, 0.3)',
                                    },
                                    '&.Mui-disabled': {
                                        backgroundColor: '#E2E8F0',
                                        color: '#A0AEC0'
                                    }
                                }}
                                disabled={!isUpcoming && exam.status === 'Expired'}
                            >
                                {isUpcoming ? 'Start' : 'Review'}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Card>
        );
    };

    return (
        <Grid container spacing={3}>
            {userExamData.map((exam) => (
                <Grid item xs={12} md={6} key={exam.id}>
                    <ExamCard exam={exam} />
                </Grid>
            ))}
        </Grid>
    );
};

export default UserExamTable;