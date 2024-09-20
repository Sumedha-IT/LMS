import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip, useMediaQuery, TablePagination
} from '@mui/material';
import { useTheme } from '@mui/system';

const CommonTable = ({ headers = [], data = [], style = {} }) => {
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
                                <TableCell
                                    key={index}
                                    sx={{
                                        fontWeight: 'bold',
                                        ...(isMobile && { fontSize: '12px' }),  // Adjust font size for mobile
                                    }}
                                    style={style.headerCell}
                                >
                                    {header.label}
                                </TableCell>
                            ))}
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
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                sx={{
                                                    marginRight: 1,
                                                    padding: isMobile ? '2px 5px' : '5px 10px',
                                                    fontSize: isMobile ? '10px' : 'inherit',
                                                }}
                                                onClick={() => row.onMarksListClick(row)}
                                            >
                                                Marks List
                                            </Button>
                                        )}
                                        {row.onViewAttendanceClick && (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                sx={{
                                                    marginLeft: 1,
                                                    padding: isMobile ? '2px 5px' : '5px 10px',
                                                    fontSize: isMobile ? '10px' : 'inherit',
                                                }}
                                                onClick={() => row.onViewAttendanceClick(row)}
                                            >
                                                View Attendance
                                            </Button>
                                        )}
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination Component */}
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

// Define prop types
CommonTable.propTypes = {
    headers: PropTypes.arrayOf(
        PropTypes.shape({
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

export default CommonTable;
