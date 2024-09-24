import React, { useState } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, Checkbox,
    FormControlLabel, TextField, Select, MenuItem, InputLabel, FormControl, Typography, Box,
} from '@mui/material';
import { toast } from 'react-toastify';

const EditQuestionSettingsModal = ({ onUpdate, totalQuestionCount }) => {
    const [open, setOpen] = useState(false);
    const [autoSelect, setAutoSelect] = useState(true); // Track if auto-select or manual
    const [useAllQuestions, setUseAllQuestions] = useState(true);
    const [questionsToUse, setQuestionsToUse] = useState(0);
    const [error, setError] = useState('');  // Track validation error message
    const totalQuestions = totalQuestionCount; // Example: Set total number of questions dynamically.

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSelectChange = (e) => {
        const isAutoSelect = e.target.value;
        setAutoSelect(isAutoSelect);

        // If "Manually select questions" is chosen, close the modal and trigger the update
        if (!isAutoSelect) {
            handleUpdate(isAutoSelect);
        }
    };

    const handleUpdate = (isAutoSelect = "") => {
        // Validation: If manually selecting questions, check the number of questions is valid
        if (!useAllQuestions && (questionsToUse <= 0 || questionsToUse > totalQuestions)) {
            setError(`Please enter a value between 1 and ${totalQuestions}`);
            return; // Stop the update if validation fails
        }

        // Clear any previous error
        setError('');

        const updateData = {
            autoSelect: isAutoSelect === false ? false : true,
            totalQuestion: useAllQuestions,
            questionCount: useAllQuestions ? totalQuestions : questionsToUse,
        };
        onUpdate(updateData); // Trigger update in the parent
        handleClose(); // Close the modal
    };

    const handleQuestionsToUseChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setQuestionsToUse(value);

        // If the value is out of range, set an error message
        if (value <= 0 || value > totalQuestions) {
            setError(`Please enter a value between 1 and ${totalQuestions}`);
        } else {
            setError(''); // Clear error if valid
        }
    };

    return (
        <>
            <span variant="contained" color="primary" onClick={handleOpen} style={{ cursor: 'pointer', color: '#007bff' }}>
                Edit Question Settings
            </span>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Question Settings</DialogTitle>
                <DialogContent dividers>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="1">How to choose questions?</InputLabel>
                        <Select
                            labelId="1"
                            id="demo-simple-select"
                            label="How to choose questions?"
                            value={autoSelect}
                            onChange={handleSelectChange}
                        >
                            <MenuItem value={true}>
                                Automatically select questions from the question bank
                            </MenuItem>
                            <MenuItem value={false}>Manually select questions</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Checkbox to use all questions */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={useAllQuestions}
                                onChange={(e) => setUseAllQuestions(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Always use all questions from this question bank."
                    />

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Turn on this setting if you want to use all the questions of this question bank in this assessment.
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <TextField
                            label="# Ques. to use"
                            type="number"
                            value={useAllQuestions ? totalQuestions : questionsToUse}
                            onChange={handleQuestionsToUseChange} // Handle changes and validation
                            disabled={useAllQuestions} // Disable if "Always use all questions" is checked
                            error={!!error} // Highlight the field with error
                            helperText={error} // Display the error message
                        />
                        <Typography>Total Questions: {totalQuestions}</Typography>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="secondary" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={() => handleUpdate()} color="primary" variant="contained">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EditQuestionSettingsModal;
