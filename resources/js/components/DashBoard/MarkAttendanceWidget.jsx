"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Check, Clock, BookOpen, Users } from "lucide-react"
import { apiRequest } from "../../utils/api"
import { toast } from "react-toastify"

// Mock data for courses
const MOCK_COURSES = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    instructor: "John Smith",
    time: "09:00 AM - 11:00 AM",
    location: "Room 101",
    isOngoing: true,
    hasMarkedAttendance: false
  },
  {
    id: 2,
    title: "Database Management Systems",
    instructor: "Sarah Johnson",
    time: "01:00 PM - 03:00 PM",
    location: "Room 203",
    isOngoing: false,
    hasMarkedAttendance: true
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    instructor: "Michael Chen",
    time: "03:30 PM - 05:30 PM",
    location: "Design Lab",
    isOngoing: false,
    hasMarkedAttendance: false
  }
];

export default function MarkAttendanceWidget() {
  const [courses, setCourses] = useState(MOCK_COURSES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Initialize with mock data immediately
  useEffect(() => {
    // No need for async/await or loading state for mock data
    setCourses(MOCK_COURSES)
    setLoading(false)

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Function to verify location is within campus boundaries
  const verifyLocation = () => {
    return new Promise((resolve) => {
      // For demo purposes, always return true immediately
      toast.success('Location verified!', { autoClose: 800 });
      resolve(true);

      // In a real implementation, you would use geolocation
      // navigator.geolocation.getCurrentPosition(...)
    });
  };

  // Function to mark attendance
  const markAttendance = async (courseId) => {
    try {
      // First verify the student's location
      const isOnCampus = await verifyLocation();
      if (!isOnCampus) {
        return;
      }

      // In a real implementation, you would call the API
      // await apiRequest('/mark-attendance', {
      //   method: 'POST',
      //   data: {
      //     course_id: courseId,
      //     date: new Date().toISOString().split('T')[0]
      //   }
      // })

      // Update the local state to reflect the change immediately
      setCourses(prevCourses =>
        prevCourses.map(course =>
          course.id === courseId ? { ...course, hasMarkedAttendance: true } : course
        )
      )

      toast.success('Attendance marked successfully!')
    } catch (err) {
      console.error('Error marking attendance:', err)
      toast.error(err.message || 'Failed to mark attendance')
    }
  }



  if (loading) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 font-medium text-lg">My Courses</h2>
        </div>
        <div className="flex justify-center items-center h-24">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 font-medium text-lg">My Courses</h2>
        </div>
        <div className="flex justify-center items-center h-24 text-red-500">
          Error loading courses. Please try again.
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-800 font-medium text-lg">My Courses</h2>
        <div className="text-gray-500 text-sm">
          <Clock size={16} className="inline mr-1" />
          {currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-24 text-gray-500">
          <BookOpen size={24} className="mb-2" />
          <p>No courses found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`border rounded-lg p-3 flex justify-between items-center ${
                course.isOngoing
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex-1">
                <div className="font-medium text-gray-800">{course.title}</div>
                <div className="text-sm text-gray-500">
                  {course.time}
                </div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Users size={12} className="mr-1" /> {course.instructor} • {course.location}
                </div>
              </div>

              {course.hasMarkedAttendance ? (
                <div className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm flex items-center">
                  <Check size={16} className="mr-1" />
                  Marked
                </div>
              ) : (
                <button
                  onClick={() => markAttendance(course.id)}
                  disabled={!course.isOngoing}
                  className={`px-3 py-1 rounded-full text-sm ${
                    course.isOngoing
                      ? 'bg-[#E53510] text-white hover:bg-[#d13010]'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Mark Attendance
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
