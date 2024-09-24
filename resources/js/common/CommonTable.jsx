<<<<<<< Updated upstream
// import React, { useState } from 'react';
// import PropTypes from 'prop-types';
// import {
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip, useMediaQuery, TablePagination
// } from '@mui/material';
// import { useTheme } from '@mui/system';

// const CommonTable = ({ headers, data, style }) => {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen size is mobile

//     // Pagination states
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);

//     // Handle page change
//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     // Handle rows per page change
//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0); // Reset to first page
//     };

//     // Slice data according to pagination
//     const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//     return (
//         <Paper>
//             <TableContainer component={Paper} sx={{ overflowX: 'auto' }} style={style.container}>
//                 <Table sx={{ minWidth: 650 }} aria-label="customized table">
//                     {/* Table Head */}
//                     <TableHead>
//                         <TableRow>
//                             {headers.map((header, index) => (
//                                 <TableCell
//                                     key={index}
//                                     sx={{
//                                         fontWeight: 'bold',
//                                         ...(isMobile && { fontSize: '12px' }),  // Adjust font size for mobile
//                                     }}
//                                     style={style.headerCell}
//                                 >
//                                     {header}
//                                 </TableCell>
//                             ))}
//                         </TableRow>
//                     </TableHead>

//                     {/* Table Body */}
//                     <TableBody>
//                         {paginatedData.map((row, index) => (
//                             <TableRow key={index} hover>
//                                 <TableCell sx={{ fontSize: isMobile ? '12px' : 'inherit' }}>{index + 1 + page * rowsPerPage}</TableCell>
//                                 <TableCell sx={{ fontSize: isMobile ? '12px' : 'inherit' }}>
//                                     <strong>{row.examDate}</strong><br />
//                                     {row.time}
//                                 </TableCell>
//                                 <TableCell sx={{ fontSize: isMobile ? '12px' : 'inherit' }}>
//                                     <strong>{row.examName}</strong><br />
//                                     {row.subExamName}
//                                 </TableCell>
//                                 <TableCell sx={{ fontSize: isMobile ? '12px' : 'inherit' }}>
//                                     <strong>{row.batchName}</strong><br />
//                                     {row.batchSubName}
//                                 </TableCell>
//                                 <TableCell sx={{ fontSize: isMobile ? '12px' : 'inherit' }}>{row.totalMarks}</TableCell>
//                                 {row.status && (
//                                     <TableCell>
//                                         <Chip
//                                             label={row.status}
//                                             color={row.status === 'Signed In' ? 'success' : 'warning'}
//                                             sx={{ marginBottom: '5px', fontSize: isMobile ? '10px' : 'inherit' }}
//                                         />
//                                         <br />
//                                         <small style={{ fontSize: isMobile ? '10px' : 'inherit' }}>{row.signInTime}</small>
//                                     </TableCell>
//                                 )}

//                                 {row.attendance && (
//                                     <TableCell sx={{ fontSize: isMobile ? '12px' : 'inherit' }}>
//                                         {row.attendance}/{row.totalAttendance}<br />
//                                         <span style={{ color: row.attendanceColor }}>{row.attendancePercentage}%</span>
//                                     </TableCell>
//                                 )}
//                                 <TableCell>
//                                     {/* Conditionally show Marks List button if `onMarksListClick` exists */}
//                                     {row.onMarksListClick && (
//                                         <Button
//                                             variant="contained"
//                                             color="primary"
//                                             size="small"
//                                             sx={{
//                                                 marginLeft: '10px',
//                                                 marginBottom: isMobile ? '10px' : "",
//                                                 padding: isMobile ? '2px 5px' : '5px 10px',  // Adjust padding for mobile
//                                                 fontSize: isMobile ? '10px' : 'inherit',      // Smaller font on mobile
//                                             }}
//                                             onClick={() => row.onMarksListClick(row)}
//                                         >
//                                             Marks List
//                                         </Button>
//                                     )}

//                                     {/* Conditionally show View Attendance button if `onViewAttendanceClick` exists */}
//                                     {row.onViewAttendanceClick && (
//                                         <Button
//                                             variant="contained"
//                                             color="secondary"
//                                             size="small"
//                                             sx={{
//                                                 marginLeft: '10px',
//                                                 padding: isMobile ? '2px 5px' : '5px 10px',  // Adjust padding for mobile
//                                                 fontSize: isMobile ? '10px' : 'inherit',      // Smaller font on mobile
//                                             }}
//                                             onClick={() => row.onViewAttendanceClick(row)}
//                                         >
//                                             View Attendance
//                                         </Button>
//                                     )}

