import React,{useState} from 'react'
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

const StudentDashboard = ({
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
  totalRecords,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onFullPersonalDetailsClick,
  onViewJobsClick
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
                            {(onFullPersonalDetailsClick || onViewJobsClick) && (
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', ...(style.headerCell || {}) }}>
                                    Personal Infomation
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
                               {(onFullPersonalDetailsClick || onViewJobsClick) && (
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        {/* Marks List and View Attendance Buttons */}
                                        {onFullPersonalDetailsClick && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                sx={{ marginRight: 1 }}
                                                onClick={() => console.log("hi")}
                                            >
                                               Personal Details
                                            </Button>
                                        )}
                                        {onViewJobsClick && (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                sx={{ marginLeft: 1 }}
                                                onClick={() =>  console.log("hi")}
                                            >
                                               Job Match
                                            </Button>
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
}

export default StudentDashboard
