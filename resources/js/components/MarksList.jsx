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
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useGetMarkListBanksMutation } from '../store/service/admin/AdminService';
import { useSearchParams } from 'react-router-dom';

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
    const [examStatisticData, setExamStatisticData] = useState();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (examId) {
            getData(examId);
        }
    }, [examId]);

    const getData = async (examID) => {
        let result = await getExamStatistic(examID);
        console.log(result)
        const { data } = result;
        setExamStatisticData(data?.data);
    };

    const handleRowClick = (row) => {
        setSelectedRowData(row);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedRowData(null);
    };

    return (
        <>
            {
                examStatisticData ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100vh',
                    }}>
                        <TableContainer sx={{ border: '1px solid rgba(0, 0, 0, 0.12)', mx: { xl: '50px', md: '40px', sm: '30px', xs: '20px' }, width: "95%" }}>
                            <Table aria-label="quiz details table">
                                <TableHead>
                                    <TableRow>
                                        {tableHeaders.map((header, index) => (
                                            <TableCell key={index} sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)', fontWeight: 'bold', textAlign: 'center', fontSize: { xs: '11px', sm: '12px', md: '13px', xl: '14px', padding: '5px' } }}>{header.label}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {examStatisticData.map((row, rowIndex) => (
                                        <TableRow key={rowIndex} onClick={() => handleRowClick(row)} style={{ cursor: 'pointer' }}>
                                            {tableHeaders.map((header, colIndex) => {
                                                const keys = header.key.split('.');
                                                const value = keys.reduce((acc, key) => acc && acc[key], row);

                                                return (
                                                    <TableCell key={colIndex} sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)', textAlign: 'center', fontSize: { xs: '11px', sm: '12px', md: '13px', xl: '14px', padding: '5px' } }}>
                                                        {value !== undefined ? value : 'N/A'}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                            <DialogTitle>Student Details</DialogTitle>
                            <DialogContent>
                                {selectedRowData && (
                                    <Box>
                                        {tableHeaders.map((header, index) => {
                                            const keys = header.key.split('.');
                                            const value = keys.reduce((acc, key) => acc && acc[key], selectedRowData);
                                            return (
                                                <Typography key={index}>
                                                    <strong>{header.label}:</strong> {value !== undefined ? value : 'N/A'}
                                                </Typography>
                                            );
                                        })}
                                    </Box>
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog}>Close</Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: `calc(100vh - 60px)` }}>
                        <CircularProgress />
                    </Box>
                )}
        </>
    );
};

export default MarksList;

