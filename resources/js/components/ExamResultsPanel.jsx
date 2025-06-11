import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const ExamResultsPanel = ({ selectedStudent }) => {
    const [examResults, setExamResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (selectedStudent) {
            fetchExamResults();
        }
    }, [selectedStudent]);

    const fetchExamResults = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/student/${selectedStudent.id}/exams`, {
                params: { examType: 'past' }
            });
            setExamResults(response.data.data || []);
        } catch (error) {
            console.error('Error fetching exam results:', error);
            setExamResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Helper to format duration (HH:MM to Xhr Ymin)
    const formatDuration = (duration) => {
        if (!duration) return 'N/A';
        if (duration.includes(':')) {
            const [hours, minutes] = duration.split(':').map(Number);
            return hours > 0 ? `${hours}hr ${minutes}min` : `${minutes}min`;
        }
        if (duration.includes('.')) {
            const [hours, minutes] = duration.split('.').map(Number);
            return hours > 0 ? `${hours}hr ${minutes}min` : `${minutes}min`;
        }
        return duration;
    };

    const getStatusDisplay = (exam) => {
        if (exam.status === 'Completed') return 'Attempted';
        if (exam.status === 'Expired') return 'Not Attempted';
        return exam.status;
    };

    const getMarksDisplay = (exam) => {
        return getStatusDisplay(exam) === 'Attempted'
            ? `${exam.totalMarksObtained} / ${exam.totalMarks}`
            : '-';
    };

    const filteredExamResults = examResults.filter(exam => {
        if (filter === 'all') return true;
        if (filter === 'attempted') return getStatusDisplay(exam) === 'Attempted';
        if (filter === 'not-attempted') return getStatusDisplay(exam) === 'Not Attempted';
        return true;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
        );
    }

    if (!selectedStudent) {
        return (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-orange-100">
                <h3 className="text-lg font-medium text-gray-900">Select a student to view exam results</h3>
                <p className="mt-2 text-sm text-gray-500">Choose a student from the list to see their exam performance.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Exam Results for {selectedStudent.name}</h2>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="exam-filter-label">Filter Exams</InputLabel>
                    <Select
                        labelId="exam-filter-label"
                        value={filter}
                        label="Filter Exams"
                        onChange={(e) => setFilter(e.target.value)}
                        sx={{ 
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#e5e7eb',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#eb6707',
                            },
                        }}
                    >
                        <MenuItem value="all">All Exams</MenuItem>
                        <MenuItem value="attempted">Attempted Exams</MenuItem>
                        <MenuItem value="not-attempted">Not Attempted Exams</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {filteredExamResults.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No exams found for the selected filter.</p>
                    </div>
                ) : (
                    <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                        <Table>
                            <TableHead>
                                <TableRow style={{background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)', color: 'white'}}>
                                    <TableCell sx={{ fontWeight: 600, color: '#FFFFFF', padding: '16px', borderBottom: '1px solid #e5e7eb' }}>Exam Name</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#FFFFFF', padding: '16px', borderBottom: '1px solid #e5e7eb' }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#FFFFFF', padding: '16px', borderBottom: '1px solid #e5e7eb' }}>Duration</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#FFFFFF', padding: '16px', borderBottom: '1px solid #e5e7eb' }}>Questions</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#FFFFFF', padding: '16px', borderBottom: '1px solid #e5e7eb' }}>Marks</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#FFFFFF', padding: '16px', borderBottom: '1px solid #e5e7eb' }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredExamResults.map((exam, idx) => (
                                    <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                                        <TableCell sx={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>{exam.title}</TableCell>
                                        <TableCell sx={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>{exam.examDate}</TableCell>
                                        <TableCell sx={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>{formatDuration(exam.duration)}</TableCell>
                                        <TableCell sx={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>{exam.totalQuestions}</TableCell>
                                        <TableCell sx={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>{getMarksDisplay(exam)}</TableCell>
                                        <TableCell sx={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>{getStatusDisplay(exam)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>
        </div>
    );
};

export default ExamResultsPanel; 