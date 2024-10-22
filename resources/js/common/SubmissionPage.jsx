import React, { useEffect, useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import { useGetExamStatisticMutation } from '../store/service/user/UserService';
import { useNavigate } from 'react-router-dom';

const tableHeaders = [
    { label: 'Section Name', accessor: 'partId', isPart: true },
    { label: 'No. of Questions', accessor: 'noOfQuestions' },
    { label: 'Answered', accessor: 'answered' },
    { label: 'Not Answered', accessor: 'notAnswered' },
    { label: 'Marked for Review', accessor: 'markForReview' },
    { label: 'Not Visited', accessor: 'notVisited' },
    { label: 'Time Taken', accessor: 'timeTaken' }
];

const SubmissionPage = ({
    userId, examId, examAttemptId, setIsSubmission, setIsSubmit, setTimeLeft, setIsTimeOver
}) => {
    const [getExamStatistic] = useGetExamStatisticMutation();
    const [examStatisticData, setExamStatisticData] = useState();
    const [errorMessage, setErrorMessage] = useState(null); // For handling error messages
    const navigate = useNavigate();

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

    const handleSubmitQuiz = () => {
        setTimeLeft(0); // Reset countdown to 00:00
        setIsTimeOver(true); // Mark exam as over
        setIsSubmit(true);
        setIsSubmission(false);
        localStorage.setItem('isTimeOver', true); // Persist the state in localStorage
        localStorage.removeItem('examStartTime');
        localStorage.removeItem('timeLeft'); // Clear timeLeft from localStorage
    };

    const handleQuitClick = () => {
        setIsSubmit(false);
        setIsSubmission(false);
    };
    const handleGoBack = () => {
        navigate('/user'); // Navigate back to the user page
    };

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
                        Go Back
                    </Button>
                </Box>
            ) : examStatisticData ? (
                <Box sx={{ alignItems: 'center' }}>
                    <TableContainer sx={{ marginTop: '100px', border: '1px solid rgba(0, 0, 0, 0.12)', mx: { xl: '50px', md: '40px', sm: '30px', xs: '20px' }, width: 'auto' }}>
                        <Table aria-label="quiz details table">
                            <TableHead>
                                <TableRow >
                                    {tableHeaders.map((header, index) => (
                                        <TableCell key={index} sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)', fontWeight: 'bold', textAlign: 'center', fontSize: { xs: '11px', sm: '12px', md: '13px', xl: '14px', padding: '5px' } }}>{header.label}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {examStatisticData?.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {tableHeaders.map((header, colIndex) => (
                                            <TableCell key={colIndex} sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)', fontSize: { xs: '9px', sm: '10px', md: '12px', xl: '14px' }, padding: '10px' }}>
                                                {header.isPart ? `Part ${String.fromCharCode(65 + rowIndex)}` : row[header.accessor]}
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
                        <Button variant="contained" sx={{ fontSize: { xs: '9px', sm: '10px', md: '12px', xl: '14px' } }} color="warning" onClick={handleSubmitQuiz}>
                            Submit
                        </Button>
                        <Button variant="outlined" sx={{ fontSize: { xs: '9px', sm: '10px', md: '12px', xl: '14px' } }} color="primary" onClick={handleQuitClick}>
                            No, Go Back To Quiz
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: `calc(100vh - 60px)` }}>
                    <CircularProgress />
                </Box>
            )}
        </>
    );
};

export default SubmissionPage;
