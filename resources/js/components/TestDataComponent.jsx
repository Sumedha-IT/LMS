
import { Delete as DeleteIcon } from '@mui/icons-material'; // Import Delete icon
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,useParams} from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAddQuestionBanksMutation, useGetRandomQuestionIdsMutation } from '../store/service/admin/AdminService';
import { getBankCount } from '../store/slices/adminSlice/ExamSlice';
import ManageQuestionsComponent from './ManageQuestionsComponent';

const TestDataComponent = ({ Meta }) => {
    const [open, setOpen] = useState(false);
    const [currentPartId, setCurrentPartId] = useState(null);
    const [currentBankId, setCurrentBankId] = useState(null);
    const [randomQuestionsIds, setRandomQuestionsIds] = useState([]);
    const nav = useNavigate();
    const dispatch = useDispatch();
    const [selectedQuestionsCount, setSelectedQuestionsCount] = useState(0);
    const [parts, setParts] = useState([]);
    const [AddQuestionBanks] = useAddQuestionBanksMutation();
    const [getRandomQuestionIds] = useGetRandomQuestionIdsMutation();
    const selector = useSelector((state) => state.ExamReducer.QuestionBankCount);
    const examId = localStorage.getItem('examId')

    // Helper function to convert part index to letters (A, B, C, ...)
    const getPartLabel = (index) => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return letters[index] || `Part ${index + 1}`; // Fallback if too many parts
    };

    useEffect(() => {
        console.log("Meta", Meta);
        if (Meta && Meta.length > 0) {
            const updatedMeta = Meta.map((val) => {
                return {
                    ...val,
                    banks: val.banks.map((e) => {
                        return {
                            ...e,
                            usage: `Use ${e.usedQuestions} out of ${e.questionsCount} questions`,
                        }
                    })
                }
            })
            console.log("new", updatedMeta);
            dispatch(getBankCount(updatedMeta));
        }
    }, [Meta])

    // Function to extract unique partIds and create parts dynamically
    useEffect(() => {
        const initialCount = {};
        const uniqueParts = [];

        // Iterate over the selector to initialize parts and selectedQuestionsCount
        selector.forEach((part) => {
            const banksCount = part.banks.reduce((acc, bank) => {
                acc[bank.id] = selectedQuestionsCount[part.partId]?.[bank.id] || 0;  // Set initial count for each bank
                return acc;
            }, {});

            initialCount[part.partId] = banksCount;

            // Add unique parts to parts array
            const existingPart = uniqueParts.find(p => p.partId === part.partId);
            if (!existingPart) {
                uniqueParts.push({
                    partId: part.partId,
                    banks: (part.banks || []), // Banks will be mapped later
                });
            }
        });

        if (uniqueParts.length === 0) {
            uniqueParts.push({ partId: Date.now().toString(), banks: [] });
        }

        // Set initial state for selectedQuestionsCount and parts
        setSelectedQuestionsCount(initialCount);
        setParts(uniqueParts);

    }, [selector]);

    const handleDeleteQuestion = (id, partId) => {
        const updatedSelector = selector.map((part) => {
            if (part.partId === partId) {
                return {
                    ...part,
                    banks: part.banks.filter((q) => q.id !== id), // Filter out the deleted bank
                };
            }
            return part;
        });
        toast.success("Question Bank removed from assessment successfully !")
        dispatch(getBankCount(updatedSelector)); // Dispatch updated banks to Redux store
    };
    const { id } = useParams();
    const addQuestions = (partId) => nav(`/administrator/${id}/exams/addquestionBank?partId=${partId}`);

    const handleOpen = () => setOpen(prevOpen => !prevOpen);

    const handleManageQuestions = async (partId, bankId, Ids) => {
        // console.log("this is your row data", Ids, typeof bankId);
        if (!Ids) {
            try {
                const getIds = await getRandomQuestionIds({ partId, bankId, examId })
                const { data } = getIds;
                setRandomQuestionsIds(data?.data)
            } catch (e) {

            }
        } else {

            setRandomQuestionsIds(Ids)
        }
        setCurrentPartId(partId); // Set the current partId
        setCurrentBankId(bankId); // Set the current bankId
        setOpen(true); // Open the ManageQuestionsComponent
    };

    // Add New Part - Without Sub-Tabs
    const addNewPart = () => {
        const newPartId = Date.now().toString();
        setParts([...parts, {
            partId: newPartId,
            banks: [] // Initialize empty banks array for the new part
        }]);
    };

    // Delete Part Functionality
    const handleDeletePart = (partId) => {
        const updatedParts = parts.filter(part => part.partId !== partId);  // Filter out the part to be deleted
        setParts(updatedParts);
        toast.success("Part Removed Successfully");
    };

    const handleSelectedQuestionsCountForPart = (partId, bankId, count) => {
        setSelectedQuestionsCount((prev) => {
            const part = prev[partId] || {};
            return {
                ...prev,
                [partId]: {
                    ...part,
                    [bankId]: count,  // Track count per bankId inside each part
                },
            };
        });
    };

    const handleSubmit = async () => {

        try {
            // console.log("exam id", examId);
            let result = await AddQuestionBanks({ examId, data: { data: parts } })
            const { data, error } = result;
            // console.log(data, error, result);
            if (data?.success === true) {
                toast.success(data?.message)
                nav(`/administrator/${id}/exams/`)
                dispatch(getBankCount([{ partId: Date.now().toString(), banks: [] }]));
                localStorage.clear();
            } else {
                toast.error(error.data.message)
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            {open ? (
                <ManageQuestionsComponent
                    handleOpen={handleOpen}
                    setSelectedQuestionsCount={handleSelectedQuestionsCountForPart}
                    partId={currentPartId}
                    bankId={currentBankId}
                    randomQuestionsIds={randomQuestionsIds}
                    examId={examId}
                />
            ) : (
                <Box sx={{ width: '100%', backgroundColor: '#f4f5f7', p: '0px', borderRadius: 1 }}>


                    {/* Content for Test Data - This will show the parts */}
                    {parts.map((part, partIndex) => {
                        const filteredBanks = selector.filter((q) => q.partId === part.partId);
                        const partLabel = getPartLabel(partIndex); // Get letter label for the part

                        return (
                            <Paper key={part.partId || partIndex} square sx={{ borderRadius: '5px', mb: 2, padding: 2 }}>
                                {/* Part Header with Label and Delete Button */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: 1, backgroundColor: '#f4f5f7' }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Part {partLabel} (Questions Randomized: No, Options Randomized: No) for Part {partIndex + 1}
                                    </Typography>
                                    <IconButton color="error" onClick={() => handleDeletePart(part.partId)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>

                                {/* Display Question Bank Details */}
                                <Box sx={{ p: 2, backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '4px', mb: 2 }}>
                                    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Question Bank</TableCell>
                                                    <TableCell>Usage</TableCell>
                                                    <TableCell align="center">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filteredBanks.length > 0 ? (
                                                    filteredBanks[0].banks?.map((row, index) => (
                                                        <TableRow key={row.id || index}>
                                                            <TableCell>{row.name}</TableCell>
                                                            <TableCell>{row.usage}</TableCell>
                                                            <TableCell align="center">
                                                                <Button
                                                                    variant="contained"
                                                                    color="warning"
                                                                    size="small"
                                                                    sx={{ marginRight: 1 }}
                                                                    onClick={() => handleManageQuestions(part.partId, row.id, row.questionsIds)}
                                                                >
                                                                    Manage Questions
                                                                </Button>
                                                                <IconButton color="error" onClick={() => handleDeleteQuestion(row.id, part.partId)}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={3}>No data available</TableCell>
                                                        </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <Typography variant="body1" sx={{ mb: 2, cursor: 'pointer', color: '#007bff' }}>
                                        <span onClick={() => addQuestions(part.partId)}>+ Add Question Bank</span>
                                    </Typography>
                                </Box>
                            </Paper>
                        );
                    })}

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Button variant="contained" color="primary" onClick={addNewPart}>
                            Add New Part
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Box>


                </Box>
            )}
        </>
    );
};

export default TestDataComponent;
