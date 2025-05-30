import React, { useState, useEffect, useRef } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Avatar, Button, Select, MenuItem, Card, CardContent, CircularProgress, Alert, Pagination, Typography, Box } from '@mui/material';
import { Event, School, BeachAccess, Flag, CalendarMonth } from '@mui/icons-material';
import { apiRequest } from '../utils/api';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const scrollRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(true);

  const DEFAULT_IMAGE = 'https://www.creativecoloursolutions.com.au/wp-content/uploads/2017/09/400x400.jpg';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch announcements
        const announcementsResponse = await apiRequest("/announcements");
        setAnnouncements(announcementsResponse.data.map(ann => ({
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

        // Fetch all holidays
        // We still need to provide start and end dates for the API, but the backend will return all holidays
        const startDate = '2000-01-01';
        const endDate = '2100-12-31';

        const holidaysResponse = await apiRequest(`/calenders/list?start=${startDate}&end=${endDate}&all_holidays=true`);

        // Filter only holiday type items
        const holidayItems = holidaysResponse.data.filter(item => item.type === 'Holiday');

        // Sort holidays by date (ascending)
        const sortedHolidays = holidayItems.sort((a, b) => {
          return new Date(a.start) - new Date(b.start);
        });

        setHolidays(sortedHolidays);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  // Add auto-scroll functionality
  useEffect(() => {
    if (!scrollRef.current || !isScrolling) return;

    const scrollContainer = scrollRef.current;
    let scrollInterval;

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer.scrollTop >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
          scrollContainer.scrollTop = 0;
        } else {
          scrollContainer.scrollTop += 1;
        }
      }, 50);
    };

    const stopScrolling = () => {
      clearInterval(scrollInterval);
    };

    startScrolling();

    // Pause scrolling on hover
    scrollContainer.addEventListener('mouseenter', stopScrolling);
    scrollContainer.addEventListener('mouseleave', startScrolling);

    return () => {
      stopScrolling();
      scrollContainer.removeEventListener('mouseenter', stopScrolling);
      scrollContainer.removeEventListener('mouseleave', startScrolling);
    };
  }, [isScrolling, holidays.length]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAnnouncements = announcements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(announcements.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          </div>

          <div className="space-y-6">
            {currentAnnouncements.map(announcement => (
              <Card key={announcement.id} className="border rounded-lg overflow-hidden shadow-md" sx={{ mb: 2, p: 0.5, maxWidth: 520, mx: 'auto' }}>
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/4 max-w-[120px] relative">
                    <img
                      src={announcement.image}
                      alt={announcement.title}
                      className="h-32 w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>
                  <CardContent className="p-3 flex-1">
                    <h2 className="text-lg font-bold mb-2">{announcement.title}</h2>
                    <p className="text-gray-600 text-sm mb-2">
                      {announcement.subtitle}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="text-white px-3 py-1 rounded-full text-xs" style={{
                        background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)',
                        boxShadow: '0 2px 8px 0 rgba(15,31,61,0.10)'
                      }}>
                        📅 {announcement.date}
                      </div>
                      {announcement.time && (
                        <div className="text-gray-600 text-xs">
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

        {/* Holidays Section */}
        <div className="w-full md:w-1/3 relative">
          <div className="sticky top-4">
            <Card className="border rounded-lg shadow-sm" sx={{
              background: 'linear-gradient(270deg, #1e3c72 0%, #2a5298 100%)',
              boxShadow: '0 4px 24px 0 rgba(30,60,114,0.10)',
            }}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold" style={{
                    background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>All Holidays</h2>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: 'rgba(235, 103, 7, 0.1)',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2
                  }}>
                    <Flag sx={{ color: '#eb6707', fontSize: '1.2rem' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#eb6707' }}>
                      {holidays.length} Holidays
                    </Typography>
                  </Box>
                </div>

                {holidays.length > 0 ? (
                  <Box
                    ref={scrollRef}
                    sx={{
                      maxHeight: '450px',
                      overflowY: 'auto',
                      pr: 1,
                      mt: 1,
                      pb: 1,
                      '&::-webkit-scrollbar': {
                        width: '6px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '10px',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        background: 'rgba(255, 255, 255, 0.4)',
                      },
                    }}
                  >
                    <div className="space-y-2">
                      {holidays.map((holiday, index) => (
                        <div key={holiday.id}>
                          <Card
                            className="hover:shadow-md transition-all cursor-pointer"
                            sx={{
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                              borderRadius: 2,
                              overflow: 'hidden',
                              background: '#ffffff',
                              border: '1px solid #f3f3f3',
                              backgroundImage: 'none',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(30,60,114,0.10)',
                              }
                            }}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <CalendarMonth fontSize="small" sx={{ color: '#1e3c72' }} />
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e3c72' }}>
                                  {formatDate(holiday.start)}
                                </Typography>
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem', pl: 0.5, color: '#404040' }}>
                                {holiday.title}
                              </Typography>
                            </CardContent>
                          </Card>
                          {index < holidays.length - 1 && (
                            <Box sx={{
                              height: '8px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}>
                              <Box sx={{
                                width: '4px',
                                height: '4px',
                                borderRadius: '50%',
                                bgcolor: 'rgba(255, 255, 255, 0.3)'
                              }} />
                            </Box>
                          )}
                        </div>
                      ))}
                    </div>
                  </Box>
                ) : (
                  <Box sx={{
                    p: 3,
                    textAlign: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2
                  }}>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                      No holidays found
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      No holidays have been added to the system yet
                    </Typography>
                  </Box>
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