import { useState, useEffect, useMemo, useRef } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from "../components/DashBoard/CircularProgress";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/animations/loading.json";
import AttendanceCheckInWidget from "../components/DashBoard/AttendanceCheckInWidget";
import { apiRequest } from "../utils/api";
import { useLocation, useNavigate } from "react-router-dom";
import UpcomingAnnouncements from "../components/DashBoard/UpcomingAnnouncements";
import StudentPlacedCard from "../components/DashBoard/StudentPlacementslider";
import StudentJourney from "../components/DashBoard/StudentJourney";
import AttendanceTracker from "../components/DashBoard/AttendanceTracker";
import MyAssignment from "../components/DashBoard/MyAssignment";
import axios from 'axios';
import Cookies from 'js-cookie';

// Key for storing login status in localStorage
const LOGIN_STATUS_KEY = 'dashboard_login_status';
const DASHBOARD_CACHE_KEY = 'dashboard_data_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const NewDashBoard = () => {
  const [profileData, setProfileData] = useState(null);
  const [assignmentData, setAssignmentData] = useState([]);
  const [examData, setExamData] = useState([]);
  const [attendanceData, setAttendanceData] = useState({ present_days: 0, total_days: 0, attendance_percentage: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [curriculums, setCurriculums] = useState([]);
  const [courseName, setCourseName] = useState('');
  
  // Add refs for tracking request state
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);

  const navigate = useNavigate();
  const location = useLocation();

  // Cache management functions
  const getCachedData = (key) => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      if (now - timestamp < CACHE_DURATION) {
        return data;
      }
      
      // Clear expired cache
      localStorage.removeItem(key);
      return null;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  };

  const setCachedData = (key, data) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  };

  const clearCache = () => {
    try {
      localStorage.removeItem(DASHBOARD_CACHE_KEY);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  // Function to manually refresh dashboard data
  const refreshDashboard = () => {
    clearCache();
    isFetchingRef.current = false;
    lastFetchTimeRef.current = 0;
    setLoading(true);
    setError("");
    
    // Trigger the useEffect to fetch fresh data
    const fetchDashboardData = async () => {
      setLoading(true);
      let updatedCurriculums = [];
      
      try {
        // First get the profile to get the user ID
        const profile = await apiRequest("/profile", { skipCache: false });
        setProfileData(profile);

        // Fetch courses and topics for StudentJourney with caching
        const userInfo = Cookies.get("user_info");
        const userData = userInfo ? JSON.parse(userInfo) : null;
        if (!userData?.token) throw new Error('Authentication required');
        const userId = Cookies.get("x_path_id");
        if (!userId) throw new Error('User ID not found');
        
        const response = await axios.get(`/api/courses/my/${userId}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': userData.token,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          withCredentials: true
        });
        
        if (response.data.courses && response.data.courses.length > 0) {
          setCourseName(response.data.courses[0].name);
          // Fetch topics for each curriculum with reduced concurrency
          const curriculumsRaw = response.data.courses[0].curriculums || [];
          
          // Use Promise.allSettled to handle failures gracefully and limit concurrency
          const curriculumPromises = curriculumsRaw.map(async (curriculum) => {
            try {
              const topicsRes = await axios.get(`/api/courses/curriculums/${curriculum.id}/topics`, {
                headers: {
                  'Accept': 'application/json',
                  'Authorization': userData.token,
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest'
                },
                withCredentials: true
              });
              return {
                ...curriculum,
                topics: topicsRes.data.topics || []
              };
            } catch (error) {
              console.warn(`Failed to fetch topics for curriculum ${curriculum.id}:`, error);
              return {
                ...curriculum,
                topics: []
              };
            }
          });

          // Process in batches to reduce server load
          const batchSize = 3;
          for (let i = 0; i < curriculumPromises.length; i += batchSize) {
            const batch = curriculumPromises.slice(i, i + batchSize);
            const batchResults = await Promise.allSettled(batch);
            batchResults.forEach(result => {
              if (result.status === 'fulfilled') {
                updatedCurriculums.push(result.value);
              }
            });
            // Small delay between batches
            if (i + batchSize < curriculumPromises.length) {
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          }
          
          setCurriculums(updatedCurriculums);
        } else {
          setCurriculums([]);
        }

        // Then use the user ID for the assignments request - remove skipCache to use caching
        const [assignments, exams, attendance] = await Promise.all([
          apiRequest("/getUserAssignments", { 
            skipCache: false,
            params: { student_id: profile.user.id }
          }),
          apiRequest("/exam-chart", { skipCache: false }),
          apiRequest("/student-attendance/report?filter_type=all", { skipCache: false }),
        ]);

        // Log the assignments data to help debug
        console.log('Assignments data:', assignments);

        if (assignments?.success && assignments?.data) {
          setAssignmentData(assignments.data);
        } else {
          console.error('Invalid assignments data:', assignments);
          setAssignmentData([]);
        }

        setExamData(exams?.data || []);

        const presentDays = attendance?.present_days || 0;
        const totalDays = attendance?.total_days || 0;
        const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

        const newAttendanceData = {
          present_days: presentDays,
          total_days: totalDays,
          attendance_percentage: attendancePercentage
        };
        setAttendanceData(newAttendanceData);

        // Cache the dashboard data
        const dashboardData = {
          profileData: profile,
          assignmentData: assignments?.success ? assignments.data : [],
          examData: exams?.data || [],
          attendanceData: newAttendanceData,
          curriculums: response.data.courses && response.data.courses.length > 0 ? updatedCurriculums : [],
          courseName: response.data.courses && response.data.courses.length > 0 ? response.data.courses[0].name : ''
        };
        setCachedData(DASHBOARD_CACHE_KEY, dashboardData);

        setLoading(false);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      } finally {
        isFetchingRef.current = false;
      }
    };

    fetchDashboardData();
  };

  // Expose refresh function globally for debugging
  useEffect(() => {
    window.refreshDashboard = refreshDashboard;
    window.clearDashboardCache = clearCache;
    
    return () => {
      delete window.refreshDashboard;
      delete window.clearDashboardCache;
    };
  }, []);

  // First effect to check if this is the first load after login
  useEffect(() => {
    const loginStatus = localStorage.getItem(LOGIN_STATUS_KEY);
    const today = new Date().toISOString().split('T')[0];

    if (loginStatus === today) {
      setIsFirstLoad(false);
    } else {
      localStorage.setItem(LOGIN_STATUS_KEY, today);
      setIsFirstLoad(true);
      // Clear cache on new day
      clearCache();
    }

    const storedStatus = localStorage.getItem('attendanceStatus');
    if (storedStatus) {
      try {
        const parsedStatus = JSON.parse(storedStatus);
        if (parsedStatus.date === today && parsedStatus.is_checked_in) {
          setIsCheckedIn(true);
        }
      } catch (e) {
        console.error('Error parsing stored attendance status:', e);
      }
    }
  }, []);

  // Second effect to load the dashboard data with caching and throttling
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Prevent multiple simultaneous requests
      if (isFetchingRef.current) {
        return;
      }

      // Throttle requests - minimum 2 seconds between requests
      const now = Date.now();
      if (now - lastFetchTimeRef.current < 2000) {
        console.log('Request throttled - too soon since last request');
        return;
      }

      // Check cache first
      const cachedData = getCachedData(DASHBOARD_CACHE_KEY);
      if (cachedData && !isFirstLoad) {
        console.log('Using cached dashboard data');
        setProfileData(cachedData.profileData);
        setAssignmentData(cachedData.assignmentData);
        setExamData(cachedData.examData);
        setAttendanceData(cachedData.attendanceData);
        setCurriculums(cachedData.curriculums);
        setCourseName(cachedData.courseName);
        setLoading(false);
        return;
      }

      isFetchingRef.current = true;
      lastFetchTimeRef.current = now;
      setLoading(true);
      let updatedCurriculums = [];

      try {
        // First get the profile to get the user ID
        const profile = await apiRequest("/profile", { skipCache: false });
        setProfileData(profile);

        // Fetch courses and topics for StudentJourney with caching
        const userInfo = Cookies.get("user_info");
        const userData = userInfo ? JSON.parse(userInfo) : null;
        if (!userData?.token) throw new Error('Authentication required');
        const userId = Cookies.get("x_path_id");
        if (!userId) throw new Error('User ID not found');
        
        const response = await axios.get(`/api/courses/my/${userId}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': userData.token,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          withCredentials: true
        });
        
        if (response.data.courses && response.data.courses.length > 0) {
          setCourseName(response.data.courses[0].name);
          // Fetch topics for each curriculum with reduced concurrency
          const curriculumsRaw = response.data.courses[0].curriculums || [];
          
          // Use Promise.allSettled to handle failures gracefully and limit concurrency
          const curriculumPromises = curriculumsRaw.map(async (curriculum) => {
            try {
              const topicsRes = await axios.get(`/api/courses/curriculums/${curriculum.id}/topics`, {
                headers: {
                  'Accept': 'application/json',
                  'Authorization': userData.token,
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest'
                },
                withCredentials: true
              });
              return {
                ...curriculum,
                topics: topicsRes.data.topics || []
              };
            } catch (error) {
              console.warn(`Failed to fetch topics for curriculum ${curriculum.id}:`, error);
              return {
                ...curriculum,
                topics: []
              };
            }
          });

          // Process in batches to reduce server load
          const batchSize = 3;
          for (let i = 0; i < curriculumPromises.length; i += batchSize) {
            const batch = curriculumPromises.slice(i, i + batchSize);
            const batchResults = await Promise.allSettled(batch);
            batchResults.forEach(result => {
              if (result.status === 'fulfilled') {
                updatedCurriculums.push(result.value);
              }
            });
            // Small delay between batches
            if (i + batchSize < curriculumPromises.length) {
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          }
          
          setCurriculums(updatedCurriculums);
        } else {
          setCurriculums([]);
        }

        // Then use the user ID for the assignments request - remove skipCache to use caching
        const [assignments, exams, attendance] = await Promise.all([
          apiRequest("/getUserAssignments", { 
            skipCache: false,
            params: { student_id: profile.user.id }
          }),
          apiRequest("/exam-chart", { skipCache: false }),
          apiRequest("/student-attendance/report?filter_type=all", { skipCache: false }),
        ]);

        // Log the assignments data to help debug
        console.log('Assignments data:', assignments);

        if (assignments?.success && assignments?.data) {
          setAssignmentData(assignments.data);
        } else {
          console.error('Invalid assignments data:', assignments);
          setAssignmentData([]);
        }

        setExamData(exams?.data || []);

        const presentDays = attendance?.present_days || 0;
        const totalDays = attendance?.total_days || 0;
        const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

        const newAttendanceData = {
          present_days: presentDays,
          total_days: totalDays,
          attendance_percentage: attendancePercentage
        };
        setAttendanceData(newAttendanceData);

        // Cache the dashboard data
        const dashboardData = {
          profileData: profile,
          assignmentData: assignments?.success ? assignments.data : [],
          examData: exams?.data || [],
          attendanceData: newAttendanceData,
          curriculums: response.data.courses && response.data.courses.length > 0 ? updatedCurriculums : [],
          courseName: response.data.courses && response.data.courses.length > 0 ? response.data.courses[0].name : ''
        };
        setCachedData(DASHBOARD_CACHE_KEY, dashboardData);

        setLoading(false);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      } finally {
        isFetchingRef.current = false;
      }
    };

    fetchDashboardData();
  }, [isFirstLoad, isCheckedIn]);

  const assignmentStats = useMemo(() => {
    let total = 0, submitted = 0;

    assignmentData.forEach(topic => {
      const first = topic.assignments?.[0];
      if (first) {
        total++;
        if (first.is_submitted) submitted++;
      }
    });

    return { total, submitted };
  }, [assignmentData]);

  const lastExam = examData?.[0];

  // Create a loading fallback component
  const LoadingFallback = () => (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-64 h-64">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
      <div className="text-gray-600 mt-4">Loading your dashboard...</div>
    </div>
  );

  // Show error message if there's an error
  if (error) return <div className="p-10 text-red-600 text-center">{error}</div>;

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingFallback />
      </div>
    );
  }

  return (
    <>
      {/* Refresh button for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={refreshDashboard}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg disabled:opacity-50"
            title="Refresh Dashboard Data"
          >
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      )}
      
      {isFirstLoad && !isCheckedIn ? (
        <>
          <div className="w-full mb-4">
            <AttendanceCheckInWidget
              displayMode="card"
              key={`attendance-widget-${new Date().toISOString().split('T')[0]}`}
            />
          </div>

          <section className="w-full p-2 mb-10">
            <div className="relative min-h-[15.75rem] rounded-2xl flex items-center px-10 w-full" style={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)' }}>
              <div className="flex gap-2 w-3/4 justify-evenly">
                <div 
                  onClick={() => window.location.href = '/administrator/1/student-attendance'}
                  className="cursor-pointer hover:opacity-90 transition-opacity group"
                  title="Click to view detailed attendance"
                >
                  <CircularProgress
                    value={attendanceData.attendance_percentage || 0}
                    max={100}
                    label="Attendance"
                    size={140}
                    strokeWidth={12}
                    showPercentage
                  />
                </div>

                <div
                  onClick={() => {
                    const path = location.pathname.split('/').slice(0, -1).join('/');
                    window.location.href = `${path}/my-courses?tab=assignments`;
                  }}
                  className="cursor-pointer hover:opacity-90 transition-opacity group"
                  title="Click to view assignments"
                >
                  <CircularProgress
                    value={assignmentStats.submitted}
                    max={assignmentStats.total || 1}
                    label="Assignments"
                    size={140}
                    strokeWidth={12}
                  />
                </div>

                {lastExam?.id && profileData?.user?.id ? (
                  <a
                    href={`/administrator/1/examinations/user/${profileData.user.id}/exam/${lastExam.id}/review`}
                    className="cursor-pointer"
                  >
                    <CircularProgress
                      value={lastExam.obtained_marks || 0}
                      max={lastExam.max_marks || 10}
                      label="Last Exam"
                      size={140}
                      strokeWidth={12}
                    />
                  </a>
                ) : (
                  <CircularProgress
                    value={0}
                    max={0}
                    label="Data Not Found"
                    size={140}
                    strokeWidth={12}
                  />
                )}
              </div>

              <img
                className="absolute -top-16 w-[17rem] right-0"
                src="/images/image%2067.png"
                alt="Decorative illustration"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/placeholder.jpg";
                  e.target.alt = "Fallback decorative illustration";
                }}
              />
            </div>
          </section>

          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="w-full md:w-3/4">
              <UpcomingAnnouncements />
            </div>
            <div className="w-full md:w-1/4">
              <StudentPlacedCard autoScroll={true} />
            </div>
          </div>

          <StudentJourney 
            onStartLearning={() => {
              const path = location.pathname.split('/').slice(0, -1).join('/');
              window.location.href = `${path}/my-courses`;
            }}
            curriculums={curriculums}
            courseName={courseName}
            loading={loading}
          />

          <div className="flex justify-between w-full px-1 my-10">
            <div className="w-2/5">
              <AttendanceTracker attendanceData={attendanceData} />
            </div>
            <div className="w-3/5">
              <MyAssignment assignments={assignmentData} />
            </div>
          </div>
        </>
      ) : (
        <>
          <section className="w-full p-2 mb-10 flex gap-2 items-stretch min-h-[13rem] h-[17rem]">
            <div className="relative rounded-2xl flex items-center px-10 w-3/4 h-full" style={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)' }}>
              <div className="flex gap-2 w-3/4 justify-evenly">
                <div 
                  onClick={() => window.location.href = '/administrator/1/student-attendance'}
                  className="cursor-pointer hover:opacity-90 transition-opacity group"
                  title="Click to view detailed attendance"
                >
                  <CircularProgress
                    value={attendanceData.attendance_percentage || 0}
                    max={100}
                    label="Attendance"
                    size={140}
                    strokeWidth={12}
                    showPercentage
                  />
                </div>

                <div
                  onClick={() => {
                    const path = location.pathname.split('/').slice(0, -1).join('/');
                    window.location.href = `${path}/my-courses?tab=assignments`;
                  }}
                  className="cursor-pointer hover:opacity-90 transition-opacity group"
                  title="Click to view assignments"
                >
                  <CircularProgress
                    value={assignmentStats.submitted}
                    max={assignmentStats.total || 1}
                    label="Assignments"
                    size={140}
                    strokeWidth={12}
                  />
                </div>

                {lastExam?.id && profileData?.user?.id ? (
                  <a
                    href={`/administrator/1/examinations/user/${profileData.user.id}/exam/${lastExam.id}/review`}
                    className="cursor-pointer"
                  >
                    <CircularProgress
                      value={lastExam.obtained_marks || 0}
                      max={lastExam.max_marks || 10}
                      label="Last Exam"
                      size={140}
                      strokeWidth={12}
                    />
                  </a>
                ) : (
                  <CircularProgress
                    value={0}
                    max={0}
                    label="Data Not Found"
                    size={140}
                    strokeWidth={12}
                  />
                )}
              </div>

              <img
                className="absolute -top-16 w-[17rem] right-0"
                src="/images/image%2067.png"
                alt="Decorative illustration"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/placeholder.jpg";
                  e.target.alt = "Fallback decorative illustration";
                }}
              />
            </div>

            <div className="w-1/4 h-full">
              <AttendanceCheckInWidget
                displayMode="card"
                key={`attendance-widget-${new Date().toISOString().split('T')[0]}`}
              />
            </div>
          </section>

          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="w-full md:w-3/4">
              <UpcomingAnnouncements />
            </div>
            <div className="w-full md:w-1/4">
              <StudentPlacedCard autoScroll={true} />
            </div>
          </div>

          <StudentJourney 
            onStartLearning={() => {
              const path = location.pathname.split('/').slice(0, -1).join('/');
              window.location.href = `${path}/my-courses`;
            }}
            curriculums={curriculums}
            courseName={courseName}
            loading={loading}
          />

          <div className="flex justify-between w-full px-1 my-10">
            <div className="w-full">
              <MyAssignment assignments={assignmentData} />
            </div>
          </div>
        </>
      )}

      <ToastContainer />
    </>
  );
};

export default NewDashBoard;
