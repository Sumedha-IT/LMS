import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NoCourses from '../components/NoCourses';
import { FaFilePdf, FaFileImage, FaYoutube, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFile, FaLink } from 'react-icons/fa';

const API_URL = import.meta.env.REACT_APP_API_URL;

// CircularProgress Component
const CircularProgress = ({ percentage, size = 40, strokeWidth = 4, white = false }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle
                    className={white ? "text-white/20" : "text-gray-200"}
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={white ? "text-white" : "text-orange-600"}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-semibold ${white ? "text-white" : "text-gray-700"}`}>{percentage}%</span>
            </div>
        </div>
    );
};

function getCookie(name) {
  let cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    let [key, value] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

// Function to get default image if curriculum image is not available
const getDefaultCurriculumImage = () => {
    return '/images/placeholder.jpg';
};

const MyCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // New state variables for expanded functionality
    const [expandedCurriculums, setExpandedCurriculums] = useState({});
    const [selectedCurriculum, setSelectedCurriculum] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [topics, setTopics] = useState([]);
    const [topicsMap, setTopicsMap] = useState({}); // Store topics for each curriculum
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [currentMaterialIndex, setCurrentMaterialIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('materials');
    const [assignments, setAssignments] = useState([]);
    const [loadingAssignments, setLoadingAssignments] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [submissionFile, setSubmissionFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissions, setSubmissions] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const viewerRef = useRef(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        const handleFullScreenChange = () => {
            const fsElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
            setIsFullScreen(!!fsElement && fsElement.id === 'teaching-material-viewer');
        };
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
        document.addEventListener('mozfullscreenchange', handleFullScreenChange);
        document.addEventListener('MSFullscreenChange', handleFullScreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
        };
    }, []);

    const fetchCourses = async () => {
        try {
            const userInfo = getCookie("user_info");
            let userData;

            try {
                userData = userInfo ? JSON.parse(userInfo) : null;
                if (!userData?.token) {
                    toast.error('Authentication required');
                    setLoading(false);
                    return;
                }

                const userId = getCookie("x_path_id");
                if (!userId) {
                    toast.error('User ID not found');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`/api/courses/my/${userId}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': userData.token,
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    withCredentials: true
                });

                if (response.data.courses) {
                    setCourses(response.data.courses);

                    // Fetch topics for all curriculums immediately
                    for (const course of response.data.courses) {
                        for (const curriculum of course.curriculums) {
                            try {
                                const topicsResponse = await axios.get(`/api/courses/curriculums/${curriculum.id}/topics`, {
                                    headers: {
                                        'Accept': 'application/json',
                                        'Authorization': userData.token,
                                        'Content-Type': 'application/json',
                                        'X-Requested-With': 'XMLHttpRequest'
                                    },
                                    withCredentials: true
                                });

                                if (topicsResponse.data) {
                                    const topicsData = topicsResponse.data.topics || topicsResponse.data;
                                    setTopicsMap(prev => ({
                                        ...prev,
                                        [curriculum.id]: topicsData
                                    }));
                                    updateCurriculumProgress(curriculum.id, topicsData);
                                }
                            } catch (error) {
                                // Silently handle topic fetching errors
                            }
                        }
                    }

                    if (response.data.courses.length === 0) {
                        setError('No courses found');
                    }
                } else {
                    setError('No courses available');
                }
            } catch (error) {
                if (error.response?.status === 403) {
                    toast.error('You do not have permission to access these courses');
                } else {
                    toast.error(error.response?.data?.message || 'Failed to load courses');
                }
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to fetch courses';
            setError(errorMessage);
            setLoading(false);

            if (err.message === 'Authentication required' || err.response?.status === 401) {
                navigate('/administrator/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const getMaterialIcon = (material) => {
        if (material.material_source === 'file') {
            const fileExtension = material.file?.split('.').pop()?.toLowerCase();
            switch (fileExtension) {
                case 'pdf': return <FaFilePdf className="text-red-500" />;
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                case 'webp': return <FaFileImage className="text-blue-500" />;
                case 'doc':
                case 'docx': return <FaFileWord className="text-blue-600" />;
                case 'xls':
                case 'xlsx': return <FaFileExcel className="text-green-600" />;
                case 'ppt':
                case 'pptx': return <FaFilePowerpoint className="text-orange-600" />;
                default: return <FaFile className="text-gray-500" />;
            }
        } else if (material.material_source === 'url' && material.content?.includes('youtube.com')) {
            return <FaYoutube className="text-red-500" />;
        }
        return <FaLink className="text-blue-500" />;
    };

    const toggleFullScreen = (elementId) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        if (!document.fullscreenElement) {
            element.requestFullscreen().catch(err => {
                toast.error(`Could not enable full-screen mode`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const handleCurriculumClick = async (curriculum) => {
        const newExpandedState = !expandedCurriculums[curriculum.id];

        // Close all other curriculums and reset content
        const newExpandedCurriculums = {};
        if (newExpandedState) {
            newExpandedCurriculums[curriculum.id] = true;
        }
        setExpandedCurriculums(newExpandedCurriculums);

        // Reset all content when switching curriculums
        setSelectedTopic(null);
        setTopics([]);
        setMaterials([]);
        setSelectedMaterial(null);
        setAssignments([]);
        setSelectedAssignment(null);
        setActiveTab('materials');

        if (newExpandedState) {
            setSelectedCurriculum(curriculum);
            if (topicsMap[curriculum.id]) {
                setTopics(topicsMap[curriculum.id]);
            } else {
                await fetchTopics(curriculum.id);
            }
        } else {
            setSelectedCurriculum(null);
        }
    };

    // Add new function to calculate curriculum progress
    const updateCurriculumProgress = (curriculumId, topicsData) => {
        if (!topicsData || topicsData.length === 0) return;

        const completedTopics = topicsData.filter(topic => topic.is_completed).length;
        const totalTopics = topicsData.length;
        const progress = Math.round((completedTopics / totalTopics) * 100);

        setCourses(prevCourses => {
            return prevCourses.map(course => ({
                ...course,
                curriculums: course.curriculums.map(curr =>
                    curr.id === curriculumId
                        ? { ...curr, progress: progress }
                        : curr
                )
            }));
        });
    };

    // Function to determine topic status and accessibility
    const getTopicStatus = (topics, currentTopic) => {
        const currentIndex = topics.findIndex(t => t.id === currentTopic.id);
        const previousTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;

        if (currentTopic.is_completed) {
            return {
                status: 'Done',
                color: 'green',
                accessible: true
            };
        } else if (currentIndex === 0 || (previousTopic && previousTopic.is_completed)) {
            return {
                status: 'In Progress',
                color: 'blue',
                accessible: true
            };
        } else {
            return {
                status: 'Not Started',
                color: 'amber',
                accessible: false
            };
        }
    };

    const handleTopicClick = async (topic) => {
        const topicStatus = getTopicStatus(topics, topic);
        if (!topicStatus.accessible) {
            toast.warning('Please complete the previous topic first');
            return;
        }

        setSelectedTopic(topic);
        setSelectedAssignment(null);

        if (topic?.id) {
            await Promise.all([
                fetchMaterials(topic.id),
                fetchAssignments(topic.id)
            ]);
        }
    };

    const formatDate = (date) => {
        if (!date || date === 'null' || date === null) {
            return 'No date set';
        }

        try {
            const dateObj = new Date(date);

            if (isNaN(dateObj.getTime())) {
                return 'Invalid date';
            }

            return dateObj.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata'
            });
        } catch (error) {
            return 'Error formatting date';
        }
    };

    const isAssignmentOverdue = (stopSubmission) => {
        if (!stopSubmission) return false;
        const now = new Date();
        const stopDate = new Date(stopSubmission);
        return now > stopDate;
    };

    const isSubmissionWindowOpen = (startSubmission, stopSubmission) => {
        const now = new Date();
        const start = startSubmission ? new Date(startSubmission) : null;
        const stop = stopSubmission ? new Date(stopSubmission) : null;

        if (!start && !stop) return true;
        if (start && !stop) return now >= start;
        if (!start && stop) return now <= stop;
        return now >= start && now <= stop;
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSubmissionFile(file);
        }
    };

    // Add Success Modal Component
    const SuccessModal = ({ onClose, onViewSubmission }) => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <div className="text-center">
                        <div className="mb-6">
                            <img
                                src="/images/courses/sub.png"
                                alt="Success"
                                className="mx-auto w-64"
                            />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                            Assignment Submitted Successfully
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Your assignment has been submitted successfully! You can track its status or upload a new assignment if needed
                        </p>
                        <div className="flex space-x-4 justify-center">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                Close
                            </button>
                            <button
                                onClick={onViewSubmission}
                                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                            >
                                View Submission
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleSubmitAssignment = async () => {
        if (!selectedAssignment) {
            toast.error('Please select an assignment first');
            return;
        }

        if (!isSubmissionWindowOpen(selectedAssignment.start_submission, selectedAssignment.stop_submission)) {
            if (selectedAssignment.start_submission && new Date() < new Date(selectedAssignment.start_submission)) {
                toast.error(`Submission window opens on ${formatDate(selectedAssignment.start_submission)}`);
            } else if (selectedAssignment.stop_submission && new Date() > new Date(selectedAssignment.stop_submission)) {
                toast.error(`Submission deadline was ${formatDate(selectedAssignment.stop_submission)}`);
            }
            return;
        }

        if (!selectedAssignment.section_id) {
            toast.error('Invalid assignment selected');
            return;
        }

        if (!submissionFile) {
            toast.error('Please select a file to submit');
            return;
        }

        try {
            setIsSubmitting(true);
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);
            const correctBatchId = 27;

            const formData = new FormData();
            formData.append('file', submissionFile);
            formData.append('teaching_material_id', selectedAssignment.section_id);
            formData.append('batch_id', correctBatchId);

            const response = await axios.post('/api/submit-assignment', formData, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': userData.token,
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (response.data.message && response.data.message.includes('successfully')) {
                setShowSuccessModal(true); // Show success modal instead of toast
                setSubmissionFile(null);
                await fetchAssignments(selectedTopic.id);
            } else {
                toast.error(response.data.message || 'Failed to submit assignment');
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors).forEach(err => {
                    toast.error(err[0]);
                });
            } else {
                toast.error(error.response?.data?.message || 'Failed to submit assignment');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchTopics = async (curriculumId) => {
        try {
            setLoadingTopics(true);
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const topicsResponse = await axios.get(`/api/courses/curriculums/${curriculumId}/topics`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': userData.token,
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                withCredentials: true
            });

            if (topicsResponse.data) {
                const topicsData = topicsResponse.data.topics || topicsResponse.data;
                // Store topics in the map and set current topics
                setTopicsMap(prev => ({
                    ...prev,
                    [curriculumId]: topicsData
                }));
                setTopics(topicsData);
                // Update curriculum progress when topics are fetched
                updateCurriculumProgress(curriculumId, topicsData);
            }
        } catch (error) {
            setTopics([]);
            // Show a toast notification for error
            toast.error('Failed to load topics. Please try again.');
        } finally {
            setLoadingTopics(false);
        }
    };

    const fetchMaterials = async (topicId) => {
        try {
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const response = await axios.get(`/api/teaching-materials/${topicId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': userData.token,
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                withCredentials: true
            });

            if (response.data) {
                const materialsData = response.data.data || [];
                setMaterials(materialsData);
                if (materialsData.length > 0) {
                    setSelectedMaterial(materialsData[0]);
                    setCurrentMaterialIndex(0);
                } else {
                    setSelectedMaterial(null);
                    setCurrentMaterialIndex(0);
                }
            }
        } catch (error) {
            // Don't show error toast to avoid disrupting UX
        }
    };

    const fetchAssignments = async (topicId) => {
        try {
            setLoadingAssignments(true);
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const response = await axios.get(`/api/teaching-materials/${topicId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': userData.token,
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                withCredentials: true
            });

            if (response.data?.data) {
                const assignmentsData = response.data.data
                    .filter(item => item.doc_type === 2)
                    .map(assignment => {
                        const start = assignment.start_submission ? new Date(assignment.start_submission) : null;
                        const stop = assignment.stop_submission ? new Date(assignment.stop_submission) : null;

                        return {
                            ...assignment,
                            start_submission: start ? start.toISOString() : null,
                            stop_submission: stop ? stop.toISOString() : null
                        };
                    });

                setAssignments(assignmentsData);

                // Fetch submission status for each assignment
                for (const assignment of assignmentsData) {
                    if (assignment.id) {
                        await fetchSubmissionStatus(assignment.id);
                    }
                }
            } else {
                setAssignments([]);
            }
        } catch (error) {
            // Don't show error toast to avoid disrupting UX
            setAssignments([]);
        } finally {
            setLoadingAssignments(false);
        }
    };

    const fetchSubmissionStatus = async (assignmentId) => {
        if (!assignmentId) return;

        try {
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const response = await axios.get(`/api/assignment-submission/${assignmentId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': userData.token,
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                withCredentials: true
            });

            if (response.data?.submission) {
                setSubmissions(prev => ({
                    ...prev,
                    [assignmentId]: response.data.submission
                }));
            }
        } catch (error) {
            // Silently handle submission status errors
        }
    };

    const renderMaterialContent = (material) => {
        if (!material) return null;

        if (material.material_source === 'file' || material.material_source === 'other') {
            const fileUrl = material.file;
            if (!fileUrl) {
                return (
                    <div className="flex flex-col items-center justify-center h-full">
                        <FaFile className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-600">File not available</p>
                    </div>
                );
            }

            const fileExtension = fileUrl.split('.').pop()?.toLowerCase();

            switch (fileExtension) {
                case 'pdf':
                    return (
                        <div className="w-full h-full bg-white rounded-lg overflow-hidden">
                            <iframe
                                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="w-full h-full border border-gray-200"
                                style={{ height: 'calc(75vh - 2rem)' }}
                                title={material.material_name}
                            />
                        </div>
                    );
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                case 'webp':
                    return (
                        <div className="flex items-center justify-center h-full bg-gray-800 rounded-lg overflow-hidden">
                            <img
                                src={fileUrl}
                                alt={material.material_name}
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                    );
                case 'doc':
                case 'docx':
                case 'xls':
                case 'xlsx':
                case 'ppt':
                case 'pptx':
                    return (
                        <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden">
                            <iframe
                                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}&ui=false&rs=false&wdHideGridlines=true&wdHideHeaders=true`}
                                className="w-full h-full"
                                title={material.material_name}
                                style={{ border: 'none' }}
                            />
                        </div>
                    );
                default:
                    return (
                        <div className="flex flex-col items-center justify-center h-full">
                            <FaFile className="w-16 h-16 text-gray-400 mb-4" />
                            <p className="text-gray-600">This file type cannot be previewed</p>
                        </div>
                    );
            }
        } else if (material.material_source === 'url') {
            if (material.content?.includes('youtube.com')) {
                const videoId = material.content.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                return videoId ? (
                    <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden">
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            className="w-full h-full"
                            title={material.material_name}
                            allowFullScreen
                            style={{ border: 'none' }}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Invalid YouTube URL</p>
                    </div>
                );
            } else {
                return (
                    <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden">
                        <iframe
                            src={material.content}
                            className="w-full h-full"
                            title={material.material_name}
                            allowFullScreen
                            style={{ border: 'none' }}
                        />
                    </div>
                );
            }
        }
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Content not available</p>
            </div>
        );
    };

    const renderAssignmentContent = (assignment) => {
        if (!assignment) return null;

        const fileUrl = assignment.file;
        if (!fileUrl) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <FaFile className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="text-gray-600">Assignment file not available</p>
                </div>
            );
        }

        const fileExtension = fileUrl.split('.').pop()?.toLowerCase();

        switch (fileExtension) {
            case 'pdf':
                return (
                    <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden relative">
                        <button
                            onClick={() => toggleFullScreen('assignment-viewer')}
                            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors duration-200"
                            title="Toggle Full Screen"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-9v4m0-4h-4m4 4l-5 5M4 16v4m0-4h4m-4 4l5-5m11 5v-4m0 4h-4m4-4l-5 5" />
                            </svg>
                        </button>
                        <div id="assignment-viewer" className="w-full h-full">
                            <iframe
                                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="w-full h-full"
                                title={assignment.material_name}
                                style={{ border: 'none', backgroundColor: 'white' }}
                            />
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full">
                        <FaFile className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-600">This file type cannot be previewed</p>
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error === 'No courses found' || error === 'No courses available') {
        return <NoCourses />;
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className={`flex gap-4 ${selectedTopic ? 'space-x-4' : ''}`}>
                {/* Left Side - Curriculums and Topics */}
                <div className={`${selectedTopic ? 'w-1/3' : 'w-full'} transition-all duration-300`}>
                    <div className="space-y-4">
                        {courses.flatMap(course =>
                            course.curriculums.map(curriculum => (
                                <div key={curriculum.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                    {/* Curriculum Header */}
                                    <div
                                        onClick={() => handleCurriculumClick(curriculum)}
                                        className="p-4 bg-orange-600 text-white flex justify-between items-center cursor-pointer hover:bg-orange-700 transition-colors duration-200"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white">
                                                <img
                                                    src={curriculum.image || getDefaultCurriculumImage()}
                                                    alt={curriculum.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = getDefaultCurriculumImage();
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-medium">{curriculum.name}</h2>
                                                <p className="text-sm text-white/80">{course.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <CircularProgress
                                                percentage={curriculum.progress || 0}
                                                size={45}
                                                strokeWidth={4}
                                                white={true}
                                            />
                                            <svg
                                                className={`w-6 h-6 transform transition-transform duration-200 ${expandedCurriculums[curriculum.id] ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Topics List */}
                                    {expandedCurriculums[curriculum.id] && (
                                        <div className="divide-y divide-gray-200">
                                            {loadingTopics ? (
                                                <div className="p-4 flex justify-center items-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                                                </div>
                                            ) : topics.length === 0 ? (
                                                <div className="p-4 text-center text-gray-500">
                                                    No topics available
                                                </div>
                                            ) : (
                                                topics.map((topic) => {
                                                    const topicStatus = getTopicStatus(topics, topic);
                                                    return (
                                                        <div
                                                            key={topic.id}
                                                            onClick={() => handleTopicClick(topic)}
                                                            className={`p-4 transition-colors duration-200 ${
                                                                !topicStatus.accessible ?
                                                                'cursor-not-allowed opacity-60' :
                                                                'cursor-pointer hover:bg-gray-50'
                                                            } ${
                                                                selectedTopic?.id === topic.id ? 'bg-orange-50' : ''
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="flex-shrink-0">
                                                                        {topic.is_completed ? (
                                                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                                                <svg
                                                                                    className="w-6 h-6 text-green-600"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    viewBox="0 0 24 24"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        strokeWidth={2}
                                                                                        d="M5 13l4 4L19 7"
                                                                                    />
                                                                                </svg>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                                                <svg
                                                                                    className="w-6 h-6 text-gray-400"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    viewBox="0 0 24 24"
                                                                                >
                                                                                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                                                                                </svg>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-lg font-medium text-gray-800">{topic.name}</h3>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-3">
                                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${topicStatus.status === 'Done' ? 'bg-green-100 text-green-800' : topicStatus.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                                                                        {topicStatus.status}
                                                                    </span>
                                                                    {!topicStatus.accessible && (
                                                                        <svg
                                                                            className="w-5 h-5 text-amber-600"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M12 15v2m0 0v2m0-2h2m-2 0H8m4-6V4"
                                                                            />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Side - Content Display */}
                {selectedTopic && (
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
                            {/* Selected Curriculum Header */}
                            <div className="border-b border-gray-200">
                                <div className="px-6 py-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        {selectedCurriculum?.name}
                                    </h2>
                                </div>
                            </div>

                            {/* Selected Topic Header */}
                            <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
                                <h3 className="text-lg font-medium text-gray-800">
                                    {selectedTopic.name}
                                </h3>
                            </div>

                            {/* Content Container */}
                            <div className="p-6">
                                {/* Navigation Box */}
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                                    {/* Navigation Tabs */}
                                    <div className="flex border-b border-gray-200">
                                        <button
                                            onClick={() => setActiveTab('materials')}
                                            className={`flex-1 px-6 py-3 text-center font-medium transition-colors duration-200 ${
                                                activeTab === 'materials'
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            Teaching Material
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('assignments')}
                                            className={`flex-1 px-6 py-3 text-center font-medium transition-colors duration-200 ${
                                                activeTab === 'assignments'
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            Assignments
                                        </button>
                                        {selectedAssignment && (
                                            <button
                                                onClick={() => setActiveTab('submit')}
                                                className={`flex-1 px-6 py-3 text-center font-medium transition-colors duration-200 ${
                                                    activeTab === 'submit'
                                                    ? 'bg-orange-600 text-white'
                                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                Submit Assignment
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    {activeTab === 'materials' ? (
                                        // Teaching Materials Content
                                        <>
                                            {selectedMaterial ? (
                                                <div
                                                    className={`bg-white rounded-lg shadow-md p-6 relative${isFullScreen ? ' fullscreen' : ''}`}
                                                    style={isFullScreen ? { minHeight: '100vh', height: '100vh', width: '100vw', padding: 0, borderRadius: 0, boxShadow: 'none', background: '#111' } : { minHeight: '75vh' }}
                                                    id="teaching-material-viewer"
                                                    ref={viewerRef}
                                                >
                                                    {/* Fullscreen Button */}
                                                    <button
                                                        onClick={() => toggleFullScreen('teaching-material-viewer')}
                                                        className="absolute top-4 right-4 z-10 bg-orange-600 hover:bg-orange-700 text-white rounded-full p-2 shadow-md focus:outline-none"
                                                        title="Fullscreen"
                                                    >
                                                        {/* Simple SVG fullscreen icon */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h2M20 8V6a2 2 0 00-2-2h-2M4 16v2a2 2 0 002 2h2M20 16v2a2 2 0 01-2 2h-2" />
                                                        </svg>
                                                    </button>
                                                    {/* PDF Viewer */}
                                                    {selectedMaterial.material_source === 'file' && selectedMaterial.file?.toLowerCase().endsWith('.pdf') ? (
                                                        <div className="relative w-full h-full" style={isFullScreen ? { height: 'calc(100vh - 0px)' } : {}}>
                                                            <iframe
                                                                src={`${selectedMaterial.file}#toolbar=0&navpanes=0&scrollbar=0`}
                                                                className="w-full h-full border border-gray-200 rounded"
                                                                style={isFullScreen ? { height: '100vh', width: '100vw', border: 'none', background: '#111' } : { height: 'calc(75vh - 2rem)' }}
                                                                title={selectedMaterial.material_name}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-full">
                                                            {renderMaterialContent(selectedMaterial)}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border-2 border-dashed border-gray-300">
                                                    <div className="bg-gray-100 rounded-full p-4 mb-4">
                                                        <svg
                                                            className="w-12 h-12 text-gray-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1.5}
                                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Materials Available</h3>
                                                    <p className="text-gray-500 text-center max-w-md">
                                                        There are currently no learning materials available for this topic.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Navigation Buttons with consistent styling */}
                                            {materials.length > 1 && (
                                                <div className="mt-4 flex justify-between">
                                                    <button
                                                        onClick={() => {
                                                            if (currentMaterialIndex > 0) {
                                                                setCurrentMaterialIndex(prev => prev - 1);
                                                                setSelectedMaterial(materials[currentMaterialIndex - 1]);
                                                            }
                                                        }}
                                                        disabled={currentMaterialIndex === 0}
                                                        className={`px-4 py-2 rounded ${
                                                            currentMaterialIndex === 0
                                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                            : 'bg-orange-600 text-white hover:bg-orange-700'
                                                        }`}
                                                    >
                                                        Previous
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (currentMaterialIndex < materials.length - 1) {
                                                                setCurrentMaterialIndex(prev => prev + 1);
                                                                setSelectedMaterial(materials[currentMaterialIndex + 1]);
                                                            }
                                                        }}
                                                        disabled={currentMaterialIndex === materials.length - 1}
                                                        className={`px-4 py-2 rounded ${
                                                            currentMaterialIndex === materials.length - 1
                                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                            : 'bg-orange-600 text-white hover:bg-orange-700'
                                                        }`}
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : activeTab === 'assignments' ? (
                                        // Assignments Content with consistent styling
                                        <div className="bg-white rounded-lg shadow-md p-6">
                                            {loadingAssignments ? (
                                                <div className="flex justify-center items-center h-64">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></div>
                                                </div>
                                            ) : assignments.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8">
                                                    <div className="bg-gray-100 rounded-full p-4 mb-4">
                                                        <svg
                                                            className="w-12 h-12 text-gray-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1.5}
                                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Assignments Available</h3>
                                                    <p className="text-gray-500 text-center max-w-md">
                                                        There are currently no assignments for this topic.
                                                    </p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="space-y-4 p-6">
                                                        {assignments.map((assignment) => {
                                                            const isOverdue = isAssignmentOverdue(assignment.stop_submission);
                                                            const isWindowOpen = isSubmissionWindowOpen(assignment.start_submission, assignment.stop_submission);
                                                            const startDate = formatDate(assignment.start_submission);
                                                            const dueDate = formatDate(assignment.stop_submission);

                                                            return (
                                                                <div
                                                                    key={assignment.id}
                                                                    className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                                                    onClick={() => setSelectedAssignment(assignment)}
                                                                >
                                                                    <div className="p-6">
                                                                        <div className="flex items-start justify-between">
                                                                            <div className="flex-grow">
                                                                                <div className="flex items-center justify-between mb-2">
                                                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                                                        {assignment.material_name}
                                                                                    </h3>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        {submissions[assignment.id] && (
                                                                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                                                                                Submitted
                                                                                            </span>
                                                                                        )}
                                                                                        {isOverdue && !submissions[assignment.id] && (
                                                                                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                                                                                Overdue
                                                                                            </span>
                                                                                        )}
                                                                                        {!isWindowOpen && !isOverdue && (
                                                                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                                                                                Not Open Yet
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <p className="text-gray-600 mb-4">
                                                                                    {assignment.description || 'No description available'}
                                                                                </p>
                                                                                <div className="flex flex-col space-y-2">
                                                                                    <p className={`text-sm ${startDate === 'No date set' ? 'text-yellow-600' : 'text-gray-500'}`}>
                                                                                        <span className="font-medium">Start Date:</span> {startDate}
                                                                                    </p>
                                                                                    <p className={`text-sm ${dueDate === 'No date set' ? 'text-yellow-600' : 'text-gray-500'}`}>
                                                                                        <span className="font-medium">Due Date:</span> {dueDate}
                                                                                    </p>
                                                                                    {submissions[assignment.id] && (
                                                                                        <p className="text-sm text-green-600">
                                                                                            Submitted: {formatDate(submissions[assignment.id].created_at)}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center ml-4">
                                                                                {getMaterialIcon(assignment)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Assignment Content Display */}
                                                    {selectedAssignment && (
                                                        <div className="border-t border-gray-200 p-6 bg-white">
                                                            <div className="mb-6">
                                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Assignment Content</h3>
                                                                {renderAssignmentContent(selectedAssignment)}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ) : activeTab === 'submit' && selectedAssignment && (
                                        // Submit Assignment Tab Content with consistent styling
                                        <div className="bg-white rounded-lg shadow-md p-6">
                                            <div className="max-w-4xl mx-auto p-8">
                                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                                    {/* Header */}
                                                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                                                        <h2 className="text-2xl font-bold text-white">Submit Assignment</h2>
                                                        <p className="text-orange-100 mt-2">{selectedAssignment.material_name}</p>
                                                    </div>

                                                    <div className="p-6">
                                                        {/* Assignment Status */}
                                                        <div className="mb-8">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <h3 className="text-lg font-semibold text-gray-800">Assignment Status</h3>
                                                                {submissions[selectedAssignment.id] ? (
                                                                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                                        Submitted
                                                                    </span>
                                                                ) : isSubmissionWindowOpen(selectedAssignment.start_submission, selectedAssignment.stop_submission) ? (
                                                                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                                        Open for Submission
                                                                    </span>
                                                                ) : isAssignmentOverdue(selectedAssignment.stop_submission) ? (
                                                                    <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                                                        Deadline Passed
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                                                        Not Open Yet
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-sm text-gray-600">Start Date</p>
                                                                    <p className="text-base font-medium text-gray-900">
                                                                        {formatDate(selectedAssignment.start_submission)}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-600">Due Date</p>
                                                                    <p className="text-base font-medium text-gray-900">
                                                                        {formatDate(selectedAssignment.stop_submission)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {submissions[selectedAssignment.id] ? (
                                                            // Submission Details
                                                            <div className="space-y-6">
                                                                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                                                    <div className="flex items-center mb-4">
                                                                        <svg className="w-8 h-8 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        <div>
                                                                            <h4 className="text-lg font-semibold text-green-900">Assignment Submitted</h4>
                                                                            <p className="text-green-700">
                                                                                Submitted on {formatDate(submissions[selectedAssignment.id].created_at)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => {
                                                                            // Add functionality to view submission details
                                                                            console.log('View submission:', submissions[selectedAssignment.id]);
                                                                        }}
                                                                        className="w-full mt-4 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                                                                    >
                                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                        </svg>
                                                                        View Submission Details
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : isSubmissionWindowOpen(selectedAssignment.start_submission, selectedAssignment.stop_submission) ? (
                                                            // Submit Form
                                                            <div className="space-y-6">
                                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                                                    <h4 className="text-lg font-semibold text-blue-900 mb-4">Upload Your Assignment</h4>
                                                                    <div className="space-y-4">
                                                                        <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                                                                            <input
                                                                                type="file"
                                                                                onChange={handleFileChange}
                                                                                className="hidden"
                                                                                id="file-upload"
                                                                            />
                                                                            <label
                                                                                htmlFor="file-upload"
                                                                                className="cursor-pointer flex flex-col items-center justify-center"
                                                                            >
                                                                                <svg className="w-12 h-12 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                                </svg>
                                                                                <span className="text-blue-900 font-medium">
                                                                                    {submissionFile ? 'Change file' : 'Choose a file'}
                                                                                </span>
                                                                                <span className="text-blue-600 text-sm mt-1">
                                                                                    or drag and drop
                                                                                </span>
                                                                            </label>
                                                                        </div>
                                                                        {submissionFile && (
                                                                            <div className="bg-white rounded-lg border border-blue-200 p-4 flex items-center justify-between">
                                                                                <div className="flex items-center">
                                                                                    <svg className="w-8 h-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                                    </svg>
                                                                                    <div>
                                                                                        <p className="text-sm font-medium text-gray-900">{submissionFile.name}</p>
                                                                                        <p className="text-sm text-gray-500">
                                                                                            {(submissionFile.size / 1024 / 1024).toFixed(2)} MB
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => setSubmissionFile(null)}
                                                                                    className="text-gray-400 hover:text-gray-500"
                                                                                >
                                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                                    </svg>
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={handleSubmitAssignment}
                                                                    disabled={!submissionFile || isSubmitting}
                                                                    className={`w-full px-6 py-3 rounded-lg font-medium text-lg flex items-center justify-center ${
                                                                        !submissionFile || isSubmitting
                                                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                                            : 'bg-orange-600 text-white hover:bg-orange-700'
                                                                    }`}
                                                                >
                                                                    {isSubmitting ? (
                                                                        <>
                                                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                            </svg>
                                                                            Submitting...
                                                                        </>
                                                                    ) : 'Submit Assignment'}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            // Submission Window Closed/Not Open
                                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                                                <div className="flex items-center mb-4">
                                                                    <svg className="w-8 h-8 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    <div>
                                                                        <h4 className="text-lg font-semibold text-yellow-900">
                                                                            {isAssignmentOverdue(selectedAssignment.stop_submission)
                                                                                ? 'Submission Deadline Passed'
                                                                                : 'Submission Window Not Open'}
                                                                        </h4>
                                                                        <p className="text-yellow-700">
                                                                            {isAssignmentOverdue(selectedAssignment.stop_submission)
                                                                                ? `The deadline was ${formatDate(selectedAssignment.stop_submission)}`
                                                                                : `Submissions will open on ${formatDate(selectedAssignment.start_submission)}`}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <SuccessModal
                    onClose={() => {
                        setShowSuccessModal(false);
                        setActiveTab('assignments');
                    }}
                    onViewSubmission={() => {
                        setShowSuccessModal(false);
                        setActiveTab('assignments');
                    }}
                />
            )}

            {/* Add fullscreen CSS for .fullscreen class */}
            <style>{`
                .fullscreen {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    min-height: 100vh !important;
                    z-index: 9999 !important;
                    background: #111 !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                }
            `}</style>
        </div>
    );
};

export default MyCourses;