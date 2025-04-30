import { useState, useEffect, useMemo } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from "../components/DashBoard/CircularProgress";
import UpcomingAnnouncements from "../components/DashBoard/UpcomingAnnouncements";
import StudentPlacedCard from "../components/DashBoard/StudentPlacementslider";
import StudentJourney from "../components/DashBoard/StudentJourney";
import AttendanceTracker from "../components/DashBoard/AttendanceTracker";
import MyAssignment from "../components/DashBoard/MyAssignment";
import { apiRequest } from "../utils/api";
import { useLocation, useNavigate } from "react-router-dom";
import AssignmentPage from "../components/DashBoard/AssignmentPage";

const NewDashBoard = () => {
  const [profileData, setProfileData] = useState(null);
  const [assignmentData, setAssignmentData] = useState([]);
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [profile, assignments, exams] = await Promise.all([
          apiRequest("/profile"),
          apiRequest("/getUserAssignments"),
          apiRequest("/exam-chart"),
        ]);

        setProfileData(profile);
        setAssignmentData(assignments?.data || []);
        setExamData(exams?.data || []);

        // Uncomment for role check if needed
        // if (profile.user.role_id !== 6) navigate('/adminstartor/1/');
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError(err.message || "Something went wrong while loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

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

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-red-600 text-center">{error}</div>;










// return(
//   <AssignmentPage apiData={assignmentData}/>
// )


  return (
    <>
      <section className="w-full p-2 mb-10 flex gap-2">
        {/* Stats Card */}
        <div className="relative min-h-[15.75rem] bg-[#404040] rounded-2xl flex items-center px-10 w-3/4">
          <div className="flex gap-2 w-3/4 justify-evenly">
            <CircularProgress value={4} max={10} label="Attendance" size={140} strokeWidth={12} showPercentage />

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

          {/* Illustration */}
          <img
            className="absolute -top-16 w-[17rem] right-0"
            src="/storage/image.png"
            alt="Decorative illustration"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/storage/fallback-image.png";
              e.target.alt = "Fallback decorative illustration";
            }}
          />
        </div>

        {/* Placement Slider */}
        <div className="w-1/4">
          <StudentPlacedCard />
        </div>
      </section>

      <UpcomingAnnouncements />
      <StudentJourney onStartLearning={() => {}} />

      {/* Attendance and Assignments */}
      <div className="flex justify-between w-full px-1 my-10">
        <div className="w-2/5">
          <AttendanceTracker />
        </div>
        <div className="w-3/5">
          <MyAssignment assignments={assignmentData} />
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default NewDashBoard;
