import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { useGetUserExamDataQuery } from '../store/service/user/UserService';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EmptyExamState from './EmptyExamState';
import { keyframes } from '@mui/system';
import { useNavigate } from 'react-router-dom';


// Define the blinking animation for text
const blinkAnimation = keyframes`
  0% { color: #333333; }
  50% { color: #FF0000; }
  100% { color: #333333; }
`;

// Define the blinking animation for background
const blinkBackgroundAnimation = keyframes`
  0% { background-color: transparent; }
  50% { background-color: rgba(255, 0, 0, 0.1); }
  100% { background-color: transparent; }
`;

const UserExamTable = ({ Value, userId }) => {
    const [userExamData, setUserExamData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate();

    // Helper function to calculate time taken based on duration
    const calculateTimeTaken = (duration) => {
        if (!duration) return 'N/A';

        // If duration is already in the format "HH:MM", convert to "Xhr YYmin"
        if (duration.includes(':')) {
            const [hours, minutes] = duration.split(':').map(Number);
            return hours > 0 ? `${hours}hr ${minutes}min` : `${minutes}min`;
        }

        // If duration is in hours (e.g., "01.00"), convert to "Xhr"
        if (duration.includes('.')) {
            const [hours, minutes] = duration.split('.').map(Number);
            return hours > 0 ? `${hours}hr ${minutes}min` : `${minutes}min`;
        }

        // Default fallback
        return duration;
    };

    const { data, isLoading } = useGetUserExamDataQuery({
        page: page + 1,
        rowsPerPage: rowsPerPage,
        ExamType: (Value === 0 ? "upcoming" : "past"),
        userId: userId,
    });

    useEffect(() => {
        if (data?.data) {
            // Process the API data to ensure all required fields are properly formatted
            const processedData = data.data.map(exam => {

                // Get the actual question count from the exam data
                let actualQuestionCount = 0;

                // Try to get question count from report data
                if (exam.report && exam.report.aggregateReport) {
                    if (exam.report.aggregateReport.totalQuestions) {
                        actualQuestionCount = parseInt(exam.report.aggregateReport.totalQuestions);
                    } else if (exam.report.aggregateReport.noOfQuestions) {
                        actualQuestionCount = parseInt(exam.report.aggregateReport.noOfQuestions);
                    }
                }

                // If we still don't have a count, try other sources
                if (!actualQuestionCount) {
                    if (exam.totalQuestions) {
                        // Try to parse from totalQuestions if it's a string like "x/y"
                        const parts = exam.totalQuestions.toString().split('/');
                        if (parts.length > 1) {
                            actualQuestionCount = parseInt(parts[1]);
                        } else {
                            actualQuestionCount = parseInt(exam.totalQuestions);
                        }
                    }
                }

                // Format the data for display
                return {
                    ...exam,
                    // Format questions display - use actual count from database if available
                    totalQuestions: actualQuestionCount > 0
                        ? `${exam.correctAnswers || 0}/${actualQuestionCount}`
                        : (exam.totalQuestions
                            ? (exam.totalQuestions.toString().includes('/')
                                ? exam.totalQuestions
                                : `${exam.totalQuestions}/30`)
                            : '0/30'),
                    // Store the actual question count separately
                    actualQuestionCount: actualQuestionCount,
                    // Format marks display
                    obtainedMarks: exam.totalMarksObtained || '0',
                    // Format time taken - if not available, calculate from duration or show 'N/A'
                    timeTaken: exam.timeTaken || calculateTimeTaken(exam.duration),
                    // Ensure duration is properly formatted
                    duration: exam.duration || 'N/A',
                    // Ensure exam date is properly formatted
                    examDate: exam.examDate || 'N/A'
                };
            });


            setUserExamData(processedData);
            // Use totalRecords from API response for total count
            setTotalCount(data.totalRecords || data.data.length);
        } else if (Value === 1 && (!data?.data || data.data.length === 0)) {
            // If no data is available, set empty array
            setUserExamData([]);
            setTotalCount(0);
        }
    }, [data, Value]);

    const handleViewScore = (exam) => {
        // Prepare exam data for the review page
        const reviewDetails = {
            title: exam.title || 'Exam Review',
            duration: exam.timeTaken || calculateTimeTaken(exam.duration) || 'N/A',
            totalQuestions: exam.totalQuestions || 0,
            obtainedMarks: exam.totalMarksObtained || exam.obtainedMarks || 0,
            totalMarks: exam.totalMarks || 0
        };

        // Store the exam details in localStorage for the ReviewPage to access
        localStorage.setItem('reviewDetails', JSON.stringify(reviewDetails));

        // Navigate to the review page
        navigate(`/user/${userId}/exam/${exam.id}/review/${exam.examAttemptId || exam.id}`);
    };

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when changing rows per page
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
                <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#E84C0F !important' }}>
                                <TableCell sx={{ fontWeight: 600, color: '#FFFFFF !important', padding: '16px' }}>Exam Name</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#FFFFFF !important', padding: '16px' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#FFFFFF !important', padding: '16px' }}>Duration</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#FFFFFF !important', padding: '16px' }}>Questions</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#FFFFFF !important', padding: '16px' }}>Marks</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#FFFFFF !important', padding: '16px' }}>Time Taken</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#FFFFFF !important', padding: '16px', textAlign: 'center' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userExamData.map((exam, index) => (
                                <TableRow
                                    key={exam.id}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? '#FFF0EE !important' : '#E8F4FF !important',
                                        color: '#495057 !important',
                                        '&:hover': {
                                            backgroundColor: index % 2 === 0 ? '#FFE4E0 !important' : '#D4E8FF !important'
                                        }
                                    }}
                                >
                                    <TableCell sx={{ color: '#495057 !important', padding: '16px' }}>{exam.title || 'N/A'}</TableCell>
                                    <TableCell sx={{ color: '#495057 !important', padding: '16px' }}>{exam.examDate || 'N/A'}</TableCell>
                                    <TableCell sx={{ color: '#495057 !important', padding: '16px' }}>{exam.duration || 'N/A'}</TableCell>
                                    <TableCell sx={{ color: '#495057 !important', padding: '16px' }}>
                                        {exam.totalQuestions}
                                    </TableCell>
                                    <TableCell sx={{ color: '#495057 !important', padding: '16px' }}>
                                        {exam.obtainedMarks || '0'}/{exam.totalMarks || '0'}
                                    </TableCell>
                                    <TableCell sx={{ color: '#495057 !important', padding: '16px' }}>{exam.timeTaken || 'N/A'}</TableCell>
                                    <TableCell sx={{ padding: '16px', textAlign: 'center' }}>
                                        <IconButton
                                            onClick={() => handleViewScore(exam)}
                                            sx={{
                                                color: '#E84C0F',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(232, 76, 15, 0.04)'
                                                }
                                            }}
                                            size="small"
                                        >
                                            <VisibilityOutlinedIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 3,
                    mb: 2,
                    px: 2,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    p: 2
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <Typography variant="body2" sx={{ color: '#718096' }}>
                            Rows per page:
                        </Typography>
                        <select
                            value={rowsPerPage}
                            onChange={handleChangeRowsPerPage}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: '1px solid #E2E8F0',
                                color: '#2D3748',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                outline: 'none',
                                '&:hover': {
                                    borderColor: '#E84C0F'
                                }
                            }}
                        >
                            {[5, 10, 25, 50].map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <Typography variant="body2" sx={{ color: '#718096', ml: 2 }}>
                            {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, totalCount)} of ${totalCount}`}
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <Button
                            disabled={page === 0}
                            onClick={(e) => handleChangePage(e, page - 1)}
                            sx={{
                                minWidth: '40px',
                                height: '40px',
                                p: 0,
                                borderRadius: '8px',
                                border: '1px solid #E2E8F0',
                                color: page === 0 ? '#CBD5E0' : '#718096',
                                backgroundColor: 'white',
                                '&:hover': {
                                    backgroundColor: '#F7FAFC',
                                    borderColor: '#E84C0F'
                                },
                                '&:disabled': {
                                    backgroundColor: '#F7FAFC',
                                    borderColor: '#E2E8F0'
                                }
                            }}
                        >
                            {'<'}
                        </Button>

                        {(() => {
                            const pageCount = Math.ceil(totalCount / rowsPerPage);
                            const buttons = [];

                            // Always show first page
                            buttons.push(
                                <Button
                                    key="first"
                                    onClick={(e) => handleChangePage(e, 0)}
                                    sx={{
                                        minWidth: '40px',
                                        height: '40px',
                                        p: 0,
                                        borderRadius: '8px',
                                        backgroundColor: page === 0 ? '#E84C0F' : 'white',
                                        color: page === 0 ? 'white' : '#718096',
                                        border: page === 0 ? 'none' : '1px solid #E2E8F0',
                                        '&:hover': {
                                            backgroundColor: page === 0 ? '#E84C0F' : '#F7FAFC',
                                            borderColor: '#E84C0F'
                                        }
                                    }}
                                >
                                    1
                                </Button>
                            );

                            // Show ellipsis if needed
                            if (page > 2) {
                                buttons.push(
                                    <Box
                                        key="ellipsis1"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minWidth: '40px',
                                            color: '#718096'
                                        }}
                                    >
                                        ...
                                    </Box>
                                );
                            }

                            // Show current page and adjacent pages
                            for (let i = Math.max(1, page - 1); i <= Math.min(pageCount - 2, page + 1); i++) {
                                buttons.push(
                                    <Button
                                        key={i}
                                        onClick={(e) => handleChangePage(e, i)}
                                        sx={{
                                            minWidth: '40px',
                                            height: '40px',
                                            p: 0,
                                            borderRadius: '8px',
                                            backgroundColor: page === i ? '#E84C0F' : 'white',
                                            color: page === i ? 'white' : '#718096',
                                            border: page === i ? 'none' : '1px solid #E2E8F0',
                                            '&:hover': {
                                                backgroundColor: page === i ? '#E84C0F' : '#F7FAFC',
                                                borderColor: '#E84C0F'
                                            }
                                        }}
                                    >
                                        {i + 1}
                                    </Button>
                                );
                            }

                            // Show ellipsis if needed
                            if (page < pageCount - 3) {
                                buttons.push(
                                    <Box
                                        key="ellipsis2"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minWidth: '40px',
                                            color: '#718096'
                                        }}
                                    >
                                        ...
                                    </Box>
                                );
                            }

                            // Always show last page if there is more than one page
                            if (pageCount > 1) {
                                buttons.push(
                                    <Button
                                        key="last"
                                        onClick={(e) => handleChangePage(e, pageCount - 1)}
                                        sx={{
                                            minWidth: '40px',
                                            height: '40px',
                                            p: 0,
                                            borderRadius: '8px',
                                            backgroundColor: page === pageCount - 1 ? '#E84C0F' : 'white',
                                            color: page === pageCount - 1 ? 'white' : '#718096',
                                            border: page === pageCount - 1 ? 'none' : '1px solid #E2E8F0',
                                            '&:hover': {
                                                backgroundColor: page === pageCount - 1 ? '#E84C0F' : '#F7FAFC',
                                                borderColor: '#E84C0F'
                                            }
                                        }}
                                    >
                                        {pageCount}
                                    </Button>
                                );
                            }

                            return buttons;
                        })()}

                        <Button
                            disabled={page >= Math.ceil(totalCount / rowsPerPage) - 1}
                            onClick={(e) => handleChangePage(e, page + 1)}
                            sx={{
                                minWidth: '40px',
                                height: '40px',
                                p: 0,
                                borderRadius: '8px',
                                border: '1px solid #E2E8F0',
                                color: page >= Math.ceil(totalCount / rowsPerPage) - 1 ? '#CBD5E0' : '#718096',
                                backgroundColor: 'white',
                                '&:hover': {
                                    backgroundColor: '#F7FAFC',
                                    borderColor: '#E84C0F'
                                },
                                '&:disabled': {
                                    backgroundColor: '#F7FAFC',
                                    borderColor: '#E2E8F0'
                                }
                            }}
                        >
                            {'>'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        );
    }

    // Card view for upcoming exams

    const ExamCard = ({ exam, index }) => {
        const isUpcoming = Value === 0;
        const [examStarted, setExamStarted] = useState(false);
        const [timeRemaining, setTimeRemaining] = useState(null);
        const [showBlinkingTimer, setShowBlinkingTimer] = useState(false);

        useEffect(() => {
            // Check if exam has already started based on start time
            const now = new Date();
            if (exam.starts_at) {
                const [hours, minutes] = exam.starts_at.split(':').map(Number);
                const examDate = new Date();
                examDate.setHours(hours, minutes, 0, 0);

                if (now >= examDate) {
                    setExamStarted(true);
                    setTimeRemaining(null);
                } else {
                    // Calculate time remaining in minutes
                    const diffMs = examDate.getTime() - now.getTime();
                    const diffMinutes = Math.floor(diffMs / 60000);
                    const diffSeconds = Math.floor((diffMs % 60000) / 1000);

                    setTimeRemaining({ minutes: diffMinutes, seconds: diffSeconds });

                    // Set blinking timer if less than or equal to 1 minute remaining
                    setShowBlinkingTimer(diffMinutes <= 1);

                    // Update the timer every second
                    const timer = setInterval(() => {
                        const currentTime = new Date();
                        const remainingMs = examDate.getTime() - currentTime.getTime();

                        if (remainingMs <= 0) {
                            clearInterval(timer);
                            setExamStarted(true);
                            setTimeRemaining(null);
                            setShowBlinkingTimer(false);
                        } else {
                            const remainingMinutes = Math.floor(remainingMs / 60000);
                            const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);

                            setTimeRemaining({ minutes: remainingMinutes, seconds: remainingSeconds });
                            setShowBlinkingTimer(remainingMinutes <= 1);
                        }
                    }, 1000);

                    return () => clearInterval(timer);
                }
            } else {
                setExamStarted(true); // Default to enabled if no start time
                setTimeRemaining(null);
            }
        }, [exam.starts_at]);

        // Determine background color based on index
        const getBgColor = () => {
            if (index % 2 === 0) {
                return '#FFF0EE'; // Light pink for even indexes
            } else {
                return '#FFF8E8'; // Light yellow for odd indexes
            }
        };

        // Determine icon based on index
        const getIcon = () => {
            if (index % 2 === 0) {
                return "/images/physics-icon.png"; // Physics icon for even indexes
            } else {
                return "/images/chemistry-icon.png"; // Chemistry icon for odd indexes
            }
        };

        return (
            <Card
                sx={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    width: '100%',
                    bgcolor: '#FFFFFF',
                    mb: 3,
                    border: '1px solid #E2E8F0',
                }}
            >
                {/* Colored Header Section */}
                <Box
                    sx={{
                        bgcolor: getBgColor(),
                        p: 2.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: '#000000',
                                fontSize: '24px',
                                mb: 0.5
                            }}
                        >
                            {exam.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#666666',
                                fontSize: '14px'
                            }}
                        >
                            {exam.subjectName || "Mid term Chapter 1 | MCQ"}
                        </Typography>
                    </Box>
                    <Box
                        component="img"
                        src={getIcon()}
                        alt="Subject Icon"
                        sx={{
                            width: '80px',
                            height: 'auto',
                            objectFit: 'contain'
                        }}
                    />
                </Box>

                {/* Info Cards Section */}
                <Box sx={{ p: 2, bgcolor: '#FFFFFF', display: 'flex', flexWrap: 'wrap' }}>
                    <Box sx={{
                        flex: '1 1 25%',
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRight: '1px solid #EEEEEE'
                    }}>
                        <Box sx={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            bgcolor: '#F5F5F5',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: 1
                        }}>
                            <CalendarTodayOutlinedIcon sx={{ fontSize: 20, color: '#666666' }} />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#666666', mb: 0.5 }}>Date</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#333333' }}>
                            {exam.examDate || "12/01/2025"}
                        </Typography>
                    </Box>

                    <Box sx={{
                        flex: '1 1 25%',
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRight: '1px solid #EEEEEE'
                    }}>
                        <Box sx={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            bgcolor: '#F5F5F5',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: 1
                        }}>
                            <AccessTimeOutlinedIcon sx={{ fontSize: 20, color: '#666666' }} />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#666666', mb: 0.5 }}>Duration</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#333333' }}>
                            {exam.duration || "3 hr"}
                        </Typography>
                    </Box>

                    <Box sx={{
                        flex: '1 1 25%',
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRight: '1px solid #EEEEEE'
                    }}>
                        <Box sx={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            bgcolor: '#F5F5F5',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: 1
                        }}>
                            <AssignmentOutlinedIcon sx={{ fontSize: 20, color: '#666666' }} />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#666666', mb: 0.5 }}>Marks</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#333333' }}>
                            {exam.totalMarks || "100"}
                        </Typography>
                    </Box>

                    <Box sx={{
                        flex: '1 1 25%',
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Box sx={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            bgcolor: '#F5F5F5',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: 1
                        }}>
                            <HelpOutlineOutlinedIcon sx={{ fontSize: 20, color: '#666666' }} />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#666666', mb: 0.5 }}>Questions</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#333333' }}>
                            {exam.totalQuestions}
                        </Typography>
                    </Box>
                </Box>

                {/* Footer Section */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderTop: '1px solid #EEEEEE'
                }}>
                    <Box>
                        <Typography
                            sx={{
                                color: showBlinkingTimer ? '#FF0000' : '#666666',
                                fontSize: '14px',
                                mb: 0.5,
                                fontWeight: showBlinkingTimer ? 600 : 400,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            {timeRemaining ? (
                                <>
                                    {showBlinkingTimer && (
                                        <Box
                                            component="span"
                                            sx={{
                                                display: 'inline-block',
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                backgroundColor: '#FF0000',
                                                animation: `${blinkAnimation} 1s ease-in-out infinite`
                                            }}
                                        />
                                    )}
                                    Time Remaining
                                </>
                            ) : 'Check-in Time'}
                        </Typography>
                        {timeRemaining ? (
                            <Box
                                sx={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    display: 'inline-block',
                                    animation: showBlinkingTimer ? `${blinkBackgroundAnimation} 1s ease-in-out infinite` : 'none',
                                    border: showBlinkingTimer ? '1px solid #FF0000' : 'none',
                                    boxShadow: showBlinkingTimer ? '0 0 5px rgba(255, 0, 0, 0.3)' : 'none',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '16px',
                                        animation: showBlinkingTimer ? `${blinkAnimation} 1s ease-in-out infinite` : 'none',
                                        color: showBlinkingTimer ? '#FF0000' : '#333333',
                                    }}
                                >
                                    {`${timeRemaining.minutes.toString().padStart(2, '0')}:${timeRemaining.seconds.toString().padStart(2, '0')}`}
                                </Typography>
                            </Box>
                        ) : (
                            <Typography sx={{ fontWeight: 600, color: '#333333', fontSize: '16px' }}>
                                {exam.starts_at || "10:00AM"}
                            </Typography>
                        )}
                    </Box>
                    <Button
                        variant="contained"
                        href={isUpcoming && examStarted ? `/user/${userId}/exam/${exam.id}` : '#'}
                        target={isUpcoming && examStarted ? "_blank" : undefined}
                        sx={{
                            backgroundColor: '#E84C0F',
                            color: '#FFFFFF',
                            borderRadius: '50px',
                            px: 4,
                            py: 1,
                            fontSize: '16px',
                            fontWeight: 600,
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: '#D43D0A',
                                boxShadow: '0 4px 8px rgba(232, 76, 15, 0.3)'
                            },
                            '&:disabled': {
                                backgroundColor: '#E2E8F0',
                                color: '#A0AEC0'
                            }
                        }}
                        disabled={!examStarted && isUpcoming}
                    >
                        Start
                    </Button>
                </Box>
            </Card>
        );
    };

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, p: 2 }}>
            {userExamData.map((exam, index) => (
                <Box key={exam.id} sx={{ width: { xs: '100%', md: '48%' }, flexGrow: 1 }}>
                    <ExamCard exam={exam} index={index} />
                </Box>
            ))}
        </Box>
    );
};

export default UserExamTable;
