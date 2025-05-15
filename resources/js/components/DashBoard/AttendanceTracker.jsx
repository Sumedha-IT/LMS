"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User } from "lucide-react"
import { apiRequest } from "../../utils/api"

export default function AttendanceTracker() {
  const [progress, setProgress] = useState(0)
  const [attendanceData, setAttendanceData] = useState({
    current: 0,
    total: 0,
    percentage: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true)
        const data = await apiRequest("/attendances", { skipCache: loading })

        setAttendanceData({
          current: data.Attendance_count || 0,
          total: data.Attendance_count + (data.Attendance_percentage ? (100 / data.Attendance_percentage * data.Attendance_count - data.Attendance_count) : 0),
          percentage: data.Attendance_percentage || 0
        })
        setProgress(data.Attendance_percentage || 0)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching attendance data:', err)
        setLoading(false)
      }
    }

    fetchAttendanceData()
  }, [])

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-md p-6 w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 font-medium text-lg">My Attendance</h2>
        </div>

        <div className="relative flex justify-center items-center">
          <div className="relative w-48 h-48">
            <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f1f1" strokeWidth="10" />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#FF3B30"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="283"
                initial={{ strokeDasharray: "0 283" }}
                animate={{ strokeDasharray: `${progress * 2.83} 283` }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <div className="text-red-500 mb-1 bg-[#E53510] bg-opacity-5 rounded-full p-2">
                <User size={20} className="fill-current" />
              </div>
              <div className="text-3xl font-bold text-gray-800">
                {loading ? "..." : `${Math.round(attendanceData.percentage)}%`}
              </div>
              <div className="text-sm text-gray-500">Attendance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
