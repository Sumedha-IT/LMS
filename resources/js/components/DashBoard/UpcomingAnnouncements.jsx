export default function UpcomingAnnouncements() {
    // Time slots from 9:00 to 16:00
    const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
  
    // Days of the week
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
    // Events data
    const events = [
      { id: 1, day: "Mon", startTime: "10:00", title: "Webinar", color: "bg-red-500" },
      { id: 2, day: "Wed", startTime: "11:00", title: "Events", color: "bg-cyan-500" },
    ];
  
    // Function to get the column index for a time slot
    const getTimeSlotIndex = (time) => {
      return timeSlots.findIndex((slot) => slot === time);
    };
  
    // Function to get the row index for a day
    const getDayIndex = (day) => {
      return days.findIndex((d) => d === day);
    };
  
    return (
      <div className="bg-gray-50 p-1 flex justify-center items-center min-h-[400px]">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100  p-6 w-full">
          <h1 className="text-2xl font-medium text-gray-800 mb-6">Upcoming Announcements</h1>
  
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
  
            {/* Grid with days and time slots */}
            <div className="relative">
              {/* Vertical grid lines */}
              <div className="absolute inset-0 grid grid-cols-[80px_repeat(8,1fr)] pointer-events-none">
                {timeSlots.map((_, index) => (
                  <div key={index} className="col-span-1 border-l border-gray-200 h-full ml-auto"></div>
                ))}
              </div>
  
              {/* Days rows */}
              <div className="relative">
                {days.map((day, dayIndex) => (
                  <div key={dayIndex} className="grid grid-cols-[80px_repeat(8,1fr)] h-10 relative">
                    <div className="col-span-1 flex items-center text-gray-500 text-sm font-normal">{day}</div>
                    <div className="col-span-8 relative">
                      {/* Render events for this day */}
                      {events
                        .filter((event) => event.day === day)
                        .map((event) => {
                          const colStart = getTimeSlotIndex(event.startTime) + 1;
                          return (
                            <div
                              key={event.id}
                              className="absolute top-1/2 -translate-y-1/2"
                              style={{
                                left: `${(colStart - 0.5) * (100 / 8)}%`,
                              }}
                            >
                              {/* Dot indicator */}
                              <div
                                className={`absolute -left-9 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${event.color}`}
                              ></div>
  
                              {/* Event pill */}
                              <div
                                className={` ${event.color} text-white px-4 py-1 rounded-full text-sm font-medium`}
                              >
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
        </div>
      </div>
    );
  }