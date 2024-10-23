import React, { useEffect } from 'react';
import { Box, Typography, Avatar, Button, Divider, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import { useGetExamReportMutation, useGetExamResultMutation } from '../../store/service/user/UserService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResultComponent = ({ userId, examId, examAttemptId, handleReviewQuestion, result }) => {
    const [examResultData, setExamResultData] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null); // Track the error message
    const [getExamResult] = useGetExamResultMutation();
    const [getExamReport] = useGetExamReportMutation();
    const userDetails = JSON.parse(localStorage.getItem('userdetails'));
    const navigate = useNavigate();

    const profile = {
        name: userDetails?.name,
        attempt_Id: examAttemptId
    };
    // console.log(userId, examId, examAttemptId)
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            let resultData;
            if (examAttemptId) {
                resultData = await getExamResult({ userId, examId, examAttemptId });
            } else {
                resultData = await getExamReport({ userId, examId });
            }
            const { data, error } = resultData;
            if (resultData?.data?.success === true) {
                setExamResultData(resultData?.data?.data);
            } else {
                setErrorMessage(resultData.data.message); // Handle 400 error
            }
        } catch (e) {

            console.log(e);
        }
    };

    const handleGoBack = () => {
        navigate('/user'); // Navigate back to the user page
    };

    return (
        <>
            {errorMessage ? (
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
            ) : examResultData ?
                <Box sx={{ width: '100%', height: { xl: '94vh', lg: '94vh', md: '93vh', xs: '93vh' }, overflow: 'auto', mx: 'auto', px: 2.5, py: { xs: 1, md: '22px' }, bgcolor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '80%' }, height: '100%' }}>

                        {/* Quiz Submitted Confirmation Section */}
                        <Box sx={{ display: { xs: 'grid', md: 'flex' }, justifyContent: 'space-between', alignItems: 'center', mb: 2, border: '1px solid #e0e0e0', py: 2, px: { xs: 2, md: 4 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, flexDirection: 'column' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Quiz Submitted  <CheckCircleIcon sx={{ color: 'green', fontSize: 25 }} />
                                </Typography>
                                <Typography variant="h8" sx={{ fontSize: 15 }}>
                                    Your Quiz have been submitted
                                </Typography>
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Typography>Name:</Typography>
                                <strong>{profile.name}</strong>
                                <Typography>Attempt ID: </Typography>
                                <strong>{profile.attempt_Id}</strong>
                            </Box>
                        </Box>

                        {/* Marks and Performance Summary */}
                        <Box sx={{ border: '1px solid #e0e0e0', mb: 2 }}>
                            <Box sx={{ textAlign: 'center', borderBottom: '1px solid #e0e0e0', }}>
                                <Typography variant="h7" sx={{ fontWeight: '700', color: 'gray', fontSize: { xs: 13 } }}>Title</Typography>
                                <Typography sx={{ fontSize: { md: 25, xs: 14 }, fontWeight: '600' }}>Total Marked Scored </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3, py: 2, px: 4, flexWrap: 'wrap', gap: '13px' }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h7" sx={{ fontWeight: '700', color: '#2f2c2c', fontSize: { xs: 13 } }}>Marks scored</Typography>
                                    <Typography sx={{ fontSize: { md: 25, xs: 14 }, fontWeight: '600' }}>{examResultData?.aggregateReport?.totalMarksObtained} / {examResultData?.aggregateReport?.maxMarks}</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h7" sx={{ fontWeight: '700', color: '#2f2c2c', fontSize: { xs: 13 } }}>Percentage</Typography>
                                    <Typography sx={{ fontSize: { md: 25, xs: 14 }, fontWeight: '600' }}>{examResultData?.aggregateReport?.percentage.toFixed(2)} %</Typography>
                                </Box>
                                {/* <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h7" sx={{ fontWeight: '700', color: '#2f2c2c', fontSize: { xs: 13 } }}>{'Accuracy'}</Typography>
                                    <Typography sx={{ fontSize: { md: 25, xs: 14 }, fontWeight: '600' }}>{examResultData?.aggregateReport?.accuracy.toFixed(2)} %</Typography>
                                </Box> */}
                            </Box>
                            <Divider />

                            {/* Time and Question Summary */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTimeIcon sx={{ fontSize: 22, mr: 1 }} />
                                    <Typography sx={{ fontSize: { xs: '15px', md: '20px' } }}>Time Taken</Typography>
                                </Box>
                                <Typography>{examResultData?.timeTaken}</Typography>
                            </Box>

                            {/* Question Attempt Summary */}
                            <Box sx={{ borderTop: '1px solid #e0e0e0', py: 2, px: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Avatar sx={{ width: 20, height: 20, bgcolor: '#a8a8a8', mr: 1 }}><RadioButtonUncheckedIcon sx={{ border: '4px solid #80808030' }} /></Avatar>
                                    <Typography sx={{ flex: 1, fontSize: { xs: '14px', md: '15px', xl: '16px' }, color: '#a8a8a8' }}>{'Questions Attempted'}</Typography>
                                    <Typography><strong>{examResultData?.aggregateReport?.totalAttemptedCount > 0 ? examResultData?.aggregateReport?.totalAttemptedCount : 0}</strong></Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Avatar sx={{ width: 20, height: 20, bgcolor: '#a8a8a8', mr: 1 }}><RadioButtonUncheckedIcon sx={{ border: '4px solid #80808030' }} /></Avatar>
                                    <Typography sx={{ flex: 1, fontSize: { xs: '14px', md: '15px', xl: '16px' }, color: '#a8a8a8' }}>{'Questions Skipped'}</Typography>
                                    <Typography><strong>{examResultData?.aggregateReport?.skippedQuestions > 0 ? examResultData?.aggregateReport?.skippedQuestions : 0}</strong></Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Avatar sx={{ width: 20, height: 20, bgcolor: 'green', mr: 1 }}><CheckCircleOutlineIcon sx={{ border: '4px solid green' }} /></Avatar>
                                    <Typography sx={{ flex: 1, fontSize: { xs: '14px', md: '15px', xl: '16px' }, color: 'green' }}>{'Answered Correct'}</Typography>
                                    <Typography><strong>{examResultData?.aggregateReport?.correct > 0 ? examResultData?.aggregateReport?.correct : 0}</strong></Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Avatar sx={{ width: 20, height: 20, bgcolor: 'red', mr: 1 }}><CancelIcon sx={{ border: '4px solid red' }} /></Avatar>
                                    <Typography sx={{ flex: 1, fontSize: { xs: '14px', md: '15px', xl: '16px' }, color: 'red' }}>{'Answered Incorrect'}</Typography>
                                    <Typography><strong>{examResultData?.aggregateReport?.wrong > 0 ? examResultData?.aggregateReport?.wrong : 0}</strong></Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Section Information */}
                        <Box sx={{ pb: 2 }}>
                            {examResultData?.partWiseReport?.map((item, index) => (
                                <Box key={index} sx={{ border: '1px solid #e0e0e0', mb: 2 }}>
                                    <Box sx={{ textAlign: 'center', borderBottom: '1px solid #e0e0e0', }}>
                                        <Typography variant="h7" sx={{ fontWeight: '700', color: 'gray', fontSize: { xs: 13 } }}>Section Name</Typography>
                                        <Typography sx={{ fontSize: { md: 25, xs: 14 }, fontWeight: '600' }}>Part  {String.fromCharCode(65 + index)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3, py: 2, px: 4, flexWrap: 'wrap', gap: '13px' }}>

                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h7" sx={{ fontWeight: '700', color: 'gray', fontSize: { xs: 13 } }}>Marks scored</Typography>
                                            <Typography sx={{ fontSize: { md: 25, xs: 14 }, fontWeight: '600' }}>{item?.marksObtained} / {item?.maxMarksForSection}</Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h7" sx={{ fontWeight: '700', color: 'gray', fontSize: { xs: 13 } }}>Percentage</Typography>
                                            <Typography sx={{ fontSize: { md: 25, xs: 14 }, fontWeight: '600' }}>{((item?.marksObtained / item?.maxMarksForSection) * 100).toFixed(2)} %</Typography>
                                        </Box>
                                    </Box>
                                    <Divider />

                                    <Box sx={{ borderTop: '1px solid #e0e0e0', py: 2, px: 2 }}>
                                        {/* Total Questions Attempt */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Avatar sx={{ width: 20, height: 20, bgcolor: '#a8a8a8', mr: 1 }}><RadioButtonUncheckedIcon sx={{ border: '4px solid #80808030' }} /></Avatar>
                                            <Typography sx={{ flex: 1, fontSize: { xs: '14px', md: '15px', xl: '16px' }, color: '#a8a8a8' }}>{'Questions Attempted'}</Typography>
                                            <Typography><strong>{item?.totalAttempedCount > 0 ? item?.totalAttempedCount : 0}</strong></Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Avatar sx={{ width: 20, height: 20, bgcolor: '#a8a8a8', mr: 1 }}><RadioButtonUncheckedIcon sx={{ border: '4px solid #80808030' }} /></Avatar>
                                            <Typography sx={{ flex: 1, fontSize: { xs: '14px', md: '15px', xl: '16px' }, color: '#a8a8a8' }}>{'Questions Skipped'}</Typography>
                                            <Typography><strong>{item?.skippedQuestions > 0 ? item?.skippedQuestions : 0}</strong></Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Avatar sx={{ width: 20, height: 20, bgcolor: 'green', mr: 1 }}><CheckCircleOutlineIcon sx={{ border: '4px solid green' }} /></Avatar>
                                            <Typography sx={{ flex: 1, fontSize: { xs: '14px', md: '15px', xl: '16px' }, color: 'green' }}>{'Answered Correct'}</Typography>
                                            <Typography><strong>{item?.correct > 0 ? item?.correct : 0}</strong></Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Avatar sx={{ width: 20, height: 20, bgcolor: 'red', mr: 1 }}><CancelIcon sx={{ border: '4px solid red' }} /></Avatar>
                                            <Typography sx={{ flex: 1, fontSize: { xs: '14px', md: '15px', xl: '16px' }, color: 'red' }}>{'Answered Incorrect'}</Typography>
                                            <Typography><strong>{item?.wrong > 0 ? item?.wrong : 0}</strong></Typography>
                                        </Box>
                                    </Box>
                                    {/* Review Questions Button */}
                                    <Divider />
                                    <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'start' }, px: 4, py: 2 }}>
                                        <Button variant="contained" color="warning" sx={{ p: { xs: '10px', md: '15px' }, fontSize: '12px' }} onClick={() => handleReviewQuestion({ userId, examId, partId: item?.partId })}
                                        >
                                            Review Questions
                                        </Button>
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                    </Box>
                </Box > : <Box sx={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center', height: `calc(100vh - 60px)`
                }}>
                    <CircularProgress />
                </Box>}
        </>
    );
};

export default ResultComponent;
