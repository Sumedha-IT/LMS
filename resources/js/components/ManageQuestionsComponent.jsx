// import React, { useState } from 'react';
// import { Box, Typography, Button, IconButton, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
// import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

// // Mock Data for Questions
// const mockQuestions = [
//     {
//         id: 'Q1',
//         question: 'Consider the following statements which explains the enhancement n-type MOSFET. Which of the following is/are correct?',
//         marks: 4.5,
//         selected: false,
//     },
//     {
//         id: 'Q2',
//         question: 'Consider the enhancement n-type MOSFET.Which of the following is/are correct with regards to channel formation?',
//         marks: 6.5,
//         selected: false,
//     },
// ];

// const ManageQuestionsComponent = () => {
//     const [questions, setQuestions] = useState(mockQuestions);
//     const [editQuestionId, setEditQuestionId] = useState(null);  // Track the ID of the question being edited
//     const [newQuestionValue, setNewQuestionValue] = useState(''); // Store the edited question value
//     const [isEditingSettings, setIsEditingSettings] = useState(false); // Track if "Edit Settings" is active
//     const [selectedQuestions, setSelectedQuestions] = useState([]); // Track selected questions

//     // Function to handle adding new questions
//     const handleAddQuestion = () => {
//         const newQuestion = {
//             id: `Q${questions.length + 1}`,
//             question: 'New Question',
//             marks: 5.0,
//             selected: false,
//         };
//         setQuestions([...questions, newQuestion]);
//     };

//     // Start editing a question
//     const handleEditQuestion = (id, currentQuestion) => {
//         setEditQuestionId(id);
//         setNewQuestionValue(currentQuestion);  // Set the current question as the default value in the input
//     };

//     // Save the edited question
//     const handleSaveQuestion = (id) => {
//         const updatedQuestions = questions.map((q) =>
//             q.id === id ? { ...q, question: newQuestionValue } : q
//         );
//         setQuestions(updatedQuestions);
//         setEditQuestionId(null);  // Exit edit mode
//     };

//     // Cancel editing the question
//     const handleCancelEdit = () => {
//         setEditQuestionId(null);  // Exit edit mode without saving
//         setNewQuestionValue('');  // Clear the input value
//     };

//     // Toggle "Edit Settings"
//     const handleEditSettings = () => {
//         setIsEditingSettings(!isEditingSettings); // Toggle edit mode
//         setSelectedQuestions([]); // Clear selected questions when toggling edit mode
//     };

//     // Function to handle selecting a question
//     const handleSelectQuestion = (id) => {
//         const updatedQuestions = questions.map((q) =>
//             q.id === id ? { ...q, selected: !q.selected } : q
//         );
//         setQuestions(updatedQuestions);

//         const selected = updatedQuestions.filter((q) => q.selected);
//         setSelectedQuestions(selected);
//     };

//     // Submit or update selected questions
//     const handleSubmitSelectedQuestions = () => {
//         console.log('Selected Questions:', selectedQuestions);
//         // Implement your logic for updating or submitting selected questions here
//     };

//     return (
//         <Box sx={{ padding: 2 }}>
//             <Typography variant="h6" sx={{ marginBottom: 2 }}>
//                 Questions: Capgemini Test - 1
//                 <Typography variant="body2" component="span" sx={{ cursor: 'pointer', color: '#007bff', marginLeft: 1 }} onClick={handleEditSettings}>
//                     {isEditingSettings ? 'Stop Editing' : 'Edit Settings'}
//                 </Typography>
//             </Typography>

//             <Button variant="contained" color="primary" sx={{ marginBottom: 2 }} onClick={handleAddQuestion}>
//                 + Add New Question
//             </Button>

//             <TableContainer component={Paper}>
//                 <Table sx={{ minWidth: 650 }} aria-label="question table">
//                     <TableHead>
//                         <TableRow>
//                             {isEditingSettings && <TableCell>Select</TableCell>}
//                             <TableCell>Marks</TableCell>
//                             <TableCell>Question</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {questions.map((q) => (
//                             <TableRow key={q.id}>
//                                 {/* Show the Checkbox only when "Edit Settings" is active */}
//                                 {isEditingSettings && (
//                                     <TableCell>
//                                         <Checkbox
//                                             checked={q.selected}
//                                             onChange={() => handleSelectQuestion(q.id)}
//                                             inputProps={{ 'aria-label': `select question ${q.id}` }}
//                                         />
//                                     </TableCell>
//                                 )}
//                                 <TableCell>
//                                     <Typography sx={{ fontWeight: 'bold', color: q.marks >= 5 ? 'green' : 'red' }}>
//                                         Marks: {q.marks}
//                                     </Typography>
//                                 </TableCell>

