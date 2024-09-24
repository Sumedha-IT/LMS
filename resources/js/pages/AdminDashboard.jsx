
<<<<<<< Updated upstream
// import React, { useState } from 'react';
// import CommonTable from '../common/CommonTable';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import ExamScheduling from '../components/ExamScheduling';
// import Questionnaire from '../components/Questionnaire';
// import ExamPaper from '../components/ExamPaper';

// import QuestionBankComponent from '../components/QuestionBankComponent';
// import AddQuestionBank from '../components/AddQuestionBank';

// const data = [
//     {
//         examDate: '18 Nov 2023',
//         time: '1:00 PM to 12:10 PM',
//         examName: 'EXAM: Test',
//         subExamName: 'SumedhaIT',
//         batchName: 'Mock Interviews Panel 1',
//         batchSubName: 'Mock Interviews Panel 1',
//         totalMarks: 50,
//         status: 'Signed In',
//         signInTime: 'At 11:51 AM, 18 Nov 2023',
//         attendance: 1,
//         totalAttendance: 1,
//         attendancePercentage: 100,
//         attendanceColor: 'green',
//         onMarksListClick: (row) => console.log('Marks List Clicked for', row),
//         onViewAttendanceClick: (row) => console.log('View Attendance Clicked for', row),
//     },
//     {
//         examDate: '18 May 2023',
//         time: '2:00 PM to 2:30 PM',
//         examName: 'EXAM: DV Test 1',
//         subExamName: 'SumedhaIT',
//         batchName: 'DV May 2023',
//         batchSubName: 'DV CORE',
//         totalMarks: 30,
//         status: 'Signed out',
//         signInTime: 'At 05:15 PM, 23 May 2023',
//         attendance: 4,
//         totalAttendance: 5,
//         attendancePercentage: 80,
//         attendanceColor: 'orange',
//         onMarksListClick: (row) => console.log('Marks List Clicked for', row),
//         onViewAttendanceClick: (row) => console.log('View Attendance Clicked for', row),
//     },
//     // Add more rows as needed...
// ];

// const headers = [
//     '#',
//     'Exam Date',
//     'Exam Name',
//     'Batch Name',
//     'Total Marks',
//     'Status',
//     'Attendance',
//     'Notes',
// ];


// function AdminDashboard() {
//     const [step, setStep] = useState(1); // Step 1 for ExamScheduling, 2 for Questionnaire, 3 for ExamPaper
//     const [examDetails, setExamDetails] = useState(null);
//     const [questionBank, setQuestionBank] = useState([]);
//     const nav = useNavigate();

//     const handleExamSchedule = (details) => {
//         console.log("this is your data", details);
//         setExamDetails(details);
//         setStep(2); // Move to step 2 when exam scheduling is done
//     };

//     const handleQuestionnaireSubmit = (selectedQuestionIds) => {
//         setQuestionBank(selectedQuestionIds);
//         setStep(3); // Move to step 3 when questionnaire is submitted
//     };

//     const AddExam = () => {
//         nav("/ExamForm");
//     }


//     // bg-[#fff0ea]



//     return (
//         <>
//             <div className="w-full text-white bg-gray-500 p-4 ">
//                 New Table
//             </div>

//             {/* <CommonTable headers={headers} rows={data} /> */}
//             <div className="p-6 flex flex-col">
//                 <div className=" border-2 mt-10">
//                     <div className="flex justify-end p-2">
//                         <button className='py-2 px-4 bg-gray-500 rounded-lg text-white mr-3'>submit</button>
//                         <button className='py-2 px-4 bg-blue-700 rounded-lg text-white ml-3' onClick={AddExam}>Add Exam</button>
//                     </div>
//                     <hr className='border-b-2 ' />
//                     <CommonTable headers={headers} data={data} />
//                 </div>
//                 {/* <QuestionBankComponent /> */}
//                 {/* <AddQuestionBank /> */}
//             </div>



