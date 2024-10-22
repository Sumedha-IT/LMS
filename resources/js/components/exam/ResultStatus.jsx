import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';
import { useGetReviewAnswerSheetMutation } from '../../store/service/user/UserService';

const ResultStatus = ({ onSubmitQuiz, userId, examId, setIsSubmit, showReport, setShowReport }) => {
    const [getReviewAnswerSheet] = useGetReviewAnswerSheetMutation();
    const [reviewData, setReviewData] = useState();
    const userDetails = JSON.parse(localStorage.getItem('userdetails'));


    const profile = {
        name: userDetails?.name,
        img: userDetails?.avatar_url,
    };

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const resultData = await getReviewAnswerSheet({ userId, examId });
            setReviewData(resultData);
        } catch (e) {
            console.log(e)
        }
    }


    const statusSummary = {
        answered: { id: reviewData?.data?.meta['Correct'], label: "Correct", color: "#22c55e", borderRadius: "6px" },
        notVisited: { id: reviewData?.data?.meta["Not Attempted"], label: "Not Attempted", color: "#878787", borderRadius: "6px" },
        notAnswered: { id: reviewData?.data?.meta['Incorrect'], label: "Incorrect", color: "#c11e1b", borderRadius: "6px" },
    };

    const handleReport = () => {
        setIsSubmit(true)
        setShowReport(false)


    }

    const getInitials = (name) => {
        return name
            ? name
                .split(' ')
                .map((word) => word[0])
                .join('')
                .toUpperCase()
            : '';
    };

    const getQuestionBgColor = (questionStatus) => {
        switch (questionStatus) {
            case 'Correct':
                return '#22c55e';
            case 'Incorrect':
                return '#c11e1b';
            case 'Not Attempted':
                return '#878787';
            default:
                return '#878787';
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: "space-between", height: '100%' }}>
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', px: '16px', py: 1, borderBottom: '2px solid #ddd' }}>
                    {profile.img ? (
                        <Avatar src={profile.img} sx={{ width: "35px", height: '35px', mr: 2 }} />
                    ) : (
                        <Avatar sx={{ width: "40px", height: '40px', backgroundColor: '#f97316', mr: 2, fontSize: '18px', fontWeight: 'bold' }}>
                            {getInitials(profile.name)}
                        </Avatar>
                    )}
                    <Box >
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {profile.name}
                        </Typography>
                    </Box>

                </Box>
                <Box>
                    <Box sx={{ mb: showReport ? 0 : { xs: 3, md: 3, xl: 8 }, p: 2, display: 'flex', flexWrap: 'wrap', gap: { xl: '12px', md: '10px', xs: '8px' } }}>
                        {Object.entries(statusSummary).map(([key, status]) => (
                            <Box
                                key={key}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: '1px',
                                    position: 'relative'
                                }}
                            >
                                <Avatar
                                    sx={{
                                        bgcolor: status.color,
                                        borderRadius: status.borderRadius,
                                        width: 30,
                                        height: 30,
                                        mr: 1,
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {status.id}
                                </Avatar>
                                <Typography variant="subtitle2" sx={{ color: '#333', fontWeight: 'bold' }}>
                                    {status.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                    {showReport && <Box sx={{ mb: 2, px: 2 }}>
                        <Button onClick={handleReport} sx={{
                            border: '1px solid #f97316',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '10px',
                            backgroundColor: '#f97316',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#ff690087',
                                color: '#fff',
                            },

                        }} >Show Report</Button>
                    </Box>}
                </Box>



                <Box sx={{
                    padding: '8px', height: { xs: '70vh', sm: '64vh', md: '65vh', lg: '70vh' }, overflowY: 'auto',
                }}>
                    <Box sx={{ display: "flex", fontWeight: '700', justifyContent: 'space-around', mb: '6px', fontSize: { xs: '12px', sm: '13px' } }}>
                        <Box>Q.No.</Box>
                        <Box>Type</Box>
                        <Box>Mark</Box>
                    </Box>
                    <Box sx={{ borderTop: '1px solid #00000024', mt: '10px' }}>
                        {reviewData && reviewData?.data?.data?.map((question, index) => (
                            <Box key={question.id} sx={{ display: 'flex', justifyContent: 'space-around', paddingTop: '10px', borderBottom: '1px solid #00000018', alignItems: 'center' }}>
                                <Avatar
                                    sx={{
                                        bgcolor: getQuestionBgColor(question.questionStatus),
                                        borderRadius: '6px',
                                        width: 35,
                                        height: 35,
                                        '@media (min-width: 600px) and (max-width: 724px)': {
                                            height: '28px',
                                            width: '28px',
                                            fontSize: '12px'
                                        },
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {index + 1}

                                </Avatar>
                                {/* Type and Result */}
                                <Box sx={{
                                    textAlign: 'center', display: 'grid', width: '58%'
                                }}>

                                    <Typography sx={{
                                        color: '#333', fontWeight: 'bold', fontSize: { xs: '11px', sm: '10px', md: '10px', lg: '13px' }, '@media (min-width: 600px) and (max-width: 724px)': {
                                            fontSize: '9px'
                                        },
                                    }}>
                                        {question.type}
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: '#595454', '@media (min-width: 600px) and (max-width: 724px)': {

                                            fontSize: '8.9px'
                                        },
                                    }}>
                                        {question.questionStatus}
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: '#595454', '@media (min-width: 600px) and (max-width: 724px)': {
                                            fontSize: '9px'
                                        },
                                    }}>
                                        Max. Marks: {question.maxMarks}
                                    </Typography>
                                </Box>

                                <Button
                                    variant="outlined"
                                    sx={{
                                        height: 35,
                                        '@media (min-width: 600px) and (max-width: 717px)': {
                                            height: '30px',
                                            minWidth: '38px'
                                        }, '@media (min-width: 900px) and (max-width: 1117px)': {
                                            height: '35px',
                                            minWidth: '45px'
                                        },
                                        border: '1px solid #00000094',
                                        borderRadius: '4px',
                                        textAlign: 'center',
                                        fontWeight: 'bold'
                                    }}

                                >
                                    {question.obtainedMarks == null ? 0 : question.obtainedMarks}
                                </Button>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>


            {/* <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, borderTop: '2px solid #00000018' }}>
                <Button
                    variant="contained"
                    fullWidth
                    color="success"
                    sx={{ borderRadius: '20px', bgcolor: '#22c55e', px: 4 }}
                    onClick={onSubmitQuiz}
                >
                    Submit Quiz
                </Button>
            </Box> */}
        </Box >

    );

};

export default ResultStatus;

