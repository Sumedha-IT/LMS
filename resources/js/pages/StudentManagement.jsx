import React, { useState, useEffect, useRef } from 'react';
import AttendancePanel from '../Components/AttendancePanel';
import AssignmentsPanel from '../Components/AssignmentsPanel';
import ExamResultsPanel from '../Components/ExamResultsPanel';
import PaymentPanel from '../Components/PaymentPanel';
import LoadingFallback from '../components/DashBoard/LoadingFallback';
import axios from 'axios';
import Lottie from 'lottie-react';
import studentAnimation from '../assets/animations/student.json';
import * as XLSX from 'xlsx';

// Helper function to get cookies
const getCookie = (name) => {
    let cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        let [key, value] = cookie.split("=");
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
};

// Create an axios instance with default config
const api = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

const StudentManagement = () => {
    const [activeTab, setActiveTab] = useState('attendance');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [batches, setBatches] = useState([]);
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showIntro, setShowIntro] = useState(true);
    const [showContent, setShowContent] = useState(false);
    const [hideIntro, setHideIntro] = useState(false);
    const dropdownRef = useRef(null);
    const [typedText, setTypedText] = useState("");
    const fullText = "Manage students, attendance, assignments, and more with ease.";

    // Show intro animation for 3 seconds, then transition
    useEffect(() => {
        const timer = setTimeout(() => {
            setHideIntro(true);
            setTimeout(() => {
                setShowIntro(false);
                setShowContent(true);
            }, 800);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Click-away listener
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    // Fetch batches when component mounts
    useEffect(() => {
        fetchBatches();
    }, []);

    // Fetch students when batch selection changes
    useEffect(() => {
        if (selectedBatch) {
            fetchStudents(selectedBatch);
        } else {
            setStudents([]);
        }
    }, [selectedBatch]);

    useEffect(() => {
        let typingInterval;
        let isDeleting = false;
        let localText = "";
        let charIndex = 0;
        function typeLoop() {
            if (!isDeleting) {
                if (charIndex < fullText.length) {
                    localText += fullText[charIndex];
                    setTypedText(localText);
                    charIndex++;
                } else {
                    isDeleting = true;
                    setTimeout(typeLoop, 1200); // Pause before deleting
                    return;
                }
            } else {
                if (charIndex > 0) {
                    localText = localText.slice(0, -1);
                    setTypedText(localText);
                    charIndex--;
                } else {
                    isDeleting = false;
                }
            }
            setTimeout(typeLoop, isDeleting ? 18 : 30);
        }
        typeLoop();
        return () => clearTimeout(typingInterval);
    }, []);

    const fetchBatches = async () => {
        try {
            setIsLoading(true);
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const response = await api.get('/api/batches', {
                headers: {
                    'Authorization': userData.token
                }
            });
            setBatches(response.data.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch batches. Please make sure you are logged in.');
            console.error('Error fetching batches:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStudents = async (batchId) => {
        try {
            setIsLoading(true);
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            console.log('Fetching students for batch:', batchId);
            console.log('User data:', {
                id: userData.id,
                role: userData.role,
                token: userData.token ? 'present' : 'missing'
            });

            const response = await api.get(`/api/batches/${batchId}`, {
                headers: {
                    'Authorization': userData.token
                }
            });

            console.log('Full API Response:', response.data);
            
            if (!response.data.data) {
                console.error('No data property in response:', response.data);
                setError('Invalid response format from server');
                return;
            }

            const batchData = response.data.data;
            console.log('Batch Data:', batchData);
            
            if (!batchData.students) {
                console.error('No students array in batch data:', batchData);
                setError('No student data available');
                return;
            }

            const studentsList = batchData.students;
            console.log('Students list:', studentsList);
            
            if (studentsList.length === 0) {
                console.log('No students found in the list');
            } else {
                console.log('First student structure:', studentsList[0]);
            }
            
            setStudents(studentsList);
            setError(null);
        } catch (err) {
            console.error('Error details:', err);
            console.error('Error response:', err.response?.data);
            setError(err.response?.data?.message || 'Failed to fetch students. Please make sure you are logged in.');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const tabs = [
        { id: 'attendance', label: 'Attendance', icon: '📊' },
        { id: 'assignments', label: 'Assignments', icon: '📝' },
        { id: 'exam-results', label: 'Exam Results', icon: '📚' },
        { id: 'payment', label: 'Payment', icon: '💰' },
        { id: 'export', label: 'Export', icon: '📥' },
    ];

    const exportToExcel = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    const handleAttendanceExport = async () => {
        try {
            setIsLoading(true);
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const response = await api.get(`/api/students/${selectedStudent.id}/attendance`, {
                headers: {
                    'Authorization': userData.token
                }
            });

            if (!response.data.data || response.data.data.length === 0) {
                alert('No attendance records found for this student.');
                return;
            }

            const attendanceData = response.data.data.map(record => ({
                'Date': record.date,
                'Status': record.status,
                'Remarks': record.remarks || '',
                'Class': record.class_name || '',
                'Subject': record.subject_name || ''
            }));

            exportToExcel(attendanceData, `${selectedStudent.name}_Attendance_Report`);
        } catch (error) {
            console.error('Error exporting attendance:', error);
            if (error.response?.status === 404) {
                alert('Attendance records not found. Please check if the student has any attendance records.');
            } else if (error.response?.status === 403) {
                alert('You do not have permission to export this student\'s attendance records.');
            } else {
                alert('Failed to export attendance data. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssignmentsExport = async () => {
        try {
            setIsLoading(true);
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const response = await api.get(`/api/students/${selectedStudent.id}/assignments`, {
                headers: {
                    'Authorization': userData.token
                }
            });

            if (!response.data.data || response.data.data.length === 0) {
                alert('No assignment records found for this student.');
                return;
            }

            const assignmentData = response.data.data.map(assignment => ({
                'Assignment Title': assignment.title,
                'Subject': assignment.subject,
                'Due Date': assignment.due_date,
                'Submission Date': assignment.submission_date || 'Not Submitted',
                'Grade': assignment.grade || 'Not Graded',
                'Status': assignment.status,
                'Feedback': assignment.feedback || ''
            }));

            exportToExcel(assignmentData, `${selectedStudent.name}_Assignments_Report`);
        } catch (error) {
            console.error('Error exporting assignments:', error);
            if (error.response?.status === 404) {
                alert('Assignment records not found. Please check if the student has any assignments.');
            } else if (error.response?.status === 403) {
                alert('You do not have permission to export this student\'s assignment records.');
            } else {
                alert('Failed to export assignment data. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleExamResultsExport = async () => {
        try {
            setIsLoading(true);
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const response = await api.get(`/api/students/${selectedStudent.id}/exam-results`, {
                headers: {
                    'Authorization': userData.token
                }
            });

            if (!response.data.data || response.data.data.length === 0) {
                alert('No exam results found for this student.');
                return;
            }

            const examData = response.data.data.map(exam => ({
                'Exam Name': exam.exam_name,
                'Subject': exam.subject,
                'Date': exam.exam_date,
                'Score': exam.score,
                'Total Marks': exam.total_marks,
                'Percentage': `${((exam.score / exam.total_marks) * 100).toFixed(2)}%`,
                'Grade': exam.grade,
                'Remarks': exam.remarks || ''
            }));

            exportToExcel(examData, `${selectedStudent.name}_Exam_Results`);
        } catch (error) {
            console.error('Error exporting exam results:', error);
            if (error.response?.status === 404) {
                alert('Exam results not found. Please check if the student has any exam records.');
            } else if (error.response?.status === 403) {
                alert('You do not have permission to export this student\'s exam results.');
            } else {
                alert('Failed to export exam results. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportAll = async () => {
        try {
            setIsLoading(true);
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            // Fetch all data
            const [attendanceRes, assignmentsRes, examRes] = await Promise.all([
                api.get(`/api/students/${selectedStudent.id}/attendance`, {
                    headers: { 'Authorization': userData.token }
                }),
                api.get(`/api/students/${selectedStudent.id}/assignments`, {
                    headers: { 'Authorization': userData.token }
                }),
                api.get(`/api/students/${selectedStudent.id}/exam-results`, {
                    headers: { 'Authorization': userData.token }
                })
            ]);

            const workbook = XLSX.utils.book_new();

            // Attendance Sheet
            if (attendanceRes.data.data && attendanceRes.data.data.length > 0) {
                const attendanceData = attendanceRes.data.data.map(record => ({
                    'Date': record.date ? new Date(record.date).toISOString().slice(0, 10) : '',
                    'Status': record.status === 'present' ? 'Present' : 'Absent',
                }));
                const totalDays = attendanceData.length;
                const presentDays = attendanceData.filter(r => r.Status === 'Present').length;
                const absentDays = attendanceData.filter(r => r.Status === 'Absent').length;
                const absentDates = attendanceData.filter(r => r.Status === 'Absent').map(r => r.Date).join(', ');
                // Add summary as a separate sheet
                const summarySheet = XLSX.utils.aoa_to_sheet([
                  ['Total Days', 'Present Days', 'Absent Days', 'Absent Dates'],
                  [totalDays, presentDays, absentDays, absentDates]
                ]);
                XLSX.utils.book_append_sheet(workbook, summarySheet, 'Attendance Summary');
                // Add attendance data sheet
                const attendanceSheet = XLSX.utils.json_to_sheet(attendanceData);
                XLSX.utils.book_append_sheet(workbook, attendanceSheet, 'Attendance');
            }

            // Assignments Sheet
            if (assignmentsRes.data.data && assignmentsRes.data.data.length > 0) {
                const assignmentData = assignmentsRes.data.data.map(assignment => ({
                    'Curriculum Name': assignment['Curriculum Name'] || '',
                    'Topic Name': assignment['Topic Name'] || '',
                    'Assignment Title': assignment['Assignment Title'] || '',
                    'Submitted Status': assignment['Status'] || 'Not Submitted',
                    'Submission Date': assignment['Submission Date'] ? new Date(assignment['Submission Date']).toISOString().slice(0, 10) : 'Not Submitted',
                }));
                const assignmentSheet = XLSX.utils.json_to_sheet(assignmentData);
                XLSX.utils.book_append_sheet(workbook, assignmentSheet, 'Assignments');
            }

            // Exam Results Sheet
            if (examRes.data.data && examRes.data.data.length > 0) {
                const examData = examRes.data.data.map(exam => ({
                    'Exam Name': exam.exam_name || '',
                    'Exam Date': exam.exam_date ? new Date(exam.exam_date).toISOString().slice(0, 10) : '',
                    'Score': exam.score !== undefined && exam.score !== '' ? exam.score : 'Not Attempted',
                    'Attempted': exam.score !== undefined && exam.score !== '' ? 'Yes' : 'No',
                }));
                const examSheet = XLSX.utils.json_to_sheet(examData);
                XLSX.utils.book_append_sheet(workbook, examSheet, 'Exam Results');
            }

            if (workbook.SheetNames.length === 0) {
                alert('No data found to export for this student.');
                return;
            }

            XLSX.writeFile(workbook, `${selectedStudent.name}_Complete_Report.xlsx`);
        } catch (error) {
            console.error('Error exporting all data:', error);
            if (error.response?.status === 404) {
                alert('No data found for this student. Please check if the student has any records.');
            } else if (error.response?.status === 403) {
                alert('You do not have permission to export this student\'s data.');
            } else {
                alert('Failed to export data. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Animation/Intro screen
    if (showIntro) {
        return (
            <div className={`flex items-center justify-center min-h-screen bg-white transition-all duration-[1500ms] ${hideIntro ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
                <div className="w-[40rem] h-[40rem] drop-shadow-2xl transition-all duration-[1500ms]">
                    <Lottie animationData={studentAnimation} loop={false} />
                </div>
            </div>
        );
    }

    // Main content with extra smooth slide-in effect
    return (
        <div className={`transition-all duration-[1500ms] ${showContent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'} container mx-auto px-4 py-8`}>
            {/* Header/Banner: Only show if batch or student is NOT selected */}
            {!(selectedBatch && selectedStudent) && (
                <div className="flex items-center mb-12 animate-fade-in bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 shadow-2xl">
                    <div className="mr-8">
                        <div className="w-40 h-40 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                            <Lottie animationData={studentAnimation} loop={true} />
                        </div>
                    </div>
                    <div className="text-white">
                        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                            {/* Heading intentionally left blank as per user edit */}
                        </h1>
                        <p className="min-h-[2em] font-extrabold text-2xl md:text-4xl bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                            {typedText}<span className="animate-pulse">|</span>
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-8">
                {/* Selection Card: Shrink and move up if both selected */}
                <div className={`rounded-3xl shadow-2xl border border-white/20 animate-fade-in backdrop-blur-lg bg-gradient-to-br from-white/90 to-white/70 transition-all duration-500 ${selectedBatch && selectedStudent ? 'p-4 mb-2' : 'p-8 mb-8'}`}>
                    {/* Search and Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="w-full">
                                <label htmlFor="batch" className="block text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    <span className='inline-block p-2 bg-blue-100 rounded-lg'>
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </span>
                                    Select Batch
                                </label>
                                <div className="relative">
                                    <select
                                        id="batch"
                                        value={selectedBatch}
                                        onChange={(e) => setSelectedBatch(e.target.value)}
                                        className="block w-full pl-4 pr-10 py-3.5 text-base border-2 border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-base rounded-xl shadow-md bg-white text-gray-900 placeholder-blue-200 transition-all duration-200 hover:border-blue-300"
                                    >
                                        <option value="">Choose a batch</option>
                                        {batches.map((batch) => (
                                            <option key={batch.batch_id} value={batch.batch_id}>
                                                {batch.batch_name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full">
                                <label htmlFor="search" className="block text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    <span className='inline-block p-2 bg-blue-100 rounded-lg'>
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </span>
                                    Search Students
                                </label>
                                <div className="relative" ref={dropdownRef}>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            id="search"
                                            value={selectedStudent ? selectedStudent.name : searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setSelectedStudent(null);
                                                setShowDropdown(true);
                                            }}
                                            placeholder="Search and select a student"
                                            className="block w-full pl-4 pr-12 py-3.5 text-base border-2 border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-base rounded-xl shadow-md bg-white text-gray-900 placeholder-blue-200 transition-all duration-200 hover:border-blue-300"
                                            onClick={() => setShowDropdown(true)}
                                            readOnly={!!selectedStudent}
                                        />
                                        {selectedStudent && (
                                            <button
                                                onClick={() => {
                                                    setSelectedStudent(null);
                                                    setSearchQuery('');
                                                    setShowDropdown(false);
                                                }}
                                                className="absolute right-16 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600 focus:outline-none transition-colors duration-200"
                                                style={{ zIndex: 101 }}
                                                tabIndex={-1}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    {showDropdown && (!selectedStudent || searchQuery) && (
                                        <div className="absolute z-[100] w-full mb-1 bottom-full bg-white rounded-xl shadow-xl max-h-60 overflow-auto border border-blue-100 animate-fade-in">
                                            {students && students.length > 0 ? (
                                                students
                                                    .filter(student => 
                                                        student.name.toLowerCase().includes(searchQuery.toLowerCase())
                                                    )
                                                    .map((student) => (
                                                        <div
                                                            key={student.id}
                                                            onClick={() => {
                                                                setSelectedStudent(student);
                                                                setSearchQuery('');
                                                                setShowDropdown(false);
                                                            }}
                                                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-all duration-150 text-gray-900 border-b border-gray-100 last:border-0"
                                                        >
                                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full font-bold text-sm">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                            </span>
                                                            <span className="font-medium">{student.name}</span>
                                                        </div>
                                                    ))
                                            ) : (
                                                <div className="px-4 py-3 text-blue-400 flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    No students found
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl relative shadow-lg animate-fade-in flex items-center gap-3">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <LoadingFallback />
                    </div>
                )}

                {selectedBatch && selectedStudent && !isLoading && !error && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-blue-100 animate-fade-in">
                        <div className="border-b border-blue-100">
                            <nav className="flex space-x-2 p-4" style={{background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)'}}>
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            relative group inline-flex items-center py-3.5 px-8 rounded-xl font-semibold text-base
                                            transition-all duration-300 ease-in-out transform
                                            ${activeTab === tab.id
                                                ? 'text-white shadow-lg scale-105 translate-y-[-2px]'
                                                : 'text-white hover:text-orange-100 hover:bg-white/20'
                                            }
                                            before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-orange-500/10 before:to-orange-600/10
                                            before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
                                            hover:shadow-md hover:scale-[1.02] animate-fade-in
                                        `}
                                        style={activeTab === tab.id ? {
                                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                                        } : {}}
                                    >
                                        <span className={`
                                            mr-2 transition-all duration-300 transform
                                            ${activeTab === tab.id 
                                                ? 'text-white scale-110' 
                                                : 'text-orange-100 group-hover:text-orange-200 group-hover:scale-110'
                                            }
                                        `}>
                                            {tab.icon}
                                        </span>
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"></span>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-8">
                            {activeTab === 'attendance' && <AttendancePanel students={filteredStudents} selectedStudent={selectedStudent} />}
                            {activeTab === 'assignments' && <AssignmentsPanel students={filteredStudents} selectedStudent={selectedStudent} selectedStudentId={selectedStudent?.id} />}
                            {activeTab === 'exam-results' && <ExamResultsPanel students={filteredStudents} selectedStudent={selectedStudent} />}
                            {activeTab === 'payment' && <PaymentPanel students={filteredStudents} selectedStudent={selectedStudent} />}
                            {activeTab === 'export' && (
                                <div className="flex flex-col items-center justify-center p-8">
                                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Export Student Data</h3>
                                    <p className="text-gray-600 mb-6 text-center max-w-md">Choose what you want to export for {selectedStudent?.name}</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                                        {/* Attendance Export */}
                                        <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100 hover:border-blue-300 transition-all duration-200">
                                            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
                                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Attendance Records</h4>
                                            <p className="text-gray-600 text-sm mb-4">Export detailed attendance history and status reports</p>
                                            <button
                                                onClick={handleAttendanceExport}
                                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Export Attendance
                                            </button>
                                        </div>

                                        {/* Assignments Export */}
                                        <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100 hover:border-blue-300 transition-all duration-200">
                                            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
                                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Assignment Details</h4>
                                            <p className="text-gray-600 text-sm mb-4">Export assignment submissions, grades, and feedback</p>
                                            <button
                                                onClick={handleAssignmentsExport}
                                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Export Assignments
                                            </button>
                                        </div>

                                        {/* Exam Results Export */}
                                        <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100 hover:border-blue-300 transition-all duration-200">
                                            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
                                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                </svg>
                                            </div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Exam Results</h4>
                                            <p className="text-gray-600 text-sm mb-4">Export exam scores, performance analysis, and grade reports</p>
                                            <button
                                                onClick={handleExamResultsExport}
                                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Export Results
                                            </button>
                                        </div>
                                    </div>

                                    {/* Export All Button */}
                                    <button
                                        onClick={handleExportAll}
                                        className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Export All Data
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!selectedBatch && !isLoading && !error && (
                    <div className="text-center py-20 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-blue-100 animate-fade-in">
                        <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Select a Batch</h3>
                        <p className="text-gray-600 max-w-md mx-auto">Choose a batch from the dropdown above to view and manage student details, including attendance, assignments, exam results, and payments.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentManagement;