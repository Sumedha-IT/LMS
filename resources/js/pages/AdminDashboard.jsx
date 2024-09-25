

import React, { useState, useEffect } from 'react';
import CommonTable from '../common/CommonTable';
import { useNavigate, useParams} from 'react-router-dom';
import { Button, Select, MenuItem, FormControl, InputLabel, Grid, Box, Typography } from '@mui/material';
import { useGetBatchesQuery, useGetExamDataQuery } from '../store/service/admin/AdminService';

function AdminDashboard() {
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [examData, setExamData] = useState([]);
    const { data: batchList } = useGetBatchesQuery();
    const { data, isLoading, isError } = useGetExamDataQuery({
        page: page + 1, // Backend expects 1-based page index
        rowsPerPage: rowsPerPage,
        filterBatch: selectedBatch,
        dateCriteria: selectedDate,
    });
    const { id } = useParams();


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

    const onEditClick = async (id) => {
        console.log(id)
        nav(`/administrator/${id}/examination/addquestion?examId=${id}`)
    }

    const nav = useNavigate();
    const handleAddNewExam = () => {
        nav(`/administrator/${id}/examination/ExamForm`);

    };

    return (
        <div className="p-4">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" >Examinations</Typography>

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
                                {batchList?.data.length > 0 ? (
                                    batchList.data.map((batch) => (
                                        <MenuItem key={batch.batch_id} value={batch.batch_id}>
                                            {batch.batch_name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No Batches Available</MenuItem>
                                )}
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
                                <MenuItem value="past">Past</MenuItem>
                                <MenuItem value="upcoming">Upcoming</MenuItem>
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
                onEditClick={onEditClick}
            />
        </div>
    );
}

export default AdminDashboard;
