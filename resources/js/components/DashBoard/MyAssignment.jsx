import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function MyAssignment({ assignments = [] }) {
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', borderRadius: 2, boxShadow: 1, p: 2 }}>
        {/* Header */}
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6" sx={{
            fontWeight: 700,
            background: 'linear-gradient(270deg, #0f1f3d 0%, #1e3c72 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.5rem',
            mb: 0
          }}>My Assignments</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{
                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
              }}>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Task</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, textAlign: 'center' }}>Grade</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, textAlign: 'center' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.length > 0 ? (
                assignments.map((topic, topicIndex) => (
                  topic.assignments.map((assignment, index) => (
                    <TableRow
                      key={`${topicIndex}-${index}`}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#F5FAFF',
                        '&:hover': {
                          backgroundColor: index % 2 === 0 ? '#F0F8FF' : '#E6F4FF'
                        }
                      }}
                    >
                      <TableCell sx={{ color: '#495057', fontWeight: 500 }}>
                        {assignment.name || '--'}
                      </TableCell>
                      <TableCell sx={{ color: '#495057', textAlign: 'center', fontWeight: 500 }}>
                        {assignment.marks_scored !== null && assignment.total_marks !== null 
                          ? `${assignment.marks_scored}/${assignment.total_marks}`
                          : '--/--'}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 16px',
                            borderRadius: '16px',
                            fontSize: 13,
                            fontWeight: 600,
                            background: assignment.is_submitted ? '#CAFFE2' : '#FFCACB',
                            color: assignment.is_submitted ? '#137333' : '#B91C1C',
                          }}
                        >
                          {assignment.is_submitted ? 'Completed' : 'Not Completed'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: 'center', color: '#888', py: 3 }}>
                    No assignments available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}