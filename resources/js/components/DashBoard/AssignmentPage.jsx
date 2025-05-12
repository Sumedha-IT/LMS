import React, { useState } from 'react';
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Link
} from '@mui/material';

const AssignmentPage = ({ apiData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Flatten all assignments with their topic names
  const allAssignments = apiData.flatMap(topic =>
    topic.assignments.map(assignment => ({
      ...assignment,
      topicName: topic.topic_name
    }))
  );

  const filteredAssignments = allAssignments.filter(assignment =>
    assignment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isImageFile = (fileName) => {
    return /\.(png|jpg|jpeg|gif|webp)$/i.test(fileName);
  };

  return (
    <div style={{ padding: '20px' }}>
      <TextField
        label="Search by Assignment Name"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper} style={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="assignments table">
        <TableHead>
  <TableRow>
    <TableCell sx={{ backgroundColor: '#E53510', color: 'white' }}>Topic Name</TableCell>
    <TableCell sx={{ backgroundColor: '#E53510', color: 'white' }}>Assignment Name</TableCell>
    <TableCell sx={{ backgroundColor: '#E53510', color: 'white' }}>Description</TableCell>
    <TableCell sx={{ backgroundColor: '#E53510', color: 'white' }}>File</TableCell>
    <TableCell sx={{ backgroundColor: '#E53510', color: 'white' }}>Status</TableCell>
  </TableRow>
</TableHead>
          <TableBody>
            {filteredAssignments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.topicName}</TableCell>
                  <TableCell>{assignment.name}</TableCell>
                  <TableCell>{assignment.description}</TableCell>
                  <TableCell>
                    {assignment.file && (
                      isImageFile(assignment.file) ? (
                        <img
                          src={assignment.file}
                          alt={assignment.name}
                          style={{ maxWidth: 100, maxHeight: 100 }}
                        />
                      ) : (
                        <Link href={assignment.file} target="_blank" rel="noopener">
                          Download File
                        </Link>
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    {assignment.is_submitted ? 'Submitted' : 'Not Submitted'}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAssignments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default AssignmentPage;