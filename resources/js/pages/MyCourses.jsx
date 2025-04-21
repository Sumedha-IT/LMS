import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NoCourses from '../components/NoCourses';

const API_URL = import.meta.env.REACT_APP_API_URL;

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

// Function to get image based on curriculum name
const getCurriculumImage = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('cmos')) return '/images/courses/cmos.jpeg';
    if (lowerName.includes('slc') || lowerName.includes('sl')) return '/images/courses/SLC.jpg';
    if (lowerName.includes('ddf')) return '/images/courses/DDF.png';
    return null;
};

const MyCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            console.log('Fetching courses...');
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
                
                console.log('Courses response:', response.data);
                
                if (response.data.courses) {
                    setCourses(response.data.courses);
                    if (response.data.courses.length === 0) {
                        setError('No courses found');
                    }
                } else {
                    setError('No courses available');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response?.status === 403) {
                    toast.error('You do not have permission to access these courses');
                } else {
                    toast.error(error.response?.data?.message || 'Failed to load courses');
                }
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
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

    const handleCurriculumClick = (curriculum) => {
        // Navigate to the Topics page with the curriculum ID
        const userId = getCookie("x_path_id");
        navigate(`/administrator/${userId}/topics/${curriculum.id}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error === 'No courses found' || error === 'No courses available') {
        return <NoCourses />;
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.flatMap(course => 
                    course.curriculums.map(curriculum => {
                        const curriculumImage = getCurriculumImage(curriculum.name);
                        
                        return (
                            <div 
                                key={curriculum.id} 
                                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                                onClick={() => handleCurriculumClick(curriculum)}
                            >
                                <div 
                                    className="relative h-48 bg-cover bg-center"
                                    style={{
                                        backgroundImage: curriculumImage ? `url(${curriculumImage})` : 'linear-gradient(to right, #1e3a8a, #1e40af)',
                                        backgroundBlendMode: 'overlay'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black opacity-40"></div>
                                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                        <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                                            {curriculum.name}
                                        </h2>
                                        <div className="text-white text-sm drop-shadow">
                                            Complete {curriculum.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 text-sm mb-4">
                                        This course introduces core physics principles, including motion, energy, forces, and modern theories. It offers practical insights into how these concepts shape our understanding of the world.
                                    </p>
                                    <div className="flex justify-between items-center text-sm">
                                        <div>
                                            <span className="text-gray-600">Completed: </span>
                                            <span className="font-semibold">{curriculum.progress || 0}%</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Day: </span>
                                            <span className="font-semibold">{curriculum.current_day || 0}/90</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full" 
                                            style={{ width: `${curriculum.progress || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MyCourses;