import React from 'react';
import { Box, Button, Typography, Stack, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const QuitConfirmation = ({ setQuitConfirmation, setIsSubmission, setIsSubmit, setTimeLeft, setIsTimeOver }) => {
    const handleQuit = () => {
        setTimeLeft(0); // Reset countdown to 00:00
        setIsTimeOver(true); // Mark exam as over
        setQuitConfirmation(false)
        setIsSubmission(false)
        setIsSubmit(true)
    }
    return (
        <Box
            sx={{
                height: '80vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor: '#f4f5f7',
                px: 2
            }}
        >
            <ErrorOutlineIcon sx={{ fontSize: 50, color: '#f44336', mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 4, px: 2, alignItems: 'center', justifyContent: 'space-around' }}>
                <Typography variant="h6" sx={{ textAlign: 'center', fontSize: { xs: '14px', sm: '16px', md: '18px', xl: '20px' } }}>
                    Quitting will automatically submit the assessment.
                </Typography>
                <Typography sx={{ fontSize: { xs: '11px', sm: '13px', md: '15px', xl: '17px' } }}>
                    Do you really want to quit?
                </Typography>
            </Box>


            {/* Buttons for Quit and Go Back */}
            <Stack direction="row" justifyContent="center" spacing={2}>
                <Button variant="contained" sx={{ fontSize: { xs: '9px', sm: '10px', md: '12px', xl: '14px' } }} color="error" onClick={handleQuit} >
                    Quit
                </Button>
                <Button variant="contained" sx={{ fontSize: { xs: '9px', sm: '10px', md: '12px', xl: '14px' } }} color="warning" onClick={() => setQuitConfirmation(false)}>
                    No, Go Back To Quiz
                </Button>
            </Stack>
        </Box>
    );
};

export default QuitConfirmation;



