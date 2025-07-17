import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingFallback from '../components/DashBoard/LoadingFallback';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, PencilIcon, TrashIcon, DocumentIcon, AcademicCapIcon, BookOpenIcon } from '@heroicons/react/24/outline';

// Helper function to get cookies
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

// Create an axios instance with default config
const api = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
    },
    withCredentials: true
});

// CurriculumAccordion Component
const CurriculumAccordion = ({ curriculum, isSelected, topics, onSelect, onEdit, onDelete, onAddTopic, onTopicEdit, onTopicDelete, onTeachingMaterial }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`border-2 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
            isSelected ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50' : 'border-gray-200 bg-white hover:border-blue-300'
        }`}>
            {/* Curriculum Header */}
            <div 
                className="p-6 cursor-pointer transition-all duration-300 hover:bg-gray-50"
                onClick={() => {
                    onSelect();
                    setIsOpen(!isOpen);
                }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0">
                            {curriculum.image ? (
                                <img
                                    src={curriculum.image}
                                    alt={curriculum.name}
                                    className="w-20 h-20 rounded-xl object-cover shadow-lg"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <BookOpenIcon className="h-10 w-10 text-white" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-2xl mb-2">{curriculum.name}</h3>
                            {curriculum.short_description && (
                                <p className="text-gray-600 leading-relaxed mb-3">
                                    {curriculum.short_description}
                                </p>
                            )}
                            <div className="flex items-center space-x-4">
                                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                    {curriculum.courses?.length || 0} Courses
                                </span>
                                <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                                    {topics.length} Topics
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit();
                                }}
                                className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-colors"
                            >
                                <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                className="p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-colors"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="ml-4">
                            {isOpen ? (
                                <ChevronDownIcon className="h-6 w-6 text-gray-500 transition-transform duration-300" />
                            ) : (
                                <ChevronRightIcon className="h-6 w-6 text-gray-500 transition-transform duration-300" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Topics Section */}
            {isOpen && (
                <div className="bg-white border-t border-gray-200">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                                    <DocumentIcon className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">Topics</h4>
                            </div>
                            <button
                                onClick={onAddTopic}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                            >
                                <PlusIcon className="h-4 w-4" />
                                <span>Add Topic</span>
                            </button>
                        </div>
                        
                        {topics.length > 0 ? (
                            <div className="space-y-4">
                                {topics.map((topic, index) => (
                                    <div key={topic.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                                                    <span className="text-white font-bold text-sm">{index + 1}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="font-bold text-gray-900 text-lg">{topic.name}</h5>
                                                    <div className="flex items-center space-x-3 mt-2">
                                                        <span className="text-xs text-gray-500">
                                                            Topic #{index + 1}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => onTeachingMaterial(topic)}
                                                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                                    >
                                                        Teaching Material
                                                    </button>

                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => onTopicEdit(topic)}
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => onTopicDelete(topic)}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <DocumentIcon className="h-8 w-8 text-gray-400" />
                                </div>
                                <h5 className="text-lg font-semibold text-gray-900 mb-2">No Topics Yet</h5>
                                <p className="text-gray-600 mb-4">Add topics to organize your curriculum content</p>
                                <button
                                    onClick={onAddTopic}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
                                >
                                    <PlusIcon className="h-4 w-4" />
                                    <span>Add Your First Topic</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// TopicAccordion Component
const TopicAccordion = ({ topic, index, onEdit, onDelete, onTeachingMaterial }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div 
                className="bg-white p-6 cursor-pointer transition-all duration-300 hover:bg-gray-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">{topic.name}</h3>
                            <div className="flex items-center space-x-3 mt-2">
                                <span className="text-xs text-gray-500">
                                    Topic #{index + 1}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex space-x-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onTeachingMaterial();
                                }}
                                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                            >
                                Teaching Material
                            </button>

                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit();
                                }}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="ml-4">
                            {isOpen ? (
                                <ChevronDownIcon className="h-5 w-5 text-gray-500 transition-transform duration-300" />
                            ) : (
                                <ChevronRightIcon className="h-5 w-5 text-gray-500 transition-transform duration-300" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Accordion Content */}
            {isOpen && (
                <div className="bg-gray-50 border-t border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-gray-900 mb-3">Topic Details</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Created:</span>
                                    <span className="text-sm text-gray-900">
                                        {topic.created_at ? new Date(topic.created_at).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                            <div className="space-y-2">
                                <button
                                    onClick={onTeachingMaterial}
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                                >
                                    Upload Teaching Material
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function MultiSelectDropdown({ options, selected, onChange, label }) {
    const [open, setOpen] = React.useState(false);
    const toggleOption = (value) => {
        if (selected.includes(value)) {
            onChange(selected.filter(v => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };
    const selectedLabels = options.filter(opt => selected.includes(opt.value)).map(opt => opt.label).join(', ');
    return (
        <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>
            <button
                type="button"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                onClick={() => setOpen(o => !o)}
            >
                {selectedLabels || 'Select courses...'}
                <span className="float-right">▼</span>
            </button>
            {open && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {options.map(opt => (
                        <label key={opt.value} className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selected.includes(opt.value)}
                                onChange={() => toggleOption(opt.value)}
                                className="mr-2 rounded"
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}

const CurriculumManagement = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [curriculums, setCurriculums] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCurriculum, setSelectedCurriculum] = useState(null);
    const [topics, setTopics] = useState([]);
    const [topicsMap, setTopicsMap] = useState({});
    const [batches, setBatches] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showTopicModal, setShowTopicModal] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        short_description: '',
        courses: [],
        image: null
    });
    const [topicFormData, setTopicFormData] = useState({
        name: '',
        curriculum_id: ''
    });
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, type: '', id: null });
    const navigate = useNavigate();
    const { id } = useParams();

    // Modal state for teaching material upload
    const [showTeachingMaterialModal, setShowTeachingMaterialModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedTopicForUpload, setSelectedTopicForUpload] = useState(null);
    const [existingMaterials, setExistingMaterials] = useState([]);
    const [loadingMaterials, setLoadingMaterials] = useState(false);
    const [deleteMaterialModal, setDeleteMaterialModal] = useState({ open: false, material: null });
    // Teaching Material form state
    const [teachingMaterialForm, setTeachingMaterialForm] = useState({
        title: '',
        description: '',
        file: null
    });

    const courseOptions = courses.map(course => ({ value: course.id, label: course.name }));

    useEffect(() => {
        fetchCurriculums();
        fetchCourses();
        fetchBatches();
    }, []);

    const fetchCurriculums = async () => {
        try {
            setIsLoading(true);
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const response = await api.get('/api/curriculum-management/curriculums', {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                }
            });

            if (response.data.curriculums) {
                setCurriculums(response.data.curriculums);
            }
        } catch (error) {
            console.error('Error fetching curriculums:', error);
            toast.error('Failed to load curriculums');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const response = await api.get('/api/curriculum-management/courses', {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                }
            });

            if (response.data.courses) {
                setCourses(response.data.courses);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchBatches = async () => {
        try {
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const response = await api.get('/api/curriculum-management/batches', {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                }
            });

            if (response.data.batches) {
                setBatches(response.data.batches);
            }
        } catch (error) {
            console.error('Error fetching batches:', error);
            // Set empty array to prevent undefined errors
            setBatches([]);
            // Log the error but don't show toast since batches might not be critical
            console.warn('Batches API failed, continuing without batches data');
        }
    };

    const fetchTopics = async (curriculumId) => {
        try {
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const response = await api.get(`/api/curriculum-management/curriculums/${curriculumId}/topics`, {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                }
            });

            if (response.data.topics) {
                // Store topics in the map for this specific curriculum
                setTopicsMap(prev => ({
                    ...prev,
                    [curriculumId]: response.data.topics
                }));
                // Set current topics for the selected curriculum
                setTopics(response.data.topics);
            }
        } catch (error) {
            console.error('Error fetching topics:', error);
            toast.error('Failed to load topics');
            // Clear topics for this curriculum on error
            setTopicsMap(prev => ({
                ...prev,
                [curriculumId]: []
            }));
            setTopics([]);
        }
    };

    const handleCreateCurriculum = async () => {
        try {
            setIsUploading(true);
            setUploadProgress(0);

            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('short_description', formData.short_description);
            formData.courses.forEach(courseId => {
                formDataToSend.append('courses[]', courseId);
            });
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const response = await api.post('/api/curriculum-management/curriculums', formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                }
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (response.data.success) {
                toast.success('Curriculum created successfully!');
                setShowCreateModal(false);
                setFormData({ name: '', short_description: '', courses: [], image: null });
                fetchCurriculums();
                // Clear topics map since we have new curriculums
                setTopicsMap({});
                setTopics([]);
            }
        } catch (error) {
            console.error('Error creating curriculum:', error);
            toast.error('Failed to create curriculum');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleUpdateCurriculum = async () => {
        try {
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            console.log('Updating curriculum with data:', {
                curriculumId: selectedCurriculum.id,
                formData: formData,
                selectedCurriculum: selectedCurriculum
            });

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('short_description', formData.short_description);
            formData.courses.forEach(courseId => {
                formDataToSend.append('courses[]', courseId);
            });
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            // Add _method field for Laravel to handle PUT requests with FormData
            formDataToSend.append('_method', 'PUT');

            console.log('FormData contents:');
            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value);
            }

            console.log('Making API request to:', `/api/curriculum-management/curriculums/${selectedCurriculum.id}`);
            console.log('Request headers:', {
                'Authorization': `Bearer ${userData.token}`,
                'Content-Type': 'multipart/form-data'
            });

            const response = await api.post(`/api/curriculum-management/curriculums/${selectedCurriculum.id}`, formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                }
            });

            console.log('API response:', response);

            if (response.data.success) {
                toast.success('Curriculum updated successfully!');
                setShowEditModal(false);
                setSelectedCurriculum(null);
                setFormData({ name: '', short_description: '', courses: [], image: null });
                fetchCurriculums();
                // Clear topics map since curriculums have changed
                setTopicsMap({});
                setTopics([]);
            }
        } catch (error) {
            console.error('Error updating curriculum:', error);
            if (error.response && error.response.data) {
                console.error('Response data:', error.response.data);
                if (error.response.data.errors) {
                    const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
                    toast.error(`Validation errors: ${errorMessages}`);
                } else if (error.response.data.error) {
                    toast.error(error.response.data.error);
                } else {
                    toast.error('Failed to update curriculum');
                }
            } else {
                toast.error('Failed to update curriculum');
            }
        }
    };

    const handleCreateTopic = async () => {
        try {
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const endpoint = selectedTopic 
                ? `/api/curriculum-management/curriculums/${selectedCurriculum.id}/topics/${selectedTopic.id}`
                : `/api/curriculum-management/curriculums/${selectedCurriculum.id}/topics`;
            
            const method = selectedTopic ? 'put' : 'post';

            const response = await api[method](endpoint, topicFormData, {
                headers: {
                    'Authorization': `Bearer ${userData.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                toast.success(selectedTopic ? 'Topic updated successfully!' : 'Topic created successfully!');
                setShowTopicModal(false);
                setSelectedTopic(null);
                setTopicFormData({ name: '', curriculum_id: selectedCurriculum.id });
                // Refresh topics for the current curriculum
                fetchTopics(selectedCurriculum.id);
            }
        } catch (error) {
            console.error('Error creating/updating topic:', error);
            toast.error('Failed to create/update topic');
        }
    };

    const handleDelete = async () => {
        try {
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            let endpoint;
            if (deleteModal.type === 'Curriculum') {
                endpoint = `/api/curriculum-management/curriculums/${deleteModal.id}`;
            } else if (deleteModal.type === 'Topic') {
                endpoint = `/api/curriculum-management/curriculums/${selectedCurriculum.id}/topics/${deleteModal.id}`;
            }

            const response = await api.delete(endpoint, {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                }
            });

            if (response.data.success) {
                toast.success(`${deleteModal.type} deleted successfully!`);
                setDeleteModal({ open: false, type: '', id: null });
                if (deleteModal.type === 'Curriculum') {
                    fetchCurriculums();
                    setSelectedCurriculum(null);
                    // Clear topics map for deleted curriculum
                    setTopicsMap(prev => {
                        const newMap = { ...prev };
                        delete newMap[deleteModal.id];
                        return newMap;
                    });
                    setTopics([]);
                } else if (deleteModal.type === 'Topic') {
                    // Refresh topics for the current curriculum
                    fetchTopics(selectedCurriculum.id);
                }
            }
        } catch (error) {
            console.error('Error deleting:', error);
            toast.error(`Failed to delete ${deleteModal.type.toLowerCase()}`);
        }
    };

    const handleCurriculumSelect = (curriculum) => {
        // Clear current topics first
        setTopics([]);
        setSelectedCurriculum(curriculum);
        
        // Check if we already have topics for this curriculum in the map
        if (topicsMap[curriculum.id]) {
            setTopics(topicsMap[curriculum.id]);
        } else {
            // Fetch topics if not already cached
            fetchTopics(curriculum.id);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
        }
    };

    const openEditModal = (curriculum) => {
        setSelectedCurriculum(curriculum);
        setFormData({
            name: curriculum.name,
            short_description: curriculum.short_description || '',
            courses: curriculum.courses?.map(c => c.id) || [],
            image: null
        });
        setShowEditModal(true);
    };

    const openTopicEditModal = (topic) => {
        setSelectedTopic(topic);
        setTopicFormData({
            name: topic.name,
            curriculum_id: selectedCurriculum.id
        });
        setShowTopicModal(true);
    };

    // Fetch existing teaching materials for a topic
    const fetchExistingMaterials = async (topicId) => {
        try {
            setLoadingMaterials(true);
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const response = await axios.get(`/api/teaching-materials/${topicId}`, {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                }
            });

            if (response.data && response.data.data) {
                // Filter only teaching materials (doc_type = 1)
                const materials = response.data.data.filter(material => material.doc_type === 1);
                setExistingMaterials(materials);
            } else {
                setExistingMaterials([]);
            }
        } catch (error) {
            console.error('Error fetching existing materials:', error);
            setExistingMaterials([]);
        } finally {
            setLoadingMaterials(false);
        }
    };

    // Handle teaching material delete
    const handleDeleteTeachingMaterial = async () => {
        try {
            if (!deleteMaterialModal.material) return;
            
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            console.log('Deleting teaching material:', deleteMaterialModal.material);

            const response = await axios.delete(`/api/teaching-materials/${deleteMaterialModal.material.id}`, {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                }
            });

            console.log('Delete response:', response);

            if (response.data.success) {
                toast.success('Teaching material deleted successfully!');
                setDeleteMaterialModal({ open: false, material: null });
                // Refresh the materials list
                if (selectedTopicForUpload) {
                    fetchExistingMaterials(selectedTopicForUpload.id);
                }
            }
        } catch (error) {
            console.error('Error deleting teaching material:', error);
            if (error.response && error.response.data) {
                console.error('Response data:', error.response.data);
                if (error.response.data.error) {
                    toast.error(error.response.data.error);
                } else {
                    toast.error('Failed to delete teaching material');
                }
            } else {
                toast.error('Failed to delete teaching material');
            }
        }
    };

    // Handle teaching material upload
    const handleTeachingMaterialUpload = async (e) => {
        e.preventDefault();
        if (!selectedTopicForUpload) return;
        setUploading(true);
        setUploadProgress(0);
        try {
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);
            
            console.log('Uploading teaching material:', {
                topicId: selectedTopicForUpload.id,
                title: teachingMaterialForm.title,
                description: teachingMaterialForm.description,
                file: teachingMaterialForm.file
            });

            const formData = new FormData();
            formData.append('topic_id', selectedTopicForUpload.id);
            formData.append('name', teachingMaterialForm.title);
            formData.append('description', teachingMaterialForm.description);
            formData.append('file', teachingMaterialForm.file);
            formData.append('doc_type', 1); // 1 for teaching material

            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const response = await axios.post('/api/teaching-materials', formData, {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                }
            });

            console.log('Teaching material upload response:', response);

            toast.success('Teaching material uploaded successfully!');
            setTeachingMaterialForm({ title: '', description: '', file: null });
            // Refresh the materials list
            if (selectedTopicForUpload) {
                fetchExistingMaterials(selectedTopicForUpload.id);
            }
        } catch (error) {
            console.error('Error uploading teaching material:', error);
            if (error.response && error.response.data) {
                console.error('Response data:', error.response.data);
                if (error.response.data.errors) {
                    const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
                    toast.error(`Validation errors: ${errorMessages}`);
                } else if (error.response.data.error) {
                    toast.error(error.response.data.error);
                } else {
                    toast.error('Failed to upload teaching material');
                }
            } else {
                toast.error('Failed to upload teaching material');
            }
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };



    if (isLoading) {
        return <LoadingFallback />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Enhanced Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                                <BookOpenIcon className="h-8 w-8 text-white" />
                            </div>
                        <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Curriculum Management
                                </h1>
                                <p className="text-gray-600 mt-2 text-lg">Design and organize your learning pathways</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                        >
                            <PlusIcon className="h-5 w-5" />
                            <span>Create Curriculum</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Enhanced Curriculums with Integrated Topics */}
                    <div className="w-full">
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-3">
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                                        <AcademicCapIcon className="h-6 w-6 text-white" />
                                            </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Curriculums & Topics</h2>
                                            </div>
                                        </div>
                            
                            <div className="space-y-6">
                                {curriculums.map((curriculum) => (
                                    <CurriculumAccordion 
                                        key={curriculum.id}
                                        curriculum={curriculum}
                                        isSelected={selectedCurriculum?.id === curriculum.id}
                                        topics={topicsMap[curriculum.id] || []}
                                        onSelect={() => handleCurriculumSelect(curriculum)}
                                        onEdit={() => openEditModal(curriculum)}
                                        onDelete={() => setDeleteModal({ open: true, type: 'Curriculum', id: curriculum.id })}
                                        onAddTopic={() => setShowTopicModal(true)}
                                        onTopicEdit={(topic) => openTopicEditModal(topic)}
                                        onTopicDelete={(topic) => setDeleteModal({ open: true, type: 'Topic', id: topic.id })}
                                        onTeachingMaterial={(topic) => { 
                                            setSelectedTopicForUpload(topic); 
                                            setShowTeachingMaterialModal(true);
                                            fetchExistingMaterials(topic.id);
                                        }}
                                    />
                                ))}
                    </div>

                            {curriculums.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-8 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                        <BookOpenIcon className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Curriculums Found</h3>
                                    <p className="text-gray-600 mb-6">Create your first curriculum to get started</p>
                                                        <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
                                    >
                                        <PlusIcon className="h-5 w-5" />
                                        <span>Create Your First Curriculum</span>
                                                        </button>
                                                    </div>
                            )}
                                                </div>
                                            </div>
                                    </div>
                                </div>

            {/* Enhanced Create Curriculum Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-y-auto transform transition-all">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                    <PlusIcon className="h-6 w-6 text-white" />
                            </div>
                                <h2 className="text-2xl font-bold text-white">Create New Curriculum</h2>
                                </div>
                            </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Curriculum Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Enter curriculum name..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                                <textarea
                                    value={formData.short_description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    rows="4"
                                    placeholder="Describe your curriculum..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Courses</label>
                                <MultiSelectDropdown
                                    options={courseOptions}
                                    selected={formData.courses}
                                    onChange={courses => setFormData(prev => ({ ...prev, courses }))}
                                    label="Select Courses"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Curriculum Image</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-300">
                                <input
                                    type="file"
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                        className="hidden"
                                        id="curriculum-image"
                                    />
                                    <label htmlFor="curriculum-image" className="cursor-pointer">
                                        <div className="space-y-2">
                                            <div className="bg-gray-100 p-3 rounded-full w-12 h-12 mx-auto">
                                                <DocumentIcon className="h-6 w-6 text-gray-400 mx-auto" />
                                            </div>
                                            <p className="text-sm text-gray-600">Click to upload image</p>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            {isUploading && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Uploading...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div 
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end space-x-4">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateCurriculum}
                                disabled={isUploading}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
                            >
                                {isUploading ? 'Creating...' : 'Create Curriculum'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Edit Curriculum Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-y-auto transform transition-all">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                    <PencilIcon className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Edit Curriculum</h2>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Curriculum Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Enter curriculum name..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                                <textarea
                                    value={formData.short_description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    rows="4"
                                    placeholder="Describe your curriculum..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Courses</label>
                                <MultiSelectDropdown
                                    options={courseOptions}
                                    selected={formData.courses}
                                    onChange={courses => setFormData(prev => ({ ...prev, courses }))}
                                    label="Select Courses"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Update Image</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-300">
                                <input
                                    type="file"
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                        className="hidden"
                                        id="edit-curriculum-image"
                                />
                                    <label htmlFor="edit-curriculum-image" className="cursor-pointer">
                                        <div className="space-y-2">
                                            <div className="bg-gray-100 p-3 rounded-full w-12 h-12 mx-auto">
                                                <DocumentIcon className="h-6 w-6 text-gray-400 mx-auto" />
                            </div>
                                            <p className="text-sm text-gray-600">Click to update image</p>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end space-x-4">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateCurriculum}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                Update Curriculum
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Create Topic Modal */}
            {showTopicModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-y-auto transform transition-all">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                    <PlusIcon className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">
                                    {selectedTopic ? 'Edit Topic' : 'Create New Topic'}
                        </h2>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Topic Name</label>
                                <input
                                    type="text"
                                    value={topicFormData.name}
                                    onChange={(e) => setTopicFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Enter topic name..."
                                />
                            </div>
                            {selectedCurriculum && (
                                <div className="bg-blue-50 p-4 rounded-xl">
                                    <p className="text-sm text-blue-800">
                                        <strong>Curriculum:</strong> {selectedCurriculum.name}
                                    </p>
                        </div>
                            )}
                        </div>
                        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end space-x-4">
                            <button
                                onClick={() => setShowTopicModal(false)}
                                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateTopic}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                {selectedTopic ? 'Update Topic' : 'Create Topic'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Delete Confirmation Modal */}
            {deleteModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-y-auto transform transition-all">
                        <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 rounded-t-2xl">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                    <TrashIcon className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Confirm Delete</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <TrashIcon className="h-8 w-8 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Delete {deleteModal.type}?
                                </h3>
                                <p className="text-gray-600">
                                    Are you sure you want to delete this {deleteModal.type.toLowerCase()}? This action cannot be undone and all associated data will be permanently removed.
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end space-x-4">
                            <button
                                onClick={() => setDeleteModal({ open: false, type: '', id: null })}
                                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                Delete {deleteModal.type}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Teaching Material Upload Modal */}
            {showTeachingMaterialModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-y-auto transform transition-all">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-t-2xl">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                    <DocumentIcon className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Upload Teaching Material</h2>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            {selectedTopicForUpload && (
                                <div className="bg-blue-50 p-4 rounded-xl">
                                    <p className="text-sm text-blue-800">
                                        <strong>Topic:</strong> {selectedTopicForUpload.name}
                                    </p>
                                </div>
                            )}

                            {/* Existing Materials Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Teaching Materials</h3>
                                {loadingMaterials ? (
                                    <div className="text-center py-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="text-gray-600 mt-2">Loading materials...</p>
                                    </div>
                                ) : existingMaterials.length > 0 ? (
                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                        {existingMaterials.map((material) => (
                                            <div key={material.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{material.material_name}</h4>
                                                        {material.description && (
                                                            <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                                                        )}
                                                        <div className="flex items-center space-x-2 mt-2">
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                Teaching Material
                                                            </span>
                                                            {material.file && (
                                                                <a 
                                                                    href={material.file} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                                                                >
                                                                    View File
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2 ml-4">
                                                        <button
                                                            onClick={() => setDeleteMaterialModal({ open: true, material: material })}
                                                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete material"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                                        <DocumentIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-600">No teaching materials uploaded yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Upload New Material Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Teaching Material</h3>
                                <form onSubmit={handleTeachingMaterialUpload} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Material Title</label>
                                <input
                                    type="text"
                                    value={teachingMaterialForm.title}
                                    onChange={e => setTeachingMaterialForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Enter material title..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                                <textarea
                                    value={teachingMaterialForm.description}
                                    onChange={e => setTeachingMaterialForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                    rows="4"
                                    placeholder="Describe the teaching material..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Upload File</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors duration-300">
                                <input
                                    type="file"
                                    onChange={e => setTeachingMaterialForm(f => ({ ...f, file: e.target.files[0] }))}
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.webm,.jpg,.jpeg,.png,.gif,.zip,.txt,.html"
                                        className="hidden"
                                        id="teaching-material-file"
                                    required
                                />
                                    <label htmlFor="teaching-material-file" className="cursor-pointer">
                                        <div className="space-y-2">
                                            <div className="bg-gray-100 p-3 rounded-full w-12 h-12 mx-auto">
                                                <DocumentIcon className="h-6 w-6 text-gray-400 mx-auto" />
                                            </div>
                                            <p className="text-sm text-gray-600">Click to upload file</p>
                                            <p className="text-xs text-gray-500">PDF, DOC, PPT, Images, Videos, etc.</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            {uploading && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Uploading...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                    </div>
                                </div>
                            )}
                                </form>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setShowTeachingMaterialModal(false)}
                                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleTeachingMaterialUpload}
                                disabled={uploading}
                                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
                            >
                                {uploading ? 'Uploading...' : 'Upload Material'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Teaching Material Delete Confirmation Modal */}
            {deleteMaterialModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
                        <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 rounded-t-2xl">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                    <TrashIcon className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Delete Teaching Material</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <TrashIcon className="h-8 w-8 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Delete Teaching Material?
                                </h3>
                                <p className="text-gray-600">
                                    Are you sure you want to delete "{deleteMaterialModal.material?.material_name}"? This action cannot be undone and the file will be permanently removed.
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end space-x-4">
                            <button
                                onClick={() => setDeleteMaterialModal({ open: false, material: null })}
                                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteTeachingMaterial}
                                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                Delete Material
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default CurriculumManagement; 