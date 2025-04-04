"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CircularProgress({
  value = 4,
  max = 10,
  label = "Total Assignments",
  size = 200,
  strokeWidth = 12,
  showPercentage = false,
}) {
  const [progress, setProgress] = useState(0);

  // Calculate the progress percentage
  const percentage = (value / max) * 100;

  // Calculate the circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Center position
  const center = size / 2;

  useEffect(() => {
    // Animate the progress
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#FFFFFF"
          // strokeOpacity="0.2"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle with animation */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#E53510"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>

      {/* Text in the center */}
      <div className="absolute flex flex-col items-center justify-center text-white">
        <motion.span
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {showPercentage ? `${Math.round(progress)}%` : `${value}/${max}`}
        </motion.span>
        <motion.span
          className="text-sm mt-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {label}
        </motion.span>
      </div>
    </motion.div>
  );
}