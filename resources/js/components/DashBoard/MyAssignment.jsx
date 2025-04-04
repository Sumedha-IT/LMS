export default function MyAssignment({ assignments = [] }) {
  const sampleAssignments = [
    { task: "Physics Chapter", grade: "--/100", completed: false },
    { task: "Maths Chapter", grade: "80/100", completed: true },
    { task: "Chemistry Chapter", grade: "75/100", completed: true }
  ];

  const data = assignments.length > 0 ? assignments : sampleAssignments;

  return (
    <div className="w-full">
      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">My Assignments</h2>
          <a href="#" className="text-sm text-red-500 hover:text-red-600 transition-colors">
            View More
          </a>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-3 py-3">
          <div className="text-sm text-gray-500 font-medium">Task</div>
          <div className="text-sm text-gray-500 font-medium text-center">Grade</div>
          <div className="text-sm text-gray-500 font-medium text-center">Update</div>
        </div>

        {/* Assignments List */}
        <div className="border-t border-gray-100">
          {data.length > 0 ? (
            data.map((assignment, index) => (
              <div key={index} className="grid grid-cols-3 py-3 items-center  last:border-none">
                <div className="text-sm text-gray-700">{assignment.task}</div>
                <div className="text-sm text-gray-700 text-center">{assignment.grade ?? "--/100"}</div>
                <div className="flex justify-center">
                  <span
                    className={`px-3 py-1 text-xs rounded-md ${
                      assignment.completed
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {assignment.completed ? "Completed" : "Not Completed"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-3 text-center text-sm text-gray-500">No assignments available</div>
          )}
        </div>
      </div>
    </div>
  );
}