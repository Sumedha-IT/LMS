
import { Delete as DeleteIcon } from '@mui/icons-material'; // Import Delete icon
import EditIcon from '@mui/icons-material/Edit'; //Import Edit icon
import { Box, Button, IconButton, Modal, Paper, Table, TableBody, TextField, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
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
    const [editablePartId, setEditablePartId] = useState(null);
    const [editablePartData, setEditablePartData] = useState('');
    const [isAddingPart, setIsAddingPart] = useState(false);

    const [newPartId, setNewPartId] = useState('');
    // const[partId,setPartIds] = useState([])

    // Helper function to convert part index to letters (A, B, C, ...)
    const getPartLabel = (index) => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return letters[index] || `Part ${index + 1}`; // Fallback if too many parts
    };
    const handleEdit = (part) => {
        setEditablePartId(part.partId);
        setEditablePartData(part.partId);
    };

    const handleSaveEdit = (partId) => {
        if (editablePartData.trim() === '') {
            toast.error("Part ID cannot be empty");
            return;
        }

        // Check for duplicates
        const isDuplicate = parts.some(part => part.partId === editablePartData && part.partId !== partId);
        if (isDuplicate) {
            toast.error("Part ID must be unique");
            return;
        }

        // Update the part if valid
        setParts((prevParts) =>
            prevParts.map(part =>
                part.partId === partId ? { ...part, partId: editablePartData } : part
            )
        );
        setEditablePartId(null); // Reset editable part ID
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

    const handleAddNewPart = () => {
        if (newPartId.trim() === '') {
            toast.error("Part ID cannot be empty");
            return;
        }

        // Check for duplicates when adding a new part
        if (parts.some(part => part.partId === newPartId)) {
            toast.error("Part ID must be unique");
            return;
        }

        setParts([...parts, { partId: newPartId, banks: [] }]);
        setNewPartId(''); // Reset new part ID
        setIsAddingPart(false); // Close the input field

        toast.success("Part added successfully!");
    };

    // Delete Part Functionality
    const handleDeletePart = (partId) => {
        const updatedParts = parts.filter(part => part.partId !== partId);  // Filter out the part to be deleted
        setParts(updatedParts);
        toast.success("Part Removed Successfully");
    };

    const handleEditPart = (partId) => {
        console.log("mohit", parts)
        const updatedParts = parts.filter(part => part.partId !== partId);  // Filter out the part to be deleted
        console.log("mohit", updatedParts)
        // if(updatedParts.length == 0){
        //     setParts(...parts,partId)
        // }

        // setParts(updatedParts);
        toast.success("Part Edit Successfully");
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
                        // const partLabel = getPartLabel(partIndex); // Get letter label for the part
                        console.log("search", part, "part", partIndex)
                        return (
                            <Paper key={part.partId || partIndex} square sx={{ borderRadius: '5px', mb: 2, padding: 2 }}>
                                {/* Part Header with Label and Delete Button */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: 1, backgroundColor: '#f4f5f7' }}>
                                    {editablePartId === part.partId ? (
                                        <TextField
                                            value={editablePartData}
                                            onChange={(e) => setEditablePartData(e.target.value)}
                                            onBlur={() => handleSaveEdit(part.partId)} // Save on blur
                                            variant="outlined"
                                            size="small"
                                            sx={{ flexGrow: 1, marginRight: 2 }}
                                        />
                                    ) : (
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {part.partId} (Questions Randomized: No, Options Randomized: No) for Part {partIndex + 1}
                                        </Typography>
                                    )}
                                    <div>
                                        <IconButton color="error" onClick={() => handleDeletePart(part.partId)}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleEdit(part)}>
                                            <EditIcon />
                                        </IconButton>
                                    </div>
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
                        {isAddingPart ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TextField
                                    value={newPartId}
                                    onChange={(e) => setNewPartId(e.target.value)}
                                    placeholder="Enter Part ID"
                                    variant="outlined"
                                    size="small"
                                    sx={{ marginRight: 2 }}
                                />
                                <Button variant="contained" color="primary" onClick={handleAddNewPart}>
                                    Add Part
                                </Button>
                                <Button variant="outlined" onClick={() => setIsAddingPart(false)} sx={{ marginLeft: 1 }}>
                                    Cancel
                                </Button>
                            </Box>
                        ) : (
                            <Button variant="contained" color="primary" onClick={() => setIsAddingPart(true)}>
                                Add New Part
                            </Button>
                        )}
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Box>
                </Box >

            )}
            {/* <Modal open={openEditTab} onClose={handleCloseEditModal}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 4, backgroundColor: 'white', borderRadius: 2, boxShadow: 24 }}>
                    <Typography variant="h6">Edit Part</Typography>
                    <TextField
                        label="Part Data"
                        value={editedPartData}
                        onChange={(e) => setEditedPartData(e.target.value)}
                        sx={{ marginTop: 2, width: '300px' }}
                    />
                    <Button variant="contained" onClick={handleSaveEdit} sx={{ marginTop: 2 }}>
                        Save
                    </Button>
                </Box>
            </Modal> */}
        </>
    );
};

export default TestDataComponent;
