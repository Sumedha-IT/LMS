import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from "../components/DashBoard/CircularProgress";
// Import AttendanceCheckInWidget directly (not lazy loaded) to ensure it loads first
import AttendanceCheckInWidget from "../components/DashBoard/AttendanceCheckInWidget";
import { apiRequest } from "../utils/api";
import { useLocation, useNavigate } from "react-router-dom";

// Lazy load all non-critical components
const UpcomingAnnouncements = lazy(() => import("../components/DashBoard/UpcomingAnnouncements"));
const StudentPlacedCard = lazy(() => import("../components/DashBoard/StudentPlacementslider"));
const StudentJourney = lazy(() => import("../components/DashBoard/StudentJourney"));
const AttendanceTracker = lazy(() => import("../components/DashBoard/AttendanceTracker"));
const MyAssignment = lazy(() => import("../components/DashBoard/MyAssignment"));
const AssignmentPage = lazy(() => import("../components/DashBoard/AssignmentPage"));

// Key for storing login status in localStorage
const LOGIN_STATUS_KEY = 'dashboard_login_status';

const NewDashBoard = () => {
  const [profileData, setProfileData] = useState(null);
  const [assignmentData, setAssignmentData] = useState([]);
  const [examData, setExamData] = useState([]);
  const [attendanceData, setAttendanceData] = useState({ present_days: 0, total_days: 0, attendance_percentage: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Add state to track if this is the first load after login
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  // Add state to track if user is checked in
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Separate state for attendance widget loading
  const [attendanceWidgetReady, setAttendanceWidgetReady] = useState(false);

  // First effect to check if this is the first load after login
  useEffect(() => {
    // Check if we have a stored login status
    const loginStatus = localStorage.getItem(LOGIN_STATUS_KEY);
    const today = new Date().toISOString().split('T')[0];

    // If we have a login status for today, this is not the first load
    if (loginStatus === today) {
      setIsFirstLoad(false);
    } else {
      // This is the first load, store today's date
      localStorage.setItem(LOGIN_STATUS_KEY, today);
      setIsFirstLoad(true);
    }

    // Check if user is already checked in
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

    // If not first load or already checked in, mark attendance widget as ready immediately
    if (!isFirstLoad || isCheckedIn) {
      setAttendanceWidgetReady(true);
    }
  }, []);

  // Second effect to load the dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      // Set a timeout to show fallback data if APIs take too long
      const timeoutId = setTimeout(() => {
        if (loading) {
          // Fallback data if APIs are slow
          setProfileData({
            user: { id: 1, name: "Student User" }
          });
          setAssignmentData([
            {
              id: 1,
              title: "Assignment 1",
              assignments: [{ id: 1, title: "Web Development", is_submitted: true }]
            },
            {
              id: 2,
              title: "Assignment 2",
              assignments: [{ id: 2, title: "Database Design", is_submitted: false }]
            }
          ]);
          setExamData([
            { id: 1, title: "Midterm Exam", obtained_marks: 75, max_marks: 100 }
          ]);
          setLoading(false);
        }
      }, 3000);

      try {
        // If this is the first load after login and user is not checked in,
        // prioritize loading the attendance widget first
        if (isFirstLoad && !isCheckedIn) {
          // Mark the attendance widget as ready immediately
          setAttendanceWidgetReady(true);

          // Wait a moment to ensure the attendance widget is rendered
          // before making any API calls that might block rendering
          await new Promise(resolve => setTimeout(resolve, 100));

          // Check if the user has checked in today
          const attendanceStatus = await apiRequest("/student-attendance/status", { skipCache: true });

          // Update checked in status
          if (attendanceStatus && attendanceStatus.is_checked_in) {
            setIsCheckedIn(true);
          }

          // Use a delay before loading other components only on first load
          setTimeout(loadAllData, 500);
        } else {
          // For subsequent loads or if already checked in, load all data immediately
          // without prioritizing the attendance widget
          loadAllData();
        }

        async function loadAllData() {
          try {
            const [profile, assignments, exams, attendance] = await Promise.all([
              apiRequest("/profile", { skipCache: true }),
              apiRequest("/getUserAssignments", { skipCache: true }),
              apiRequest("/exam-chart", { skipCache: true }),
              apiRequest("/student-attendance/report?filter_type=all", { skipCache: true }),
            ]);

            // Clear the timeout since we got responses
            clearTimeout(timeoutId);

            // Process the data
            setProfileData(profile);
            setAssignmentData(assignments?.data || []);
            setExamData(exams?.data || []);

            // Process attendance data from the student attendance report
            const presentDays = attendance?.present_days || 0;
            const totalDays = attendance?.total_days || 0;
            const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

            // Create attendance data object with the correct format
            const attendanceDataToUse = {
              present_days: presentDays,
              total_days: totalDays,
              attendance_percentage: attendancePercentage
            };

            setAttendanceData(attendanceDataToUse);
            setLoading(false);

            // Always mark attendance widget as ready after data is loaded
            setAttendanceWidgetReady(true);
          } catch (error) {
            console.error("Dashboard data fetch error:", error);
            clearTimeout(timeoutId);

            // Use fallback data on error
            setProfileData({
              user: { id: 1, name: "Student User" }
            });
            setAssignmentData([
              {
                id: 1,
                title: "Assignment 1",
                assignments: [{ id: 1, title: "Web Development", is_submitted: true }]
              },
              {
                id: 2,
                title: "Assignment 2",
                assignments: [{ id: 2, title: "Database Design", is_submitted: false }]
              }
            ]);
            setExamData([
              { id: 1, title: "Midterm Exam", obtained_marks: 75, max_marks: 100 }
            ]);

            // Don't show error, just use fallback data
            setError("");
            setLoading(false);

            // Always mark attendance widget as ready after data is loaded
            setAttendanceWidgetReady(true);
          }
        }
      } catch (err) {
        console.error("Dashboard load error:", err);

        // Use fallback data on error
        setProfileData({
          user: { id: 1, name: "Student User" }
        });
        setAssignmentData([
          {
            id: 1,
            title: "Assignment 1",
            assignments: [{ id: 1, title: "Web Development", is_submitted: true }]
          },
          {
            id: 2,
            title: "Assignment 2",
            assignments: [{ id: 2, title: "Database Design", is_submitted: false }]
          }
        ]);
        setExamData([
          { id: 1, title: "Midterm Exam", obtained_marks: 75, max_marks: 100 }
        ]);

        // Don't show error, just use fallback data
        setError("");
        setLoading(false);

        // Always mark attendance widget as ready after data is loaded
        setAttendanceWidgetReady(true);
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
    <div className="p-4 rounded-md bg-gray-50 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-24 bg-gray-200 rounded mb-2"></div>
    </div>
  );

  // Show error message if there's an error
  if (error) return <div className="p-10 text-red-600 text-center">{error}</div>;










// return(
//   <AssignmentPage apiData={assignmentData}/>
// )


  return (
    <>
      {/* Conditional rendering based on whether this is first load after login and user is not checked in */}
      {isFirstLoad && !isCheckedIn ? (
        // On first load and not checked in, prioritize attendance widget
        <>
          {/* Attendance Check-In Widget - Render this first on initial login */}
          <div className="w-full mb-4">
            <AttendanceCheckInWidget
              displayMode="card"
              key={`attendance-widget-${new Date().toISOString().split('T')[0]}`} // Force re-render on date change
            />
          </div>

          {/* Show loading indicator for other content */}
          {loading && (
            <div className="w-full p-2 mb-10 flex gap-2">
              <div className="relative min-h-[15.75rem] bg-gray-100 animate-pulse rounded-2xl flex items-center px-10 w-full">
                <div className="flex gap-2 w-3/4 justify-evenly">
                  <div className="h-36 w-36 rounded-full bg-gray-200"></div>
                  <div className="h-36 w-36 rounded-full bg-gray-200"></div>
                  <div className="h-36 w-36 rounded-full bg-gray-200"></div>
                </div>
              </div>
            </div>
          )}

          {/* Only render the rest of the components if attendance widget is ready */}
          {attendanceWidgetReady && !loading && (
            <>
              {/* Stats Card */}
              <section className="w-full p-2 mb-10">
                <div className="relative min-h-[15.75rem] rounded-2xl flex items-center px-10 w-full" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
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
                      <div className="text-center mt-2 text-sm text-gray-400 group-hover:text-white transition-colors">
                        {/* Click to view details */}
                      </div>
                    </div>

                    <CircularProgress
                      value={assignmentStats.submitted}
                      max={assignmentStats.total || 1}
                      label="Assignments"
                      size={140}
                      strokeWidth={12}
                    />

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

                  {/* Illustration - Only show when not loading */}
                  {!loading && (
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
                  )}
                </div>
              </section>

              {/* Rest of the components */}
              <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="w-full md:w-3/4">
                  <Suspense fallback={<LoadingFallback />}>
                    <UpcomingAnnouncements />
                  </Suspense>
                </div>
                <div className="w-full md:w-1/4">
                  <Suspense fallback={<LoadingFallback />}>
                    <StudentPlacedCard autoScroll={true} />
                  </Suspense>
                </div>
              </div>

              <Suspense fallback={<LoadingFallback />}>
                <StudentJourney onStartLearning={() => {
                  const path = location.pathname.split('/').slice(0, -1).join('/');
                  window.location.href = `${path}/my-courses`;
                }} />
              </Suspense>

              <div className="flex justify-between w-full px-1 my-10">
                <div className="w-2/5">
                  <Suspense fallback={<LoadingFallback />}>
                    <AttendanceTracker />
                  </Suspense>
                </div>
                <div className="w-3/5">
                  <Suspense fallback={<LoadingFallback />}>
                    <MyAssignment assignments={assignmentData} />
                  </Suspense>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        // For subsequent loads or if already checked in, show all content with attendance widget in normal position
        <>
          <section className="w-full p-2 mb-10 flex gap-2">
            {/* Stats Card - Show loading state or actual data */}
            <div className={`relative min-h-[15.75rem] ${loading ? 'bg-gray-100 animate-pulse' : ''} rounded-2xl flex items-center px-10 w-3/4`} style={!loading ? { background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' } : {}}>
              {loading ? (
                <div className="flex gap-2 w-3/4 justify-evenly">
                  <div className="h-36 w-36 rounded-full bg-gray-200"></div>
                  <div className="h-36 w-36 rounded-full bg-gray-200"></div>
                  <div className="h-36 w-36 rounded-full bg-gray-200"></div>
                </div>
              ) : (
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
                    <div className="text-center mt-2 text-sm text-gray-400 group-hover:text-white transition-colors">
                      {/* Click to view details */}
                    </div>
                  </div>

                  <CircularProgress
                    value={assignmentStats.submitted}
                    max={assignmentStats.total || 1}
                    label="Assignments"
                    size={140}
                    strokeWidth={12}
                  />

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
              )}

              {/* Illustration - Only show when not loading */}
              {!loading && (
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
              )}
            </div>

            {/* Attendance Check-In Widget */}
            <div className="w-1/4">
              <AttendanceCheckInWidget
                displayMode="card"
                key={`attendance-widget-${new Date().toISOString().split('T')[0]}`} // Force re-render on date change
              />
            </div>
          </section>

          {/* Only render the rest of the components if not loading or if attendance widget is ready */}
          {(attendanceWidgetReady || !loading) && (
            <>
              {/* Combined Announcements and Student Placement section */}
              <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="w-full md:w-3/4">
                  <Suspense fallback={<LoadingFallback />}>
                    <UpcomingAnnouncements />
                  </Suspense>
                </div>
                <div className="w-full md:w-1/4">
                  <Suspense fallback={<LoadingFallback />}>
                    <StudentPlacedCard autoScroll={true} />
                  </Suspense>
                </div>
              </div>

              <Suspense fallback={<LoadingFallback />}>
                <StudentJourney onStartLearning={() => {
                  const path = location.pathname.split('/').slice(0, -1).join('/');
                  window.location.href = `${path}/my-courses`;
                }} />
              </Suspense>

              {/* Assignments Section */}
              <div className="flex justify-between w-full px-1 my-10">
                <div className="w-full">
                  <Suspense fallback={<LoadingFallback />}>
                    <MyAssignment assignments={assignmentData} />
                  </Suspense>
                </div>
              </div>
            </>
          )}
        </>
      )}

      <ToastContainer />
    </>
  );
};

export default NewDashBoard;
