import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api"; // Import the utility function
import CircularProgress from "../components/DashBoard/CircularProgress";
import PerformanceChart from "../components/DashBoard/PerformanceChart";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpcomingAnnouncements from "../components/DashBoard/UpcomingAnnouncements";
import StudentPlacedCard from "../components/DashBoard/StudentPlacementslider";
import StudentJourney from "../components/DashBoard/StudentJourney";
import AttendanceTracker from "../components/DashBoard/AttendanceTracker";
import MyAssignment from "../components/DashBoard/MyAssignment";
import LearningJourney from "../components/DashBoard/LearningJourney";

const NewDashBoard = () => {
  const [examChartData, setExamChartData] = useState(null);
  const [UserData, setUserData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch profile data and check role_id
    const fetchData = async () => {
      try {
        // Example using the utility function
        const profileData = await apiRequest("/profile");
        setUserData(profileData);

        // if (profileData.user.role_id !== 6) {
        //   navigate("/administrator/1");
        // }

        const examData = await apiRequest("/exam-chart");
        setExamChartData(examData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <>


      <section className="  w-full p-2 mb-10 flex gap-2">
        <div className=" relative  min-h-[15.75rem] bg-[#404040]  rounded-2xl flex items-center px-10 w-3/4">
          <div className=" flex gap-2 w-3/4 justify-evenly">
            <CircularProgress value={4} max={10} label="Total Assignments" size={150} strokeWidth={12} showPercentage={true} />
            <CircularProgress value={4} max={10} label="Total Assignments" size={150} strokeWidth={12} showPercentage={true} />
            <CircularProgress value={4} max={10} label="Total Assignments" size={150} strokeWidth={12} showPercentage={false} />
          </div>
          <div className="">
            <img
              className="absolute  -top-16 w-[17rem] right-0"
              src="/images/image 67.png"
              alt="Decorative illustration"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop if fallback also fails
                e.target.src = "/images/fallback-image.png"; // Different fallback path
                e.target.alt = "Fallback decorative illustration";
              }}
            />
          </div>
        </div>
        <div className=" w-1/4">
          <StudentPlacedCard />
        </div>

      </section>

      {/* Pass the fetched data to PerformanceChart */}
      {/* <PerformanceChart UserData={UserData} examChartData={examChartData} /> */}
      <UpcomingAnnouncements />
      <StudentJourney />
      <div className=" flex justify-between w-full px-1 my-10">
        <div className="  w-2/5">
          <AttendanceTracker />
        </div>
        <div className=" w-3/5">
          <MyAssignment />
        </div>


      </div>
      <ToastContainer />
      {/* <LearningJourney/> */}
    </>
  );
};

export default NewDashBoard;