import React from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaperIcon from '@mui/icons-material/Article'; // Use a suitable icon for paper
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Slide from '@mui/material/Slide';
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
    return (
        <Slide
            direction="down"
            ref={ref}
            {...props}
            timeout={{ enter: 300, exit: 200 }}
            easing={{
                enter: 'ease-out',
                exit: 'ease-in'
            }}
        />)
});

const ReviewDialog = ({ openModal, handleCloseModal, selectedRow }) => {
    localStorage.setItem('reviewDetails', JSON.stringify(selectedRow));
    const nav = useNavigate()
    return (
        <Dialog
            open={openModal}
            TransitionComponent={Transition}
            keepMounted
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    height: 'auto',
                    borderRadius: '10px',
                    position: 'absolute',
                    top: 40,
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: '701', color: '#f97316', fontSize: { xs: '14px', sm: '16px', md: '20px', xl: '22px' } }}>
                    <Box component="span" sx={{ color: '#032246' }}>Past </Box>Attempts
                </Typography>
                <IconButton onClick={handleCloseModal} sx={{ fontWeight: '800', p: 0 }} >
                    <CloseIcon sx={{ fontWeight: '800', p: 0 }} />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mb: 2, fontWeight: '500' }}>Legend:</Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<CheckIcon sx={{ color: '#0B8043', fontSize: { xs: '11px', sm: '12px', md: '14px', xl: '15px' } }} />}
                        sx={{ textTransform: 'none', color: '#03035d', borderColor: '#80808057', fontSize: { xs: '11px', sm: '12px', md: '14px', xl: '15px' } }}
                    >
                        Passed
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<CheckCircleIcon sx={{ color: '#0B8043', fontSize: { xs: '11px', sm: '12px', md: '14px', xl: '15px' } }} />}
                        sx={{ textTransform: 'none', color: '#03035d', borderColor: '#80808057', fontSize: { xs: '11px', sm: '12px', md: '14px', xl: '15px' } }}
                    >
                        Perfect
                    </Button>
                </Box>

                {/* Data with icons */}
                {selectedRow && (
                    <Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xl: '23px', md: '40px', sm: "46px", xs: "28px" }, mb: 3, mt: 5, p: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, fontSize: { xs: '11px', sm: '12px', md: '14px', xl: '15px' } }}>
                                <EventIcon sx={{ color: '#f97316', mr: 1, fontSize: { xs: '14px', sm: '16px', md: '18px', xl: '22px' } }} />
                                <Typography sx={{ fontSize: { xs: '11px', sm: '12px', md: '14px', xl: '15px' } }}>{`${selectedRow.examDate} ${selectedRow.starts_at} to ${selectedRow.ends_at}`}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, fontSize: { xs: '11px', sm: '12px', md: '14px', xl: '15px' } }}>
                                <AccessTimeIcon sx={{ color: '#f97316', mr: 1, fontSize: { xs: '14px', sm: '16px', md: '18px', xl: '22px' } }} />
                                <Typography sx={{ fontSize: { xs: '11px', sm: '12px', md: '14px', xl: '15px' } }}>{selectedRow.duration}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PaperIcon sx={{ color: '#f97316', mr: 1, fontSize: { xs: '14px', sm: '16px', md: '18px', xl: '22px' } }} />
                                <Typography sx={{ fontSize: { xs: '11px', sm: '12px', md: '14px', xl: '15px' } }}>{selectedRow?.totalMarksObtained} / {selectedRow.totalMarks}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{
                            display: 'flex', gap: 2, justifyContent: "end"
                        }}>
                            <Box>
                                <Button onClick={() => nav(`/user/7/exam/${selectedRow.id}/review`)} color='#09b509db' sx={{ display: 'flex', alignItems: 'center', mb: 1, fontSize: { xs: '11px', sm: '12px', md: '14px', xl: '15px' } }}>
                                    Evaluated
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <ArrowForwardIcon sx={{ color: '#f97316', fontSize: { xs: '14px', sm: '16px', md: '18px', xl: '22px' } }} />
                            </Box>
                        </Box>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ReviewDialog;
