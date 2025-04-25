"use client";
import { Card, CardContent, CircularProgress, Button, Pagination, Select, MenuItem } from '@mui/material';
import { useEffect, useState } from "react";
import Circularprogress from "./Ui/Circularprogress";
import { apiRequest } from "../../utils/api";
import { useLocation } from "react-router-dom";
export default function LearningJourney({onCloseLearning}) {
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedCurriculums, setExpandedCurriculums] = useState([]);
  const location = useLocation();
  const trimmedPath = location.pathname
  .split('/')
  .slice(0, -1)
  .join('/') + '/';


  const statusColors = {
    Done: 'bg-green-100 text-green-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Not Started': 'bg-amber-100 text-amber-800'
  };

  useEffect(() => {
    const fetchJourneyData = async () => {
      try {
        setLoading(true);
        const data = await apiRequest("/student/journey");
        setJourney(data);
      } catch (err) {
        console.error("Error fetching journey data:", err);
        setError(err.message || "Failed to load journey data");
      } finally {
        setLoading(false);
      }
    };

    fetchJourneyData();
  }, []);

  const toggleCurriculum = (curriculumId) => {
    setExpandedCurriculums(prev =>
      prev.includes(curriculumId)
        ? prev.filter(id => id !== curriculumId)
        : [...prev, curriculumId]
    );
  };

  const calculateCurriculumProgress = (topics) => {
    if (!topics || topics.length === 0) return 0;
    const completed = topics.filter(t => t.is_topic_completed).length;
    return Math.round((completed / topics.length) * 100);
  };

  // Show loading state
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress sx={{ color: '#f97316' }} />
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      );
    }
  
    // Show error state
    if (error) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-2">Error</div>
            <p className="text-gray-600">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
              sx={{
                backgroundColor: '#f97316',
                '&:hover': { backgroundColor: '#ea580c' },
                marginTop: '16px'
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }
  if (!journey) return null;

  const cycles = journey.curriculums.map((curriculum, index) => {
    const progress = calculateCurriculumProgress(curriculum.topics);
    return {
      id: curriculum.id,
      title: curriculum.curriculum.name,
      duration: `Tutor: ${curriculum.tutor?.name || "Unknown"}`,
      days: `${curriculum.topics.length} Topics`,
      progress: progress,
      color: index % 2 === 0 ? "bg-blue-400" : "bg-amber-400",
      items: curriculum.topics.map(topic => ({
        title: topic.topic_name,
        is_completed: topic.is_topic_completed
      }))
    };
  });

  return (
    <div className="w-full mx-5 p-6 bg-white">
      <div className=" flex justify-between ">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">My Learning Journey</h1>
      <button className="text-3xl font-semibold text-gray-800 mb-8" onClick={onCloseLearning}><svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="red"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="cursor-pointer"
>
  <line x1="18" y1="6" x2="6" y2="18" />
  <line x1="6" y1="6" x2="18" y2="18" />
</svg>
</button>
      </div>

      {cycles.map((cycle) => (
        <div key={cycle.id} className="mb-12 relative">
          <div 
            className="flex justify-between items-center mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
            onClick={() => toggleCurriculum(cycle.id)}
          >
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-amber-500">
                {cycle.title}
                <span className="ml-3 text-gray-500 text-sm">
                  ({cycle.duration}) - {cycle.days}
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="h-2 w-44 bg-gray-200 rounded-full overflow-hidden mr-3">
                  <div 
                    className={`h-full ${cycle.color} rounded-full`} 
                    style={{ width: `${cycle.progress}%` }} 
                  />
                </div>
                <span className="font-medium">{cycle.progress}%</span>
              </div>
              <svg
                className={`w-6 h-6 transform transition-transform ${
                  expandedCurriculums.includes(cycle.id) ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {expandedCurriculums.includes(cycle.id) && (
            <div className="relative">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${cycle.color}`} />
              <div className="pl-6 space-y-4">
                {cycle.items.map((item, i) => {
                  const status = item.is_completed ? 'Done' : 'In Progress';
                  return (
                    <div
                      key={i}
                      className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center shadow-sm"
                    >
                      <a href={`${trimmedPath}my-courses`} className="flex flex-col flex-grow">
                        <span className="font-medium text-gray-700 mb-2">{item.title}</span>
                      </a>

                      <div className="ml-4 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
                          {status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}