//                                     {/* Conditionally show Add Button if `onAddClick` exists */}
//                                     {row.onAddClick && (
//                                         <Button
//                                             variant="contained"
//                                             color="success"
//                                             size="small"
//                                             sx={{
//                                                 marginLeft: '10px',
//                                                 padding: isMobile ? '2px 5px' : '5px 10px',  // Adjust padding for mobile
//                                                 fontSize: isMobile ? '10px' : 'inherit',      // Smaller font on mobile
//                                             }}
//                                             onClick={() => row.onAddClick(row)}
//                                         >
//                                             Add
//                                         </Button>
//                                     )}
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             {/* Pagination Component */}
//             <TablePagination
//                 rowsPerPageOptions={[10, 25, 50]}
//                 component="div"
//                 count={data.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//         </Paper>
//     );
// };

// // Define prop types
// CommonTable.propTypes = {
//     headers: PropTypes.arrayOf(PropTypes.string).isRequired,
//     data: PropTypes.arrayOf(
//         PropTypes.shape({
//             examDate: PropTypes.string.isRequired,
//             time: PropTypes.string.isRequired,
//             examName: PropTypes.string.isRequired,
//             subExamName: PropTypes.string,
//             batchName: PropTypes.string.isRequired,
//             batchSubName: PropTypes.string,
//             totalMarks: PropTypes.number.isRequired,
//             status: PropTypes.string.isRequired,
//             signInTime: PropTypes.string,
//             attendance: PropTypes.number.isRequired,
//             totalAttendance: PropTypes.number.isRequired,
//             attendancePercentage: PropTypes.number.isRequired,
//             attendanceColor: PropTypes.string.isRequired,
//             onMarksListClick: PropTypes.func,  // Optional, for Marks List button
//             onViewAttendanceClick: PropTypes.func,  // Optional, for View Attendance button
//             onAddClick: PropTypes.func,  // Optional, for Add button
//         })
//     ).isRequired,
//     style: PropTypes.shape({
//         container: PropTypes.object,
//         headerCell: PropTypes.object,
//         button: PropTypes.object,
//     })
// };

// CommonTable.defaultProps = {
//     style: {
//         container: { margin: '20px 0' },
//         headerCell: { fontWeight: 'bold' },
//         button: { padding: '5px 10px' },
//     },
// };

// export default CommonTable;




import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip, useMediaQuery, TablePagination
} from '@mui/material';
import { useTheme } from '@mui/system';