//                                 {/* If question is being edited, show input field */}
//                                 <TableCell>
//                                     {editQuestionId === q.id ? (
//                                         <TextField
//                                             fullWidth
//                                             value={newQuestionValue}
//                                             onChange={(e) => setNewQuestionValue(e.target.value)}
//                                             variant="outlined"
//                                             size="small"
//                                         />
//                                     ) : (
//                                         q.question
//                                     )}
//                                 </TableCell>

//                                 <TableCell align="center">
//                                     {editQuestionId === q.id ? (
//                                         <>
//                                             <IconButton color="primary" onClick={() => handleSaveQuestion(q.id)}>
//                                                 <SaveIcon />
//                                             </IconButton>
//                                             <IconButton color="error" onClick={handleCancelEdit}>
//                                                 <CancelIcon />
//                                             </IconButton>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <IconButton color="primary" onClick={() => handleEditQuestion(q.id, q.question)}>
//                                                 <EditIcon />
//                                             </IconButton>
//                                             <IconButton color="error">
//                                                 <DeleteIcon />
//                                             </IconButton>
//                                         </>
//                                     )}
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             {/* Show Submit or Update Button when any question is selected */}
//             {isEditingSettings && selectedQuestions.length > 0 && (
//                 <Box sx={{ marginTop: 2 }}>
//                     <Button variant="contained" color="primary" onClick={handleSubmitSelectedQuestions}>
//                         Submit Selected Questions
//                     </Button>
//                 </Box>
//             )}
//         </Box>
//     );
// };

// export default ManageQuestionsComponent;



import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, IconButton, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { axiosGet } from '../services/Services';

// Mock Data for Questions
const mockQuestions = [
    {
        id: 'Q1',
        question: 'Consider the following statements which explains the enhancement n-type MOSFET. Which of the following is/are correct?',
        marks: 4.5,
        selected: false,
    },
    {
        id: 'Q2',
        question: 'Consider the enhancement n-type MOSFET.Which of the following is/are correct with regards to channel formation?',
        marks: 6.5,
        selected: false,
    },
];

