import React, { useEffect, useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import { useGetExamStatisticMutation, useGetExamResultMutation } from '../store/service/user/UserService';
import { useNavigate } from 'react-router-dom';
import CalculatorModal from '../components/exam/CalculatorModal';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// Only show these columns in the confirmation table
const tableHeaders = [
    { label: 'No. of Questions', accessor: 'noOfQuestions' },
    { label: 'Answered', accessor: 'answered' },
    { label: 'Not Answered', accessor: 'notAnswered' },
    { label: 'Not Visited', accessor: 'notVisited' },
];

const SubmissionPage = ({
    userId, examId, examAttemptId, setIsSubmission, setIsSubmit, setTimeLeft, setIsTimeOver
}) => {
    const [getExamStatistic] = useGetExamStatisticMutation();
    const [getExamResult, { isLoading: isSubmitting }] = useGetExamResultMutation();
    const [examStatisticData, setExamStatisticData] = useState();
    const [errorMessage, setErrorMessage] = useState(null); // For handling error messages
    const navigate = useNavigate();
    const [calculatorOpen, setCalculatorOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            let result = await getExamStatistic({ userId, examId, examAttemptId });
            if (result?.data?.status === 400) {
                setErrorMessage(result.data.message); // Handle 400 error
            } else {
                setExamStatisticData(result?.data?.data);
            }
        } catch (e) {
            console.log(e);
        }
    };

    // Helper to process examStatisticData according to new rules and correct field names
    const processExamStats = (data) => {
        if (!Array.isArray(data)) return [];
        return data.map(row => {
            // Use the correct field names from the API
            const answered = (row.answered ?? 0) + (row.answeredAndMarkForReview ?? 0);
            const notAnswered = (row.notAnswered ?? 0) + (row.markForReview ?? 0);
            // Not Visited remains as is
            return {
                ...row,
                answered,
                notAnswered,
            };
        });
    };

    const handleSubmitQuiz = async () => {
        try {
            // Remove beforeunload handler immediately
            window.onbeforeunload = null;

            // Call your API to submit the exam and await it
            const result = await getExamResult({ userId, examId, examAttemptId });
            if (result?.data?.status === 200) {
                // Set exam as completed
                setTimeLeft(0);
                setIsTimeOver(true);
                localStorage.setItem('isTimeOver', true);
                localStorage.removeItem('examStartTime');
                localStorage.removeItem('timeLeft');

                // Show completion dialog
                setOpenDialog(true);

                // Wait for 3 seconds before closing the window
                setTimeout(() => {
                    window.close();
                }, 5000);
            } else {
                // Show error if submission failed
                setErrorMessage(result?.data?.message || 'Failed to submit exam.');
            }
        } catch (error) {
            setErrorMessage('Error submitting exam.');
            console.error('Error submitting exam:', error);
        }
    };

    const handleQuitClick = () => {
        setIsSubmit(false);
        setIsSubmission(false);
    };
    const handleGoBack = () => {
        navigate('/user'); // Navigate back to the user page
    };

    // Determine if time is over (from prop or localStorage)
    const isTimeOverFromProp = typeof window !== 'undefined' && typeof window.isTimeOver !== 'undefined' ? window.isTimeOver : false;
    const isTimeOverFromLocalStorage = localStorage.getItem('isTimeOver') === 'true';
    const timeOver = (typeof isTimeOver !== 'undefined' && isTimeOver === true) || isTimeOverFromProp || isTimeOverFromLocalStorage;

    return (
        <>
            {errorMessage ? ( // Display error message if 400 error occurs
                <Box sx={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: `calc(100vh - 60px)`, textAlign: 'center'
                }}>
                    <Typography variant="h6" sx={{ color: '#f97316', mb: 2 }}>
                        {errorMessage}
                    </Typography>
                    <Button variant="contained" onClick={handleGoBack} sx={{ bgcolor: '#f97316' }}>
                        Close
                    </Button>
                </Box>
            ) : examStatisticData ? (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100vh',
                 // Full viewport height for centering
                }}  >
                    {/* Exam Name (if available) */}
                    {examStatisticData[0]?.examTitle && (
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                            {examStatisticData[0]?.examTitle}
                        </Typography>
                    )}
                    <TableContainer sx={{  border: '1px solid rgba(0, 0, 0, 0.12)', mx: { xl: '50px', md: '40px', sm: '30px', xs: '20px' }, width: "95%" }}>
                        <Table aria-label="quiz details table">
                            <TableHead>
                                <TableRow >
                                    {tableHeaders.map((header, index) => (
                                        <TableCell key={index}  sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)', fontWeight: 'bold', textAlign: 'center', fontSize: { xs: '11px', sm: '12px', md: '13px', xl: '14px', padding: '5px' } }}>{header.label}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {processExamStats(examStatisticData)?.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {tableHeaders.map((header, colIndex) => (
                                            <TableCell key={colIndex} sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)',  textAlign: 'center',fontSize: { xs: '9px', sm: '10px', md: '12px', xl: '14px' }, padding: '10px' }}>
                                                {row[header.accessor]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Typography variant="h6" align="center" sx={{ fontSize: { xs: '13px', sm: '15px', md: '17px', xl: '20px' }, marginTop: 2 }}>
                        Are you sure you want to submit?
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, marginTop: 2 }}>
                        <Button
                            variant="contained"
                            sx={{
                                fontSize: { xs: '9px', sm: '10px', md: '12px', xl: '14px' },
                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                color: 'white',
                                fontWeight: 600,
                                borderRadius: '8px',
                                boxShadow: 'none',
                                textTransform: 'none',
                                px: 3,
                                '&:hover': {
                                    background: 'linear-gradient(270deg, #e42b12 0%, #eb6707 100%)',
                                    color: '#fff',
                                    boxShadow: 'none',
                                },
                            }}
                            onClick={handleSubmitQuiz}
                        >
                            Submit
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{ fontSize: { xs: '9px', sm: '10px', md: '12px', xl: '14px' } }}
                            color="primary"
                            onClick={handleQuitClick}
                            disabled={timeOver}
                        >
                            No, Go Back To Quiz
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: `calc(100vh - 60px)` }}>
                    {isSubmitting ? <CircularProgress /> : <CircularProgress />}
                </Box>
            )}
            <Dialog
                open={openDialog}
                onClose={null}
                aria-labelledby="exam-completed-dialog-title"
                aria-describedby="exam-completed-dialog-description"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        boxShadow: 8,
                        background: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(10px)',
                        minWidth: { xs: 280, sm: 400 },
                        textAlign: 'center',
                    }
                }}
                sx={{
                    '& .MuiDialog-container': {
                        background: 'linear-gradient(135deg, #f97316 0%, #6366f1 100%)',
                        backdropFilter: 'blur(8px)',
                    }
                }}
            >
                <DialogTitle id="exam-completed-dialog-title" sx={{ fontWeight: 'bold', fontSize: 24, color: '#f97316' }}>
                    Exam Completed Successfully!
                </DialogTitle>
                <DialogContent id="exam-completed-dialog-description" sx={{ fontSize: 18, color: '#333', py: 2 }}>
                    <Typography sx={{ mb: 2 }}>
                        Your exam has been submitted successfully.
                    </Typography>
                    <Typography sx={{ fontSize: 16, color: '#666' }}>
                        This window will close automatically in 3 seconds...
                    </Typography>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SubmissionPage;
