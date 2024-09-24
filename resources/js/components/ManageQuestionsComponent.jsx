


import {
    Box, Button, Checkbox, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useGetQuestionIdMutation, useGetQuestionsAsPerBankIdQuery } from '../store/service/admin/AdminService';
import { getBankCount } from '../store/slices/adminSlice/ExamSlice';
import EditQuestionSettingsModal from './EditQuestionSettingsModal';

const ManageQuestionsComponent = ({ handleOpen, setSelectedQuestionsCount, partId, bankId, randomQuestionsIds }) => {
    const { data, isLoading, isError } = useGetQuestionsAsPerBankIdQuery(bankId);
    const [GetQuestionId] = useGetQuestionIdMutation();
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [autoSelect, setAutoSelect] = useState(true); // Control Auto vs Manual question selection
    const [totalQuestions, setTotalQuestions] = useState(0); // Dynamic total questions count
    const selector = useSelector((state) => state.ExamReducer.QuestionBankCount);
    const dispatch = useDispatch();

    useEffect(() => {
        if (data && !isLoading && !isError) {
            if (randomQuestionsIds?.length > 0) {
                // console.log("!randomQuestionsIds.includes(e.id)", randomQuestionsIds);
                const filteredData = data.data?.filter((e) => randomQuestionsIds.includes(e.id));
                setQuestions(filteredData)
                console.log(data.data?.filter((e) => randomQuestionsIds.includes(e.id)));
            } else {

                setQuestions(data.data);
            }
        }
    }, [data, isLoading, isError]);

    // Handle question selection
    const handleSelectQuestion = (id) => {
        const updatedQuestions = questions.map((q) =>
            q.id === id ? { ...q, selected: !q.selected } : q
        );
        setQuestions(updatedQuestions);
        const selected = updatedQuestions.filter((q) => q.selected);
        setSelectedQuestions(selected);
    };

    // Handle submit for selected questions
    const handleSubmitSelectedQuestions = (randomIds = []) => {
        console.log('randomIds', randomIds);
        const questionsIds = selectedQuestions.map((e) => e.id);
        const updatedParts = selector.map((part) => {
            if (String(part.partId) === String(partId)) {
                return {
                    ...part,
                    banks: part.banks?.map((bank) => {
                        if (String(bank.id) === String(bankId)) {
                            return {
                                ...bank,
                                usage: `Use ${randomIds.length > 0 ? randomIds.length : selectedQuestions.length} out of ${data.data?.length} questions`,
                                questionsIds: randomIds.length > 0 ? randomIds : questionsIds,
                            };
                        }
                        return bank;
                    }),
                };
            }
            return part;
        });
        dispatch(getBankCount(updatedParts));
        toast.success("Question bank details updated successfully !")
        handleOpen(); // Close the modal or component
    };

    // Handle the modal update and its response
    const handleModalUpdate = async ({ autoSelect, totalQuestion, questionCount }) => {
        setAutoSelect(autoSelect);
        setTotalQuestions(questionCount);
        console.log("in the box", autoSelect, totalQuestion, questionCount);
        if (autoSelect) {
            let result = await GetQuestionId({ data: { autoSelect, totalQuestion, questionCount, questionBankId: bankId } })
            const { data } = result;
            console.log(data);
            handleSubmitSelectedQuestions(data?.data)
            // Auto-select questions logic here (example: take all questions automatically)
            // const updatedQuestions = questions.map((q, index) => ({
            //     ...q,
            //     selected: index < questionCount, // Select the first 'questionCount' questions
            // }));
            // setQuestions(updatedQuestions);
            // console.log("updatedQuestions", updatedQuestions);
        } else {
            // Manually select questions
            // Map over the data and check if each question's id is in randomQuestionsIds
            const updatedQuestions = data.data?.map((q) => ({
                ...q,
                selected: randomQuestionsIds?.includes(q.id),  // Select if the question's id is in randomQuestionsIds
            }));

            setQuestions(updatedQuestions);  // Set the questions with the correct selected state

            console.log("Updated questions with randomQuestionsIds", updatedQuestions);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Questions: Capgemini Test - 1
                <Typography
                    variant="body2"
                    component="span"
                    sx={{ cursor: 'pointer', color: '#007bff', marginLeft: 1 }}
                >
                    <EditQuestionSettingsModal onUpdate={handleModalUpdate} totalQuestionCount={questions.length} />
                </Typography>
            </Typography>

            {/* Table for displaying and selecting questions */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="question table">
                    <TableHead>
                        <TableRow>
                            {/* Show the Checkbox column only if autoSelect is false */}
                            {!autoSelect && <TableCell>Select</TableCell>}
                            <TableCell>Marks</TableCell>
                            <TableCell>Question</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map((q) => (
                            <TableRow key={q.id}>
                                {/* Show the Checkbox only when autoSelect is false */}
                                {!autoSelect && (
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
                                <TableCell>
                                    <div dangerouslySetInnerHTML={{ __html: q.question }}></div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Show Submit Button when any question is selected in Manual Mode */}
            {!autoSelect && selectedQuestions.length > 0 && (
                <Box sx={{ marginTop: 2 }}>
                    <Button variant="contained" color="primary" onClick={() => { handleSubmitSelectedQuestions() }}>
                        Submit Selected Questions
                    </Button>
                </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" color="secondary" onClick={() => handleOpen()}>
                    Close
                </Button>
            </Box>
        </Box>
    );
};

export default ManageQuestionsComponent;
