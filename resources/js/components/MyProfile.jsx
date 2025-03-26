import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { BsPersonLinesFill } from 'react-icons/bs';
import { MdDescription, MdWork, MdSchool, MdBuild, MdStar, MdLink } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsPersonFill, BsBriefcaseFill, BsBookFill, BsAwardFill } from 'react-icons/bs';
import { MdLocationOn, MdEmail, MdPhone } from 'react-icons/md';
import { FiExternalLink } from 'react-icons/fi';
import './MyProfile.css';

// Update API_URL constant
const API_URL = 'http://localhost:8000';

// Update mainMenu array
const mainMenu = [
  {
    id: 'personal',
    label: 'Personal Details',
    icon: <BsPersonLinesFill />,
    subMenu: [
      { id: 'basic', label: 'Basic Details', icon: <BsPersonLinesFill /> },
      { id: 'additional', label: 'Additional Details', icon: <MdDescription /> },
      { id: 'docs', label: 'Docs', icon: <MdDescription /> },
      { id: 'parent', label: 'Parent Details', icon: <BsPersonLinesFill /> },
      { id: 'notification', label: 'Notification', icon: <MdDescription /> },
    ],
  },
  { id: 'work', label: 'Work Experience', icon: <MdWork /> },
  { id: 'education', label: 'Education', icon: <MdSchool /> },
  { id: 'projects', label: 'Projects', icon: <MdBuild /> },
  { id: 'certifications', label: 'Certifications', icon: <MdStar /> },
  { id: 'achievements', label: 'Achievements', icon: <MdStar /> },
  { id: 'social', label: 'Social Links', icon: <MdLink /> },
];

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

const MyProfile = () => {
  const { user, id } = useParams();

  // Add error and success states
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState(null);
  // Add these two state variables at the top level
  const [degreeTypes, setDegreeTypes] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [showOtherSpecialization, setShowOtherSpecialization] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar_url: null,
    registration_number: '',
    phone: '',
    gender: '',
    birthday: '',
    address: '',
    pincode: '',
    city: '',
    qualification: [],
    state_id: '',
    country_code: '',
    state: { id: '', name: '' },
    aadhaar_number: '',
    linkedin_profile: '',
    upload_resume: null,
    upload_aadhar: null,
    parent_name: '',
    parent_email: '',
    parent_aadhar: '',
    parent_occupation: '',
    residential_address: '',
    receive_email_notification: false,
    receive_sms_notification: false,
    work_experience: [],
    education: [],
    projects: [],
    certifications: [],
    achievements: [],
    social_links: { linkedin: '', github: '' }
  });
  const [photoPreview, setPhotoPreview] = useState(null);

 

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    const userInfo = getCookie("user_info");
    let userData;

    try {
      userData = userInfo ? JSON.parse(userInfo) : null;
      if (!userData?.token) {
        toast.error('Authentication required');
        setLoading(false);
        return;
      }

      
      if (activeMenu !== 'education') {
        const profileResponse = await axios.get(`${API_URL}/api/profile`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': userData.token,
          },
          withCredentials: true,
        });

        setFormData(prev => ({
          ...prev,
          ...profileResponse.data.user,
        }));
      }

      // If on education tab, fetch education data and degree types
      if (activeMenu === 'education') {
        const [educationResponse, degreeResponse] = await Promise.all([
          axios.get(`${API_URL}/api/get/education`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': userData.token,
            },
            withCredentials: true,
          }),
          axios.get(`${API_URL}/api/get/degrees`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': userData.token,
            },
          })
        ]);

        setDegreeTypes(degreeResponse.data.data || []);
        
        // For each education entry, fetch its specializations
        const educationData = educationResponse.data.data || [];
        for (const edu of educationData) {
          if (edu.degree_type_id) {
            const specResponse = await axios.get(`${API_URL}/api/get/specialization/${edu.degree_type_id}`, {
              headers: {
                'Accept': 'application/json',
                'Authorization': userData.token,
              },
            });
            setSpecializations(prev => [...prev, ...specResponse.data.data]);
          }
        }

        setFormData(prev => ({
          ...prev,
          education: educationData,
        }));
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [activeMenu]);



