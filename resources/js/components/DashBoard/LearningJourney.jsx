"use client";

import { useEffect, useState } from "react";
import Circularprogress from "./Ui/Circularprogress";
import { apiRequest } from "../../utils/api";

export default function LearningJourney() {
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJourneyData = async () => {
      try {
        setLoading(true);
        const data = await apiRequest("student/journey");
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

  const calculateCurriculumProgress = (topics) => {
    if (!topics || topics.length === 0) return 0;
    const completed = topics.filter(t => t.is_topic_completed).length;
    return Math.round((completed / topics.length) * 100);
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading your learning journey...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!journey) return null;

  const cycles = journey.curriculums.map((curriculum, index) => {
    const progress = calculateCurriculumProgress(curriculum.topics);
    return {
      title: curriculum.curriculum.name,
      duration: `Tutor: ${curriculum.tutor?.name || "Unknown"}`,
      days: `${curriculum.topics.length} Topics`,
      progress: progress,
      color: index % 2 === 0 ? "bg-blue-400" : "bg-amber-400",
      items: curriculum.topics.map(topic => ({
        title: topic.topic_name,
        tags: [],
        progress: topic.is_topic_completed
      }))
    };
  });

  return (
    <div className=" w-full mx-5 p-6 bg-white">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">My Learning Journey</h1>

      {cycles.map((cycle, index) => (
        <div key={index} className="mb-12 relative">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-amber-500">{cycle.title}</h2>
              <span className="text-gray-500 ml-3 text-sm">({cycle.duration}) - {cycle.days}</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-44 bg-gray-200 rounded-full overflow-hidden mr-3">
                <div className={`h-full ${cycle.color} rounded-full`} style={{ width: `${cycle.progress}%` }} />
              </div>
              <span className={`font-medium `}>{cycle.progress}%</span>
            </div>
          </div>

          <div className="relative">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${cycle.color}`} />
            <div className="pl-6 space-y-4">
              {cycle.items.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700">{item.title}</span>
                    {item.tags.length > 0 && (
                      <div className="flex gap-2 mt-1">
                        {item.tags.map((tag, j) => (
                          <span
                            key={j}
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              tag === "HTML" ? "bg-green-100 text-green-800" :
                              tag === "CSS" ? "bg-orange-100 text-orange-800" :
                              tag === "BOOTSTRAP" ? "bg-blue-100 text-blue-800" :
                              tag === "FLEXBOX" ? "bg-green-100 text-green-800" :
                              tag === "PYTHON" ? "bg-green-100 text-green-800" :
                              tag === "JAVASCRIPT" ? "bg-blue-100 text-blue-800" :
                              tag === "SQL" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {item.progress !== null ? (
                    <Circularprogress value={item.progress} color="#22c55e" />
                  ) : (
                    <div className="w-8 h-8" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
