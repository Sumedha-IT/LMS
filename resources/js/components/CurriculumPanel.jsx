import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurriculumPanel = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const response = await axios.get('/api/tutor/subjects');
            setSubjects(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setLoading(false);
        }
    };

    const fetchTopics = async (subjectId) => {
        try {
            const response = await axios.get(`/api/tutor/subjects/${subjectId}/topics`);
            setTopics(response.data);
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    };

    const handleSubjectChange = (subjectId) => {
        setSelectedSubject(subjectId);
        fetchTopics(subjectId);
    };

    const markTopicCompleted = async (topicId, completed) => {
        try {
            await axios.post(`/api/tutor/topics/${topicId}/complete`, {
                completed,
                completed_date: completed ? new Date().toISOString() : null
            });
            // Refresh topics after marking as complete
            fetchTopics(selectedSubject);
        } catch (error) {
            console.error('Error marking topic as complete:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Curriculum Management</h2>
                <select
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    value={selectedSubject || ''}
                >
                    <option value="">Select a Subject</option>
                    {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedSubject && (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {topics.map((topic) => (
                            <li key={topic.id} className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-900">{topic.title}</h3>
                                        <p className="mt-1 text-sm text-gray-500">{topic.description}</p>
                                        {topic.completed_date && (
                                            <p className="mt-1 text-sm text-green-600">
                                                Completed on: {new Date(topic.completed_date).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <button
                                            onClick={() => markTopicCompleted(topic.id, !topic.completed)}
                                            className={`px-4 py-2 rounded-md text-sm font-medium ${
                                                topic.completed
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                            }`}
                                        >
                                            {topic.completed ? 'Mark Incomplete' : 'Mark Complete'}
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CurriculumPanel; 