// Update the fetchSpecializations function to use the same token handling:
const fetchSpecializations = async (degreeTypeId) => {
  if (!degreeTypeId) return;
  
  try {
    const userInfo = getCookie("user_info");
    const userData = userInfo ? JSON.parse(userInfo) : null;
    
    if (!userData?.token) {
      console.error('No auth token available');
      toast.error('Authentication required');
      return;
    }
    
    const response = await axios.get(`${API_URL}/api/get/specialization/${degreeTypeId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': userData.token,
      },
      withCredentials: true,
    });
    
    setSpecializations(response.data.data || []);
  } catch (error) {
    console.error('Error fetching specializations:', error);
    toast.error('Failed to load specializations');
  }
};

const fetchEducationData = async () => {
  try {
    const userInfo = getCookie("user_info");
    const userData = userInfo ? JSON.parse(userInfo) : null;

    if (!userData?.token) {
      console.error('No auth token available');
      toast.error('Authentication required. Please log in again.');
      return;
    }

    const response = await axios.get(`${API_URL}/api/get/education`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${userData.token}`, // Ensure Bearer prefix is added
      },
      withCredentials: true,
    });

    console.log('Fetched education data:', response.data);

    setFormData((prev) => ({
      ...prev,
      education: response.data.data || [],
    }));
  } catch (error) {
    console.error('Error fetching education data:', error);
    toast.error(error.response?.data?.message || 'Failed to load education data');
  }
};

const validateEducationData = (data) => {
  const errors = [];
  if (!data.degree_type_id) errors.push('Degree type is required');
  if (!data.institute_name) errors.push('Institute name is required');
  if (!data.duration_from) errors.push('Start date is required');
  if (!data.duration_to) errors.push('End date is required');
  if (!data.percentage_cgpa) errors.push('Percentage/CGPA is required');
  if (data.percentage_cgpa && (isNaN(data.percentage_cgpa) || data.percentage_cgpa < 0 || data.percentage_cgpa > 100)) {
    errors.push('Percentage/CGPA must be a number between 0 and 100');
  }
  return errors;
};

const handleItemChange = (field, index, key, value) => {
  try {
    console.log('handleItemChange called with:', { field, index, key, value });
    
    setFormData(prev => {
      const updatedData = { ...prev };
      if (!updatedData[field]) {
        updatedData[field] = [];
      }
      if (!updatedData[field][index]) {
        updatedData[field][index] = {};
      }

      // Validate and transform input based on field type
      let transformedValue = value;
      if (field === 'education') {
        console.log('Processing education field change:', { key, value });
        switch(key) {
          case 'degree_type_id':
            // Clear specialization when degree type changes
            updatedData[field][index].specialization_id = '';
            updatedData[field][index].other_specialization = '';
            transformedValue = value;
            break;
          case 'percentage_cgpa':
            const numValue = parseFloat(value);
            console.log('Processing percentage_cgpa:', { value, numValue });
            if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
              transformedValue = numValue;
            } else {
              toast.error('Percentage must be between 0 and 100');
              return updatedData;
            }
            break;
          case 'institute_name':
          case 'location':
            transformedValue = value.trim();
            console.log(`Trimmed ${key}:`, transformedValue);
            break;
          case 'duration_from':
          case 'duration_to':
            if (key === 'duration_to' && 
                updatedData[field][index].duration_from && 
                new Date(value) < new Date(updatedData[field][index].duration_from)) {
              toast.error('End date cannot be before start date');
              return updatedData;
            }
            break;
        }
      }

      updatedData[field][index][key] = transformedValue;
      return updatedData;
    });
  } catch (error) {
    console.error('Error in handleItemChange:', error);
    toast.error('Failed to update field');
  }
};

