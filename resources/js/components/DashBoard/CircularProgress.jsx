"use client";

import { useEffect, useState } from "react";

export default function CircularProgress({
  value = 4,
  max = 10,
  label = "Total Assignments",
  size = 200,
  strokeWidth = 12,
  showPercentage = false, // New prop to toggle between percentage and min/max
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
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#ffffff"
          strokeOpacity="0.2"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#ff3e1d"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out",
          }}
        />
      </svg>

      {/* Text in the center */}
      <div className="absolute flex flex-col items-center justify-center text-white">
        <span className="text-3xl font-bold">
          {showPercentage ? `${Math.round(progress)}%` : `${value}/${max}`}
        </span>
        <span className="text-sm mt-1">{label}</span>
      </div>
    </div>
  );
}
