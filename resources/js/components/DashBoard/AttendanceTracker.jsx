"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, ArrowRight } from "lucide-react"
import { apiRequest } from "../../utils/api"
import { useNavigate } from "react-router-dom"

export default function AttendanceTracker() {
  const [progress, setProgress] = useState(0)
  const [attendanceData, setAttendanceData] = useState({
    current: 0,
    total: 0,
    percentage: 0
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true)
        // Use the student attendance report API which has the correct attendance calculation
        const data = await apiRequest("/student-attendance/report?filter_type=all", { skipCache: true })

        // Check if we have attendance data
        if (data) {
          // Calculate the correct attendance percentage from the report
          const presentDays = data.present_days || 0
          const totalDays = data.total_days || 0
          const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

          // Set the attendance data from the API response
          setAttendanceData({
            current: presentDays,
            total: totalDays,
            percentage: attendancePercentage
          })
          setProgress(attendancePercentage)
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching attendance data:', err)
        // Set default values in case of error
        setAttendanceData({
          current: 0,
          total: 0,
          percentage: 0
        })
        setProgress(0)
        setLoading(false)
      }
    }

    fetchAttendanceData()
  }, [])

  const handleViewDetails = () => {
    navigate('/student/attendance')
  }

  return (
    <div className="w-full h-full bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Attendance</h2>
        <button
          onClick={handleViewDetails}
          className="flex items-center text-[#E53510] hover:text-[#d32f2f] transition-colors"
        >
          View Details
          <ArrowRight className="ml-1" size={16} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E53510]"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="text-[#E53510]" size={20} />
              <span className="text-gray-600">Current Attendance</span>
            </div>
            <span className="text-lg font-semibold text-gray-800">
              {attendanceData.percentage}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              className="bg-[#E53510] h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <span>{attendanceData.current} days present</span>
            <span>out of {attendanceData.total} days</span>
          </div>
        </div>
      )}
    </div>
  )
}
