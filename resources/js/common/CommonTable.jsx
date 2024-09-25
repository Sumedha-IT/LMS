// import React from 'react';
import React, { useState } from 'react';
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
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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
    onEditClick = null,
    addedBanks = [],
    totalRecords,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
}) => {
    // State for the dropdown menu
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const open = Boolean(anchorEl);

    // Handle dropdown open and close
    const handleMenuOpen = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setCurrentRow(null);
    };

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
                            {(onMarksListClick || onViewAttendanceClick || onAddClick || onEditClick) && (
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', ...(style.headerCell || {}) }}>
                                    Actions
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length > 0 ? data?.map((row, rowIndex) => (
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

                                {(onMarksListClick || onViewAttendanceClick || onAddClick || onEditClick) && (
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        {/* Marks List and View Attendance Buttons */}
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

                                        {/* Dropdown Menu */}
                                        {onEditClick && (
                                            <>
                                                <IconButton
                                                    aria-label="more"
                                                    aria-controls="long-menu"
                                                    aria-haspopup="true"
                                                    onClick={(event) => handleMenuOpen(event, row)}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={open}
                                                    onClose={handleMenuClose}
                                                    PaperProps={{
                                                        style: {
                                                            maxHeight: 48 * 4.5,
                                                            width: '20ch',
                                                            boxShadow: 'rgba(0, 0, 0, 0.20) 0px 2px 4px', // Light shadow
                                                            borderRadius: '8px', // Optional: Soften the corners
                                                        },
                                                    }}
                                                >
                                                    <MenuItem onClick={() => { onEditClick(currentRow.id); handleMenuClose(); }}>
                                                        Edit
                                                    </MenuItem>
                                                    {/* <MenuItem onClick={() => { onViewAttendanceClick(currentRow); handleMenuClose(); }}>
                                                        View Attendance
                                                    </MenuItem>
                                                    <MenuItem onClick={() => { handleMenuClose(); }}>
                                                        Question Paper
                                                    </MenuItem>
                                                    <MenuItem onClick={() => { handleMenuClose(); }}>
                                                        Add To Calendar
                                                    </MenuItem> */}
                                                </Menu>
                                            </>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        )) : (<TableRow>
                            <TableCell colSpan={headers.length + 1} sx={{ textAlign: 'center', padding: '20px' }}>
                                No Data
                            </TableCell>
                        </TableRow>)}
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
    onEditClick: PropTypes.func, // Added for dropdown
    addedBanks: PropTypes.array,
    style: PropTypes.object, // Custom styles for the table
};

// Default props
// CommonTable.defaultProps = {
//     style: {
//         container: {},
//         paper: {},
//         headerCell: {
//             backgroundColor: '#f5f5f5',
//             color: '#333',
//             fontWeight: 'bold',
//         },
//         bodyCell: {
//             color: '#333',
//         },
//         pagination: {
//             backgroundColor: '#f5f5f5',
//         },
//     },
//     onMarksListClick: null,
//     onViewAttendanceClick: null,
//     onAddClick: null,
//     onEditClick: null, // Default to null so dropdown is optional
//     addedBanks: [],
// };

export default CommonTable;
