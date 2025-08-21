import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import Cookies from "js-cookie";

export default function AssignmentsReport({ assignmentData: propAssignmentData = null }) {
  const [Assignment, setAssignment] = useState([]);

  useEffect(() => {
    // If assignment data is provided as props, use it
    if (propAssignmentData) {
      setAssignment(propAssignmentData);
    } else {
      // Fallback to API call only if no data provided (for backward compatibility)
      const FetchUserdata = async () => {
        try {
          const userId = Cookies.get("x_path_id");
          if (!userId) {
            throw new Error("No user ID found");
          }
          const data1 = await apiRequest("/getUserAssignments", {
            params: {
              student_id: userId
            }
          });
          setAssignment(data1.data);
        } catch (err) {
          console.error("Error fetching profile data:", err);
        }
      };
      FetchUserdata();
    }
  }, [propAssignmentData]);

  const getPerformanceColor = (performance) => {
    switch(performance) {
      case "Excellent": return "bg-green-100 text-green-800";
      case "Strong": return "bg-blue-100 text-blue-800";
      case "Needs Improvement": return "bg-yellow-100 text-yellow-800";
      default: return "bg-red-100 text-red-800";
    }
  };

  // Get filtered submitted assignments
  const submittedAssignments = Assignment.filter(row => 
    row.assignments?.[0]?.is_submitted === true
  );

  return (
    <div className="w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div style={{
        background: 'linear-gradient(270deg, #0f1f3d 0%, #1e3c72 100%)',
        borderTopLeftRadius: '0.75rem',
        borderTopRightRadius: '0.75rem',
        padding: '1rem',
        marginBottom: 0
      }}>
        <h1 className="text-2xl w-full text-center font-medium mb-0 text-white">Assignments Report</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="p-6">
            <tr style={{background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)', color: 'white'}} className="font-medium text-xl">
              <th className="text-left px-4 py-3 font-semibold border-b border-gray-200">Name</th>
              <th className="px-4 py-3 font-semibold border-b border-gray-200">Topic</th>
              <th className="px-4 py-3 font-semibold border-b border-gray-200">Marks Scored</th>
              <th className="px-4 py-3 font-semibold border-b border-gray-200">Total Marks</th>
            </tr>
          </thead>
          <tbody>
            {submittedAssignments.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-3 text-center border-b border-gray-200">
                  No submitted assignments found
                </td>
              </tr>
            ) : (
              submittedAssignments.map((row, index) => (
                <tr key={index} className="p-6 hover:bg-gray-50 text-[#404040] text-base font-medium">
                  <td className="px-4 py-3 border-b border-gray-200">{row.topic_name ?? "-"}</td>
                  <td className="px-4 py-3 text-center border-b border-gray-200">
                    {row.assignments[0].name ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-center border-b border-gray-200">
                    {row.assignments[0].marks_scored ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-center border-b border-gray-200">
                    {row.assignments[0].total_marks ?? "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}