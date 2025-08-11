import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Card, CardContent, Grid, FormControl, InputLabel, Select, MenuItem, TextField, CircularProgress, Alert, Drawer, IconButton, Avatar, Divider, Button } from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import StudentDashboard from './StudentDashboard';
import { useGetJobPostingsQuery, useGetJobEligibleStudentsQuery } from '../store/service/admin/AdminService';
import { useGetCoursesQuery as useUserCoursesQuery } from '../store/service/user/UserService';
import axios from 'axios';

const getCookie = (name) => {
    let cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        let [key, value] = cookie.split('=');
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
};

const PlacementStudents = ({ eligibleOnlyMode = false }) => {
    const brand = useMemo(() => ({
        green: '#22c55e',
        orange: '#f97316',
        red: '#c11e1b',
        purple: '#ab00ab',
        gray: '#878787'
    }), []);
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [students, setStudents] = useState([]);
    const [allStudentsCache, setAllStudentsCache] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    // Job posting filter states
    const [selectedJobPosting, setSelectedJobPosting] = useState('');
    const [showJobEligibleFilter, setShowJobEligibleFilter] = useState(eligibleOnlyMode ? true : false);
    const [filteredByJob, setFilteredByJob] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedCourseJobId, setSelectedCourseJobId] = useState('');

    // Student data states
    const [studentAssignments, setStudentAssignments] = useState({});
    const [studentAttendance, setStudentAttendance] = useState({});
    const [studentExams, setStudentExams] = useState({});

    // API hooks
    const { data: jobPostings } = useGetJobPostingsQuery();
    const { data: coursesData, isLoading: coursesLoading } = useUserCoursesQuery();
    const { data: jobEligibleStudents, isLoading: loadingEligibleStudents, refetch: refetchEligibleStudents } = useGetJobEligibleStudentsQuery(selectedJobPosting, {
        skip: !selectedJobPosting
    });

    // Function to fetch student assignments
    const fetchStudentAssignments = async (studentId) => {
        try {
            const userInfo = getCookie('user_info');
            const userData = JSON.parse(userInfo);
            const response = await axios.get(`/api/students/${studentId}/assignments`, {
                headers: { 'Authorization': userData.token }
            });
            return response.data.data || [];
        } catch (err) {
            console.error('Error fetching assignments:', err);
            return [];
        }
    };

    // Function to fetch student attendance (using fast API)
    const fetchStudentAttendance = async (studentId) => {
        try {
            const userInfo = getCookie('user_info');
            const userData = JSON.parse(userInfo);
            const response = await axios.get(`/api/student-attendance/report?student_id=${studentId}&filter_type=all`, {
                headers: { 'Authorization': userData.token }
            });
            
            // Debug: Log attendance response
            console.log(`Fast attendance response for student ${studentId}:`, response.data);
            
            return response.data;
        } catch (err) {
            console.error('Error fetching attendance:', err);
            return {
                total_days: 0,
                present_days: 0,
                complete_days: 0,
                absent_days: 0,
                attendance_details: []
            };
        }
    };

    // Function to fetch student exams
    const fetchStudentExams = async (studentId) => {
        try {
            const userInfo = getCookie('user_info');
            const userData = JSON.parse(userInfo);
            const response = await axios.get(`/api/students/${studentId}/exam-marks`, {
                headers: { 'Authorization': userData.token }
            });
            return response.data.exam_summary || {};
        } catch (err) {
            console.error('Error fetching exams:', err);
            return {};
        }
    };

    // Function to calculate attendance percentage (using fast API response)
    const calculateAttendancePercentage = (attendanceData) => {
        if (!attendanceData || !attendanceData.present_days) return 0;
        
        // Debug: Log attendance data
        console.log('Fast attendance data for calculation:', attendanceData);
        
        const presentDays = attendanceData.present_days || 0;
        const totalDays = attendanceData.total_days || 0;
        const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
        
        console.log(`Fast attendance calculation: ${presentDays}/${totalDays} = ${percentage}%`);
        
        return percentage;
    };

    // Function to calculate assignment submission count
    const calculateAssignmentSubmissions = (assignmentData) => {
        if (!assignmentData || assignmentData.length === 0) return 0;
        return assignmentData.filter(assignment => assignment.Status === 'submitted').length;
    };

    // Function to calculate exam marks (optimized version)
    const calculateExamMarks = (examData) => {
        if (!examData || Object.keys(examData).length === 0) {
            return { totalMarks: 0, hasNegativeScores: false };
        }
        
        // The optimized API returns total_marks directly
        const totalMarks = examData.total_marks || 0;
        const hasNegativeScores = examData.has_negative_scores || false;
        
        return { 
            totalMarks: totalMarks,
            hasNegativeScores: hasNegativeScores
        };
    };

    // Function to fetch additional data for students (parallel per student + progressive state updates)
    const fetchStudentAdditionalData = async (studentsList) => {
        const tasks = studentsList.map(async (student) => {
            try {
                const [assignments, attendance, exams] = await Promise.all([
                    fetchStudentAssignments(student.id),
                    fetchStudentAttendance(student.id),
                    fetchStudentExams(student.id),
                ]);

                setStudentAssignments((prev) => ({ ...prev, [student.id]: assignments }));
                setStudentAttendance((prev) => ({ ...prev, [student.id]: attendance }));
                setStudentExams((prev) => ({ ...prev, [student.id]: exams }));
            } catch (e) {
                // Keep going even if one student fails
                setStudentAssignments((prev) => ({ ...prev, [student.id]: [] }));
                setStudentAttendance((prev) => ({ ...prev, [student.id]: { total_days: 0, present_days: 0 } }));
                setStudentExams((prev) => ({ ...prev, [student.id]: {} }));
            }
        });

        await Promise.allSettled(tasks);
    };

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                setLoading(true);
                const userInfo = getCookie('user_info');
                const userData = JSON.parse(userInfo);
                const response = await axios.get('/api/batches', {
                    headers: { 'Authorization': userData.token }
                });
                setBatches(response.data.data || []);
                setError(null);
            } catch (err) {
                setError('Failed to fetch batches. Please make sure you are logged in.');
            } finally {
                setLoading(false);
            }
        };
        fetchBatches();
    }, []);

    // Add a useEffect to fetch all students if no batch is selected (disabled in eligible-only mode)
    useEffect(() => {
        const fetchAllStudents = async () => {
            try {
                setLoading(true);
                const userInfo = getCookie('user_info');
                const userData = JSON.parse(userInfo);
                const response = await axios.get('/api/students', {
                    headers: { 'Authorization': userData.token }
                });
                const studentsData = response.data.data || [];
                setAllStudentsCache(studentsData);
                if (!eligibleOnlyMode) {
                    setStudents(studentsData);
                } else {
                    // In eligible-only mode, only show results after selecting a course
                    setStudents([]);
                }
                
                // Fetch additional data without blocking UI
                fetchStudentAdditionalData(studentsData);
                
                setError(null);
            } catch (err) {
                setError('Failed to fetch students. Please make sure you are logged in.');
                setStudents([]);
            } finally {
                setLoading(false);
            }
        };
        if (!selectedBatch && !filteredByJob) {
            fetchAllStudents();
        }
    }, [selectedBatch, filteredByJob, eligibleOnlyMode]);

    // In the batch-specific fetchStudents effect, only run if selectedBatch is set (disabled in eligible-only mode)
    useEffect(() => {
        if (!selectedBatch || eligibleOnlyMode) return;
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const userInfo = getCookie('user_info');
                const userData = JSON.parse(userInfo);
                const response = await axios.get(`/api/batches/${selectedBatch}`, {
                    headers: { 'Authorization': userData.token }
                });
                const batchData = response.data.data;
                const studentsData = batchData.students || [];
                setStudents(studentsData);
                
                // Fetch additional data without blocking UI
                fetchStudentAdditionalData(studentsData);
                
                setError(null);
            } catch (err) {
                setError('Failed to fetch students. Please make sure you are logged in.');
                setStudents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [selectedBatch]);

    // Eligible-only mode: filter students by selected course
    useEffect(() => {
        if (!eligibleOnlyMode) return;
        if (!selectedCourse) {
            setStudents([]);
            return;
        }

        const ensureAllStudentsLoaded = async () => {
            if (allStudentsCache.length === 0) {
                try {
                    setLoading(true);
                    const userInfo = getCookie('user_info');
                    const userData = JSON.parse(userInfo);
                    const response = await axios.get('/api/students', {
                        headers: { 'Authorization': userData.token }
                    });
                    const studentsData = response.data.data || [];
                    setAllStudentsCache(studentsData);
                    setStudents(studentsData.filter(s => `${s.course?.id || s.course_id || ''}` === `${selectedCourse}`));
                } catch (err) {
                    setError('Failed to fetch students. Please make sure you are logged in.');
                    setStudents([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setStudents(allStudentsCache.filter(s => `${s.course?.id || s.course_id || ''}` === `${selectedCourse}`));
            }
        };

        ensureAllStudentsLoaded();
    }, [eligibleOnlyMode, selectedCourse, allStudentsCache]);

    // Precompute eligible counts per course (number of students in each course)
    const courseIdToEligibleCount = useMemo(() => {
        const counts = {};
        for (const student of allStudentsCache) {
            const cid = `${student.course?.id || student.course_id || ''}`;
            if (!cid) continue;
            counts[cid] = (counts[cid] || 0) + 1;
        }
        return counts;
    }, [allStudentsCache]);

    // Handle job eligible students filter
    useEffect(() => {
        if (jobEligibleStudents && selectedJobPosting) {
            const eligibleStudents = jobEligibleStudents.students || [];
            setStudents(eligibleStudents);
            setFilteredByJob(true);
            
            // Fetch additional data for eligible students (non-blocking)
            fetchStudentAdditionalData(eligibleStudents);
        }
    }, [jobEligibleStudents, selectedJobPosting]);

    const handleJobEligibleFilter = () => {
        if (selectedJobPosting) {
            refetchEligibleStudents();
        }
    };

    const clearJobFilter = () => {
        setSelectedJobPosting('');
        if (eligibleOnlyMode) {
            // Stay on eligible mode with empty results until a job is selected
            setFilteredByJob(false);
            setStudents([]);
            setShowJobEligibleFilter(true);
        } else {
            setFilteredByJob(false);
            setStudents([]);
        }
    };

    const filteredStudents = students.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()));

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setSelectedStudent(null);
    };

    return (
        <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', p: 3 }}>
            {/* Card Header for Students Page */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: '#0f1f3d' }}>
                    {eligibleOnlyMode ? 'Eligible Students' : 'Students'}
                </Typography>
                {/* Job Eligible Students Filter Button */}
                {!eligibleOnlyMode && (
                    <Button
                        variant="contained"
                        startIcon={<FilterListIcon />}
                        onClick={() => setShowJobEligibleFilter(!showJobEligibleFilter)}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                            '&:hover': {
                                background: 'linear-gradient(270deg, #e42b12 0%, #eb6707 100%)',
                            }
                        }}
                    >
                        {showJobEligibleFilter ? 'Hide Job Filter' : 'Job Eligible Students'}
                    </Button>
                )}
            </Box>
            
            {/* Eligibility Filter Card */}
            {eligibleOnlyMode ? (
                <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ color: '#0f1f3d', fontWeight: 600 }}>Filter by Course</Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Select Course</InputLabel>
                                    <Select
                                        value={selectedCourse}
                                        label="Select Course"
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                    >
                                        <MenuItem value="">Select a course</MenuItem>
                                        {coursesData?.courses?.map((course) => (
                                            <MenuItem key={course.id} value={course.id}>
                                                {course.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box display="flex" gap={2}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => { setSelectedCourse(''); setSelectedCourseJobId(''); setStudents([]); }}
                                        sx={{
                                            borderRadius: 2,
                                            borderColor: '#e5e7eb',
                                            color: '#6b7280',
                                            '&:hover': {
                                                borderColor: '#d1d5db',
                                                backgroundColor: '#f9fafb'
                                            }
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                        {selectedCourse && (
                            <Box mt={2}>
                                <Typography variant="body2" color="text.secondary">
                                    Eligible students for this course: {students.length}
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            ) : (
                (showJobEligibleFilter) && (
                    <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ color: '#0f1f3d', fontWeight: 600 }}>Filter by Job Posting Eligibility</Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Select Job Posting</InputLabel>
                                        <Select
                                            value={selectedJobPosting}
                                            label="Select Job Posting"
                                            onChange={(e) => setSelectedJobPosting(e.target.value)}
                                        >
                                            <MenuItem value="">Select a job posting</MenuItem>
                                            {jobPostings?.data?.map((job) => (
                                                <MenuItem key={job.id} value={job.id}>
                                                    {job.title} - {job.company?.name || 'N/A'}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box display="flex" gap={2}>
                                        <Button
                                            variant="contained"
                                            onClick={handleJobEligibleFilter}
                                            disabled={!selectedJobPosting || loadingEligibleStudents}
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: 2,
                                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(270deg, #e42b12 0%, #eb6707 100%)',
                                                },
                                                '&:disabled': {
                                                    background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                                                }
                                            }}
                                        >
                                            {loadingEligibleStudents ? <CircularProgress size={20} /> : 'Filter Eligible Students'}
                                        </Button>
                                        {filteredByJob && (
                                            <Button
                                                variant="outlined"
                                                onClick={clearJobFilter}
                                                sx={{
                                                    borderRadius: 2,
                                                    borderColor: '#e5e7eb',
                                                    color: '#6b7280',
                                                    '&:hover': {
                                                        borderColor: '#d1d5db',
                                                        backgroundColor: '#f9fafb'
                                                    }
                                                }}
                                            >
                                                Clear Filter
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                            {jobEligibleStudents && selectedJobPosting && (
                                <Box mt={2}>
                                    <Typography variant="body2" color="text.secondary">
                                        Found {jobEligibleStudents.eligible_students} eligible students out of {jobEligibleStudents.total_students} total students
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                )
            )}

            {/* Jobs list (eligible-only mode): show all jobs by default; filter when a course is selected */}
            {eligibleOnlyMode && (
                <Card sx={{ mb: 4, borderRadius: 4, boxShadow: 6 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {selectedCourse ? 'Jobs for selected course' : 'All Jobs'}
                        </Typography>
                        <Grid container spacing={1}>
                            {(jobPostings?.data || [])
                                .filter(j => !selectedCourse || `${j.course_id}` === `${selectedCourse}`)
                                .map(job => {
                                    const count = selectedCourse
                                        ? students.length
                                        : (courseIdToEligibleCount[`${job.course_id}`] || 0);
                                    return (
                                <Grid item xs={12} key={job.id}>
                                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                        <CardContent sx={{ py: 1.5, px: 2 }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                                                <Box overflow="hidden">
                                                    <Typography variant="subtitle1" fontWeight={700} noWrap>{job.title}</Typography>
                                                    <Typography variant="body2" color="text.secondary" noWrap>{job.company?.name || 'N/A'}</Typography>
                                                </Box>
                                                <Button
                                                    variant={selectedCourseJobId === job.id ? 'contained' : 'outlined'}
                                                    onClick={() => {
                                                        if (!selectedCourse || `${selectedCourse}` !== `${job.course_id}`) {
                                                            setSelectedCourse(`${job.course_id}`);
                                                        }
                                                        setSelectedCourseJobId(job.id);
                                                    }}
                                                >
                                                    View students ({count})
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                    );
                                })}
                            {selectedCourse && ((jobPostings?.data || []).filter(j => `${j.course_id}` === `${selectedCourse}`).length === 0) && (
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary">No jobs found for this course.</Typography>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {!eligibleOnlyMode && (
            <Card sx={{ mb: 4, borderRadius: 4, boxShadow: 6 }}>
                <CardContent>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Batch</InputLabel>
                                <Select
                                    value={selectedBatch}
                                    label="Batch"
                                    onChange={e => {
                                        setSelectedBatch(e.target.value);
                                        setPage(0);
                                        setFilteredByJob(false);
                                    }}
                                >
                                    <MenuItem value="">Select Batch</MenuItem>
                                    {batches.map(batch => (
                                        <MenuItem key={batch.batch_id} value={batch.batch_id}>{batch.batch_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <TextField
                                    size="small"
                                    label="Search Students"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            )}
            {/* Error/Loading */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                    <CircularProgress />
                </Box>
            ) : (
                (!eligibleOnlyMode || (eligibleOnlyMode && selectedCourse && selectedCourseJobId)) ? (
                    <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
                        <CardContent>
                            <StudentDashboard
                            headers={[
                                { label: 'Name', accessor: 'name' },
                                { label: 'Email', accessor: 'email' },
                                { label: 'Phone', accessor: 'phone' },
                                { label: 'Course', accessor: row => row.course?.name || '--' },
                                { label: 'Batch', accessor: row => row.batches?.[0]?.batch_name || '--' },
                                { label: 'Attendance %', accessor: row => {
                                    const attendanceData = studentAttendance[row.id] || [];
                                    const percentage = calculateAttendancePercentage(attendanceData);
                                    return percentage > 0 ? `${percentage}%` : '--';
                                }},
                                        { label: 'Exam Marks', accessor: row => {
            const examData = studentExams[row.id] || {};
            const { totalMarks, hasNegativeScores } = calculateExamMarks(examData);
            if (totalMarks !== 0) {
                const scoreText = `${totalMarks}`;
                return hasNegativeScores ? `${scoreText} ⚠️` : scoreText;
            }
            return '--';
        }},
                                { label: 'Profile Completion', accessor: row => row.placement_eligibility?.profile_completion_percentage ? `${row.placement_eligibility.profile_completion_percentage}%` : '--' },
                                { label: 'Fees Status', accessor: row => row.placement_eligibility?.fees_payment_status ? 'Paid' : 'Pending' },
                                { label: 'Assignments Submitted', accessor: row => {
                                    const assignmentData = studentAssignments[row.id] || [];
                                    const submittedCount = calculateAssignmentSubmissions(assignmentData);
                                    const totalCount = assignmentData.length;
                                    return totalCount > 0 ? `${submittedCount}/${totalCount}` : '--';
                                }},
                                { label: 'Lab Tests', accessor: row => row.placement_eligibility?.lab_test_cases_completed ? 'Completed' : 'Pending' },
                                { label: 'Placed', accessor: row => row.placement_eligibility?.is_placed ? 'Yes' : 'No' },
                                { label: 'Placement Company', accessor: row => row.placement_eligibility?.placement_company || '--' },
                                { label: 'Placement Salary', accessor: row => row.placement_eligibility?.placement_salary ? `₹${row.placement_eligibility.placement_salary}` : '--' },
                                { label: 'Placement Date', accessor: row => row.placement_eligibility?.placement_date ? new Date(row.placement_eligibility.placement_date).toLocaleDateString() : '--' },
                                { label: 'PAP Student', accessor: row => row.placement_eligibility?.is_pap_student ? 'Yes' : 'No' },
                                { label: 'Remaining Fees', accessor: row => row.placement_eligibility?.remaining_fee_amount ? `₹${row.placement_eligibility.remaining_fee_amount}` : '--' },
                            ]}
                            data={filteredStudents}
                            totalRecords={filteredStudents.length}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={(e, newPage) => setPage(newPage)}
                            onRowsPerPageChange={val => setRowsPerPage(val)}
                            onFullPersonalDetailsClick={student => handleStudentClick(student)}
                        />
                        </CardContent>
                    </Card>
                ) : (
                    eligibleOnlyMode && selectedCourse && !selectedCourseJobId ? (
                        <Alert severity="info">Select a job to view the eligible students list.</Alert>
                    ) : null
                )
            )}
            {/* Student Details Drawer */}
            <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
                <Box sx={{ width: 350, p: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h6">Student Details</Typography>
                        <IconButton onClick={handleDrawerClose}><CloseIcon /></IconButton>
                    </Box>
                    {selectedStudent ? (
                        <>
                            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                <Avatar sx={{ width: 72, height: 72, mb: 1 }}>
                                    {selectedStudent.name?.[0] || '?'}
                                </Avatar>
                                <Typography variant="h6">{selectedStudent.name}</Typography>
                                <Typography variant="body2" color="text.secondary">{selectedStudent.email}</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            
                            {/* Basic Information */}
                            <Typography variant="subtitle1" fontWeight="bold" mb={1}>Basic Information</Typography>
                            <Typography variant="subtitle2">Phone:</Typography>
                            <Typography mb={1}>{selectedStudent.phone || '--'}</Typography>
                            <Typography variant="subtitle2">Course:</Typography>
                            <Typography mb={1}>{selectedStudent.course?.name || '--'}</Typography>
                            <Typography variant="subtitle2">Batch:</Typography>
                            <Typography mb={1}>{selectedStudent.batches?.[0]?.batch_name || '--'}</Typography>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            {/* Placement Eligibility Information */}
                            <Typography variant="subtitle1" fontWeight="bold" mb={1}>Placement Eligibility</Typography>
                            <Typography variant="subtitle2">Eligible for Placement:</Typography>
                            <Typography mb={1} color={selectedStudent.placement_eligibility?.is_eligible ? 'success.main' : 'error.main'}>
                                {selectedStudent.placement_eligibility?.is_eligible ? 'Yes' : 'No'}
                            </Typography>
                            
                            <Typography variant="subtitle2">Attendance Percentage:</Typography>
                            <Typography mb={1}>
                                {(() => {
                                    const attendanceData = studentAttendance[selectedStudent.id] || [];
                                    const percentage = calculateAttendancePercentage(attendanceData);
                                    return percentage > 0 ? `${percentage}%` : '--';
                                })()}
                            </Typography>
                            
                                                    <Typography variant="subtitle2">Exam Marks:</Typography>
                        <Typography mb={1}>
                            {(() => {
                                const examData = studentExams[selectedStudent.id] || {};
                                const { totalMarks, hasNegativeScores } = calculateExamMarks(examData);
                                if (totalMarks !== 0) {
                                    const scoreText = `${totalMarks}`;
                                    return hasNegativeScores ? `${scoreText} ⚠️ (Has negative scores)` : scoreText;
                                }
                                return '--';
                            })()}
                        </Typography>
                            
                            <Typography variant="subtitle2">Profile Completion:</Typography>
                            <Typography mb={1}>{selectedStudent.placement_eligibility?.profile_completion_percentage ? `${selectedStudent.placement_eligibility.profile_completion_percentage}%` : '--'}</Typography>
                            
                            <Typography variant="subtitle2">Fees Payment Status:</Typography>
                            <Typography mb={1} color={selectedStudent.placement_eligibility?.fees_payment_status ? 'success.main' : 'error.main'}>
                                {selectedStudent.placement_eligibility?.fees_payment_status ? 'Paid' : 'Pending'}
                            </Typography>
                            
                            <Typography variant="subtitle2">Assignments Submitted:</Typography>
                            <Typography mb={1}>
                                {(() => {
                                    const assignmentData = studentAssignments[selectedStudent.id] || [];
                                    const submittedCount = calculateAssignmentSubmissions(assignmentData);
                                    const totalCount = assignmentData.length;
                                    return totalCount > 0 ? `${submittedCount}/${totalCount}` : '--';
                                })()}
                            </Typography>
                            
                            <Typography variant="subtitle2">Lab Test Cases:</Typography>
                            <Typography mb={1} color={selectedStudent.placement_eligibility?.lab_test_cases_completed ? 'success.main' : 'warning.main'}>
                                {selectedStudent.placement_eligibility?.lab_test_cases_completed ? 'Completed' : 'Pending'}
                            </Typography>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            {/* Placement Information */}
                            <Typography variant="subtitle1" fontWeight="bold" mb={1}>Placement Information</Typography>
                            <Typography variant="subtitle2">Placed:</Typography>
                            <Typography mb={1} color={selectedStudent.placement_eligibility?.is_placed ? 'success.main' : 'info.main'}>
                                {selectedStudent.placement_eligibility?.is_placed ? 'Yes' : 'No'}
                            </Typography>
                            
                            <Typography variant="subtitle2">Placement Company:</Typography>
                            <Typography mb={1}>{selectedStudent.placement_eligibility?.placement_company || '--'}</Typography>
                            
                            <Typography variant="subtitle2">Placement Salary:</Typography>
                            <Typography mb={1}>{selectedStudent.placement_eligibility?.placement_salary ? `₹${selectedStudent.placement_eligibility.placement_salary}` : '--'}</Typography>
                            
                            <Typography variant="subtitle2">Placement Date:</Typography>
                            <Typography mb={1}>{selectedStudent.placement_eligibility?.placement_date ? new Date(selectedStudent.placement_eligibility.placement_date).toLocaleDateString() : '--'}</Typography>
                            
                            <Typography variant="subtitle2">PAP Student:</Typography>
                            <Typography mb={1} color={selectedStudent.placement_eligibility?.is_pap_student ? 'info.main' : 'text.secondary'}>
                                {selectedStudent.placement_eligibility?.is_pap_student ? 'Yes' : 'No'}
                            </Typography>
                            
                            <Typography variant="subtitle2">Remaining Fee Amount:</Typography>
                            <Typography mb={1}>{selectedStudent.placement_eligibility?.remaining_fee_amount ? `₹${selectedStudent.placement_eligibility.remaining_fee_amount}` : '--'}</Typography>
                            
                            <Divider sx={{ my: 2 }} />
                            <Button variant="contained" color="primary" fullWidth disabled>View Full Profile</Button>
                        </>
                    ) : (
                        <Typography>No student selected.</Typography>
                    )}
                </Box>
            </Drawer>
        </Box>
    );
};

export default PlacementStudents; 