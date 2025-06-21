import React, { useState, useEffect } from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, FormControl, Button, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import { useUploadExamQuestionsMutation } from '../../store/service/user/UserService';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CalculatorModal from './CalculatorModal';
import LoadingFallback from '../DashBoard/LoadingFallback';

const QuestionPanel = ({ question, onAnswer, onNext, onMarkForReview, onClearResponse, questions, getSection, isReviewMode, partIds, buttonDisable, handleReviewQuestion, activePartId, examEndTime }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [loading, setLoading] = useState(false)
    const [UploadExamQuestions] = useUploadExamQuestionsMutation();
    const { userId, examAttemptId, examId } = useParams();
    const [activePart, setActivePart] = useState(null);
    const [calculatorOpen, setCalculatorOpen] = useState(false);

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
        // In review mode, we need to set the selected option from the user's answer
        if (isReviewMode) {
            // The answer field contains the user's selected option
            // Parse the answer data correctly based on its format
            let userAnswer = null;

            if (question?.answer) {
                // If answer is a JSON object with selectedOption property
                if (typeof question.answer === 'object' && question.answer.selectedOption) {
                    userAnswer = Number(question.answer.selectedOption);
                }
                // If answer is a string that might be a JSON string
                else if (typeof question.answer === 'string' && question.answer.includes('selectedOption')) {
                    try {
                        const parsedAnswer = JSON.parse(question.answer);
                        userAnswer = Number(parsedAnswer.selectedOption);
                    } catch (e) {
                        // If parsing fails, try to use the answer directly
                        userAnswer = Number(question.answer);
                    }
                }
                // If answer is a direct number or string number
                else {
                    userAnswer = Number(question.answer);
                }
            }

            setSelectedOption(userAnswer);

            // We no longer need to set any inferred correct option
            // We'll only use the explicit correctOption from the backend
        } else {
            let selectedValue = question?.answer?.selectedOption;
            setSelectedOption(question && question.selectedOption ? question.selectedOption : selectedValue || null);
        }
    }, [isReviewMode, question]);


    const handleOptionChange = (event) => {
        const selected = event.target.value;
        setSelectedOption(Number(selected));
        onAnswer(question?.id, Number(selected)); // Update the selected answer in the parent
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
        
        // Find current question index and get next question
        const currentIndex = questions.findIndex(q => q.id === question?.id);
        const nextQuestion = questions[currentIndex + 1];
        if (nextQuestion) {
            onNext(nextQuestion.id);
        }

        const payloadData = {
            data: {
                questionId: question?.question_id,
                answerId: selectedOption,
                examAttemptId: examAttemptId,
                statusCode: statusCode
            }
        }
        try {
            await UploadExamQuestions({ userId, payloadData: payloadData });
            // No need to check result as we're already calling onNext above
        } catch (e) {
            // Silently handle error - could add error handling UI if needed
        }
    }

    const getOptionStyles = (optionId) => {
        if (!isReviewMode) return {}; // No special styles if not in review mode

        // Only use the explicit correctOption from the backend
        const correctOption = question?.correctOption !== null && question?.correctOption !== undefined
            ? Number(question?.correctOption)
            : null;

        const userSelectedOption = Number(selectedOption);

        // For questions with "Incorrect" status, we can infer that the selected option is wrong
        const isQuestionIncorrect = question?.questionStatus === "Incorrect";

        // Determine if this is the correct answer - ONLY if explicitly provided
        const isCorrectAnswer = correctOption === optionId;

        // Determine if this is the user's answer
        const isUserAnswer = optionId === userSelectedOption;

        // Case 1: This option is both the correct answer and the user's answer
        if (isCorrectAnswer && isUserAnswer) {
            return {
                backgroundColor: '#dff0d8', // Light green background
                color: '#3c763d', // Dark green text
                border: '2px solid #28a745',
                position: 'relative',
                '&::after': {
                    content: '"✓ Correct Answer (Your Selection)"',
                    position: 'absolute',
                    right: '10px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#28a745'
                }
            };
        }

        // Case 2: This option is the correct answer (but not what the user selected)
        if (isCorrectAnswer) {
            return {
                backgroundColor: '#dff0d8', // Light green background
                color: '#3c763d', // Dark green text
                border: '2px solid #28a745',
                position: 'relative',
                '&::after': {
                    content: '"✓ Correct Answer"',
                    position: 'absolute',
                    right: '10px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#28a745'
                }
            };
        }

        // Case 3: This option is the user's incorrect selection
        if (isUserAnswer && isQuestionIncorrect) {
            return {
                backgroundColor: '#f8d7da', // Light red background
                color: '#721c24', // Dark red text
                border: '2px solid #dc3545',
                position: 'relative',
                '&::after': {
                    content: '"✗ Your Answer"',
                    position: 'absolute',
                    right: '10px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#dc3545'
                }
            };
        }

        return {}; // Default style for other options
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
            {loading ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: `calc(100vh - 60px)`
                }}>
                    <LoadingFallback />
                </Box>
            ) : (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', }} >
                    <Box>
                        <Box sx={{ p: 2, height: 'calc(100vh - 289px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'auto' }}>
                            <FormControl component="fieldset" sx={{ borderBottom: 2, borderColor: "#c0bfbf", pb: 4 }}>
                                <RadioGroup value={String(selectedOption)} onChange={handleOptionChange}>
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

                                    {/* Legend for review mode */}
                                    {isReviewMode && (
                                        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', justifyContent: 'flex-end' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ width: 16, height: 16, backgroundColor: '#dff0d8', border: '1px solid #28a745', mr: 1, borderRadius: '2px' }}></Box>
                                                <Typography sx={{ fontSize: '12px', color: '#3c763d' }}>Correct Answer</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ width: 16, height: 16, backgroundColor: '#f8d7da', border: '1px solid #dc3545', mr: 1, borderRadius: '2px' }}></Box>
                                                <Typography sx={{ fontSize: '12px', color: '#721c24' }}>Your Answer</Typography>
                                            </Box>
                                        </Box>
                                    )}
                                    <Typography 
                                        component="div"
                                        sx={{ fontSize: { xs: '16px', md: '18px', lg: '19px' }, mb: 3 }}
                                        dangerouslySetInnerHTML={{ __html: question?.question }}
                                    />
                                    {question?.meta.map((option, index) => (
                                        <FormControlLabel
                                            key={index}
                                            value={String(option.id)}
                                            control={<Radio />}
                                            disabled={isReviewMode}
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <span dangerouslySetInnerHTML={{ __html: option.option }} />
                                                    {isReviewMode && (
                                                        <>
                                                            {/* Show correct answer indicator ONLY if explicitly provided in the backend */}
                                                            {question?.correctOption !== null &&
                                                             question?.correctOption !== undefined &&
                                                             Number(option.id) === Number(question?.correctOption) && (
                                                                <Typography sx={{ color: 'green', fontWeight: 'bold', ml: 1 }}>
                                                                    (Correct Answer)
                                                                </Typography>
                                                            )}

                                                            {/* Show the user's answer only if it is not the correct answer */}
                                                            {Number(option.id) === Number(selectedOption) &&
                                                                Number(option.id) !== Number(question?.correctOption) && (
                                                                    <Typography
                                                                        sx={{
                                                                            color: 'red',
                                                                            fontWeight: 'bold',
                                                                            ml: 1
                                                                        }}
                                                                    >
                                                                        (Your Answer)
                                                                    </Typography>
                                                            )}
                                                        </>
                                                    )}
                                                </Box>
                                            }
                                            sx={{
                                                ...getOptionStyles(Number(option.id)),
                                                margin: '8px 0',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                width: '100%',
                                                '& .MuiFormControlLabel-label': {
                                                    width: '100%'
                                                }
                                            }}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, p: 2 }}>
                        {/* Calculator Button - moved to the left for better visibility */}
                        {!isReviewMode && (
                            <Button
                                variant={calculatorOpen ? "contained" : "outlined"}
                                sx={calculatorOpen ? {
                                    background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                    color: 'white',
                                    fontWeight: 600,
                                    borderRadius: '8px',
                                    boxShadow: 'none',
                                    textTransform: 'none',
                                    px: 3,
                                    mr: 2,
                                    '&:hover': {
                                        background: 'linear-gradient(270deg, #e42b12 0%, #eb6707 100%)',
                                        color: '#fff',
                                        boxShadow: 'none',
                                    },
                                } : {
                                    color: '#333',
                                    borderColor: '#c0bfbf',
                                    fontSize: '12px',
                                    borderRadius: '8px',
                                    px: 3,
                                    mr: 2,
                                    '&:hover': {
                                        background: 'linear-gradient(270deg, #e42b12 0%, #eb6707 100%)',
                                        color: '#fff',
                                        borderColor: 'transparent',
                                        boxShadow: 'none',
                                    },
                                }}
                                onClick={() => setCalculatorOpen(true)}
                            >
                                <CalculateOutlinedIcon />
                            </Button>
                        )}
                        <CalculatorModal open={calculatorOpen} onClose={() => setCalculatorOpen(false)} />
                        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', gap: 1 }}>
                        {isReviewMode ? (
                            <>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: '#333',
                                        borderColor: '#c0bfbf',
                                        fontWeight: 600,
                                        borderRadius: '8px',
                                        boxShadow: 'none',
                                        textTransform: 'none',
                                        px: 3,
                                        mr: 2,
                                        '&:hover': {
                                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                            color: '#fff',
                                            borderColor: 'transparent',
                                            boxShadow: 'none',
                                        },
                                    }}
                                    onClick={() => {
                                        const currentIndex = questions.findIndex(q => q.id === question.id);
                                        if (currentIndex > 0) {
                                            onNext(questions[currentIndex - 1].id);
                                        }
                                    }}
                                    disabled={questions.findIndex(q => q.id === question.id) === 0}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: '#333',
                                        borderColor: '#c0bfbf',
                                        fontWeight: 600,
                                        borderRadius: '8px',
                                        boxShadow: 'none',
                                        textTransform: 'none',
                                        px: 3,
                                        '&:hover': {
                                            background: 'linear-gradient(270deg, #e42b12 0%, #eb6707 100%)',
                                            color: '#fff',
                                            borderColor: 'transparent',
                                            boxShadow: 'none',
                                        },
                                    }}
                                    onClick={() => {
                                        const currentIndex = questions.findIndex(q => q.id === question.id);
                                        if (currentIndex < questions.length - 1) {
                                            onNext(questions[currentIndex + 1].id);
                                        }
                                    }}
                                    disabled={questions.findIndex(q => q.id === question.id) === questions.length - 1}
                                >
                                    Next
                                </Button>
                            </>
                        ) : (
                            <>
                                {/* Save and Next Button */}
                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: '#333',
                                        borderColor: '#c0bfbf',
                                        fontWeight: 600,
                                        borderRadius: '8px',
                                        boxShadow: 'none',
                                        textTransform: 'none',
                                        px: 3,
                                        mr: 2,
                                        '&:hover': {
                                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                            color: '#fff',
                                            borderColor: 'transparent',
                                            boxShadow: 'none',
                                        },
                                    }}
                                    disabled={question?.id === questions[questions.length - 1]?.id && question?.saved}
                                    onClick={() => { handleSave({ markedForReview: false }); }}
                                >
                                    Save and Next
                                </Button>
                                {/* Mark for Review & Next Button */}
                                {!question?.saved && <Button
                                    variant="outlined"
                                    sx={{
                                        color: '#333',
                                        borderColor: '#c0bfbf',
                                        fontWeight: 600,
                                        borderRadius: '8px',
                                        boxShadow: 'none',
                                        textTransform: 'none',
                                        px: 3,
                                        mr: 2,
                                        '&:hover': {
                                            background: 'linear-gradient(270deg, #e42b12 0%, #eb6707 100%)',
                                            color: '#fff',
                                            borderColor: 'transparent',
                                            boxShadow: 'none',
                                        },
                                    }}
                                    disabled={question?.id === questions[questions.length - 1]?.id && question?.saved}
                                    onClick={() => { handleSave({ markedForReview: true }); onMarkForReview(question?.id) }}
                                >
                                    Mark for Review & Next
                                </Button>}

                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: '#333',
                                        borderColor: '#c0bfbf',
                                        fontWeight: 600,
                                        borderRadius: '8px',
                                        boxShadow: 'none',
                                        textTransform: 'none',
                                        px: 3,
                                        mr: 2,
                                        '&:hover': {
                                            background: 'linear-gradient(270deg, #e42b12 0%, #eb6707 100%)',
                                            color: '#fff',
                                            borderColor: 'transparent',
                                            boxShadow: 'none',
                                        },
                                    }}
                                    disabled={question?.id === questions[questions.length - 1]?.id && question?.saved}
                                    onClick={handleClearResponse}
                                >
                                    Clear Response
                                </Button>

                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: '#333',
                                        borderColor: '#c0bfbf',
                                        fontWeight: 600,
                                        borderRadius: '8px',
                                        boxShadow: 'none',
                                        textTransform: 'none',
                                        px: 3,
                                        '&:hover': {
                                            background: 'linear-gradient(270deg, #e42b12 0%, #eb6707 100%)',
                                            color: '#fff',
                                            borderColor: 'transparent',
                                            boxShadow: 'none',
                                        },
                                    }}
                                    onClick={handleRefresh}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                                </Button>
                            </>
                        )}
                        </Box>
                    </Box>
                </Box >
            )}
        </>
    );
};

export default QuestionPanel;
