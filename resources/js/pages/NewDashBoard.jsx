import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import CircularProgress from "../components/DashBoard/CircularProgress";
import PerformanceChart from "../components/DashBoard/PerformanceChart";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpcomingAnnouncements from "../components/DashBoard/UpcomingAnnouncements";
import StudentPlacedCard from "../components/DashBoard/StudentPlacementslider";
import StudentJourney from "../components/DashBoard/StudentJourney";
import AttendanceTracker from "../components/DashBoard/AttendanceTracker";
import MyAssignment from "../components/DashBoard/MyAssignment";

// Function to decode and parse the cookie
const getDecodedCookie = (cookieName) => {
  try {
    const cookieValue = Cookies.get(cookieName);
    if (!cookieValue) return null;
    const decodedValue = decodeURIComponent(cookieValue);
    return JSON.parse(decodedValue);
  } catch (error) {
    console.error('Error decoding cookie:', error);
    return null;
  }
};

const NewDashBoard = () => {
  const baseUrl = import.meta.env.VITE_APP_API_URL;
  const endpoint = "exam-chart";
  const url = `${baseUrl}${endpoint}`;

  const cookieData = getDecodedCookie('user_info');
  const token = cookieData?.token;


  // State to store the fetched exam chart data
  const [examChartData, setExamChartData] = useState(null);
  const [UserData, setUserData] = useState([]);
  // Hook for navigation
  const navigate = useNavigate();

  // Function to fetch exam-chart data
  async function fetchExamChartData() {
    try {
      if (!token) {
        throw new Error("No token found in cookie");
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching exam-chart data:", error);
      throw error;
    }
  }

  // Function to fetch profile data
  async function fetchProfileData() {
    try {
      if (!token) {
        throw new Error("No token found in cookie");
      }

      const profileUrl = `${baseUrl}profile`; // Endpoint for profile data
      const response = await fetch(profileUrl, {
        method: "GET",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching profile data:", error);
      throw error;
    }
  }

  useEffect(() => {
    // Fetch profile data and check role_id
    fetchProfileData()
      .then((profileData) => {
        // console.log("Profile data received:", profileData.user.role_id);
        setUserData(profileData);
        // Check if role_id is not 6
        if (profileData.user.role_id !== 6) {
          // Redirect to the home route
          navigate("/administrator/1");
        }
      })
      .catch((error) => {
        console.error("Failed to fetch profile data:", error);
        toast.error("Failed to fetch profile data");
      });

    // Fetch exam-chart data
    fetchExamChartData()
      .then((data) => {
        // console.log("Exam chart data received:", data);
        setExamChartData(data); // Store the fetched data in state
      })
      .catch((error) => {
        console.error("Failed to fetch exam-chart data:", error);
        toast.error("Failed to fetch exam-chart data");
      });
  }, [token, navigate]);

  return (
    <>
      <section className="w-full p-2 mb-10 hidden">
        <div className="relative min-h-[15.75rem]  rounded-2xl flex items-center px-10 w-full">
          <div className="flex justify-evenly bg-[#404040] w-[70%]">
            <CircularProgress value={4} max={10} label="Total Assignments" size={157} strokeWidth={12} showPercentage={true} />
            <CircularProgress value={4} max={10} label="Total Assignments" size={157} strokeWidth={12} showPercentage={true} />
            <CircularProgress value={4} max={10} label="Total Assignments" size={157} strokeWidth={12} showPercentage={false} />
            {/* <CircularProgress value={4} max={10} label="Total Assignments" size={157} strokeWidth={12} showPercentage={false} /> */}
            <div>

            </div>
          </div>
          <div className=" w-[30%]">
            <StudentPlacedCard />
          </div>

        </div>

      </section>

      <section className=" w-full p-2 mb-10 flex gap-2">
        <div className=" relative  min-h-[15.75rem] bg-[#404040]  rounded-2xl flex items-center px-10 w-3/4">
          <div className=" flex gap-2">
            <CircularProgress value={4} max={10} label="Total Assignments" size={157} strokeWidth={12} showPercentage={true} />
            <CircularProgress value={4} max={10} label="Total Assignments" size={157} strokeWidth={12} showPercentage={true} />
            <CircularProgress value={4} max={10} label="Total Assignments" size={157} strokeWidth={12} showPercentage={false} />
          </div>
          <div>
            <img className=" absolute -top-16  w-[20rem] right-5"
              src="/storage/image.png"
              alt="Image"
              onError={(e) => {
                e.target.src = "/storage/image.png";
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
      <StudentJourney/>
     <div className=" flex justify-between w-full px-1 my-10">
      <div className="  w-2/5">
      <AttendanceTracker/>
      </div>
      <div className=" w-3/5">
      <MyAssignment/>
      </div>
   
  
     </div>
      <ToastContainer />
    </>
  );
};

export default NewDashBoard;