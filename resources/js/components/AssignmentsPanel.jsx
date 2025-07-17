import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DocumentTextIcon, CheckCircleIcon, XCircleIcon, ClipboardDocumentListIcon, ClockIcon, AcademicCapIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { 
    Box, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Card,
    CardContent,
    IconButton,
    Tooltip,
    Modal,
    Button
} from '@mui/material';

const AssignmentsPanel = ({ selectedStudentId }) => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (selectedStudentId) {
            fetchAssignments();
        } else {
            setLoading(false);
            setError('No student selected');
        }
    }, [selectedStudentId, selectedStatus]);

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

    const fetchAssignments = async () => {
        try {
            const userInfo = getCookie("user_info");
            if (!userInfo) {
                throw new Error('No user info cookie found');
            }
            const userData = JSON.parse(userInfo);
            if (!userData.token) {
                throw new Error('No token found in user data');
            }

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const headers = {
                'Authorization': userData.token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            if (csrfToken) {
                headers['X-CSRF-TOKEN'] = csrfToken;
            }

            const response = await axios.get('/api/getUserAssignments', {
                params: {
                    student_id: selectedStudentId,
                    status: selectedStatus
                },
                headers: headers
            });
            
            if (!response.data || !response.data.data) {
                throw new Error('Invalid response format from API');
            }

            const transformedAssignments = response.data.data.flatMap(topic => 
                topic.assignments.map(assignment => ({
                    id: assignment.id,
                    title: assignment.name,
                    description: assignment.description,
                    topic_name: topic.topic_name,
                    curriculum_name: topic.curriculum?.name || topic.curriculum_name || '-',
                    status: assignment.is_submitted ? 'submitted' : 'pending',
                    submitted_at: assignment.is_submitted ? new Date().toISOString() : null,
                    grade: assignment.marks_scored,
                    total_marks: assignment.total_marks,
                    file_url: assignment.file
                }))
            );
            
            setAssignments(transformedAssignments);
            setError(null);
        } catch (error) {
            console.error('Error fetching assignments:', error);
            setError(error.message || 'Failed to fetch assignments');
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const totalAssignments = assignments.length;
    const submittedAssignments = assignments.filter(a => a.status === 'submitted').length;
    const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
    const averageGrade = assignments.length > 0 
        ? assignments.reduce((acc, curr) => acc + (curr.grade || 0), 0) / assignments.length 
        : 0;

    const handleViewSubmission = (assignment) => {
        setSelectedSubmission(assignment);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSubmission(null);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e' }}>
                    Assignments
                </Typography>
                <FormControl sx={{ minWidth: 200 }}>
                    <Select
                        value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(0, 0, 0, 0.1)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(0, 0, 0, 0.2)',
                            },
                        }}
                    >
                        <MenuItem value="all">All Assignments</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="submitted">Submitted</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', borderRadius: '8px' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ClipboardDocumentListIcon className="h-6 w-6 text-blue-500" />
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Total Assignments
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                        {totalAssignments}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', borderRadius: '8px' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Submitted
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                        {submittedAssignments}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', borderRadius: '8px' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ClockIcon className="h-6 w-6 text-yellow-500" />
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Pending
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                        {pendingAssignments}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', borderRadius: '8px' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AcademicCapIcon className="h-6 w-6 text-purple-500" />
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Average Grade
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                        {averageGrade.toFixed(1)}%
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Assignments Table */}
            <Card sx={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', borderRadius: '8px' }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Assignment Details
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)' }}>
                                    <TableCell sx={{ fontWeight: 600, color: '#FFFFFF', py: 2 }}>Curriculum</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#FFFFFF', py: 2 }}>Topic</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#FFFFFF', py: 2 }}>Assignment</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#FFFFFF', py: 2 }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#FFFFFF', py: 2 }}>Grade</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#FFFFFF', py: 2 }}>Submitted</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#FFFFFF', py: 2, textAlign: 'center' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(!assignments || assignments.length === 0) ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                            <Typography color="text.secondary">
                                                No assignments found for this student.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    assignments.map((assignment) => (
                                        <TableRow key={assignment.id} hover>
                                            <TableCell>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {assignment.curriculum_name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {assignment.topic_name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                                                    <Box sx={{ ml: 2 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                            {assignment.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {assignment.description}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        px: 1.5,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        display: 'inline-block',
                                                        bgcolor: assignment.status === 'submitted' 
                                                            ? 'rgba(76, 175, 80, 0.1)' 
                                                            : 'rgba(255, 152, 0, 0.1)',
                                                        color: assignment.status === 'submitted' 
                                                            ? '#2e7d32' 
                                                            : '#ed6c02',
                                                        fontWeight: 500,
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    {assignment.status}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {assignment.grade 
                                                    ? `${assignment.grade}/${assignment.total_marks}`
                                                    : '-'
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {assignment.submitted_at 
                                                    ? new Date(assignment.submitted_at).toLocaleString()
                                                    : '-'
                                                }
                                            </TableCell>
                                            <TableCell align="center">
                                                {assignment.status === 'submitted' && assignment.file_url && (
                                                    <Tooltip title="View Submission">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleViewSubmission(assignment)}
                                                            sx={{
                                                                color: '#eb6707',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(235, 103, 7, 0.1)'
                                                                }
                                                            }}
                                                        >
                                                            <EyeIcon className="h-5 w-5" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Submission View Modal */}
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="submission-modal"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                }}
            >
                <Box sx={{
                    position: 'relative',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    width: '800px',
                    overflow: 'auto'
                }}>
                    {/* Close Button */}
                    <IconButton
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'gray.500'
                        }}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </IconButton>

                    {selectedSubmission && (
                        <>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a237e' }}>
                                Assignment Submission
                            </Typography>
                            
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                                    {selectedSubmission.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {selectedSubmission.description}
                                </Typography>
                                
                                <Box sx={{ 
                                    mt: 2, 
                                    p: 2, 
                                    bgcolor: 'background.default', 
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                                        Submitted File
                                    </Typography>
                                    {selectedSubmission.file_url && (
                                        <iframe
                                            src={selectedSubmission.file_url}
                                            style={{
                                                width: '100%',
                                                height: '500px',
                                                border: 'none'
                                            }}
                                            title="Assignment Submission"
                                        />
                                    )}
                                </Box>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default AssignmentsPanel; 