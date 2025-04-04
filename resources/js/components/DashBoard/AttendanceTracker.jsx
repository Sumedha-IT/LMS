"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User } from "lucide-react"

export default function AttendanceTracker() {
  const [progress, setProgress] = useState(0)
  const current = 100
  const total = 250
  const percentage = (current / total) * 100

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage)
    }, 100)
    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-xs">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 font-medium text-lg">My Attendance</h2>
          <a href="#" className="text-red-500 text-sm font-medium">
            View More
          </a>
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
                {current}/{total}
              </div>
              <div className="text-sm text-gray-500">Attendance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
