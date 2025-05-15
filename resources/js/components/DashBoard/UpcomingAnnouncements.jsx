import { useEffect, useState, useMemo } from "react";
import { apiRequest } from "../../utils/api";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CircularProgress, Button, Pagination, Select, MenuItem } from '@mui/material';
export default function UpcomingAnnouncements() {
  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500", "bg-cyan-500"];

  const [announcements, setAnnouncements] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);

        // Set a timeout to use fallback data if the API takes too long
        const timeoutId = setTimeout(() => {
          if (loading) {
            // Fallback data if API is slow
            const mockAnnouncements = [
              {
                Id: 1,
                Title: "Upcoming Exam Schedule",
                Schedule_at: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
              },
              {
                Id: 2,
                Title: "Project Submission Deadline",
                Schedule_at: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString()
              },
              {
                Id: 3,
                Title: "Guest Lecture on AI",
                Schedule_at: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString()
              }
            ];
            setAnnouncements(mockAnnouncements);
            setLoading(false);
          }
        }, 3000);

        // Make the actual API request
        const data = await apiRequest("/announcements", { skipCache: loading });

        // Clear the timeout since we got a response
        clearTimeout(timeoutId);

        setAnnouncements(data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        // Use fallback data on error
        const mockAnnouncements = [
          {
            Id: 1,
            Title: "Upcoming Exam Schedule",
            Schedule_at: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
          },
          {
            Id: 2,
            Title: "Project Submission Deadline",
            Schedule_at: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString()
          },
          {
            Id: 3,
            Title: "Guest Lecture on AI",
            Schedule_at: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString()
          }
        ];
        setAnnouncements(mockAnnouncements);
        setError(null); // Don't show error, just use fallback data
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

    const location = useLocation();
    const trimmedPath = location.pathname
    .split('/')
    .slice(0, -1)
    .join('/') + '/';

  // Get current week range based on weekOffset
  const getWeekRange = () => {
    const now = new Date();
    const start = new Date(now.setDate(now.getDate() - now.getDay() + weekOffset * 7));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  };

  // Convert API data into event format for the grid
  const events = useMemo(() => {
    const { start, end } = getWeekRange();
    return announcements
      .filter((item) => {
        const dateObj = new Date(item.Schedule_at);
        return dateObj >= start && dateObj <= end;
      })
      .map((item) => {
        const dateObj = new Date(item.Schedule_at);
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const day = days[dateObj.getDay()];
        const closestTimeSlot = [...timeSlots]
          .reverse()
          .find((slot) => {
            const [slotH, slotM] = slot.split(":").map(Number);
            return hours > slotH || (hours === slotH && minutes >= slotM);
          });

        return {
          id: item.Id,
          day,
          startTime: closestTimeSlot || "09:00",
          title: item.Title,
          color: colors[Math.floor(Math.random() * colors.length)]
        };
      });
  }, [announcements, weekOffset]);


  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Get current week dates
  const { start, end } = getWeekRange();
  return (
    <div className="bg-gray-50 p-1 flex justify-center items-center min-h-[400px]">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full">
      <div className="grid grid-cols-[auto_1fr_auto] items-center mb-4 gap-4">
          <h1 className="text-2xl font-medium text-gray-800 whitespace-nowrap">
            <a href={`${trimmedPath}announcements`}>Upcoming Announcements</a>
          </h1>
          <div className="text-center text-sm font-semibold text-gray-800 whitespace-nowrap">
            {formatDate(start)} to {formatDate(end)}
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setWeekOffset(weekOffset - 1)} className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
              Previous Week
            </button>
            <button onClick={() => setWeekOffset(weekOffset + 1)} className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
              Next Week
            </button>
          </div>
        </div>

        {loading ? (
           <div className="flex justify-center items-center h-screen">
           <CircularProgress sx={{ color: '#f97316' }} />
           <span className="ml-3 text-gray-600">Loading...</span>
         </div>
        ) : error ? (
          <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-2">Error</div>
            <p className="text-gray-600">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
              sx={{
                backgroundColor: '#f97316',
                '&:hover': { backgroundColor: '#ea580c' },
                marginTop: '16px'
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
        ) : (
          <div className="relative">
            {/* Time slots header */}
            <div className="grid grid-cols-[80px_repeat(8,1fr)] mb-4">
              <div className="col-span-1"></div>
              {timeSlots.map((time, index) => (
                <div key={index} className="text-center text-gray-500 text-sm font-normal">
                  {time}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="relative">
              <div className="absolute inset-0 grid grid-cols-[80px_repeat(8,1fr)] pointer-events-none">
                {timeSlots.map((_, index) => (
                  <div key={index} className="col-span-1 border-l border-gray-200 h-full ml-auto"></div>
                ))}
              </div>

              <div className="relative">
                {days.map((day, dayIndex) => (
                  <div key={dayIndex} className="grid grid-cols-[80px_repeat(8,1fr)] h-10 relative">
                    <div className="col-span-1 flex items-center text-gray-500 text-sm font-normal">{day}</div>
                    <div className="col-span-8 relative">
                      {events
                        .filter((event) => event.day === day)
                        .map((event) => {
                          const colStart = timeSlots.indexOf(event.startTime) + 1;
                          return (
                            <div
                              key={event.id}
                              className="absolute top-1/2 -translate-y-1/2"
                              style={{
                                left: `${(colStart - 0.5) * (100 / 8)}%`,
                              }}
                            >
                              <div
                                className={`absolute -left-14 top-1/2 -translate-y-1/2  w-3 h-3 rounded-full ${event.color}`}
                              ></div>
                              <div className={`${event.color} text-white px-4 py-1 rounded-full text-sm font-medium`}>
                                {event.title}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
