import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "./Ui/Card";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
export default function PerformanceChart({ examChartData,UserData }) {
  const [highlightedMonth, setHighlightedMonth] = useState(5); // June (0-indexed)
  const [isVisible, setIsVisible] = useState(false);

    // Hook for navigation
    const navigate = useNavigate();
  // Transform API data into the required format
  const transformApiData = (apiData) => {
    if (!apiData || !apiData.data) return [];

    return apiData.data.map((item) => {
      // Calculate percentage
      const obtained = item.obtained_marks < 0 ? 0 : item.obtained_marks; // Consider negative values as 0
      const percentage = ((obtained / item.max_marks) * 100).toFixed(2); // Convert to percentage with 2 decimal places

      // Extract subject name from the first curriculum (if available)
      // const subject = item.curriculums.length > 0 ? item.curriculums[0].name : "Unknown Subject";
      const subject = item.title ? item.title : "Unknown Subject";

      // Extract month from the day (assuming "day" is in the format "Wednesday")
      const month = item.day; // Use the day directly as the month (or map it to a month if needed)

      const ID = item.id; //
      return {
        id: ID,
        month: month,
        subject: subject,
        obtained: parseFloat(percentage), // Convert percentage back to a number
        maximum: 100, // Since percentage is out of 100
      };
    });
  };

  // Transform the examChartData prop
  const performanceData = transformApiData(examChartData);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
  }, []);

  if (!examChartData) {
    return <div>Loading chart data...</div>;
  }

  return (
    <div className="min-w-4xl bg-white shadow-xl rounded-lg mx-auto p-4 pr-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-6">
          <motion.h2
            className="text-2xl font-medium text-gray-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Exam Performance
          </motion.h2>
        </div>
        <Card className="w-full m-2 p-6">
          <motion.div
            className="flex items-center gap-8 mb-6 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#E53510] opacity-25"></div>
              <span className="text-sm text-gray-500">Maximum Marks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#E53510]"></div>
              <span className="text-sm text-gray-500">Obtained Marks</span>
            </div>
          </motion.div>

          <div className="relative mt-10 overflow-x-auto">
            <BarChart
            User={UserData}
              data={performanceData}
              highlightedMonth={highlightedMonth}
              setHighlightedMonth={setHighlightedMonth}
              isVisible={isVisible}
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

const handleClick = () => {
  const path = `/administrator/1/examinations/user/${UserData.user.id}/exam/${item.id}/review`;
  alert(path); // For testing
  navigate(path); // If using React Router
};


function BarChart({ data, highlightedMonth, setHighlightedMonth, isVisible,User }) {
  // Calculate dimensions
  const chartHeight = 260;
  const barWidth = 30;
  const barGap = 70;
  const maxValue = 100;

  // Generate line points for the trend line
  const linePoints = data
    .map((item, index) => {
      const x = index * barGap + barWidth / 2;
      const y = chartHeight - (item.obtained / maxValue) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="relative" style={{ height: `${chartHeight + 100}px` }}>
      {/* Y-axis labels */}
      <motion.div
        className="absolute w-10 left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map((value) => (
          <div
            key={value}
            style={{ top: `${chartHeight - (value / maxValue) * chartHeight}px` }}
            className="absolute"
          >
            {value}
          </div>
        ))}
      </motion.div>

      {/* Chart area */}
      <div className="relative ml-12" style={{ height: `${chartHeight}px`, minWidth: `${data.length * barGap}px` }}>
        {/* Bars */}
        {data.map((item, index) => (
          <a 
          
          href={`/administrator/1/examinations/user/${User.user.id}/exam/${item.id}/review`}
          
            key={index}
            className={`absolute cursor-pointer  bottom-0 flex flex-col items-center ${index !== 0 ? "ml-10" : ""}`}
            style={{ left: `${index * barGap}px` }}
            onMouseEnter={() => setHighlightedMonth(index)}
          >

            {/* Maximum marks bar */}
            <motion.div
           
     
           
              className="w-6 bg-[#E53510] opacity-25 rounded-[49px]"
              style={{
                height: isVisible ? `${(item.maximum / maxValue) * chartHeight}px` : 0,
                originY: "bottom",
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.8 + index * 0.05,
                ease: "easeOut",
              }}
            />

            {/* Obtained marks bar */}
            <motion.div
              className="absolute bottom-0 w-6 bg-[#E53510] rounded-[49px]"
              style={{
                height: isVisible ? `${(item.obtained / maxValue) * chartHeight}px` : 0,
                originY: "bottom",
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: 0.5,
                delay: 1 + index * 0.05,
                ease: "easeOut",
              }}
            />

            {/* Tooltip for highlighted month */}
            {index === highlightedMonth && (
              <motion.div
                className="absolute -top-0 bg-white rounded-md shadow-md p-2 text-center w-24 z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-xs text-gray-500">Obtained Marks Percentage</div>
                <div className="text-red-500 bg-[#FFEFEC] rounded-md font-bold">
                  {item.obtained}/{item.maximum}
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45 shadow-b"></div>
              </motion.div>
            )}

            {/* Month and subject labels */}
            <motion.div
              className="absolute border-t-2 border-dotted top-full w-20 mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.05 }}
            >
              <div className="text-xs text-gray-500 ">{item.month}</div>
              <div className="text-xs font-medium ">{item.subject}</div>
            </motion.div>
          </a>
        ))}
      </div>
    </div>
  );
}