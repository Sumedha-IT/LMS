import React from 'react'
import MarkAttendanceWidget from '../components/DashBoard/MarkAttendanceWidget'
import { Box, Typography } from '@mui/material'

const MarkAttendancePage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
        Mark Your Attendance
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        You can mark your attendance for today's classes below. Attendance can only be marked during the scheduled class time.
      </Typography>
      
      <MarkAttendanceWidget />
    </Box>
  )
}

export default MarkAttendancePage