const ManageQuestionsComponent = ({ handleOpen, setSelectedQuestionsCount }) => {
    const [questions, setQuestions] = useState(mockQuestions);
    const [editQuestionId, setEditQuestionId] = useState(null);  // Track the ID of the question being edited
    const [newQuestionValue, setNewQuestionValue] = useState(''); // Store the edited question value
    const [isAddingNewQuestion, setIsAddingNewQuestion] = useState(false); // Track if a new question is being added
    const [newQuestionInput, setNewQuestionInput] = useState(''); // Store the value for new question input
    const [isEditingSettings, setIsEditingSettings] = useState(false); // Track if "Edit Settings" is active
    const [selectedQuestions, setSelectedQuestions] = useState([]); // Track selected questions



    const Getdata = async () => {
        const payload = { "questionBankId": 12 }
        try {
            let result = await axiosGet('questions');
            const { data } = result;
            console.log(('data', data.data));
            // if (data?.data) {
            //     setSetTableList(data.data.map((e) => {
            //         console.log("first", e)
            //         return (
            //             {
            //                 name: e.name,
            //                 id: e.id,
            //                 question_bank_subject_id: e.question_bank_subject_id,
            //                 question_bank_type_id: e.question_bank_type_id,
            //                 question_bank_chapter: e.question_bank_chapter,
            //                 description: e.description,
            //                 question_bank_difficulty_id: e.question_bank_difficulty_id,
            //                 onAddClick
            //             }
            //         )
            //     }))
            // }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        // Getdata()
    }, [])



    // Start editing a question
    const handleEditQuestion = (id, currentQuestion) => {
        setEditQuestionId(id);
        setNewQuestionValue(currentQuestion);  // Set the current question as the default value in the input
    };

    // Save the edited question
    const handleSaveQuestion = (id) => {
        const updatedQuestions = questions.map((q) =>
            q.id === id ? { ...q, question: newQuestionValue } : q
        );
        setQuestions(updatedQuestions);
        setEditQuestionId(null);  // Exit edit mode
    };

    // Cancel editing the question
    const handleCancelEdit = () => {
        setEditQuestionId(null);  // Exit edit mode without saving
        setNewQuestionValue('');  // Clear the input value
    };

    // Toggle "Edit Settings"
    const handleEditSettings = () => {
        setIsEditingSettings(!isEditingSettings); // Toggle edit mode
        setSelectedQuestions([]); // Clear selected questions when toggling edit mode
    };

    // Function to handle selecting a question
    const handleSelectQuestion = (id) => {
        const updatedQuestions = questions.map((q) =>
            q.id === id ? { ...q, selected: !q.selected } : q
        );
        setQuestions(updatedQuestions);

        const selected = updatedQuestions.filter((q) => q.selected);
        setSelectedQuestions(selected);
    };

    // Handle adding new question by showing input
    const handleAddNewQuestion = () => {
        setIsAddingNewQuestion(true); // Show the input for the new question
    };

    // Handle saving the new question
    const handleSaveNewQuestion = () => {
        if (newQuestionInput.trim()) {
            const newQuestion = {
                id: `${questions.length + 1}`,
                question: newQuestionInput.trim(),
                marks: 5.0,
                selected: false,
            };
            setQuestions([...questions, newQuestion]);
            setIsAddingNewQuestion(false); // Hide the input after adding the question
            setNewQuestionInput(''); // Clear the input field
        }
    };

    // Cancel adding a new question
    const handleCancelNewQuestion = () => {
        setIsAddingNewQuestion(false);
        setNewQuestionInput('');
    };

    // Submit or update selected questions
    const handleSubmitSelectedQuestions = () => {
        console.log('Selected Questions:', selectedQuestions.length);
        setSelectedQuestionsCount(selectedQuestions.length)
        handleOpen()
        // Implement your logic for updating or submitting selected questions here
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Questions: Capgemini Test - 1
                <Typography variant="body2" component="span" sx={{ cursor: 'pointer', color: '#007bff', marginLeft: 1 }} onClick={handleEditSettings}>
                    {isEditingSettings ? 'Stop Editing' : 'Edit Settings'}
                </Typography>
            </Typography>

            {/* Button to Add New Question */}
            <Button variant="contained" color="primary" sx={{ marginBottom: 2 }} onClick={handleAddNewQuestion}>
                + Add New Question
            </Button>

            {/* Show input field for adding a new question */}
            {isAddingNewQuestion && (
                <Box sx={{ display: 'flex', marginBottom: 2 }}>
                    <TextField
                        label="New Question"
                        variant="outlined"
                        fullWidth
                        value={newQuestionInput}
                        onChange={(e) => setNewQuestionInput(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleSaveNewQuestion} sx={{ marginLeft: 1 }}>
                        Save
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancelNewQuestion} sx={{ marginLeft: 1 }}>
                        Cancel
                    </Button>
                </Box>
            )}

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="question table">
                    <TableHead>
                        <TableRow>
                            {isEditingSettings && <TableCell>Select</TableCell>}
                            <TableCell>Marks</TableCell>
                            <TableCell>Question</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map((q) => (
                            <TableRow key={q.id}>
                                {/* Show the Checkbox only when "Edit Settings" is active */}
                                {isEditingSettings && (
                                    <TableCell>
                                        <Checkbox
                                            checked={q.selected}
                                            onChange={() => handleSelectQuestion(q.id)}
                                            inputProps={{ 'aria-label': `select question ${q.id}` }}
                                        />
                                    </TableCell>
                                )}
                                <TableCell>
                                    <Typography sx={{ fontWeight: 'bold', color: q.marks >= 5 ? 'green' : 'red' }}>
                                        Marks: {q.marks}
                                    </Typography>
                                </TableCell>

                                {/* If question is being edited, show input field */}
                                <TableCell>
                                    {editQuestionId === q.id ? (
                                        <TextField
                                            fullWidth
                                            value={newQuestionValue}
                                            onChange={(e) => setNewQuestionValue(e.target.value)}
                                            variant="outlined"
                                            size="small"
                                        />
                                    ) : (
                                        q.question
                                    )}
                                </TableCell>

                                <TableCell align="center">
                                    {editQuestionId === q.id ? (
                                        <>
                                            <IconButton color="primary" onClick={() => handleSaveQuestion(q.id)}>
                                                <SaveIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={handleCancelEdit}>
                                                <CancelIcon />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <>
                                            <IconButton color="primary" onClick={() => handleEditQuestion(q.id, q.question)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Show Submit or Update Button when any question is selected */}
            {isEditingSettings && selectedQuestions.length > 0 && (
                <Box sx={{ marginTop: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSubmitSelectedQuestions}>
                        Submit Selected Questions
                    </Button>
                </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" color="secondary" onClick={() => { handleOpen() }}>
                    Close
                </Button>
            </Box>
        </Box>
    );
};

export default ManageQuestionsComponent;
