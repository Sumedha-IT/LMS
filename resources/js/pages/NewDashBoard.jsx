import { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from "../components/DashBoard/CircularProgress";
import UpcomingAnnouncements from "../components/DashBoard/UpcomingAnnouncements";
import StudentPlacedCard from "../components/DashBoard/StudentPlacementslider";
import StudentJourney from "../components/DashBoard/StudentJourney";
import AttendanceTracker from "../components/DashBoard/AttendanceTracker";
import MyAssignment from "../components/DashBoard/MyAssignment";
import LearningJourney from "../components/DashBoard/LearningJourney";
import Announcements from "./Announcements";
import { apiRequest } from "../utils/api";
import { useLocation, useNavigate } from "react-router-dom";

const NewDashBoard = () => {
  const [showLearning, setShowLearning] = useState(false);
  const [profileData, setProfileData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const FetchUserdata = async () => {
      try {
        setLoading(true);
        const data = await apiRequest("/profile");
        
        // Redirect if role is not 6
        // if (data.user.role_id !== 6) {
        //   navigate('/adminstartor/1/');
        //   return;
        // }
        
        setProfileData(data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    FetchUserdata();
  }, [navigate]); // Added navigate to dependency array

  // Return null while loading or if profile data isn't available
  // if (loading || !profileData) {
  //   return null;
  // }

  // // Additional safety check
  // if (profileData.user.role_id !== 6) {
  //   return null;
  // }




  
  const trimmedPath = location.pathname
    .split('/')
    .slice(0, -1)
    .join('/') + '/';

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
              src="/storage/image.png"
              alt="Decorative illustration"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop if fallback also fails
                e.target.src = "/storage/fallback-image.png"; // Different fallback path
                e.target.alt = "Fallback decorative illustration";
              }}
            />
          </div>
        </div>
        <div className=" w-1/4">
          <StudentPlacedCard />
        </div>

      </section>

          <UpcomingAnnouncements />
          <StudentJourney onStartLearning={() => setShowLearning(true)} />
          
          <div className="hidden justify-between w-full px-1 my-10">
            <div className="w-2/5">
              <AttendanceTracker />
            </div>
            <div className="w-3/5">
              <MyAssignment />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NewDashBoard;