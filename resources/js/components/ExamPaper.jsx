import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { questionsData } from '../utils/questionsData';

const ExamPaper = ({ questionId }) => {
    const [selectedOptions, setSelectedOptions] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const questions = questionsData[questionId] || [];

    const handleOptionChange = (questionId, optionValue) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [questionId]: optionValue,
        }));
    };

    const handleSubmit = () => {
        setConfirmationOpen(true);
    };

    const handleCancelSubmit = () => {
        setConfirmationOpen(false);
    };

    const handleConfirmSubmit = () => {
        console.log("Selected Options:", selectedOptions);
        setConfirmationOpen(false);
    };

    if (!Array.isArray(questions)) {
        return <div>Error: The question set must have at least 10 questions.</div>;
    }

    return (
        <div className=" mx-auto p-8 bg-white border border-gray-300 shadow-lg">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Subject: Math</h1>
                <div className="text-lg">
                    <div>Date: 21/10/2023</div>
                    <div>Time: 1 Hour</div>
                    <div>Max Marks: 40</div>
                </div>
                <div className="mt-4 text-start">
                    <p><strong>Instructions:</strong></p>
                    <ol className="list-decimal list-inside">
                        <li>Attempt all questions.</li>
                        <li>All questions carry equal marks.</li>
                        <li>No calculators or electronic devices allowed.</li>
                    </ol>
                </div>
            </div>

            <hr className="my-6" />

            <form>
                {questions.map((question, index) => (
                    <div key={index} className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">{`Q${index + 1}. ${question.text}`}</h3>
                        <RadioGroup
                            value={selectedOptions[question.id] || ""}
                            onChange={(e) => handleOptionChange(question.id, e.target.value)}
                        >
                            {question.options.map((option, idx) => (
                                <FormControlLabel
                                    key={idx}
                                    value={option.value}
                                    control={<Radio />}
                                    label={option.label}
                                    className="text-lg"
                                />
                            ))}
                        </RadioGroup>
                    </div>
                ))}

                <Button color="primary" variant="contained" fullWidth type="button" onClick={handleSubmit}>
                    Submit Exam
                </Button>
            </form>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmationOpen}
                onClose={handleCancelSubmit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Submission"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to submit this exam? Once confirmed, you will not be able to edit the details.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelSubmit} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmSubmit} color="primary" autoFocus>
                        Yes, Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ExamPaper;
