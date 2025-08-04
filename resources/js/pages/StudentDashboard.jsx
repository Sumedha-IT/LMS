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
}) => {
 
  return (
      <Paper sx={{ margin: '20px 0', boxShadow: 3, borderRadius: 3, overflow: 'hidden', ...style.paper }}>
          <TableContainer component={Paper} sx={{ overflowX: 'auto', ...style.container }}>
              <Table sx={{ minWidth: 650 }} aria-label="customized table" stickyHeader>
                  <TableHead>
                      <TableRow sx={{ background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)' }}>
                          {headers?.map((header, index) => (
                              <TableCell
                                  key={index}
                                  sx={{
                                      fontWeight: 'bold',
                                      fontSize: '1rem',
                                      background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                      color: '#fff',
                                      borderBottom: '2px solid #e0e0e0',
                                      ...(style.headerCell || {}),
                                  }}
                              >
                                  {header.label}
                              </TableCell>
                          ))}
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {data.length > 0 ? data?.map((row, rowIndex) => (
                          <TableRow
                              key={rowIndex}
                              sx={{
                                  backgroundColor: rowIndex % 2 === 0 ? '#fff' : '#F5FAFF',
                                  transition: 'background-color 0.3s',
                                  '&:hover': {
                                      backgroundColor: '#F0F8FF',
                                  },
                              }}
                          >
                              {headers?.map((header, index) => (
                                  <TableCell
                                      key={index}
                                      sx={{
                                          padding: '12px 20px',
                                          fontSize: '0.98rem',
                                          color: '#333',
                                          borderBottom: '1px solid #e0e0e0',
                                          ...(style.bodyCell || {}),
                                      }}
                                  >
                                      {typeof header.accessor === 'function'
                                          ? header.accessor(row)
                                          : row[header.accessor] || '--'}
                                  </TableCell>
                              ))}
                          </TableRow>
                      )) : (<TableRow>
                          <TableCell colSpan={headers.length} sx={{ textAlign: 'center', padding: '20px' }}>
                              No Data
                          </TableCell>
                      </TableRow>)}
                  </TableBody>
              </Table>
          </TableContainer>

          {/* Pagination Component */}
          {/* Remove the TablePagination component at the bottom of the StudentDashboard table. */}
      </Paper>
  );
}

export default StudentDashboard
