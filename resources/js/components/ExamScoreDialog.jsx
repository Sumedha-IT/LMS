import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, Grid, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ExamScoreDialog = ({ exam, open, onClose }) => {
    if (!exam) return null;

    // Calculate correct and wrong answers
    const correctAnswers = exam.correctAnswers || Math.floor((exam.obtainedMarks / exam.totalMarks) * exam.totalQuestions);
    const wrongAnswers = exam.wrongAnswers || (exam.totalQuestions - correctAnswers);
    const percentage = Math.round((exam.obtainedMarks / exam.totalMarks) * 100);

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
                                {exam.obtainedMarks}/{exam.totalMarks}
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
                                {correctAnswers}/{exam.totalQuestions}
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
                                {wrongAnswers}/{exam.totalQuestions}
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
                            {exam.totalQuestions}
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ExamScoreDialog;
