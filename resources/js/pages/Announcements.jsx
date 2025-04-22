import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Avatar, Button, Select, MenuItem, Card, CardContent } from '@mui/material';
import { Event, School, BeachAccess } from '@mui/icons-material';

const Announcements = () => {
  const [date, setDate] = useState(new Date());
  const [filter, setFilter] = useState('all');
  const [calendarView, setCalendarView] = useState('day');

  // Sample announcement data
  const announcements = [
    {
      id: 1,
      title: "Blood Donation Camp",
      subtitle: "Be a Hero, Save a Life! Join us for the Blood Donation Drive and make a difference in someone's life...",
      date: "12/01/2025",
      time: "10:00AM – 12:00PM",
      venue: "Vijay Nagar",
      type: "event",
      image: "/blood-donation.png",
      icon: <Event sx={{ color: 'white' }} />
    },
    {
      id: 2,
      title: "New Semester Orientation",
      subtitle: "A vibrant banner with icons of books, a calendar, and excited students.",
      date: "14/01/2025",
      type: "academic",
      image: "/orientation.png",
      icon: <School sx={{ color: 'white' }} />
    },
    {
      id: 3,
      title: "Annual Science Fair",
      subtitle: "Colorful visuals of science experiments, lab equipment, and students showcasing projects.",
      date: "15/01/2025",
      type: "academic",
      image: "/science-fair.png",
      icon: <School sx={{ color: 'white' }} />
    },
    {
      id: 4,
      title: "Republic Day",
      subtitle: "Institute Holiday",
      date: "26/01/2025",
      type: "holiday",
      image: "/holiday.png",
      icon: <BeachAccess sx={{ color: 'white' }} />
    }
  ];

  // Filter announcements based on selected filter
  const filteredAnnouncements = filter === 'all' 
    ? announcements 
    : announcements.filter(ann => ann.type === filter);

  // Get events for the selected date
  const selectedDateEvents = announcements.filter(ann => {
    const annDate = new Date(ann.date);
    return (
      annDate.getDate() === date.getDate() &&
      annDate.getMonth() === date.getMonth() &&
      annDate.getFullYear() === date.getFullYear()
    );
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-8">
        {/* Left side - Announcements list */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Announcements by Institute</h1>
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 bg-purple-600 border-2 border-white shadow-md">
                <AvatarFallback className="text-white">S</AvatarFallback>
              </Avatar>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-32 bg-red-50 border-none rounded-full"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiSelect-select': { padding: '8px 16px' }
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="event">Events</MenuItem>
                <MenuItem value="academic">Academic</MenuItem>
                <MenuItem value="holiday">Holidays</MenuItem>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredAnnouncements.map(announcement => (
              <Card key={announcement.id} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/3 max-w-[200px] relative">
                    <img
                      src={announcement.image}
                      alt={announcement.title}
                     
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-purple-600 p-2 rounded-full">
                      {announcement.icon}
                    </div>
                  </div>
                  <CardContent className="p-4 flex-1">
                    <h2 className="text-xl font-bold mb-1">{announcement.title}</h2>
                    <p className="text-gray-600 text-sm mb-3">
                      {announcement.subtitle}
                    </p>
                    {announcement.time && announcement.venue && (
                      <p className="text-gray-600 text-xs mb-2">
                        {announcement.time} • {announcement.venue}
                      </p>
                    )}
                    <Button 
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs px-4 py-1 h-auto"
                      sx={{
                        backgroundColor: '#f97316',
                        '&:hover': { backgroundColor: '#ea580c' },
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        padding: '4px 16px',
                        height: 'auto'
                      }}
                    >
                      Date - {announcement.date}
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right side - Calendar */}
        <div className="w-full md:w-1/3">
          <Card className="sticky top-4 border rounded-lg shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Calendar</h2>
                <Select
                  value={calendarView}
                  onChange={(e) => setCalendarView(e.target.value)}
                  className="bg-red-50 border-none rounded-full"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSelect-select': { padding: '4px 16px', fontSize: '0.875rem' }
                  }}
                >
                  <MenuItem value="day">Day</MenuItem>
                  <MenuItem value="week">Week</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                </Select>
              </div>

              <div className="mb-6 border rounded-lg overflow-hidden">
                <DateCalendar
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                  views={['day', 'month', 'year']}
                  sx={{
                    width: '100%',
                    '& .MuiPickersCalendarHeader-root': { padding: '0 8px' },
                    '& .MuiPickersDay-root': { 
                      margin: '0 2px',
                      '&.Mui-selected': { backgroundColor: '#f97316' }
                    }
                  }}
                />
              </div>

              <h3 className="text-lg font-semibold mb-2">
                Events on {date.toLocaleDateString()}
              </h3>
              
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-2">
                  {selectedDateEvents.map(event => (
                    <Card key={event.id} variant="outlined" className="hover:bg-gray-50">
                      <CardContent className="py-2 px-3">
                        <h4 className="text-sm font-medium">{event.title}</h4>
                        <p className="text-xs text-gray-600">{event.subtitle}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  No events scheduled for this day.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default Announcements;