export default function AssignmentsReport() {
  const data = [
    {
      module: "CMOS Fundamentals (CF)",
      total: 30,
      scored: 25,
      performance: "Excellent"
    },
    {
      module: "Scripting Language (SL)",
      total: 25,
      scored: 18,
      performance: "Strong"
    },
    {
      module: "Digital Design Flow (DDF)",
      total: 20,
      scored: 12,
      performance: "Needs Improvement"
    },
    {
      module: "SSTA",
      total: 15,
      scored: 6,
      performance: "Weak"
    },
    {
      module: "PNR",
      total: 15,
      scored: 6,
      performance: "Weak"
    },
  ];

  const getPerformanceColor = (performance) => {
    switch(performance) {
      case "Excellent": return "bg-green-100 text-green-800";
      case "Strong": return "bg-blue-100 text-blue-800";
      case "Needs Improvement": return "bg-yellow-100 text-yellow-800";
      default: return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className=" w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden ">
      <h1 className=" p-3 text-2xl w-full text-center  font-medium mb-4">Assignments Report</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className=" p-6">
            <tr className="bg-[#E53510] text-white font-medium text-xl">
              <th className="text-left px-4 py-3 font-semibold  border-b border-gray-200">Modules</th>
              <th className="px-4 py-3 font-semibold  border-b border-gray-200">Total Marks</th>
              <th className="px-4 py-3 font-semibold  border-b border-gray-200">Marks Scored</th>
              <th className="px-4 py-3 font-semibold  border-b border-gray-200">Performance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className=" p-6 hover:bg-gray-50 text-[#404040] text-base font-medium">
                <td className="px-4 py-3  border-b border-gray-200">{row.module}</td>
                <td className="px-4 py-3 text-center  border-b border-gray-200">{row.total}</td>
                <td className="px-4 py-3 text-center  border-b border-gray-200">{row.scored}</td>
                <td className="px-4 py-3 text-center border-b border-gray-200">
                  {/* <span className={`inline-block ${getPerformanceColor(row.performance)} rounded-full px-3 py-1 text-sm font-medium`}>
                    {row.performance}
                  </span> */}
                  <span className={`inline-block  rounded-full px-3 py-1 text-sm font-medium`}>
                    {row.performance}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}