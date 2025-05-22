import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography
} from '@mui/material';

export default function MyAssignment({ assignments = [] }) {
  const sampleAssignments = [
    { task: "Physics Chapter", grade: "--/100", completed: false },
    { task: "Maths Chapter", grade: "80/100", completed: true },
    { task: "Chemistry Chapter", grade: "75/100", completed: true }
  ];

  const data = assignments.length > 0 ? assignments : sampleAssignments;
  const [Assignment, setAssignment] = useState([]);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const data = await apiRequest("/getUserAssignments");
        setAssignment(data.data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };
    fetchAssignment();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', borderRadius: 2, boxShadow: 1, p: 2 }}>
        {/* Header */}
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#404040' }}>My Assignments</Typography>
          <a href="#" className="text-sm text-red-500 hover:text-red-600 transition-colors">
            View More
          </a>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#E84C0F' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Task</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, textAlign: 'center' }}>Grade</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, textAlign: 'center' }}>Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(Assignment.length > 0 ? Assignment : data).map((assignment, index) => {
                // Support both API and sample data
                const name = assignment.assignments?.[0]?.name || assignment.task || '--';
                const marks_scored = assignment.assignments?.[0]?.marks_scored;
                const total_marks = assignment.assignments?.[0]?.total_marks;
                const grade = marks_scored !== undefined && total_marks !== undefined ? `${marks_scored}/${total_marks}` : assignment.grade || '--';
                const completed = assignment.assignments?.[0]?.completed ?? assignment.completed;
                return (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#FFF0EE' : '#E8F4FF',
                      '&:hover': {
                        backgroundColor: index % 2 === 0 ? '#FFE4E0' : '#D4E8FF'
                      }
                    }}
                  >
                    <TableCell sx={{ color: '#495057', fontWeight: 500 }}>{name}</TableCell>
                    <TableCell sx={{ color: '#495057', textAlign: 'center', fontWeight: 500 }}>{grade}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 16px',
                          borderRadius: '16px',
                          fontSize: 13,
                          fontWeight: 600,
                          background: completed ? '#CAFFE2' : '#FFCACB',
                          color: completed ? '#137333' : '#B91C1C',
                        }}
                      >
                        {completed ? 'Completed' : 'Not Completed'}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
              {(Assignment.length === 0 && data.length === 0) && (
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