const handleSaveEducation = (edu, index) => {
  console.log('Saving education data:', edu);
  
  // Check if all required fields are present
  const requiredFields = {
    degree_type_id: edu.degree_type_id || edu.degree_type?.id,
    institute_name: edu.institute_name,
    duration_from: edu.duration_from,
    duration_to: edu.duration_to,
    percentage_cgpa: edu.percentage_cgpa,
    location: edu.location
  };

  console.log('Checking required fields:', requiredFields);

  // Check if all required fields have values
  const hasAllRequired = Object.values(requiredFields).every(val => val !== undefined && val !== null && val !== '');
  
  if (hasAllRequired) {
    console.log('All required fields present, preparing data');
    const educationData = {
      id: edu.id, // This will be undefined for new records
      degree_type_id: edu.degree_type_id || edu.degree_type?.id,
      specialization_id: edu.specialization_id || edu.specialization?.id || null,
      other_specialization: edu.other_specialization || null,
      percentage_cgpa: parseFloat(edu.percentage_cgpa),
      institute_name: edu.institute_name.trim(),
      location: edu.location.trim(),
      duration_from: edu.duration_from,
      duration_to: edu.duration_to
    };
    
    console.log('Triggering save with data:', educationData);
    if (edu.id) {
      // If we have an ID, it's an update
      updateEducation(educationData);
    } else {
      // If no ID, it's a new record
      createEducation(educationData);
    }
  } else {
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);
    console.log('Missing required fields:', missingFields);
    toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
  }
};

