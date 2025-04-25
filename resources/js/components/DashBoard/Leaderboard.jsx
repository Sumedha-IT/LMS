import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import Cookies from "js-cookie";
export default function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [currentStudentId, setCurrentStudentId] = useState(null);



    useEffect(() => {

        // Read cookie
        const studentIdFromCookie = Cookies.get("x_path_id");
        if (studentIdFromCookie) {
            setCurrentStudentId(studentIdFromCookie);
        }
        const fetchData = async () => {
            try {
                const response = await apiRequest("/leaderboard");
                setLeaderboardData(response[0]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();


    }, []);


    console.log(currentStudentId)

    return (
        <div className="w-full h-full max-w-xs mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-[#404040]">Leaderboard</h2>
            </div>

            <div className="divide-y divide-gray-200">
                {/* Header Row */}
                <div className="grid grid-cols-2 bg-[#E53510] px-4 text-white font-medium">
                    <div className="p-3 pl-4">Name</div>
                    <div className="p-3 text-right pr-4">Score</div>
                </div>

                {/* Data Rows */}
                {leaderboardData.map((item, index) => (
                    <div
                        key={index}
                        className={`grid px-4 text-base grid-cols-2  ${ currentStudentId == item.StudentId ? "bg-[#FFF1ED] text-[#E53510]" : " text-[#404040]"}`}
                    >
                        <div className="p-3 pl-4  overflow-hidden break-words max-w-44">
                            {item.StudentName}
                        </div>
                        <div className="p-3 text-right pr-4 ">
                            {item.Score || 0}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}