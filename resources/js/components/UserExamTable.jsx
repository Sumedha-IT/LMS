
// import React, { useEffect, useState } from 'react';
// import { Box, Button, Typography } from '@mui/material';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import PendingActionsIcon from '@mui/icons-material/PendingActions';
// import CommonTable from '../common/CommonTable';
// import { useGetUserExamDataQuery } from '../store/service/user/UserService';

// const headers = [
//     { label: '', accessor: 'index' },
//     { label: 'Exam Name', accessor: 'examNameWithStatus' },
//     { label: 'Status', accessor: 'status' },
//     { label: '', accessor: 'actions' },
// ];

// const UserExamTable = ({ Value }) => {
//     const [userExamData, setUserExamData] = useState([]);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const { data } = useGetUserExamDataQuery({
//         page: page + 1,
//         rowsPerPage: rowsPerPage,
//         ExamType: (Value === 0 ? "upcoming" : "past"),
//         userId: 7,
//     });

//     useEffect(() => {
//         if (data) {
//             setUserExamData(data.data);
//         }
//     }, [data]);

//     const handlePageChange = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleRowsPerPageChange = (newRowsPerPage) => {
//         setRowsPerPage(newRowsPerPage);
//         setPage(0);
//     };

//     const handleAttempt = (e) => {
//         console.log(e);
//     };

//     // Function to combine date and time into a single Date object for proper comparison
//     const combineDateAndTime = (date, time) => {
//         const [hours, minutes] = time.split(':');
//         const [year, month, day] = date.split('-');
//         return new Date(year, month - 1, day, hours, minutes); // month-1 since JS Date() months are 0-indexed
//     };

//     const isButtonEnabled = (examDate, startsAt, endsAt) => {
//         const currentTime = new Date(); // Get current time
//         const startTime = combineDateAndTime(examDate, startsAt); // Combine date and start time
//         const endTime = combineDateAndTime(examDate, endsAt); // Combine date and end time

//         // console.log(currentTime, startTime, endTime); // Debug to ensure times are correct

//         // Check if the current time is between the start and end times
//         return currentTime >= startTime && currentTime <= endTime;
//     };

//     const renderActions = (row) => {
//         const buttonEnabled = isButtonEnabled(row.examDate, row.starts_at, row.ends_at);

//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 3 }}>
//                 {Value === 0 ? (
//                     <Box
//                         component="a"
//                         href={buttonEnabled ? `/user/${7}/exam/${row.id}` : '#'}
//                         target={buttonEnabled ? "_blank" : undefined}
//                         rel="noopener noreferrer"
//                         sx={{
//                             display: 'inline-block',
//                             textDecoration: 'none',
//                             border: '1px solid #f97316',
//                             color: buttonEnabled ? '#f97316' : '#ccc',
//                             borderRadius: '20px',
//                             padding: '8px 16px',
//                             fontSize: '14px',
//                             fontWeight: 'bold',
//                             textAlign: 'center',
//                             cursor: buttonEnabled ? 'pointer' : 'not-allowed',
//                             '&:hover': {
//                                 backgroundColor: buttonEnabled ? '#f97316' : undefined,
//                                 color: buttonEnabled ? '#fff' : undefined,
//                             },
//                         }}
//                     >
//                         Attempt
//                     </Box>
//                 ) : (
//                     <Button
//                         variant="text"
//                         color="warning"
//                         size="small"
//                         onClick={() => handleAttempt(row)}
//                         sx={{ color: '#f97316' }}
//                     >
//                         Review
//                     </Button>
//                 )}
//             </Box>
//         );
//     };

//     const renderStatusIcons = (row) => (
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#777' }}>
//             <PendingActionsIcon sx={{ color: '#f97316', fontSize: '18px' }} />
//             <Typography variant="body2">
//                 {`${row.examDate} ${row.starts_at} to ${row.ends_at}`}
//             </Typography>
//             <AccessTimeIcon sx={{ color: '#f97316', fontSize: '18px' }} />
//             <Typography variant="body2">{row.duration}</Typography>
//         </Box>
//     );

//     const renderExamNameWithStatus = (row) => (
//         <Box>
//             <Typography variant="h6" sx={{ color: '#1e293b', mb: 1 }}>
//                 {row.title}
//             </Typography>
//             <Typography sx={{ color: '#1e293b', mb: 2 }}>
//                 {row.subjectName}
//             </Typography>
//             {renderStatusIcons(row)}
//         </Box>
//     );

//     const transformedData = userExamData.map((exam, index) => ({
//         index: `${index + 1}.`,
//         examNameWithStatus: renderExamNameWithStatus(exam),
//         ...exam,
//         actions: renderActions(exam),
//     }));

//     return (
//         <Box>
//             <CommonTable
//                 headers={headers}
//                 data={transformedData}
//                 totalRecords={data?.totalRecords || 0}
//                 page={page}
//                 rowsPerPage={rowsPerPage}
//                 onPageChange={handlePageChange}
//                 onRowsPerPageChange={handleRowsPerPageChange}
//                 style={{
//                     paper: { boxShadow: 'none' },
//                     headerCell: { fontWeight: 'bold', color: '#f97316', backgroundColor: '#fef4e9' },
//                     bodyCell: { color: '#333' },
//                 }}
//             />
//         </Box>
//     );
// };

