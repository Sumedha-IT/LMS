import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Button, Typography, Select, MenuItem } from '@mui/material';
import CommonTable from '../common/CommonTable'; // Import the reusable common table component
import TabPanel, { a11yProps } from '../common/TabPanel'; // Import the common TabPanel component
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useGetQuestionBanksQuery } from '../store/service/admin/AdminService';
import { useDispatch, useSelector } from 'react-redux';
import { getBankCount } from '../store/slices/adminSlice/ExamSlice';
import { toast } from 'react-toastify';

// Table headers for the question bank
const tableHeaders = [
    { label: 'Exam Name', accessor: 'name' },
    { label: 'Chapter Name', accessor: 'question_bank_chapter' },
    { label: 'Description', accessor: 'description' },
    { label: 'Difficulty Level', accessor: 'question_bank_difficulty_id' },
];

const AddQuestionBank = () => {
    const { id } = useParams();
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
    const [tabValue, setTabValue] = useState(1);
    const [filterExam, setFilterExam] = useState('');
    const [tableList, setTableList] = useState([]);
    const [addedBanks, setAddedBanks] = useState([]);
    const { data, isLoading, isError } = useGetQuestionBanksQuery({
        page: page + 1,
        rowsPerPage: rowsPerPage,
    }); // Use RTK Query for fetching data
    const nav = useNavigate();
    const dispatch = useDispatch();
    const selector = useSelector((state) => state.ExamReducer.QuestionBankCount);
    const [searchParams] = useSearchParams();
    useEffect(() => {
        if (data && !isLoading && !isError) {
            const tableData = data.data.map((e) => ({
                name: e.name,
                id: e.id,
                question_bank_subject_id: e.question_bank_subject_id,
                question_bank_type_id: e.question_bank_type_id,
                question_bank_chapter: e.questionBankChapter,
                description: e.description,
                question_bank_difficulty_id: e.questionBankDifficultyId,
                questionsCount: e.questionsCount

            }));

            setTableList(tableData);
        }
    }, [data, isLoading, isError]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Handle exam filter change
    const handleFilterChange = (event) => {
        setFilterExam(event.target.value);
    };
    const handlePageChange = (event, newPage) => {
        setPage(newPage);
        console.log("new page", newPage);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setPage(0); // Reset to the first page
    };



    const onAddClick = (row) => {
        const partId = searchParams.get('partId'); // Get the current partId from query params

        // Check if the question bank already exists in any part
        const isBankAddedInAnyPart = selector.some((part) =>
            part.banks.some((bank) => bank.id === row.id)
        );

        if (isBankAddedInAnyPart) {
            // If the bank is already added in any part, show a warning or prevent the addition
            console.log('This question bank is already added in another part.');
            toast.error("This question bank is already added in another part.")
            return;
        }

        // Check if the partId already exists in the selector
        const existingPart = selector.find((e) => e.partId === partId);

        console.log("hello",);
        if (existingPart) {
            // If partId exists, add the bank to the existing part's banks array
            const isBankExist = existingPart.banks.some((bank) => bank.id === row.id);
            if (!isBankExist) {
                // Add the new bank to the existing part's banks array and set default usage
                const updatedBanks = [
                    ...existingPart.banks,
                    { ...row, usage: `Use ${row.questionsCount} out of ${row.questionsCount} questions` } // Add default usage for new bank
                ];
                const updatedSelector = selector.map((e) =>
                    e.partId === partId ? { ...e, banks: updatedBanks } : e
                );
                toast.success("Question Bank Added Successfully");
                // Dispatch the updated selector to Redux
                dispatch(getBankCount(updatedSelector));
                setAddedBanks((prev) => [...prev, row.id]);

            } else {
                console.log("Bank already added for this part.");
                toast.error("Bank already added for this part.")
            }
        } else {
            // If partId doesn't exist, create a new part entry with the bank and set default usage
            const newPart = {
                partId,
                banks: [
                    { ...row, usage: `Use ${row.questionsCount} out of ${row.questionsCount} questions` } // Add default usage for the first bank
                ]
            };
            toast.success("Question Bank Added Successfully");
            // Dispatch the new part added to the selector
            dispatch(getBankCount([...selector, newPart]));
            setAddedBanks((prev) => [...prev, row.id]);
        }
    };
    // Handle loading, error, and empty states
    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error loading data.</Typography>;

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
                {/* <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
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
                </Box> */}

                {/* Common Table for Question Bank Data */}
                <CommonTable
                    headers={tableHeaders}
                    data={tableList}
                    totalRecords={data?.totalRecords || 0}
                    onAddClick={(row) => onAddClick(row)}
                    addedBanks={addedBanks}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    style={{
                        container: { margin: '20px 0' },
                        headerCell: { fontWeight: 'bold' },
                        button: { padding: '5px 10px' },
                    }}
                />

            </TabPanel>

            {/* Close Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" color="secondary" onClick={() => { nav(`/administrator/${id}/exams/addquestion`) }}>
                    Close
                </Button>
            </Box>
        </Box>
    );
};

export default AddQuestionBank;