const CommonTable = ({ headers, data, style }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen size is mobile

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page
    };

    // Slice data according to pagination
    const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper>
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }} style={style.container}>
                <Table sx={{ minWidth: 650 }} aria-label="customized table">
                    {/* Table Head */}
                    <TableHead>
                        <TableRow>
                            {headers.map((header, index) => (
=======
import React from 'react';
import PropTypes from 'prop-types';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TablePagination,
} from '@mui/material';

const CommonTable = ({
    headers,
    data,
    style = {
        container: {},
        paper: {},
        headerCell: {
            backgroundColor: '#f5f5f5',
            color: '#333',
            fontWeight: 'bold',
        },
        bodyCell: {
            color: '#333',
        },
        pagination: {
            backgroundColor: '#f5f5f5',
        },
    },
    onMarksListClick = null,
    onViewAttendanceClick = null,
    onAddClick = null,
    addedBanks = [],
    totalRecords,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
}) => {
    return (
        <Paper sx={{ margin: '20px 0', boxShadow: 'none', ...style.paper }}>
            <TableContainer component={Paper} sx={{ overflowX: 'auto', ...style.container }}>
                <Table sx={{ minWidth: 650 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {headers?.map((header, index) => (
>>>>>>> Stashed changes
                                <TableCell
                                    key={index}
                                    sx={{
                                        fontWeight: 'bold',
<<<<<<< Updated upstream
                                        ...(isMobile && { fontSize: '12px' }),  // Adjust font size for mobile
                                    }}
                                    style={style.headerCell}
=======
                                        ...(style.headerCell || {}),
                                    }}
>>>>>>> Stashed changes
                                >
                                    {header.label}
                                </TableCell>
                            ))}
<<<<<<< Updated upstream
                            {/* Conditionally render the "Actions" column if any row has action buttons */}
                            {data.some(row => row.onMarksListClick || row.onViewAttendanceClick || row.onAddClick) && (
                                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            )}
                        </TableRow>
                    </TableHead>

                    {/* Table Body */}
                    <TableBody>
                        {paginatedData.map((row, rowIndex) => (
                            <TableRow key={rowIndex} hover>
                                {headers.map((header, index) => (
                                    <TableCell
                                        key={index}
                                        sx={{ fontSize: isMobile ? '12px' : 'inherit', padding: '8px 16px' }}
                                    >
                                        {header.accessor === 'status' ? (
                                            <>
                                                <Chip
                                                    label={row.status}
                                                    color={row.status === 'Signed In' ? 'success' : 'warning'}
                                                    sx={{ marginBottom: '5px', fontSize: isMobile ? '10px' : 'inherit' }}
                                                />
                                                <br />
                                                <small style={{ fontSize: isMobile ? '10px' : 'inherit' }}>
                                                    {row.signInTime}
                                                </small>
                                            </>
                                        ) : (
                                            row[header.accessor] || '--'  // Render default cell content
                                        )}
                                    </TableCell>
                                ))}

                                {row.onMarksListClick || row.onViewAttendanceClick || row.onAddClick ? (
                                    <TableCell>
                                        {row.onMarksListClick && (
=======
                            {(onMarksListClick || onViewAttendanceClick || onAddClick) && (
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', ...(style.headerCell || {}) }}>
                                    Actions
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((row, rowIndex) => (
                            <TableRow
                                key={rowIndex}
                                sx={{
                                    transition: 'background-color 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: '#f0f0f0',
                                    },
                                }}
                            >
                                {headers?.map((header, index) => (
                                    <TableCell
                                        key={index}
                                        sx={{
                                            padding: '8px 16px',
                                            ...(style.bodyCell || {}),
                                        }}
                                    >
                                        {typeof header.accessor === 'function'
                                            ? header.accessor(row)
                                            : row[header.accessor] || '--'}
                                    </TableCell>
                                ))}

                                {(onMarksListClick || onViewAttendanceClick || onAddClick) && (
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        {onMarksListClick && (
>>>>>>> Stashed changes
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
<<<<<<< Updated upstream
                                                sx={{
                                                    marginRight: 1,
                                                    padding: isMobile ? '2px 5px' : '5px 10px',
                                                    fontSize: isMobile ? '10px' : 'inherit',
                                                }}
                                                onClick={() => row.onMarksListClick(row)}
=======
                                                sx={{ marginRight: 1 }}
                                                onClick={() => onMarksListClick(row)}
>>>>>>> Stashed changes
                                            >
                                                Marks List
                                            </Button>
                                        )}
<<<<<<< Updated upstream
                                        {row.onViewAttendanceClick && (
=======
                                        {onViewAttendanceClick && (
>>>>>>> Stashed changes
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
<<<<<<< Updated upstream
                                                sx={{
                                                    marginLeft: 1,
                                                    padding: isMobile ? '2px 5px' : '5px 10px',
                                                    fontSize: isMobile ? '10px' : 'inherit',
                                                }}
                                                onClick={() => row.onViewAttendanceClick(row)}
=======
                                                sx={{ marginLeft: 1 }}
                                                onClick={() => onViewAttendanceClick(row)}
>>>>>>> Stashed changes
                                            >
                                                View Attendance
                                            </Button>
                                        )}
<<<<<<< Updated upstream
                                        {row.onAddClick && (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                sx={{
                                                    marginLeft: 1,
                                                    padding: isMobile ? '2px 5px' : '5px 10px',
                                                    fontSize: isMobile ? '10px' : 'inherit',
                                                }}
                                                onClick={() => row.onAddClick(row)}
                                            >
                                                Add
                                            </Button>
                                        )}
                                    </TableCell>
                                ) : null}
=======
                                        {onAddClick && (
                                            <Button
                                                variant="contained"
                                                color={addedBanks.includes(row.id) ? 'success' : 'primary'}
                                                size="small"
                                                sx={{ marginLeft: 1 }}
                                                disabled={addedBanks.includes(row.id)}
                                                onClick={() => onAddClick(row)}
                                            >
                                                {addedBanks.includes(row.id) ? 'Added' : 'Add'}
                                            </Button>
                                        )}
                                    </TableCell>
                                )}
>>>>>>> Stashed changes
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination Component */}
            <TablePagination
<<<<<<< Updated upstream
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
=======
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={totalRecords}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
                sx={{ ...style.pagination }}
>>>>>>> Stashed changes
            />
        </Paper>
    );
};

// Define prop types
CommonTable.propTypes = {
    headers: PropTypes.arrayOf(
        PropTypes.shape({
<<<<<<< Updated upstream
            label: PropTypes.string.isRequired,  // Header label for the table column
            accessor: PropTypes.string.isRequired, // The field name to access the value from data
        })
    ).isRequired,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            // Dynamically passed data fields via accessor
            // onMarksListClick: PropTypes.func,  // Optional, for Marks List button
            // onViewAttendanceClick: PropTypes.func,  // Optional, for View Attendance button
            // onAddClick: PropTypes.func,  // Optional, for Add button
        })
    ).isRequired,
    style: PropTypes.shape({
        container: PropTypes.object,
        headerCell: PropTypes.object,
        button: PropTypes.object,
    }),
};

CommonTable.defaultProps = {
    style: {
        container: { margin: '20px 0' },
        headerCell: { fontWeight: 'bold' },
        button: { padding: '5px 10px' },
    },
=======
            label: PropTypes.string.isRequired,
            accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
        })
    ).isRequired,
    data: PropTypes.array.isRequired,
    totalRecords: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onRowsPerPageChange: PropTypes.func.isRequired,
    onMarksListClick: PropTypes.func,
    onViewAttendanceClick: PropTypes.func,
    onAddClick: PropTypes.func,
    addedBanks: PropTypes.array,
    style: PropTypes.object, // Custom styles for the table
>>>>>>> Stashed changes
};

export default CommonTable;
