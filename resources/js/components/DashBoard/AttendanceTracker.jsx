"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, ChevronDown, ChevronUp } from "lucide-react"
import { apiRequest } from "../../utils/api"
import MarkAttendanceWidget from "./MarkAttendanceWidget"

export default function AttendanceTracker() {
  const [progress, setProgress] = useState(0)
  const [attendanceData, setAttendanceData] = useState({
    current: 0,
    total: 0,
    percentage: 0
  })
  const [loading, setLoading] = useState(true)
  const [showMarkAttendance, setShowMarkAttendance] = useState(false)

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true)
        // Use a timeout to prevent API request from blocking rendering
        const timeoutId = setTimeout(() => {
          if (loading) {
            // If still loading after 3 seconds, use fallback data
            setAttendanceData({
              current: 200,
              total: 250,
              percentage: 80
            })
            setProgress(80)
            setLoading(false)
          }
        }, 3000)

        // Make the actual API request
        const data = await apiRequest("/attendances", { skipCache: loading })

        // Clear the timeout since we got a response
        clearTimeout(timeoutId)

        // Process the data
        setAttendanceData({
          current: data.Attendance_count || 0,
          total: data.Attendance_count + (data.Attendance_percentage ? (100 / data.Attendance_percentage * data.Attendance_count - data.Attendance_count) : 0),
          percentage: data.Attendance_percentage || 0
        })
        setProgress(data.Attendance_percentage || 0)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching attendance data:', err)
        // Use fallback data if API fails
        setAttendanceData({
          current: 200,
          total: 250,
          percentage: 80
        })
        setProgress(80)
        setLoading(false)
      }
    }

    fetchAttendanceData()
  }, [])

  const toggleMarkAttendance = () => {
    setShowMarkAttendance(!showMarkAttendance)
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-md p-6 w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 font-medium text-lg">My Attendance</h2>
          <button
            onClick={toggleMarkAttendance}
            className="bg-[#E53510] text-white px-3 py-1 rounded-full text-sm flex items-center hover:bg-[#d13010]"
          >
            {showMarkAttendance ? 'Hide Courses' : 'Mark Attendance'}
            {showMarkAttendance ?
              <ChevronUp size={16} className="ml-1" /> :
              <ChevronDown size={16} className="ml-1" />
            }
          </button>
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
                {loading ? "..." : `${Math.round(attendanceData.current)}/${Math.round(attendanceData.total)}`}
              </div>
              <div className="text-sm text-gray-500">Attendance</div>
            </div>
          </div>
        </div>

        {/* Collapsible Mark Attendance Section */}
        {showMarkAttendance && (
          <div className="mt-6 border-t pt-4 animate-fadeIn">
            <div className="bg-gray-50 p-4 rounded-lg">
              <MarkAttendanceWidget />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
