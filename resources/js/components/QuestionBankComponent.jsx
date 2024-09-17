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
    };

    return (
        <>
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
        </>
    );
};

export default QuestionBankComponent;