//             {/* <div className="bg-gray-100 flex justify-center items-center  px-8">
//                 <motion.div
//                     initial={{ justifyItems: 'center' }}
//                     animate={{ justifyItems: 'center' }}
//                     transition={{ duration: 0.5 }}
//                     className=" w-full max-w-7xl gap-8"
//                 >
//                     {step === 1 && (
//                         <motion.div
//                             initial={{ opacity: 1, x: 0 }}
//                             animate={{ x: 0, opacity: 1 }}
//                             transition={{ duration: 0.5 }}
//                             className=" justify-self-center"
//                         >
//                             <ExamScheduling onExamSchedule={handleExamSchedule} />
//                         </motion.div>
//                     )}

//                     {step === 2 && (
//                         <motion.div
//                             initial={{ opacity: 0, x: 50 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ duration: 0.5 }}
//                             className="justify-self-center items-center"
//                         >
//                             <Questionnaire
//                                 examDetails={examDetails}
//                                 setQuestionBank={handleQuestionnaireSubmit}
//                             />
//                         </motion.div>
//                     )}

//                     {step === 3 && questionBank.length > 0 && (
//                         <motion.div
//                             initial={{ opacity: 0, x: 50 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ duration: 0.5 }}
//                             className=" justify-self-center items-center"
//                         >
//                             <ExamPaper questionId={questionBank[0]} />
//                         </motion.div>
//                     )}
//                 </motion.div>
//             </div> */}
//         </>
//     );
// }

// export default AdminDashboard;






import React, { useState } from 'react';
import CommonTable from '../common/CommonTable';
import { useNavigate } from 'react-router-dom';


const data = [
    {
        examDate: '18 Nov 2023',
        time: '1:00 PM to 12:10 PM',
        examName: 'EXAM: Test',
        subExamName: 'SumedhaIT',
        batchName: 'Mock Interviews Panel 1',
        batchSubName: 'Mock Interviews Panel 1',
        totalMarks: 50,
        status: 'Signed In',
        signInTime: 'At 11:51 AM, 18 Nov 2023',
        attendance: 1,
        totalAttendance: 1,
        attendancePercentage: 100,
        attendanceColor: 'green',
        onMarksListClick: (row) => console.log('Marks List Clicked for', row),
        onViewAttendanceClick: (row) => console.log('View Attendance Clicked for', row),
    },
    {
        examDate: '18 May 2023',
        time: '2:00 PM to 2:30 PM',
        examName: 'EXAM: DV Test 1',
        subExamName: 'SumedhaIT',
        batchName: 'DV May 2023',
        batchSubName: 'DV CORE',
        totalMarks: 30,
        status: 'Signed out',
        signInTime: 'At 05:15 PM, 23 May 2023',
        attendance: 4,
        totalAttendance: 5,
        attendancePercentage: 80,
        attendanceColor: 'orange',
        onMarksListClick: (row) => console.log('Marks List Clicked for', row),
        onViewAttendanceClick: (row) => console.log('View Attendance Clicked for', row),
    },
    // Add more rows as needed...
];

const columns = [
    { label: 'Exam Date', accessor: 'examDate' },
    { label: 'Time', accessor: 'time' },
    { label: 'Exam Name', accessor: 'examName' },
    { label: 'Batch Name', accessor: 'batchName' },
    { label: 'Total Marks', accessor: 'totalMarks' },
    { label: 'Status', accessor: 'status' },
    { label: 'Attendance', accessor: 'attendance' },
];

// const headers = [
//     '#',
//     'Exam Date',
//     'Exam Name',
//     'Batch Name',
//     'Total Marks',
//     'Status',
//     'Attendance',
//     'Notes',
// ];


