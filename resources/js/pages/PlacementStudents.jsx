import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, FormControl, InputLabel, Select, MenuItem, TextField, CircularProgress, Alert, Drawer, IconButton, Avatar, Divider, Button } from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import StudentDashboard from './StudentDashboard';
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

const PlacementStudents = () => {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

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

    // Add a useEffect to fetch all students if no batch is selected
    useEffect(() => {
        const fetchAllStudents = async () => {
            try {
                setLoading(true);
                const userInfo = getCookie('user_info');
                const userData = JSON.parse(userInfo);
                const response = await axios.get('/api/students', {
                    headers: { 'Authorization': userData.token }
                });
                setStudents(response.data.data || []);
                setError(null);
            } catch (err) {
                setError('Failed to fetch students. Please make sure you are logged in.');
                setStudents([]);
            } finally {
                setLoading(false);
            }
        };
        if (!selectedBatch) {
            fetchAllStudents();
        }
    }, [selectedBatch]);

    // In the batch-specific fetchStudents effect, only run if selectedBatch is set
    useEffect(() => {
        if (!selectedBatch) return;
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const userInfo = getCookie('user_info');
                const userData = JSON.parse(userInfo);
                const response = await axios.get(`/api/batches/${selectedBatch}`, {
                    headers: { 'Authorization': userData.token }
                });
                const batchData = response.data.data;
                setStudents(batchData.students || []);
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
        <Box>
            {/* Card Header for Students Page */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h5" fontWeight={700} gutterBottom>Students</Typography>
                {/* You can add an 'Add Student' button here if needed */}
            </Box>
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
            {/* Error/Loading */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                    <CircularProgress />
                </Box>
            ) : (
                <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
                    <CardContent>
                        <StudentDashboard
                            headers={[
                                { label: 'Name', accessor: 'name' },
                                { label: 'Email', accessor: 'email' },
                                { label: 'Phone', accessor: 'phone' },
                                { label: 'Placement Status', accessor: row => row.placement_status || '--' },
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
                            <Typography variant="subtitle2">Phone:</Typography>
                            <Typography mb={1}>{selectedStudent.phone || '--'}</Typography>
                            <Typography variant="subtitle2">Roll No:</Typography>
                            <Typography mb={1}>{selectedStudent.roll_no || '--'}</Typography>
                            <Typography variant="subtitle2">Status:</Typography>
                            <Typography mb={1}>{selectedStudent.status || '--'}</Typography>
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