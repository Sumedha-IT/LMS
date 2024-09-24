<<<<<<< Updated upstream
import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TabPanel, { a11yProps } from '../common/TabPanel';
import { axiosGet } from '../services/Services';
import ManageQuestionsComponent from './ManageQuestionsComponent';
// import { useGetPokemonByNameQuery, useGetSubjectsQuery } from '../store/service/admin/AdminService';

const QuestionBankComponent = () => {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestionsCount, setSelectedQuestionsCount] = useState(0);
    const [mainTab, setMainTab] = useState(0); // Top-Level Tabs
    const [subTab, setSubTab] = useState(1);   // Sub-Level Tabs
    const [open, setOpen] = useState(false);
    const nav = useNavigate();
    // const { data } = useGetSubjectsQuery();

    // console.log(data, "agaya h ");
    const Getdata = async (bankIds) => {
        try {
            let result = await axiosGet(`questionBanks`);

            const { data } = result;

            // Find the selected bank from localStorage
            const filteredBanks = data.data.filter((bank) => bankIds.includes(bank.id));

            // Mock selected questions count (replace with your logic)
            // For example, the user selected 15 questions
            console.log(selectedQuestionsCount)
            // If the bank is found, set the questions state
            if (filteredBanks) {
                setQuestions(filteredBanks.map((bank) => ({
                    name: bank.name,
                    id: bank.id,
                    usage: `Use ${selectedQuestionsCount} out of 30 questions`
                })));
            }
        } catch (e) {
            console.log(e);
        }
    };

    // Fetch data from localStorage and update questions
    useEffect(() => {
        let storedBankIds = JSON.parse(localStorage.getItem("bankIds")) || [];
        Getdata(storedBankIds);

    }, [selectedQuestionsCount]);

    // Function to delete a question bank and remove from localStorage
    const handleDeleteQuestion = (id) => {
        // Filter out the question bank with the specified id
        const updatedQuestions = questions.filter((q) => q.id !== id);
        setQuestions(updatedQuestions);

        // Remove the bankId from localStorage
        let storedBankIds = JSON.parse(localStorage.getItem("bankIds")) || [];
        const updatedBankIds = storedBankIds.filter(bankId => bankId !== id);

        // Update the bankIds in localStorage
        localStorage.setItem("bankIds", JSON.stringify(updatedBankIds));
    };

    const handleMainTabChange = (event, newValue) => {
        setMainTab(newValue);
    };

    const handleSubTabChange = (event, newValue) => {
        setSubTab(newValue);
    };

    const addQuestions = () => {
        nav("/addQuestionBank");
    };

    const handleOpen = () => {
        setOpen(!open);
    }

    const handleManageQuestions = () => {
        handleOpen()
        // nav('/manageQuestions');
=======

import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material'; // Import Delete icon
import { useNavigate } from 'react-router-dom';
import TabPanel, { a11yProps } from '../common/TabPanel';
import { useDispatch, useSelector } from 'react-redux';
import { getBankCount } from '../store/slices/adminSlice/ExamSlice';
import ManageQuestionsComponent from './ManageQuestionsComponent';
import { useAddQuestionBanksMutation } from '../store/service/admin/AdminService';
import { toast } from 'react-toastify';

const QuestionBankComponent = () => {
    const [mainTab, setMainTab] = useState(0);
    const [subTab, setSubTab] = useState(1); // Sub-tab state for switching between Add Basic Details and Test Data
    const [open, setOpen] = useState(false);
    const [currentPartId, setCurrentPartId] = useState(null);
    const [currentBankId, setCurrentBankId] = useState(null);
    const [randomQuestionsIds, setRandomQuestionsIds] = useState([]);
    const nav = useNavigate();
    const dispatch = useDispatch();
    const [selectedQuestionsCount, setSelectedQuestionsCount] = useState(0);
    const [parts, setParts] = useState([]);
    const [AddQuestionBanks] = useAddQuestionBanksMutation();
    const selector = useSelector((state) => state.ExamReducer.QuestionBankCount);

    // Helper function to convert part index to letters (A, B, C, ...)
    const getPartLabel = (index) => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return letters[index] || `Part ${index + 1}`; // Fallback if too many parts
    };

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

    const handleMainTabChange = (event, newValue) => setMainTab(newValue);
    const handleSubTabChange = (event, newValue) => setSubTab(newValue); // Sub tab state handler for Add Basic Details and Test Data
    const addQuestions = (id) => nav(`/addQuestionBank?partId=${id}`);
    const handleOpen = () => setOpen(prevOpen => !prevOpen);

    const handleManageQuestions = (partId, bankId, Ids) => {
        console.log("this is your row data", Ids);
        setRandomQuestionsIds(Ids)
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
        const id = localStorage.getItem('examId')
        try {
            let result = await AddQuestionBanks({ id, data: { data: parts } })
            const { data, error } = result;
            console.log(data, error, result);
            if (data?.success === true) {
                toast.success(data?.message)
            } else {
                console.log("asdfadsfds", error.data.message)
                toast.error(error.data.message)
            }
        } catch (e) {
            console.log(e);
        }
>>>>>>> Stashed changes
    };

    return (
        <>
<<<<<<< Updated upstream
            {open ? <ManageQuestionsComponent handleOpen={handleOpen} setSelectedQuestionsCount={setSelectedQuestionsCount} /> : <Box sx={{ width: '100%', backgroundColor: '#f4f5f7', p: 2, borderRadius: 1 }}>
                {/* Top-Level Tabs (Curriculum and Test) */}
                <Paper square>
                    <Tabs
                        value={mainTab}
                        onChange={handleMainTabChange}
                        aria-label="Main Tabs"
                        sx={{
                            backgroundColor: '#f4f5f7',
                            '& .Mui-selected': {
                                backgroundColor: 'white',
                                color: 'black',
                                borderRadius: '5px 5px 0 0',
                            },
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                color: '#007bff',
                                fontWeight: 'bold',
                                borderRadius: '5px 5px 0 0',
                            },
                        }}
                    >
                        <Tab label="Curriculum" {...a11yProps(0)} />
                        <Tab label="Test" {...a11yProps(1)} />
                    </Tabs>
                </Paper>

                {/* Content for Top-Level Tabs */}
                <TabPanel value={mainTab} index={1}>
                    <Typography>This is the Curriculum section.</Typography>
                </TabPanel>

                <TabPanel value={mainTab} index={0}>
                    {/* Sub-Level Tabs (inside Test) */}
                    <Paper square sx={{ borderRadius: '5px', mb: 2 }}>
=======
            {open ? (
                <ManageQuestionsComponent
                    handleOpen={handleOpen}
                    setSelectedQuestionsCount={handleSelectedQuestionsCountForPart}
                    partId={currentPartId}
                    bankId={currentBankId}
                    randomQuestionsIds={randomQuestionsIds}
                />
            ) : (
                <Box sx={{ width: '100%', backgroundColor: '#f4f5f7', p: 2, borderRadius: 1 }}>
                    {/* Main Tabs */}
                    <Paper square>
                        <Tabs
                            value={mainTab}
                            onChange={handleMainTabChange}
                            aria-label="Main Tabs"
                            sx={{
                                backgroundColor: '#f4f5f7',
                                '& .Mui-selected': {
                                    backgroundColor: 'white',
                                    color: 'black',
                                    borderRadius: '5px 5px 0 0',
                                },
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    color: '#007bff',
                                    fontWeight: 'bold',
                                    borderRadius: '5px 5px 0 0',
                                },
                            }}
                        >
                            <Tab label="Curriculum" {...a11yProps(0)} />
                            <Tab label="Test" {...a11yProps(1)} />
                        </Tabs>
                    </Paper>

                    <TabPanel value={mainTab} index={1}>
                        <Typography>This is the Curriculum section.</Typography>
                    </TabPanel>

                    <TabPanel value={mainTab} index={0}>
>>>>>>> Stashed changes
                        <Tabs
                            value={subTab}
                            onChange={handleSubTabChange}
                            aria-label="Sub Tabs"
                            sx={{
                                backgroundColor: '#f4f5f7',
                                '& .Mui-selected': {
                                    backgroundColor: 'white',
                                    color: 'black',
                                    borderRadius: '5px 5px 0 0',
                                },
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    color: '#007bff',
                                    fontWeight: 'bold',
                                    borderRadius: '5px 5px 0 0',
                                },
                            }}
                        >
                            <Tab label="Add Basic Details" {...a11yProps(0)} />
                            <Tab label="Test Data" {...a11yProps(1)} />
                        </Tabs>
<<<<<<< Updated upstream
                    </Paper>

                    {/* Content for Sub-Level Tabs */}
                    <TabPanel value={subTab} index={0}>
                        <Typography>Add your basic exam details here.</Typography>
                    </TabPanel>

                    <TabPanel value={subTab} index={1}>
                        {/* Test Data Content */}
                        <Box sx={{ p: 2, backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '4px', mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Part A (Questions Randomized: No, Options Randomized: No)
                            </Typography>

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
                                        {questions.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.usage}</TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        variant="contained"
                                                        color="warning"
                                                        size="small"
                                                        sx={{ marginRight: 1 }}
                                                        onClick={handleManageQuestions}
                                                    >
                                                        Manage Questions
                                                    </Button>
                                                    <IconButton color="error" onClick={() => handleDeleteQuestion(row.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Typography variant="body1" sx={{ mb: 2, cursor: 'pointer', color: '#007bff' }}>
                                <span onClick={addQuestions}>+ Add Question Bank</span>
                            </Typography>
                        </Box>

                        {/* Add New Part Button */}
                        <Button variant="contained" color="primary">
                            Add New Part
                        </Button>
                    </TabPanel>
                </TabPanel>
            </Box>}
=======

                        {/* Sub Tab Panels */}
                        <TabPanel value={subTab} index={0}>
                            {/* Content for Add Basic Details */}
                            <Box sx={{ p: 2 }}>
                                <Typography variant="h6">Basic Details Form</Typography>
                                <TextField
                                    label="Exam Title"
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Duration (in minutes)"
                                    type="number"
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Additional Instructions"
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={4}
                                />
                            </Box>
                        </TabPanel>

                        <TabPanel value={subTab} index={1}>
                            {/* Content for Test Data - This will show the parts */}
                            {parts.map((part, partIndex) => {
                                const filteredBanks = selector.filter((q) => q.partId === part.partId);
                                const partLabel = getPartLabel(partIndex); // Get letter label for the part

                                return (
                                    <Paper key={part.partId || partIndex} square sx={{ borderRadius: '5px', mb: 2 }}>
                                        {/* Part Header with Label and Delete Button */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
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
                        </TabPanel>
                    </TabPanel>
                    {/* Sub-Tabs */}

                </Box>
            )}
>>>>>>> Stashed changes
        </>
    );
};

export default QuestionBankComponent;
