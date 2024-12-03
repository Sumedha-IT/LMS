import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useGetMarkListBanksMutation } from '../store/service/admin/AdminService';

const tableHeaders = [
    { label: "Student Name", key: "student.name" },
    { label: "Email", key: "student.email" },
    { label: "Attempt Count", key: "attempt_count" },
    { label: "Score", key: "score" },
    { label: "Time Taken", key: "report.timeTaken" },
    { label: "Grade", key: "report.aggregateReport.grade" },
    { label: "Status", key: "status" },
];

const MarksList = ({ open, onClose, examId }) => {
    const [getExamStatistic] = useGetMarkListBanksMutation();
    const [examStatisticData, setExamStatisticData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (open && examId) {
            getData(examId);
        }
    }, [open, examId]);
    // get the Marks data from api's
    const getData = async (examID) => {
        setIsLoading(true);
        try {
            const result = await getExamStatistic(examID);
            const { data } = result;
            setExamStatisticData(data.data);
        } catch (error) {
            console.error("Error fetching exam statistics:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Marks List</DialogTitle>
            <DialogContent>
                {/* waiting for api response and set into the loading state */}
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ width: '100%' }}>
                        <TableContainer>
                            <Table aria-label="marks table">
                                <TableHead>
                                    <TableRow>
                                        {tableHeaders.map((header, index) => (
                                            <TableCell key={index} align="center" sx={{ fontWeight: 'bold' }}>
                                                {header.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {examStatisticData ? (
                                        examStatisticData.map((row, rowIndex) => (
                                            <TableRow key={rowIndex}>
                                                {tableHeaders.map((header, colIndex) => {
                                                    const keys = header.key.split('.');
                                                    const value = keys.reduce((acc, key) => acc && acc[key], row);
                                                    return (
                                                        <TableCell key={colIndex} align="center">
                                                            {value !== undefined ? value : 'N/A'}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={tableHeaders.length} align="center">
                                                No Data Available
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MarksList;