function AdminDashboard() {

    const nav = useNavigate();



    const AddExam = () => {
        nav("/ExamForm");
    }


    // bg-[#fff0ea]



    return (
        <>
            <div className="w-full text-white bg-gray-500 p-4 ">
                New Table
            </div>

            {/* <CommonTable headers={headers} rows={data} /> */}
            <div className="p-6 flex flex-col">
                <div className=" border-2 mt-10">
                    <div className="flex justify-end p-2">
                        {/* <button className='py-2 px-4 bg-gray-500 rounded-lg text-white mr-3'>submit</button> */}
                        <button className='py-2 px-4 bg-blue-700 rounded-lg text-white ml-3' onClick={AddExam}>Add Exam</button>
                    </div>
                    <hr className='border-b-2 ' />
                    <CommonTable headers={columns} data={data} />
                </div>
                {/* <QuestionBankComponent /> */}
                {/* <AddQuestionBank /> */}
            </div>




        </>
=======

import React, { useState, useEffect } from 'react';
import CommonTable from '../common/CommonTable';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Select, MenuItem, FormControl, InputLabel, Grid, Box } from '@mui/material';
import { useGetExamDataQuery } from '../store/service/admin/AdminService';

function AdminDashboard() {
    const { id } = useParams();
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [examData, setExamData] = useState([]);
    const { data, isLoading, isError } = useGetExamDataQuery({
        page: page + 1, // Backend expects 1-based page index
        rowsPerPage: rowsPerPage,
        filterBatch: selectedBatch,
        dateCriteria: selectedDate,
    });

    useEffect(() => {
        if (data && !isLoading && !isError) {
            setExamData(data.data);
        }
    }, [data, isLoading, isError]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
        console.log("new page", newPage);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setPage(0); // Reset to the first page
    };

    const resetFilters = () => {
        setSelectedBatch('');
        setSelectedDate('');
        setPage(0);
    };

    const nav = useNavigate();
    const handleAddNewExam = () => {
        nav(`/administrator/${id}/examination/ExamForm`);
        // nav('/ExamForm'); // Navigate to the Add New Exam form
    };

    return (
        <div className="p-4">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <h1>Examinations</h1>

                {/* Filter and Add Buttons */}
                <div>
                    <Button
                        variant="contained"
                        sx={{ marginRight: 2 }}
                        onClick={resetFilters}
                    >
                        Reset Filters
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddNewExam}
                    >
                        + Add New
                    </Button>
                </div>
            </Box>

            <Box sx={{ mb: 3 }}>
                {/* Filters - Select Batch and Date */}
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel id="1">Select Batch</InputLabel>
                            <Select
                                labelId="1"
                                id="demo-simple-select"
                                value={selectedBatch}
                                label="Select Batch"
                                onChange={(e) => setSelectedBatch(e.target.value)}
                            >
                                <MenuItem value="1">All</MenuItem>
                                <MenuItem value="Batch1">Batch 1</MenuItem>
                                <MenuItem value="Batch2">Batch 2</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel id='2'>Date Criteria</InputLabel>
                            <Select
                                labelId="2"
                                value={selectedDate}
                                label="Date Criteria"
                                onChange={(e) => setSelectedDate(e.target.value)}
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Past">Past</MenuItem>
                                <MenuItem value="Upcoming">Upcoming</MenuItem>
                                {/* Add more options */}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            {/* Table Component */}
            <CommonTable
                headers={[
                    { label: 'Exam Date', accessor: 'examDate' },
                    { label: 'Time', accessor: (row) => `${row.starts_at} to ${row.ends_at}` },
                    { label: 'Exam Name', accessor: 'title' },
                    { label: 'Batch Name', accessor: 'batch' },
                    { label: 'Total Marks', accessor: 'totalMarks' },
                    { label: 'Status', accessor: 'status' },
                    { label: 'Attendance', accessor: 'maxAttempts' },
                ]}
                data={examData}
                totalRecords={data?.totalRecords || 0} // Total from API response
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onMarksListClick={(row) => console.log('Marks List Clicked for', row)}
                onViewAttendanceClick={(row) => console.log('View Attendance Clicked for', row)}
            />
        </div>
>>>>>>> Stashed changes
    );
}

export default AdminDashboard;
