import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { Avatar, Button, Select, MenuItem, Card, CardContent, CircularProgress, Alert, Pagination } from '@mui/material';
import { Event, School, BeachAccess } from '@mui/icons-material';
import { apiRequest } from '../utils/api';

const Announcements = () => {
  const [date, setDate] = useState(new Date());
  const [filter, setFilter] = useState('all');
  const [calendarView, setCalendarView] = useState('day');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const DEFAULT_IMAGE = 'https://www.creativecoloursolutions.com.au/wp-content/uploads/2017/09/400x400.jpg';

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/announcements");
        setAnnouncements(response.data.map(ann => ({
          id: ann.Id,
          title: ann.Title,
          subtitle: ann.Description,
          rawDate: new Date(ann.Schedule_at),
          date: new Date(ann.Schedule_at).toLocaleDateString('en-GB'),
          time: new Date(ann.Schedule_at).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit' 
          }),
          venue: ann.Venue || "Online",
          image: ann.Image || DEFAULT_IMAGE,
          type: 'event',
          icon: <Event sx={{ color: 'white' }} />
        })));
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError(err.message || "Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const filteredAnnouncements = filter === 'all' 
    ? announcements 
    : announcements.filter(ann => ann.type === filter);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const hasEvents = (date) => {
    return announcements.some(ann => {
      const annDate = ann.rawDate;
      return (
        annDate.getDate() === date.getDate() &&
        annDate.getMonth() === date.getMonth() &&
        annDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const CustomDay = (props) => {
    const { day, ...other } = props;
    const isEventDate = hasEvents(day);

    return (
      <PickersDay 
        {...other} 
        day={day}
        sx={{
          position: 'relative',
          ...(isEventDate && {
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: 2,
              left: '50%',
              width: 6,
              height: 6,
              backgroundColor: '#f97316',
              borderRadius: '50%',
              transform: 'translateX(-50%)'
            }
          })
        }}
      />
    );
  };

  const selectedDateEvents = announcements.filter(ann => {
    const annDate = ann.rawDate;
    const selectedDate = date;
    return (
      annDate.getDate() === selectedDate.getDate() &&
      annDate.getMonth() === selectedDate.getMonth() &&
      annDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 min-h-screen">
        <Alert severity="error" className="mt-8">{error}</Alert>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-8 min-h-screen">
        {/* Announcements List */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Announcements by Institute</h1>
            <div className="flex items-center gap-4">
             
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

          <div className="space-y-6">
            {currentAnnouncements.map(announcement => (
              <Card key={announcement.id} className="border rounded-lg overflow-hidden shadow-lg">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/3 max-w-[300px] relative">
                    <img
                      src={announcement.image}
                      alt={announcement.title}
                      className="h-56 w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE;
                      }}
                    />
                   
                  </div>
                  <CardContent className="p-6 flex-1">
                    <h2 className="text-2xl font-bold mb-3">{announcement.title}</h2>
                    <p className="text-gray-600 text-base mb-4">
                      {announcement.subtitle}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm">
                        📅 {announcement.date}
                      </div>
                      {announcement.time && (
                        <div className="text-gray-600 text-sm">
                          ⏰ {announcement.time}
                        </div>
                      )}
                      
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#4f46e5',
                    '&:hover': { backgroundColor: '#f97316' }
                  },
                  '& .Mui-selected': {
                    backgroundColor: '#f97316 !important',
                    color: 'white !important',
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Calendar Section */}
        <div className="w-full md:w-1/3 relative">
          <div className="sticky top-4">
            <Card className="border rounded-lg shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Academic Calendar</h2>
                  <Select
                    value={calendarView}
                    onChange={(e) => setCalendarView(e.target.value)}
                    className="bg-red-50 border-none rounded-full"
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                      '& .MuiSelect-select': { padding: '4px 16px' }
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
                    slots={{
                      day: CustomDay,
                    }}
                    sx={{
                      width: '100%',
                      '& .MuiPickersDay-root': {
                        '&.Mui-selected': {
                          backgroundColor: '#f97316',
                          '&:hover': { backgroundColor: '#ea580c' }
                        }
                      }
                    }}
                  />
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  Events on {date.toLocaleDateString('en-GB')}
                </h3>
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map(event => (
                    <Card key={event.id} className="mb-2 hover:bg-gray-50">
                      <CardContent className="p-3">
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.subtitle}</p>
                        <div className="mt-2 text-xs text-gray-500">
                          ⏰ {event.time} 
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">
                    No events scheduled for this day
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default Announcements;