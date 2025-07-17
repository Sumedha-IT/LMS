import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, Grid, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ExamScoreDialog = ({ exam, open, onClose }) => {
    if (!exam) return null;

    // Process the exam data

    // Ensure we have valid numeric values for calculations
    const obtainedMarks = parseInt(exam.obtainedMarks || exam.totalMarksObtained || 0);
    const totalMarks = parseInt(exam.totalMarks || 0);

    // Get actual question count from the exam data
    // First try to get it from aggregateReport if available
    let actualQuestionCount = 0;

    // Check if we have report data with aggregateReport
    if (exam.report && exam.report.aggregateReport) {
        if (exam.report.aggregateReport.totalQuestions) {
            actualQuestionCount = parseInt(exam.report.aggregateReport.totalQuestions);
        } else if (exam.report.aggregateReport.noOfQuestions) {
            // Some APIs return noOfQuestions instead of totalQuestions
            actualQuestionCount = parseInt(exam.report.aggregateReport.noOfQuestions);
        }
    }

    // If we still don't have a count, try to get it from partWiseReport
    if (!actualQuestionCount && exam.report && exam.report.partWiseReport && exam.report.partWiseReport.length > 0) {
        // Sum up questions from all parts
        actualQuestionCount = exam.report.partWiseReport.reduce((total, part) => {
            return total + parseInt(part.totalQuestions || part.noOfQuestions || 0);
        }, 0);
    }

    // If still no count, try to parse from totalQuestions if it's a string like "x/y"
    if (!actualQuestionCount && exam.totalQuestions) {
        const parts = exam.totalQuestions.toString().split('/');
        if (parts.length > 1) {
            actualQuestionCount = parseInt(parts[1]);
        } else {
            actualQuestionCount = parseInt(exam.totalQuestions);
        }
    }

    // Fallback to correct + wrong if we have those values
    if (!actualQuestionCount && (exam.correctAnswers || exam.wrongAnswers)) {
        actualQuestionCount = (parseInt(exam.correctAnswers || 0) + parseInt(exam.wrongAnswers || 0));
    }

    // If we still don't have a count and have report data, try to extract it
    if (!actualQuestionCount && exam.report) {
        // Try to find question count in the report structure
        // This is a silent operation, no logging needed
    }

    // Use the actual question count from the data, no defaults
    const totalQuestions = actualQuestionCount || 0;

    // Calculate correct and wrong answers based on actual data
    // Only calculate if we have a valid question count
    let correctAnswers = 0;
    let wrongAnswers = 0;

    // First try to get correct/wrong answers directly from the report
    if (exam.report && exam.report.aggregateReport) {
        if (exam.report.aggregateReport.correct !== undefined) {
            correctAnswers = parseInt(exam.report.aggregateReport.correct);
        }
        if (exam.report.aggregateReport.wrong !== undefined) {
            wrongAnswers = parseInt(exam.report.aggregateReport.wrong);
        }
    }

    // If we still don't have correct/wrong counts, try other properties
    if (correctAnswers === 0 && wrongAnswers === 0) {
        // Try direct properties on the exam object
        if (exam.correctAnswers !== undefined) {
            correctAnswers = parseInt(exam.correctAnswers);
        }
        if (exam.wrongAnswers !== undefined) {
            wrongAnswers = parseInt(exam.wrongAnswers);
        }

        // If we have totalQuestions but not correct/wrong, estimate based on score
        if (correctAnswers === 0 && wrongAnswers === 0 && totalQuestions > 0) {
            if (totalMarks > 0) {
                // Estimate correct answers based on score percentage
                correctAnswers = Math.round((obtainedMarks / totalMarks) * totalQuestions);
                wrongAnswers = totalQuestions - correctAnswers;
            } else {
                console.warn('Cannot calculate correct/wrong answers: missing total marks');
            }
        }
    }

    // Calculate final values for display

    const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
                }
            }}
        >
            <DialogTitle sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #E2E8F0'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3748' }}>
                    Exam Score Details
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A202C', mb: 1 }}>
                        {exam.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#718096' }}>
                        {exam.subjectName}
                    </Typography>
                </Box>

                {/* Score Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={4}>
                        <Paper elevation={0} sx={{
                            p: 3,
                            border: '1px solid #E2E8F0',
                            borderRadius: '16px',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: percentage >= 70 ? '#48BB78' : percentage >= 40 ? '#F6AD55' : '#F56565'
                            }} />
                            <Box sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                bgcolor: '#FFF5F3',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                mb: 2
                            }}>
                                <GradeOutlinedIcon sx={{ color: '#f4511e' }} />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2D3748', mb: 1 }}>
                                {obtainedMarks}/{totalMarks}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#718096' }}>
                                Total Score ({percentage}%)
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper elevation={0} sx={{
                            p: 3,
                            border: '1px solid #E2E8F0',
                            borderRadius: '16px',
                            textAlign: 'center'
                        }}>
                            <Box sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                bgcolor: '#F0FFF4',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                mb: 2
                            }}>
                                <CheckCircleOutlineIcon sx={{ color: '#48BB78' }} />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2D3748', mb: 1 }}>
                                {correctAnswers}/{totalQuestions}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#718096' }}>
                                Correct Answers
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper elevation={0} sx={{
                            p: 3,
                            border: '1px solid #E2E8F0',
                            borderRadius: '16px',
                            textAlign: 'center'
                        }}>
                            <Box sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                bgcolor: '#FFF5F5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                mb: 2
                            }}>
                                <ErrorOutlineIcon sx={{ color: '#E53E3E' }} />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2D3748', mb: 1 }}>
                                {wrongAnswers}/{totalQuestions}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#718096' }}>
                                Wrong Answers
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Additional Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AssignmentOutlinedIcon sx={{ color: '#718096' }} />
                    <Box>
                        <Typography variant="caption" sx={{ color: '#718096', display: 'block' }}>
                            Total Questions
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#2D3748' }}>
                            {totalQuestions}
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ExamScoreDialog;
