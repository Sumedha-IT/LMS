
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
    );
}

export default AdminDashboard;
