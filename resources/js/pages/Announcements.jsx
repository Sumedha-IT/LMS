import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Card, CardContent, CircularProgress, Button, Pagination, Select, MenuItem } from '@mui/material';
import { Announcement as AnnouncementIcon } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Function to get cookie by name
function getCookie(name) {
  let cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    let [key, value] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

const Announcements = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const announcementsPerPage = 3;

  const fetchAnnouncements = async () => {
    try {
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;

      if (!userData?.token) {
        toast.error('Authentication required');
        setLoading(false);
        return;
      }

      const userId = getCookie("x_path_id");
      if (!userId) {
        toast.error('User ID not found');
        setLoading(false);
        return;
      }

      // Make API request
      const response = await axios.get('/api/announcements', {
        headers: {
          'Accept': 'application/json',
          'Authorization': userData.token,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true
      });

      // Transform API data to match our component's expected format
      const formattedAnnouncements = response.data.data.map(announcement => {
        // Parse the date from the API
        const scheduleDate = new Date(announcement.Schedule_at);
        const formattedDate = scheduleDate.toLocaleDateString();

        return {
          id: announcement.Id,
          title: announcement.Title,
          subtitle: announcement.Description,
          date: formattedDate,
          // Extract time from the schedule date if available
          time: scheduleDate ? `${scheduleDate.getHours() % 12 || 12}:${String(scheduleDate.getMinutes()).padStart(2, '0')} ${scheduleDate.getHours() >= 12 ? 'PM' : 'AM'}` : null,
          // Use venue from API if available, otherwise null
          venue: announcement.Venue || null,
          image: announcement.Image || null,
          // Add a placeholder image URL if the image is null
          placeholderImage: 'https://via.placeholder.com/180x140?text=Announcement',
          type: 'announcement', // Default type
          // Randomly assign weekly or monthly for demo purposes
          frequency: Math.random() > 0.5 ? 'weekly' : 'monthly'
        };
      });

      setAnnouncements(formattedAnnouncements);
      setLoading(false);
    } catch (error) {
      // Handle permission errors
      if (error.response?.status === 403) {
        toast.error('You do not have permission to access these announcements');
      } else if (error.response?.status === 401) {
        toast.error('Authentication required');
        navigate('/administrator/login');
      } else {
        // Handle other errors
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch announcements';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch announcements from API
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Paginate announcements
  const startIndex = (page - 1) * announcementsPerPage;
  const paginatedAnnouncements = announcements.slice(startIndex, startIndex + announcementsPerPage);
  const pageCount = Math.ceil(announcements.length / announcementsPerPage);

  // Get events for the selected date
  const selectedDateEvents = announcements.filter(ann => {
    if (!ann.date) return false;

    const annDate = new Date(ann.date);
    return (
      annDate.getDate() === date.getDate() &&
      annDate.getMonth() === date.getMonth() &&
      annDate.getFullYear() === date.getFullYear()
    );
  });

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress sx={{ color: '#f97316' }} />
        <span className="ml-3 text-gray-600">Loading announcements...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
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
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-8">
        {/* Left side - Announcements list */}
        <div className="w-full md:w-2/3">
          {announcements.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <AnnouncementIcon sx={{ fontSize: 48, color: '#9ca3af', margin: '0 auto 16px' }} />
              <h3 className="text-lg font-medium text-gray-600">No announcements available</h3>
              <p className="text-gray-500 mt-2">Check back later for updates</p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {paginatedAnnouncements.map(announcement => (
                  <Card
                    key={announcement.id}
                    className="border rounded-lg overflow-hidden shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/3 relative">
                        <img
                          src={announcement.image || announcement.placeholderImage}
                          alt={announcement.title}
                          className="h-full w-full object-cover"
                          style={{ minHeight: '200px' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=Announcement';
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
                          {announcement.venue && (
                            <div className="text-gray-600 text-sm">
                              📍 {announcement.venue}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={handlePageChange}
                  size="large"
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#f97316',
                      fontSize: '1rem',
                      padding: '8px 16px',
                      '&.Mui-selected': {
                        backgroundColor: '#f97316',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#ea580c',
                        },
                      },
                    },
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Right side - Calendar */}
        <div className="w-full md:w-1/3">
          <Card className="sticky top-4 border rounded-lg shadow-sm overflow-hidden mb-4">
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
                  <MenuItem value="month">Month</MenuItem>
                  <MenuItem value="year">Year</MenuItem>
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
                Announcements on {date.toLocaleDateString()}
              </h3>

              {selectedDateEvents.length > 0 ? (
                <div className="space-y-2">
                  {selectedDateEvents.map(event => (
                    <Card
                      key={event.id}
                      variant="outlined"
                      className="hover:bg-gray-50"
                    >
                      <CardContent className="py-2 px-3">
                        <h4 className="text-sm font-medium">{event.title}</h4>
                        <p className="text-xs text-gray-600">{event.subtitle}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  No announcements scheduled for this day.
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