const createEducation = async (educationData) => {
  try {
    console.log('Creating new education record:', educationData);
    
    const userInfo = getCookie("user_info");
    const userData = userInfo ? JSON.parse(userInfo) : null;
    
    if (!userData?.token) {
      console.error('No auth token found');
      toast.error('Authentication required');
      return;
    }

    setLoading(true);
    
    const response = await axios({
      method: 'post',
      url: `${API_URL}/api/education`,
      data: educationData,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${userData.token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    console.log('API Response:', response.data);

    if (response.data) {
      toast.success('Education added successfully');
      
      // Fetch fresh data to ensure we have the latest state
      console.log('Fetching fresh education data...');
      await fetchEducationData();
      console.log('Fresh education data fetched');
    }
  } catch (error) {
    console.error('Error creating education:', error);
    const errorMessage = error.response?.data?.message || 'Failed to add education';
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

const updateEducation = async (educationData) => {
  try {
    console.log('Updating education record:', educationData);
    
    const userInfo = getCookie("user_info");
    const userData = userInfo ? JSON.parse(userInfo) : null;
    
    if (!userData?.token) {
      console.error('No auth token found');
      toast.error('Authentication required');
      return;
    }

    setLoading(true);
    
    const response = await axios({
      method: 'put',
      url: `${API_URL}/api/update/education`,
      data: educationData,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${userData.token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    console.log('API Response:', response.data);

    if (response.data) {
      toast.success('Education updated successfully');
      
      // Fetch fresh data to ensure we have the latest state
      console.log('Fetching fresh education data...');
      await fetchEducationData();
      console.log('Fresh education data fetched');
    }
  } catch (error) {
    console.error('Error updating education:', error);
    const errorMessage = error.response?.data?.message || 'Failed to update education';
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
    setActiveSubTab(null);
  };

  const toggleSubTab = (id) => {
    console.log('Toggling sub tab:', id);
    setActiveSubTab(activeSubTab === id ? null : id);
    setSuccess(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(`Field changed: ${name} = ${value}`);

    setFormData((prev) => {
        const newData = {
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        };
        console.log('Updated formData:', newData);
        return newData;
    });
};

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      if (name === 'avatar_url' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const addItem = (key) => {
    if (key === 'education') {
      console.log('Adding new education item');
      setFormData((prev) => ({
        ...prev,
        [key]: [...prev[key], {
          degree_type_id: '',
          specialization_id: '',
          other_specialization: '',
          percentage_cgpa: '',
          institute_name: '',
          location: '',
          duration_from: '',
          duration_to: '',
          isNew: true // Add this flag to identify new entries
        }]
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [key]:
          key === 'qualification'
            ? [...prev[key], { qualification_id: '', year: '', institute_name: '', percentage: '' }]
            : key === 'work_experience'
            ? [...prev[key], { company: '', role: '', start_date: '', end_date: '', description: '' }]
            : key === 'projects'
            ? [...prev[key], { name: '', description: '' }]
            : key === 'certifications'
            ? [...prev[key], { name: '', issuer: '' }]
            : key === 'achievements'
            ? [...prev[key], { title: '', description: '' }]
            : prev[key],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;
      
      if (!userData?.token) {
        toast.error('User authentication required');
        return;
      }
  
      // Create FormData object
      const formDataToSend = new FormData();
      
      // Handle file uploads first with proper error handling
      const fileFields = ['avatar_url', 'upload_resume', 'upload_aadhar'];
      fileFields.forEach(field => {
        if (formData[field] instanceof File) {
          formDataToSend.append(field, formData[field]);
        }
      });
  
      // Clean and validate data before sending
      const jsonData = {
        name: formData.name?.trim(),
        email: formData.email?.trim().toLowerCase(),
        gender: formData.gender || null,
        birthday: formData.birthday || null,
        address: formData.address?.trim() || null,
        city: formData.city?.trim() || null,
        state_id: formData.state_id || null,
        pincode: formData.pincode?.trim() || null,
        aadhaar_number: formData.aadhaar_number?.trim() || null,
        linkedin_profile: formData.linkedin_profile?.trim() || null,
        parent_name: formData.parent_name?.trim() || null,
        parent_email: formData.parent_email?.trim()?.toLowerCase() || null,
        parent_aadhar: formData.parent_aadhar?.trim() || null,
        parent_occupation: formData.parent_occupation?.trim() || null,
        residential_address: formData.residential_address?.trim() || null,
        receive_email_notification: Boolean(formData.receive_email_notification),
        receive_sms_notification: Boolean(formData.receive_sms_notification),
        qualification: Array.isArray(formData.qualification) ? formData.qualification : [],
        work_experience: Array.isArray(formData.work_experience) ? formData.work_experience : [],
        education: Array.isArray(formData.education) ? formData.education : [],
        projects: Array.isArray(formData.projects) ? formData.projects : [],
        certifications: Array.isArray(formData.certifications) ? formData.certifications : [],
        achievements: Array.isArray(formData.achievements) ? formData.achievements : []
      };
  
      // Log data before sending
      console.log('Sending data:', { jsonData, files: Object.fromEntries(formDataToSend.entries()) });
  
      formDataToSend.append('data', JSON.stringify(jsonData));
  
      const response = await axios.post(`${API_URL}/api/profile`, formDataToSend, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`, // Added Bearer prefix
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
  
      if (response.data.success) {
        toast.success('Profile updated successfully!');
        if (response.data.user) {
          setFormData(prev => ({
            ...prev,
            ...response.data.user
          }));
        }
      } else {
        throw new Error(response.data.message || 'Update failed');
      }
  
    } catch (error) {
      console.error('Profile update error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const renderSubTabContent = () => {
    console.log('Rendering sub tab content for:', activeSubTab);
    console.log('Current form data:', formData);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (success) return <p className="text-green-500">{success}</p>;

    switch (activeSubTab) {
      case 'basic':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name || ''} 
                onChange={handleChange} 
                className="w-full p-2 border rounded" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email || ''} 
                onChange={handleChange} 
                className="w-full p-2 border rounded" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
              <input 
                type="text" 
                name="registration_number" 
                value={formData.registration_number || ''} 
                onChange={handleChange} 
                disabled 
                className="w-full p-2 border rounded bg-gray-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
              <input 
                type="text" 
                value={formData.domain_id || ''} 
                disabled 
                className="w-full p-2 border rounded bg-gray-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
              <select 
                name="country_code" 
                value={formData.country_code || ''} 
                onChange={handleChange} 
                disabled 
                className="w-full p-2 border rounded bg-gray-50"
              >
                <option value="+91">+91</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone || ''} 
                onChange={handleChange} 
                disabled 
                className="w-full p-2 border rounded bg-gray-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select 
                name="gender" 
                value={formData.gender || ''} 
                onChange={handleChange} 
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Birthday *</label>
              <input 
                type="date" 
                name="birthday" 
                value={formData.birthday || ''} 
                onChange={handleChange} 
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        );
      case 'additional':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea name="address" value={formData.address || ''} onChange={handleChange} className="w-full p-2 border rounded" rows={4} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" name="city" value={formData.city || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select name="state_id" value={formData.state_id || ''} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select State</option>
                <option value="1">State 1</option>
                <option value="2">State 2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input type="text" name="pincode" value={formData.pincode || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </div>
        );
      case 'docs':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
              <input type="text" name="aadhaar_number" value={formData.aadhaar_number || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
              <input type="url" name="linkedin_profile" value={formData.linkedin_profile || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
              <input type="file" name="upload_resume" onChange={handleFileChange} className="w-full p-2" />
              {formData.upload_resume && typeof formData.upload_resume === 'string' && (
                <a href={formData.upload_resume} target="_blank" rel="noopener noreferrer" className="text-orange-500">View Current Resume</a>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Document</label>
              <input type="file" name="upload_aadhar" onChange={handleFileChange} className="w-full p-2" />
              {formData.upload_aadhar && typeof formData.upload_aadhar === 'string' && (
                <a href={formData.upload_aadhar} target="_blank" rel="noopener noreferrer" className="text-orange-500">View Current Aadhaar</a>
              )}
            </div>
          </div>
        );
      case 'parent':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
              <input type="text" name="parent_name" value={formData.parent_name || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
              <input type="email" name="parent_email" value={formData.parent_email || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Aadhaar</label>
              <input type="text" name="parent_aadhar" value={formData.parent_aadhar || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Occupation</label>
              <input type="text" name="parent_occupation" value={formData.parent_occupation || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
              <textarea name="residential_address" value={formData.residential_address || ''} onChange={handleChange} className="w-full p-2 border rounded" rows={4} />
            </div>
          </div>
        );
      case 'qualification':
        return (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <input type="checkbox" name="receive_email_notification" checked={formData.receive_email_notification || false} onChange={handleChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">Receive Email Notification</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="receive_sms_notification" checked={formData.receive_sms_notification || false} onChange={handleChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">Receive SMS Notification</label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderMainTabContent = (menuId) => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (success) return <p className="text-green-500">{success}</p>;

    switch (menuId) {
      case 'personal':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {mainMenu.find((menu) => menu.id === 'personal').subMenu.map((subTab) => (
                <div
                  key={subTab.id}
                  className={`sub-menu-item ${
                    activeSubTab === subTab.id ? 'sub-menu-item-active' : 'sub-menu-item-inactive'
                  }`}
                  onClick={() => toggleSubTab(subTab.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className={`${activeSubTab === subTab.id ? 'text-orange-500' : 'text-gray-500'}`}>{subTab.icon}</span>
                    <span className={activeSubTab === subTab.id ? 'text-orange-500' : 'text-gray-700'}>{subTab.label}</span>
                  </div>
                  {activeSubTab === subTab.id ? <FaChevronUp className="w-4 h-4 text-orange-500" /> : <FaChevronDown className="w-4 h-4 text-gray-500" />}
                </div>
              ))}
            </div>
            
            {/* Show sub-tab content below the menu */}
            {activeSubTab && (
              <div className="form-container">
                {renderSubTabContent()}
                <div className="mt-6 flex justify-end">
                  <button 
                    type="submit" 
                    className="form-submit-button"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case 'work':
        return <div className="grid grid-cols-1 gap-4"><p>No work experience data available in API</p></div>;
      case 'education':
        return (
          <div className="space-y-6">
            {formData.education.map((edu, index) => {
              // Check for both string and number types since API might return either
              const degreeTypeId = edu.degree_type_id || (edu.degree_type && edu.degree_type.id);
              const isSchoolEducation = ['1', '2', 1, 2].includes(degreeTypeId);
              
              return (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-white">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree Type *</label>
                    <select 
                      value={degreeTypeId || ''} 
                      onChange={(e) => {
                        handleItemChange('education', index, 'degree_type_id', e.target.value);
                        // Only fetch specializations for higher education
                        const newDegreeId = e.target.value;
                        const isNewSchoolEducation = ['1', '2', 1, 2].includes(Number(newDegreeId));
                        if (!isNewSchoolEducation) {
                          fetchSpecializations(newDegreeId);
                        } else {
                          // Clear specialization fields for school education
                          handleItemChange('education', index, 'specialization_id', '');
                          handleItemChange('education', index, 'other_specialization', '');
                        }
                      }} 
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select Degree Type</option>
                      {degreeTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                    {edu.degree_type && (
                      <p className="mt-1 text-sm text-gray-600">Current: {edu.degree_type.name}</p>
                    )}
                  </div>
                  
                  {/* Only show specialization fields for non-school education */}
                  {!isSchoolEducation && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                        <select 
                          value={edu.specialization_id || (edu.specialization && edu.specialization.id) || ''} 
                          onChange={(e) => {
                            handleItemChange('education', index, 'specialization_id', e.target.value);
                            // Show other specialization input if "Other" (ID: 75 or 76) is selected
                            setShowOtherSpecialization(e.target.value === '75' || e.target.value === '76');
                          }} 
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select Specialization</option>
                          {specializations.map(spec => (
                            <option key={spec.id} value={spec.id}>{spec.name}</option>
                          ))}
                        </select>
                        {edu.specialization && (
                          <p className="mt-1 text-sm text-gray-600">Current: {edu.specialization.name}</p>
                        )}
                      </div>

                      {showOtherSpecialization && (
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Other Specialization</label>
                          <input 
                            type="text" 
                            value={edu.other_specialization || ''} 
                            onChange={(e) => handleItemChange('education', index, 'other_specialization', e.target.value)} 
                            className="w-full p-2 border rounded"
                            placeholder="Enter your specialization"
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name *</label>
                    <input 
                      type="text" 
                      value={edu.institute_name || ''} 
                      onChange={(e) => handleItemChange('education', index, 'institute_name', e.target.value)} 
                      className="w-full p-2 border rounded"
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input 
                      type="text" 
                      value={edu.location || ''} 
                      onChange={(e) => handleItemChange('education', index, 'location', e.target.value)} 
                      className="w-full p-2 border rounded"
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration From *</label>
                    <input 
                      type="date" 
                      value={edu.duration_from || ''} 
                      onChange={(e) => handleItemChange('education', index, 'duration_from', e.target.value)} 
                      className="w-full p-2 border rounded"
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration To *</label>
                    <input 
                      type="date" 
                      value={edu.duration_to || ''} 
                      onChange={(e) => handleItemChange('education', index, 'duration_to', e.target.value)} 
                      className="w-full p-2 border rounded"
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Percentage/CGPA *</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="100" 
                      value={edu.percentage_cgpa || ''} 
                      onChange={(e) => handleItemChange('education', index, 'percentage_cgpa', e.target.value)} 
                      className="w-full p-2 border rounded"
                      required 
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end mt-4">
                    <button 
                      type="button"
                      onClick={() => handleSaveEducation(edu, index)}
                      className="form-submit-button"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Education'}
                    </button>
                  </div>
                </div>
              );
            })}
            
            <div className="flex justify-between items-center mt-4">
              <button 
                type="button" 
                onClick={() => addItem('education')} 
                className="flex items-center gap-1 text-orange-500"
              >
                <FiEdit className="w-4 h-4" />
                <span>Add Education</span>
              </button>
              <div className="text-sm text-gray-600">
                * Required fields
              </div>
            </div>
          </div>
        );
      case 'projects':
        return <div className="grid grid-cols-1 gap-4"><p>No projects data available in API</p></div>;
      case 'certifications':
        return <div className="grid grid-cols-1 gap-4"><p>No certifications data available in API</p></div>;
      case 'achievements':
        return <div className="grid grid-cols-1 gap-4"><p>No achievements data available in API</p></div>;
      case 'social':
        return (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input type="url" name="linkedin_profile" value={formData.linkedin_profile || ''} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
            </div>
            <button
              type="submit"
              className="form-submit-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="profile-header">
        <div
          className="profile-header-bg"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80')`
          }}
        >
          <button className="profile-edit-button">
            <FiEdit className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Rest of your profile content remains unchanged */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative -mt-24">
          {/* Profile Image and Basic Info */}
          <div className="flex flex-col items-start gap-4">
            <div className="relative">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <label className="profile-image-edit">
                <input 
                  type="file" 
                  name="avatar_url" 
                  onChange={handleFileChange} 
                  className="hidden"
                  accept="image/*"
                />
                <FiEdit className="w-4 h-4 text-white" />
              </label>
            </div>

            <div>
              <h1 className="text-2xl font-bold">{formData.name || 'User Name'}</h1>
              <span className="inline-block mt-1 px-3 py-1 bg-pink-50 text-gray-700 rounded-full text-sm">
                {formData.designation || 'Software Engineer'}
              </span>

              {/* Contact Info */}
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="contact-info-item">
                  <div className="contact-icon-container-phone">
                    <MdPhone className="contact-icon-phone" />
                  </div>
                  <span className="text-sm">{formData.country_code || '+91'} {formData.phone || ''}</span>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon-container-email">
                    <MdEmail className="contact-icon-email" />
                  </div>
                  <span className="text-sm">{formData.email || ''}</span>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon-container-location">
                    <MdLocationOn className="contact-icon-location" />
                  </div>
                  <span className="text-sm">{formData.city && formData.state_id ? `${formData.city}, India` : (formData.city || '')}</span>
                </div>
              </div>
            </div>
          </div>

          
          
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {mainMenu.map((menu) => (
              <button
                key={menu.id}
                onClick={() => toggleMenu(menu.id)}
                className={`main-menu-item ${
                  activeMenu === menu.id 
                    ? 'main-menu-item-active' 
                    : 'main-menu-item-inactive'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`main-menu-icon ${
                    activeMenu === menu.id ? 'text-white' : ''
                  }`}>
                    {menu.icon}
                  </span>
                  <span className="font-medium text-gray-700">{menu.label}</span>
                </div>
                <span className={`main-menu-arrow ${
                  activeMenu === menu.id ? 'opacity-100' : ''
                }`}>
                  {activeMenu === menu.id ? '↓' : '→'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      
      {activeMenu && (
        <div className="form-container mx-4 md:mx-auto md:max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <span className="text-orange-500">{mainMenu.find((m) => m.id === activeMenu)?.icon}</span>
              {mainMenu.find((m) => m.id === activeMenu)?.label}
            </h3>
          </div>
          {activeMenu === 'education' ? (
            renderMainTabContent(activeMenu)
          ) : (
            <form onSubmit={handleSubmit}>
              {renderMainTabContent(activeMenu)}
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default MyProfile;
