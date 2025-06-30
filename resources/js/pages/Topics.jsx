import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { FaFilePdf, FaFileImage, FaYoutube, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFile, FaLink } from 'react-icons/fa';

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

const Topics = () => {
    const { curriculumId } = useParams();
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [curriculums, setCurriculums] = useState([]);
    const [selectedCurriculum, setSelectedCurriculum] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [currentMaterialIndex, setCurrentMaterialIndex] = useState(0);
    const [expandedCurriculums, setExpandedCurriculums] = useState({});
    const [activeTab, setActiveTab] = useState('materials');
    const [assignments, setAssignments] = useState([]);
    const [loadingAssignments, setLoadingAssignments] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [submissionFile, setSubmissionFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissions, setSubmissions] = useState({});

    // Get the topic ID from URL search params
    const searchParams = new URLSearchParams(window.location.search);
    const topicId = searchParams.get('topic');

    useEffect(() => {
        fetchCurriculumsAndTopics();
    }, []);

    // Handle initial topic selection from URL
    useEffect(() => {
        const initializeFromUrl = async () => {
            if (curriculumId && topicId && curriculums.length > 0) {
                const curriculum = curriculums.find(c => c.id.toString() === curriculumId);
                if (curriculum) {
                    setSelectedCurriculum(curriculum);
                    setExpandedCurriculums(prev => ({
                        ...prev,
                        [curriculum.id]: true
                    }));
                    
                    // Fetch topics for this curriculum
                    await fetchTopics(curriculum.id);
                    
                    // Find and select the topic
                    const topic = topics.find(t => t.id.toString() === topicId);
                    if (topic) {
                        setSelectedTopic(topic);
                        await fetchMaterials(topic.id);
                    }
                }
            }
        };

        initializeFromUrl();
    }, [curriculumId, topicId, curriculums]);

    const fetchCurriculumsAndTopics = async () => {
        try {
            setLoading(true);
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);
            const userId = getCookie("x_path_id");
            
            const curriculumResponse = await axios.get(`/api/courses/my/${userId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': userData.token,
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                withCredentials: true
            });

            if (curriculumResponse.data?.courses) {
                const allCurriculums = curriculumResponse.data.courses.flatMap(course => 
                    course.curriculums.map(curriculum => ({
                        ...curriculum,
                        courseName: course.name
                    }))
                );
                setCurriculums(allCurriculums);
            }
        } catch (error) {
            console.error('Error fetching curriculums:', error);
            toast.error('Failed to load curriculums');
        } finally {
            setLoading(false);
        }
    };

    const fetchTopics = async (curriculumId) => {
        try {
            console.log('Fetching topics for curriculum:', curriculumId);
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const topicsResponse = await axios.get(`/api/topics?curriculum_id=${curriculumId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': userData.token,
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                withCredentials: true
            });

            console.log('Topics API response:', topicsResponse.data);

            if (topicsResponse.data) {
                const topicsData = topicsResponse.data.topics || topicsResponse.data;
                console.log('Setting topics:', topicsData);
                setTopics(topicsData);
            }
        } catch (error) {
            console.error('Topics fetch error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error('Failed to load topics');
        }
    };

    const getMaterialIcon = (material) => {
        if (material.material_source === 'file') {
            const fileExtension = material.file?.split('.').pop()?.toLowerCase();
            switch (fileExtension) {
                case 'pdf':
                    return <FaFilePdf className="text-red-500" />;
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                case 'webp':
                    return <FaFileImage className="text-blue-500" />;
                case 'doc':
                case 'docx':
                    return <FaFileWord className="text-blue-600" />;
                case 'xls':
                case 'xlsx':
                    return <FaFileExcel className="text-green-600" />;
                case 'ppt':
                case 'pptx':
                    return <FaFilePowerpoint className="text-orange-600" />;
                default:
                    return <FaFile className="text-gray-500" />;
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
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
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
                        <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden relative">
                            <button
                                onClick={() => toggleFullScreen('material-viewer')}
                                className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors duration-200"
                                title="Toggle Full Screen"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-9v4m0-4h-4m4 4l-5 5M4 16v4m0-4h4m-4 4l5-5m11 5v-4m0 4h-4m4-4l-5 5" />
                                </svg>
                            </button>
                            <div id="material-viewer" className="w-full h-full">
                                <iframe
                                    src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                    className="w-full h-full"
                                    title={material.material_name}
                                    style={{
                                        border: 'none',
                                        backgroundColor: 'white'
                                    }}
                                />
                            </div>
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

    const fetchMaterials = async (topicId) => {
        try {
            console.log('Starting fetchMaterials for topicId:', topicId);
            const userInfo = getCookie("user_info");
            console.log('User info from cookie:', userInfo);
            let userData;

            try {
                userData = userInfo ? JSON.parse(userInfo) : null;
                console.log('Parsed user data:', userData);
                
                if (!userData?.token) {
                    console.error('No token found in userData');
                    toast.error('Authentication required');
                    return;
                }

                // Make direct API request with topic_id
                console.log('Making API request to:', `/api/teaching-materials/${topicId}`);
                const response = await axios.get(`/api/teaching-materials/${topicId}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': userData.token,
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    withCredentials: true
                });

                console.log('API Response:', response.data);

                if (response.data) {
                    const materialsData = response.data.data || [];
                    console.log('Materials data to be set:', materialsData);
                    setMaterials(materialsData);
                    if (materialsData.length > 0) {
                        console.log('Setting first material:', materialsData[0]);
                        setSelectedMaterial(materialsData[0]);
                        setCurrentMaterialIndex(0);
                    } else {
                        console.log('No materials found in response');
                        setSelectedMaterial(null);
                        setCurrentMaterialIndex(0);
                    }
                }
            } catch (err) {
                console.error('Error details:', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status
                });
                toast.error('Failed to fetch teaching materials');
                setMaterials([]);
                setSelectedMaterial(null);
                setCurrentMaterialIndex(0);
            }
        } catch (err) {
            console.error('Cookie parsing error:', err);
            toast.error('Authentication error');
            setMaterials([]);
            setSelectedMaterial(null);
            setCurrentMaterialIndex(0);
        }
    };

    const getCookie = (name) => {
        let cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            let [key, value] = cookie.split("=");
            if (key === name) {
                return decodeURIComponent(value);
            }
        }
        return null;
    };

    const fetchSubmissionStatus = async (assignmentId) => {
        if (!assignmentId) {
            console.log('Skipping submission status fetch - no assignment ID');
            return;
        }
        
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
            if (error.response?.status === 404) {
                // No submission found for this assignment - this is normal
                console.log(`No submission found for assignment ${assignmentId}`);
            } else {
                console.error('Error fetching submission status:', error);
            }
        }
    };

    const isAssignmentOverdue = (stopSubmission) => {
        if (!stopSubmission) return false;
        const now = new Date();
        const stopDate = new Date(stopSubmission);
        console.log('Checking if overdue:', { now, stopDate, stopSubmission });
        return now > stopDate;
    };

    const isSubmissionWindowOpen = (startSubmission, stopSubmission) => {
        const now = new Date();
        const start = startSubmission ? new Date(startSubmission) : null;
        const stop = stopSubmission ? new Date(stopSubmission) : null;
        
        console.log('Checking submission window:', { now, start, stop });
        
        if (!start && !stop) return true;
        if (start && !stop) return now >= start;
        if (!start && stop) return now <= stop;
        return now >= start && now <= stop;
    };

    const formatDate = (date) => {
        if (!date) return 'No date set';
        try {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                console.error('Invalid date:', date);
                return 'Invalid date';
            }
            return dateObj.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Error formatting date';
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

            console.log('Assignments API Response:', response.data);

            if (response.data?.data) {
                const assignmentsData = response.data.data.filter(item => item.doc_type === 2);
                
                // Log each assignment's dates
                assignmentsData.forEach(assignment => {
                    console.log('Assignment dates:', {
                        id: assignment.id,
                        name: assignment.material_name,
                        start: assignment.start_submission,
                        stop: assignment.stop_submission,
                        isOverdue: isAssignmentOverdue(assignment.stop_submission),
                        isWindowOpen: isSubmissionWindowOpen(assignment.start_submission, assignment.stop_submission)
                    });
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
            console.error('Error fetching assignments:', error);
            toast.error('Failed to load assignments');
            setAssignments([]);
        } finally {
            setLoadingAssignments(false);
        }
    };

    const handleTopicClick = async (topic) => {
        // Remove topic access restriction - allow access to any topic
        setSelectedTopic(topic);
        setSelectedAssignment(null);
        
        // Update URL with topic ID
        const newSearchParams = new URLSearchParams(window.location.search);
        newSearchParams.set('topic', topic.id);
        navigate(`/administrator/11/topics/${curriculumId}?${newSearchParams.toString()}`, { replace: true });

        if (topic?.id) {
            await Promise.all([
                fetchMaterials(topic.id),
                fetchAssignments(topic.id)
            ]);
        }
    };

    const handleCurriculumClick = async (curriculum) => {
        const newExpandedState = !expandedCurriculums[curriculum.id];
        
        // Close all other curriculums and only toggle the clicked one
        const newExpandedCurriculums = {};
        if (newExpandedState) {
            newExpandedCurriculums[curriculum.id] = true;
        }
        setExpandedCurriculums(newExpandedCurriculums);
        
        // Update URL with curriculum ID
        navigate(`/administrator/11/topics/${curriculum.id}${window.location.search}`);
        
        if (newExpandedState) {
            await fetchTopics(curriculum.id);
        } else {
            // Clear topics when closing
            setTopics([]);
        }
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
                                style={{
                                    border: 'none',
                                    backgroundColor: 'white'
                                }}
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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSubmissionFile(file);
        }
    };

    const renderAssignmentsList = () => {
        if (loadingAssignments) {
            return (
                <div key="loading" className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></div>
                </div>
            );
        }

        if (assignments.length === 0) {
            return (
                <div key="no-assignments" className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8">
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
            );
        }

        return (
            <div key="assignments-container">
                {/* Assignment Content Viewer */}
                {selectedAssignment && activeTab !== 'submit' && (
                    <div key={`assignment-viewer-${selectedAssignment.id}`} style={{ height: '75vh' }}>
                        {renderAssignmentContent(selectedAssignment)}
                    </div>
                )}

                {/* Assignment List */}
                {activeTab !== 'submit' && (
                    <div key="assignments-list" className="space-y-4 p-6">
                        {assignments.map((assignment) => {
                            const isOverdue = isAssignmentOverdue(assignment.stop_submission);
                            const isWindowOpen = isSubmissionWindowOpen(assignment.start_submission, assignment.stop_submission);
                            return (
                                <div 
                                    key={`assignment-${assignment.id}`}
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
                                                    <p className="text-sm text-gray-500">
                                                        <span className="font-medium">Start Date:</span> {formatDate(assignment.start_submission)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        <span className="font-medium">Due Date:</span> {formatDate(assignment.stop_submission)}
                                                    </p>
                                                    {submissions[assignment.id] && (
                                                        <p className="text-sm text-green-600">
                                                            Submitted: {formatDate(submissions[assignment.id].created_at)}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="mt-4 flex justify-end">
                                                    {/* Only show assignment button if topic is in progress */}
                                                    {selectedTopic && selectedTopic.is_started && (isWindowOpen || submissions[assignment.id]) && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedAssignment(assignment);
                                                                setActiveTab('submit');
                                                            }}
                                                            className="px-4 py-2 text-sm bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors duration-200"
                                                        >
                                                            {submissions[assignment.id] ? 'Edit Submission' : 'Submit'}
                                                        </button>
                                                    )}
                                                    {/* Show message if topic is not in progress */}
                                                    {selectedTopic && !selectedTopic.is_started && (
                                                        <div className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg">
                                                            Topic not started yet
                                                        </div>
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
                )}

                {/* Submission Form */}
                {selectedAssignment && activeTab === 'submit' && (
                    <div key={`submission-form-${selectedAssignment.id}`} className="p-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                {submissions[selectedAssignment.id] ? 'Edit Submission' : 'Submit Assignment'}
                            </h3>
                            
                            {/* Assignment Details */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h4 className="text-lg font-medium text-gray-700 mb-2">{selectedAssignment.material_name}</h4>
                                <p className="text-gray-600 mb-2">{selectedAssignment.description || 'No description available'}</p>
                                
                                <div className="mt-3">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Start Date:</span>{' '}
                                        {selectedAssignment.start_submission 
                                            ? new Date(selectedAssignment.start_submission).toLocaleString()
                                            : 'No date set'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Due Date:</span>{' '}
                                        {selectedAssignment.stop_submission 
                                            ? new Date(selectedAssignment.stop_submission).toLocaleString()
                                            : 'No date set'}
                                    </p>
                                </div>

                                {/* Add submission status if needed */}
                                {submissions[selectedAssignment.id] && (
                                    <p className="mt-2 text-sm text-green-600">
                                        Submitted on: {new Date(submissions[selectedAssignment.id].created_at).toLocaleString()}
                                    </p>
                                )}
                            </div>

                            {/* File Upload Area - Only show if not overdue or already submitted */}
                            {(!isAssignmentOverdue(selectedAssignment.stop_submission) || submissions[selectedAssignment.id]) && (
                                <>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {submissions[selectedAssignment.id] ? 'Upload new submission' : 'Upload your submission'}
                                        </label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                            <div className="space-y-1 text-center">
                                                <svg
                                                    className="mx-auto h-12 w-12 text-gray-400"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    viewBox="0 0 48 48"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                                                    >
                                                        <span>Upload a file</span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={handleFileChange}
                                                            accept=".pdf,.doc,.docx,.txt,.rtf,.odt"
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PDF, DOC, DOCX, TXT, RTF, ODT up to 10MB
                                                </p>
                                            </div>
                                        </div>
                                        {submissionFile && (
                                            <div key={`selected-file-${submissionFile.name}`} className="mt-2 flex items-center text-sm text-gray-500">
                                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {submissionFile.name}
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleSubmitAssignment}
                                            disabled={!submissionFile || isSubmitting}
                                            className={`px-6 py-2 rounded-lg font-medium ${
                                                !submissionFile || isSubmitting
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-orange-600 text-white hover:bg-orange-700'
                                            }`}
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Submitting...
                                                </div>
                                            ) : (
                                                submissions[selectedAssignment.id] ? 'Update Submission' : 'Submit Assignment'
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const handleSubmitAssignment = async () => {
        if (!selectedAssignment) {
            console.error('No assignment selected');
            toast.error('Please select an assignment first');
            return;
        }

        // Log the selected assignment for debugging
        console.log('Selected Assignment:', {
            id: selectedAssignment.id,
            section_id: selectedAssignment.section_id,
            start_submission: selectedAssignment.start_submission,
            stop_submission: selectedAssignment.stop_submission,
            isOverdue: isAssignmentOverdue(selectedAssignment.stop_submission),
            isWindowOpen: isSubmissionWindowOpen(selectedAssignment.start_submission, selectedAssignment.stop_submission)
        });

        // Check submission window
        if (!isSubmissionWindowOpen(selectedAssignment.start_submission, selectedAssignment.stop_submission)) {
            if (selectedAssignment.start_submission && new Date() < new Date(selectedAssignment.start_submission)) {
                toast.error(`Submission window opens on ${formatDate(selectedAssignment.start_submission)}`);
            } else if (selectedAssignment.stop_submission && new Date() > new Date(selectedAssignment.stop_submission)) {
                toast.error(`Submission deadline was ${formatDate(selectedAssignment.stop_submission)}`);
            }
            return;
        }

        if (!selectedAssignment.section_id) {
            console.error('Selected assignment has no section_id:', selectedAssignment);
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
            const correctBatchId = 27; // Hardcoded based on the database value for now

            const formData = new FormData();
            formData.append('file', submissionFile);
            formData.append('teaching_material_id', selectedAssignment.section_id);
            formData.append('batch_id', correctBatchId);

            console.log('Submitting Assignment:', {
                teaching_material_id: selectedAssignment.section_id,
                batch_id: correctBatchId,
                file_name: submissionFile.name,
                file_size: submissionFile.size,
                file_type: submissionFile.type,
                dates: {
                    start: selectedAssignment.start_submission,
                    stop: selectedAssignment.stop_submission
                }
            });

            const response = await axios.post('/api/submit-assignment', formData, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': userData.token,
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            console.log('Submission Response:', response.data);

            if (response.data.message && response.data.message.includes('successfully')) {
                toast.success(response.data.message);
                setSubmissionFile(null);
                await fetchAssignments(selectedTopic.id);
            } else {
                console.error('Unexpected server response:', response.data);
                toast.error(response.data.message || 'Failed to submit assignment');
            }
        } catch (error) {
            console.error('Submission error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <button 
                    onClick={() => {
                        const userId = getCookie("x_path_id");
                        navigate(`/administrator/${userId}/my-courses`);
                    }}
                    className="flex items-center text-orange-600 hover:text-orange-800 bg-orange-100 hover:bg-orange-200 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Courses
                </button>
            </div>

            {/* Main Content Area */}
            <div className={`flex gap-4 ${selectedTopic ? 'space-x-4' : ''}`}>
                {/* Left Side - Curriculums and Topics */}
                <div className={`${selectedTopic ? 'w-1/3' : 'w-full'} transition-all duration-300`}>
                    <div className="space-y-4">
                        {curriculums.map((curriculum) => (
                            <div key={curriculum.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                {/* Curriculum Header */}
                                <div 
                                    onClick={() => handleCurriculumClick(curriculum)}
                                    className="p-4 bg-orange-600 text-white flex justify-between items-center cursor-pointer hover:bg-orange-700 transition-colors duration-200"
                                >
                                    <div>
                                        <h2 className="text-xl font-medium">{curriculum.name}</h2>
                                        <p className="text-sm text-white/80">{curriculum.courseName}</p>
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
                    {topics.map((topic) => (
                        <div 
                            key={topic.id}
                            onClick={() => handleTopicClick(topic)}
                                                className={`p-4 cursor-pointer transition-colors duration-200 ${
                                                    selectedTopic?.id === topic.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <CircularProgress percentage={topic.progress || 0} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800">{topic.name}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {topic.is_completed ? (
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                            Completed
                                        </span>
                                    ) : topic.is_started ? (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                            In Progress
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                                            Not Started
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Teaching Materials */}
                {selectedTopic && (
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-lg">
                            {/* Curriculum and Topic Headers */}
                            <div className="border-b border-gray-200">
                                {/* Curriculum Name */}
                                <div className="p-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        {selectedCurriculum?.name}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">Topics</p>
                                </div>

                                {/* Selected Topic with Material Name */}
                                <div className="bg-pink-50 p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="font-medium text-gray-700">{selectedTopic.name}</span>
                                        {selectedMaterial && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <span>{selectedMaterial.material_name}</span>
                                                <span className="mx-2">•</span>
                                                <span>{currentMaterialIndex + 1}/{materials.length}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Navigation Tabs */}
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => setActiveTab('materials')}
                                            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                                activeTab === 'materials' 
                                                ? 'bg-orange-600 text-white' 
                                                : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                            }`}
                                        >
                                            Teaching Material
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('assignments')}
                                            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                                activeTab === 'assignments' 
                                                ? 'bg-orange-600 text-white' 
                                                : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                            }`}
                                        >
                                            Assignments
                                        </button>
                                        {selectedAssignment && (
                                            <button
                                                onClick={() => setActiveTab('submit')}
                                                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                                    activeTab === 'submit' 
                                                    ? 'bg-orange-600 text-white' 
                                                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                                }`}
                                            >
                                                Submit
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div>
                                {activeTab === 'materials' ? (
                                    // Teaching Materials Content
                                    <>
                                        {selectedMaterial ? (
                                            <div style={{ height: '75vh' }}>
                                                {renderMaterialContent(selectedMaterial)}
                                            </div>
                                        ) : (
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
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                                                        />
                                                    </svg>
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Materials Available</h3>
                                                <p className="text-gray-500 text-center max-w-md">
                                                    There are currently no learning materials available for this topic. 
                                                    Please check back later or select a different topic.
                                                </p>
                        </div>
                                        )}

                                        {/* Navigation Buttons */}
                                        {materials.length > 1 && (
                                            <div className="p-4 border-t border-gray-200 flex justify-between">
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
                                ) : (
                                    <div className="bg-gray-50">
                                        {renderAssignmentsList()}
                        </div>
                    )}
                </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Topics; 
