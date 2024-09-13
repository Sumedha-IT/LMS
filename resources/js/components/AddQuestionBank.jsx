import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Button, Typography, Select, MenuItem } from '@mui/material';
import CommonTable from '../common/CommonTable'; // Import the reusable common table component
import TabPanel, { a11yProps } from '../common/TabPanel'; // Import the common TabPanel component
import { useNavigate } from 'react-router-dom';
import { axiosGet } from '../services/Services';
import { useGetQuestionBanksQuery } from '../store/service/admin/AdminService';

// // Data for the common table (for question banks)
// const questionBankData = [
//     {
//         examDate: 'DDF Week 0',
//         time: 'QB ID:27682',
//         examName: 'Week 1',
//         subExamName: '8 Questions',
//         batchName: 'Test 1',
//         batchSubName: '',
//         totalMarks: 'Intermediate',
//         status: 'MCQ - Single Correct',
//         attendance: '',
//         // totalAttendance: '',
//         // attendancePercentage: '',
//         // attendanceColor: '',
//         onAddClick: () => nav('/addquestion'),
//     },
//     // Add more rows as needed...
// ];


const tableHeaders = [
    { label: 'Exam Name', accessor: 'name' },
    { label: 'Chapter Name', accessor: 'question_bank_chapter' },
    { label: 'Description', accessor: 'description' },
    { label: 'Difficulty Level', accessor: 'question_bank_difficulty_id' },
    // { label: 'Attendance', accessor: 'attendance' },
];

// Main "Add Question Bank" component
const AddQuestionBank = () => {
    const [tabValue, setTabValue] = useState(1);
    const [filterExam, setFilterExam] = useState('');
    const [tableList, setSetTableList] = useState([]);
    const [page, setPage] = useState(1);
    const { data } = useGetQuestionBanksQuery();
    const nav = useNavigate();
    // console.log("data is here", data);


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Handle exam filter change
    const handleFilterChange = (event) => {
        setFilterExam(event.target.value);
    };

    const onAddClick = (row) => {
        console.log(row);

        // Get the existing bank IDs from localStorage
        let bankIds = JSON.parse(localStorage.getItem("bankIds")) || [];

        // Check if the bankId already exists in the list
        if (!bankIds.includes(row.id)) {
            // Add the new bank ID to the list
            bankIds.push(row.id);

            // Update localStorage with the new array of IDs
            localStorage.setItem("bankIds", JSON.stringify(bankIds));
            console.log('Bank ID added:', row.id);
            nav('/addquestion')
        } else {
            console.log('Bank ID already exists:', row.id);
        }
    };


    const Getdata = async () => {
        try {
            // let result = await axiosGet('questionBanks');
            // const { data } = result;
            console.log('data', data.data);
            if (data?.data) {
                setSetTableList(data.data.map((e) => {
                    console.log("first", e)
                    return (
                        {
                            name: e.name,
                            id: e.id,
                            question_bank_subject_id: e.question_bank_subject_id,
                            question_bank_type_id: e.question_bank_type_id,
                            question_bank_chapter: e.question_bank_chapter,
                            description: e.description,
                            question_bank_difficulty_id: e.question_bank_difficulty_id,
                            onAddClick
                        }
                    )
                }))
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        Getdata()
    }, [])



    // Table headers for the question bank
    // const tableHeaders = [
    //     '#', 'Name', 'Chapter', 'Subject', 'Exam', 'Difficulty', 'Question Type', '', // Empty header for Add buttons
    // ];

    return (
        <Box sx={{ width: '100%', backgroundColor: '#f4f5f7', p: 2, borderRadius: 1 }}>
            {/* Top-Level Tabs (Add New Question Bank & Add From Existing Banks) */}
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Add Question Bank Tabs"
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
                        // backgroundColor: '#e0e0e0',
                        borderRadius: '5px 5px 0 0',
                    },
                }}
            >
                <Tab label="Add New Question Bank" {...a11yProps(0)} />
                <Tab label="Add From Existing Banks" {...a11yProps(1)} />
            </Tabs>

            {/* Tab Content */}
            <TabPanel value={tabValue} index={0}>
                <Typography>Add New Question Bank content here.</Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                {/* Filter Dropdown */}
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ mr: 2 }}>Filter Exam:</Typography>
                    <Select
                        value={filterExam}
                        onChange={handleFilterChange}
                        displayEmpty
                        sx={{ minWidth: 200 }}
                    >
                        <MenuItem value="">Any</MenuItem>
                        <MenuItem value="test1">Test 1</MenuItem>
                        <MenuItem value="test2">Test 2</MenuItem>
                    </Select>
                </Box>

                {/* Common Table for Question Bank Data */}
                <CommonTable
                    headers={tableHeaders}
                    data={tableList}
                    style={{
                        container: { margin: '20px 0' },
                        headerCell: { fontWeight: 'bold' },
                        button: { padding: '5px 10px' },
                    }}
                />

            </TabPanel>

            {/* Close Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" color="secondary" onClick={() => { nav('/addquestion') }}>
                    Close
                </Button>
            </Box>
        </Box>
    );
};

export default AddQuestionBank;
