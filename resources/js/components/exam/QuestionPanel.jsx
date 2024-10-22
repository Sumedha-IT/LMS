import React, { useState, useEffect } from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, FormControl, Button, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import { useUploadExamQuestionsMutation } from '../../store/service/user/UserService';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const QuestionPanel = ({ question, onAnswer, onNext, onMarkForReview, onClearResponse, questions, getSection, isReviewMode, partIds, buttonDisable, handleReviewQuestion, activePartId }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [loading, setLoading] = useState(false)
    const [UploadExamQuestions] = useUploadExamQuestionsMutation();
    const { userId, examAttemptId, examId } = useParams();
    const [activePart, setActivePart] = useState(null);

    // Effect to handle setting the active part based on partIds or activePartId
    useEffect(() => {
        if (partIds && partIds.length > 0) {
            if (activePartId) {
                // If activePartId is provided, use it as the active part
                setActivePart(activePartId);
            } else if (!activePart) {
                // Otherwise, set the first part as the active part by default
                setActivePart(partIds[0]);
            }
        }
    }, [partIds, activePartId]);

    useEffect(() => {
        let selectedValue = question?.answer?.selectedOption;
        // setSelectedOption(selectedValue ? selectedValue : question?.selectedOption || null);
        setSelectedOption(question && question.selectedOption ? question.selectedOption : selectedValue || null);
    }, [isReviewMode, question]);


    const handleOptionChange = (event) => {
        const selected = event.target.value;
        setSelectedOption(selected);
        onAnswer(question?.id, selected); // Update the selected answer in the parent
    };

    const handleSave = async ({ markedForReview = false }) => {
        let statusCode;
        if (selectedOption && markedForReview) {
            statusCode = 3; // Answered and Marked for Review
        } else if (selectedOption) {
            statusCode = 1; // Answered
        } else if (markedForReview) {
            statusCode = 4; // Marked for Review
        } else {
            statusCode = 2; // Not Answered
        }
        onNext(question?.id + 1)

        const payloadData = {
            data: {
                questionId: question?.question_id,
                answerId: selectedOption,
                examAttemptId: examAttemptId,
                statusCode: statusCode
            }
        }
        try {
            let result = await UploadExamQuestions({ userId, payloadData: payloadData });
            // if (result.data.success) {
            //     onNext(question?.id + 1)
            // }
        } catch (e) {
            console.log(e);
        }
    }

    const getOptionStyles = (optionId) => {

        if (!isReviewMode) return {}; // No special styles if not in review mode

        if (optionId === question?.correctOption) {
            return { backgroundColor: '#dff0d8', color: 'white' };  // Correct answer highlighted green
        }
        if (optionId === Number(selectedOption) && optionId !== question?.correctOption) {
            return { backgroundColor: '#fababa', color: 'white' };  // Incorrect answer highlighted gray
        }
        return {}; // Default style
    };

    const handleClearResponse = () => {
        setSelectedOption(null);
        onClearResponse(question?.id);
    };

    const handleRefresh = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }

    const handlePartClick = (partId) => {
        setActivePart(partId);
        if (isReviewMode) {
            handleReviewQuestion({ userId, examId, partId })
        } else {
            getSection(partId);
        }

    };

    return (
        <>
            {loading ? <Box>
                <Box sx={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center', height: `calc(100vh - 60px)`
                }}>
                    <CircularProgress />
                </Box>
            </Box> :
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', }} >
                    <Box>
                        <Box sx={{ bgcolor: '#d5d5d599', p: 1, mb: 3, display: 'flex', alignItems: "center", justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="h8" sx={{ fontWeight: 'bold', fontSize: { xs: '12px', sm: '13px', md: '14px', xl: '16px' } }}>SECTIONS: </Typography>
                                {partIds?.map((partId, index) => (

                                    <Box
                                        key={index}
                                        onClick={() => handlePartClick(partId)}
                                        sx={{
                                            fontSize: { xs: '9px', sm: '10px', md: '12px', xl: '14px' },
                                            bgcolor: activePart === partId ? '#f97316' : "#4dc4ff",
                                            color: activePart === partId ? 'white' : 'black',
                                            p: 1,
                                            ml: 2,
                                            borderRadius: 2,
                                            cursor: 'pointer',
                                            '&:hover': {
                                                bgcolor: activePart === partId ? '#f97316' : '#76c7ff'
                                            }
                                        }}
                                    >
                                        {`Part`} {String.fromCharCode(65 + index)}
                                    </Box>
                                ))}
                            </Box>
                            <Box><RefreshIcon onClick={handleRefresh} sx={{ fontSize: '30px', cursor: 'pointer' }} /> <CalculateOutlinedIcon sx={{ fontSize: '30px', cursor: 'pointer' }} /></Box>
                        </Box>

                        <Box sx={{ p: 2, height: 'calc(100vh - 289px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'auto' }}>
                            <FormControl component="fieldset" sx={{ borderBottom: 2, borderColor: "#c0bfbf", pb: 4 }}>
                                <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                                    <Box sx={{ borderTop: 1, borderBottom: 1, mb: 3, display: 'flex', justifyContent: "space-between" }}>
                                        <Typography sx={{ fontSize: { xs: '16px', md: '18px', lg: '20px' }, borderColor: "#c0bfbf", pt: 2, pb: 2, fontWeight: 'bold' }}>Question {question && questions.findIndex(q => q.id === question.id) + 1} </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Box
                                                sx={{
                                                    backgroundColor: '#28a745', // Green background for positive marks
                                                    color: 'white',
                                                    padding: '0.2rem 0.5rem',
                                                    borderRadius: '0.25rem',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.875rem',
                                                }}
                                            >
                                                Marks: +{question?.score}
                                            </Box>

                                            {question?.negativeScore && (
                                                <Box
                                                    sx={{
                                                        backgroundColor: '#dc3545', // Red background for negative marks
                                                        color: 'white',
                                                        padding: '0.2rem 0.5rem',
                                                        borderRadius: '0.25rem',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.875rem',
                                                    }}
                                                >
                                                    -{question?.negativeScore}
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                    <Typography sx={{ fontSize: { xs: '16px', md: '18px', lg: '19px' }, mb: 3 }}>  {<div dangerouslySetInnerHTML={{ __html: question?.question }} />}</Typography>
                                    {question?.meta.map((option, index) => (
                                        <FormControlLabel
                                            key={index}
                                            value={option.id}
                                            control={<Radio />}
                                            disabled={isReviewMode}
                                            label={<Box dangerouslySetInnerHTML={{ __html: option.option }} sx={{ fontSize: { xs: '14px', md: '16px', xl: '17px' } }} />}
                                            sx={getOptionStyles(option.id)}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, p: 2 }}>
                        {isReviewMode ? (
                            <>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: '#f97316',
                                        fontSize: '12px',
                                        borderColor: '#f97316',
                                        borderRadius: '20px',
                                        px: 3,
                                        mr: 5,
                                        '&:hover': { backgroundColor: '#f97316', color: '#fff' },
                                    }}
                                    onClick={() => onNext(question?.id - 1)}
                                    disabled={question?.id === questions[0]?.id}  // Disable for the first question
                                >
                                    Previous
                                </Button>

                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: '#f97316',
                                        borderColor: '#f97316',
                                        borderRadius: '20px',
                                        px: 3,
                                        '&:hover': { backgroundColor: '#f97316', color: '#fff' },
                                    }}
                                    onClick={() => onNext(question?.id + 1)}
                                    disabled={buttonDisable}
                                >
                                    Next
                                </Button>
                            </>
                        ) : (
                            <>
                                {!question?.saved && <Button
                                    variant="outlined"
                                    sx={{
                                        color: '#f97316',
                                        fontSize: '12px',
                                        borderColor: '#f97316',
                                        borderRadius: '20px',
                                        px: 3,
                                        mr: 5,
                                        '&:hover': { backgroundColor: '#f97316', color: '#fff' },
                                    }}
                                    disabled={question?.id === questions[questions.length - 1]?.id && question?.saved}
                                    onClick={() => { handleSave({ markedForReview: true }); onMarkForReview(question?.id) }}
                                >
                                    Mark for Review & Next
                                </Button>}

                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: '#f97316',
                                        borderColor: '#f97316',
                                        fontSize: '12px',
                                        borderRadius: '20px',
                                        px: 3,
                                        '&:hover': { backgroundColor: '#f97316', color: '#fff' },
                                    }}
                                    disabled={question?.id === questions[questions.length - 1]?.id && question?.saved}
                                    onClick={handleClearResponse}
                                >
                                    Clear Response
                                </Button>

                                {question?.saved ? <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#f97316',
                                        color: '#fff',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        px: 4,
                                        '&:hover': { bgcolor: '#f97316' },
                                    }}
                                    disabled={question?.id === questions[questions.length - 1]?.id}
                                    onClick={() => onNext(question.id + 1)}

                                >
                                    Next
                                </Button>
                                    : (<Button
                                        variant="contained"
                                        sx={{
                                            bgcolor: '#f97316',
                                            color: '#fff',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            px: 4,
                                            '&:hover': { bgcolor: '#f97316' },
                                        }}
                                        onClick={handleSave}
                                        disabled={question?.id === questions[questions.length - 1]?.id && question?.saved}
                                    >
                                        {question?.id === questions[questions.length - 1]?.id && !question?.saved ? "Save" : "Save & Next"}
                                    </Button>)}
                            </>
                        )}
                    </Box>
                </Box >
            }
        </>
    );
};

export default QuestionPanel;
