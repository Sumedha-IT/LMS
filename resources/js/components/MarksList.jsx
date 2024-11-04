// import React, { useEffect, useState } from 'react';
// import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
// import { useGetMarkListBanksMutation } from '../store/service/admin/AdminService';
// import { useNavigate, useParams, useSearchParams } from 'react-router-dom';


// const tableHeaders = [
//     { label: "Student Name", key: "student.name" },
//     { label: "Email", key: "student.email" },
//     { label: "Attempt Count", key: "attempt_count" },
//     { label: "Score", key: "score" },
//     { label: "Time Taken", key: "report.timeTaken" },
//     { label: "Grade", key: "report.aggregateReport.grade" },
//     { label: "Status", key: "status" },
// ];

// const MarksList = () => {
//     const [getExamStatistic] = useGetMarkListBanksMutation();
//     const [examStatisticData, setExamStatisticData] = useState();
//     const [searchParams] = useSearchParams();
//     useEffect(() => {
//         const examID = searchParams.get('examId');
//         if (examID) {
//             getData(examID)
//         }
//     }, []);

//     const getData = async (examID) => {
//         let result = await getExamStatistic(examID);
//         const { data } = result;
//         setExamStatisticData(data?.data);
//     };

//     return (
//         <>
//             {
//                 examStatisticData ? (
//                     <Box sx={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         width: '100%',
//                         height: '100vh',
//                     }}  >
//                         <TableContainer sx={{ border: '1px solid rgba(0, 0, 0, 0.12)', mx: { xl: '50px', md: '40px', sm: '30px', xs: '20px' }, width: "95%" }}>
//                             <Table aria-label="quiz details table">
//                                 <TableHead>
//                                     <TableRow >
//                                         {tableHeaders.map((header, index) => (
//                                             <TableCell key={index} sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)', fontWeight: 'bold', textAlign: 'center', fontSize: { xs: '11px', sm: '12px', md: '13px', xl: '14px', padding: '5px' } }}>{header.label}</TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {examStatisticData.map((row, rowIndex) => (
//                                         <TableRow key={rowIndex}>
//                                             {tableHeaders.map((header, colIndex) => {
//                                                 const keys = header.key.split('.');
//                                                 const value = keys.reduce((acc, key) => acc && acc[key], row);

//                                                 return (
//                                                     <TableCell key={colIndex} sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)', textAlign: 'center', fontSize: { xs: '11px', sm: '12px', md: '13px', xl: '14px', padding: '5px' } }}>
//                                                         {value !== undefined ? value : 'N/A'}
//                                                     </TableCell>
//                                                 );
//                                             })}
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </Box>) : (
//                     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: `calc(100vh - 60px)` }}>
//                         <CircularProgress />
//                     </Box>
//                 )}
//         </>
//     )
// }

// export default MarksList

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
    Typography,
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

    const getData = async (examID) => {
        setIsLoading(true);
        try {
            const result = await getExamStatistic(examID);
            const { data } = result;
            console.log(data,"data")
            setExamStatisticData(data);
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
