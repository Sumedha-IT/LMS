
// import React from 'react';
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
    style,
    onMarksListClick,
    onViewAttendanceClick,
    onAddClick,
    addedBanks,
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
                                <TableCell
                                    key={index}
                                    sx={{
                                        fontWeight: 'bold',
                                        ...(style.headerCell || {}),
                                    }}
                                >
                                    {header.label}
                                </TableCell>
                            ))}
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
                                        backgroundColor: '#f0f0f0', // Change background on hover
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
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                sx={{ marginRight: 1 }}
                                                onClick={() => onMarksListClick(row)}
                                            >
                                                Marks List
                                            </Button>
                                        )}
                                        {onViewAttendanceClick && (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                sx={{ marginLeft: 1 }}
                                                onClick={() => onViewAttendanceClick(row)}
                                            >
                                                View Attendance
                                            </Button>
                                        )}
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination Component */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={totalRecords}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
                sx={{ ...style.pagination }}
            />
        </Paper>
    );
};

// Define prop types
CommonTable.propTypes = {
    headers: PropTypes.arrayOf(
        PropTypes.shape({
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
};

// Default props
CommonTable.defaultProps = {
    style: {
        container: {},
        paper: {},
        headerCell: {
            backgroundColor: '#f5f5f5',
            color: '#333',
            fontWeight: 'bold',
        },
        bodyCell: {
            // backgroundColor: '#fff',
            color: '#333',
        },
        pagination: {
            backgroundColor: '#f5f5f5',
        },
    },
    onMarksListClick: null,
    onViewAttendanceClick: null,
    onAddClick: null,
    addedBanks: [],
};

export default CommonTable;