// export default UserExamTable;









import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { Box, Button, Slide, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CommonTable from '../common/CommonTable';
import ReviewDialog from '../common/ReviewDialog';
import { useGetUserExamDataQuery } from '../store/service/user/UserService';

const headers = [
    { label: '', accessor: 'index' },
    { label: 'Exam Name', accessor: 'examNameWithStatus' },
    { label: 'Status', accessor: 'status' },
    { label: '', accessor: 'actions' },
];

const Transition = React.forwardRef(function Transition(props, ref) {
    return (
        <Slide
            direction="down"
            ref={ref}
            {...props}
            timeout={{ enter: 500, exit: 300 }} // Adjust the enter and exit times for smoothness
            easing={{
                enter: 'ease-out',  // Smooth slide in
                exit: 'ease-in'      // Smooth slide out
            }}
        />)
});

const UserExamTable = ({ Value }) => {
    const [userExamData, setUserExamData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const { data } = useGetUserExamDataQuery({
        page: page + 1,
        rowsPerPage: rowsPerPage,
        ExamType: (Value === 0 ? "upcoming" : "past"),
        userId: 7,
    });

    useEffect(() => {
        if (data) {
            setUserExamData(data.data);
        }
    }, [data]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };


    const handleReview = (row) => {
        setSelectedRow(row);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedRow(null);
    };



    // Function to combine date and time into a single Date object for proper comparison
    const combineDateAndTime = (date, time) => {
        const [hours, minutes] = time.split(':');
        const [year, month, day] = date.split('-');
        return new Date(year, month - 1, day, hours, minutes); // month-1 since JS Date() months are 0-indexed
    };

    const isButtonEnabled = (examDate, startsAt, endsAt) => {
        const currentTime = new Date(); // Get current time
        const startTime = combineDateAndTime(examDate, startsAt); // Combine date and start time
        const endTime = combineDateAndTime(examDate, endsAt); // Combine date and end time

        // console.log(currentTime, startTime, endTime); // Debug to ensure times are correct
        return currentTime >= startTime && currentTime <= endTime;
        // Check if the current time is between the start and end times
    }


    const renderActions = (row) => {
        const buttonEnabled = isButtonEnabled(row.examDate, row.starts_at, row.ends_at);

        return (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 3 }}>
                {Value === 0 ? (
                    <Box
                        component="a"
                        href={buttonEnabled ? `/user/${7}/exam/${row.id}` : '#'}
                        target={buttonEnabled ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        sx={{
                            display: 'inline-block',
                            textDecoration: 'none',
                            border: '1px solid #f97316',
                            color: buttonEnabled ? '#f97316' : '#ccc',
                            borderRadius: '20px',
                            padding: '8px 16px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            cursor: buttonEnabled ? 'pointer' : 'not-allowed',
                            '&:hover': {
                                backgroundColor: buttonEnabled ? '#f97316' : undefined,
                                color: buttonEnabled ? '#fff' : undefined,
                            },
                        }}
                    >
                        Attempt
                    </Box>
                ) : (
                    <Button
                        variant="text"
                        color="warning"
                        size="small"
                        onClick={() => handleReview(row)}
                        sx={{ color: '#f97316' }}
                    >
                        Review
                    </Button>
                )}
            </Box>
        );
    };


    const renderStatusIcons = (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#777' }}>
            <PendingActionsIcon sx={{ color: '#f97316', fontSize: '18px' }} />
            <Typography variant="body2" sx={{ fontSize: { xs: '11px', sm: '12px', md: '14px', xl: '15px' } }}>
                {`${row.examDate} ${row.starts_at} to ${row.ends_at}`}
            </Typography>
            <AccessTimeIcon sx={{ color: '#f97316', fontSize: '18px' }} />
            <Typography variant="body2">{row.duration}</Typography>
        </Box>
    );

    const renderExamNameWithStatus = (row) => (
        <Box>
            <Typography variant="h6" sx={{ color: '#1e293b', mb: 1, fontSize: { xs: '13px', sm: '15px', md: '17px', xl: '18px' } }}>
                {row.title}
            </Typography>
            <Typography sx={{ color: '#1e293b', mb: { xs: 1, md: 2 }, fontSize: { xs: '12px', sm: '14px', md: '16px', xl: '17px' } }}>
                {row.subjectName}
            </Typography>
            {renderStatusIcons(row)}
        </Box>
    );


    const transformedData = userExamData.map((exam, index) => ({
        index: `${index + 1}.`,
        examNameWithStatus: renderExamNameWithStatus(exam),
        ...exam,
        actions: renderActions(exam),
    }));

    return (
        <Box>
            <CommonTable
                headers={headers}
                data={transformedData}
                totalRecords={data?.totalRecords || 0}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                style={{
                    paper: { boxShadow: 'none' },
                    headerCell: { fontWeight: 'bold', color: '#f97316', backgroundColor: '#fef4e9' },
                    bodyCell: { color: '#333' },
                }}
            />

            {/* Dialog for review with slide transition */}
            <ReviewDialog
                openModal={openModal}
                handleCloseModal={handleCloseModal}
                selectedRow={selectedRow} // Pass the selected row data
            />
        </Box>
    );
};

export default UserExamTable;